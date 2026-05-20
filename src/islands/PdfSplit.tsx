import { useState, useRef, useEffect } from 'preact/hooks';
import { PDFDocument } from 'pdf-lib';
import JSZip from 'jszip';

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function parsePageRange(input: string, maxPages: number): number[][] {
  const groups: number[][] = [];
  const parts = input.split(',').map(s => s.trim()).filter(Boolean);
  for (const part of parts) {
    if (part.includes('-')) {
      const [start, end] = part.split('-').map(Number);
      if (isNaN(start) || isNaN(end) || start < 1 || end > maxPages || start > end) continue;
      groups.push(Array.from({ length: end - start + 1 }, (_, i) => start + i));
    } else {
      const n = Number(part);
      if (!isNaN(n) && n >= 1 && n <= maxPages) groups.push([n]);
    }
  }
  return groups;
}

async function splitPDF(file: File, pageIndices: number[][]): Promise<Uint8Array> {
  const srcBytes = await file.arrayBuffer();
  const srcPdf = await PDFDocument.load(srcBytes);
  const zip = new JSZip();

  for (let i = 0; i < pageIndices.length; i++) {
    const newPdf = await PDFDocument.create();
    const pages = await newPdf.copyPages(srcPdf, pageIndices[i].map(n => n - 1));
    pages.forEach(p => newPdf.addPage(p));
    const pdfBytes = await newPdf.save();
    zip.file(`split_${i + 1}.pdf`, pdfBytes);
  }

  const zipBlob = await zip.generateAsync({ type: 'blob' });
  return new Uint8Array(await zipBlob.arrayBuffer());
}

function computeEveryN(input: string, totalPages: number): number[][] {
  const n = parseInt(input, 10);
  if (isNaN(n) || n < 1) return [];
  const groups: number[][] = [];
  for (let i = 0; i < totalPages; i += n) {
    const chunk: number[] = [];
    for (let j = i + 1; j <= Math.min(i + n, totalPages); j++) {
      chunk.push(j);
    }
    groups.push(chunk);
  }
  return groups;
}

export default function PdfSplit() {
  const [file, setFile] = useState<File | null>(null);
  const [thumbnails, setThumbnails] = useState<string[]>([]);
  const [totalPages, setTotalPages] = useState(0);
  const [mode, setMode] = useState<'range' | 'everyN'>('range');
  const [rangeInput, setRangeInput] = useState('');
  const [everyN, setEveryN] = useState('1');
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState<Uint8Array | null>(null);
  const [error, setError] = useState('');
  const [loadingThumbs, setLoadingThumbs] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!file) {
      setThumbnails([]);
      setTotalPages(0);
      setResult(null);
      setError('');
      return;
    }

    let cancelled = false;
    setLoadingThumbs(true);
    setError('');

    (async () => {
      try {
        const pdfjsLib = await import('pdfjs-dist');
        pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://unpkg.com/pdfjs-dist@4.8.69/build/pdf.worker.min.mjs';

        const bytes = await file.arrayBuffer();
        const pdf = await pdfjsLib.getDocument({ data: bytes }).promise;
        if (cancelled) return;

        const pages = pdf.numPages;
        setTotalPages(pages);

        const thumbs: string[] = [];
        for (let i = 1; i <= pages; i++) {
          const page = await pdf.getPage(i);
          const viewport = page.getViewport({ scale: 0.3 });
          const canvas = document.createElement('canvas');
          canvas.width = viewport.width;
          canvas.height = viewport.height;
          await page.render({ canvasContext: canvas.getContext('2d')!, viewport }).promise;
          thumbs.push(canvas.toDataURL());
          if (!cancelled) setThumbnails([...thumbs]);
        }
        if (!cancelled) setThumbnails(thumbs);
      } catch (err) {
        if (!cancelled) setError('Failed to load PDF or render thumbnails.');
        console.error(err);
      } finally {
        if (!cancelled) setLoadingThumbs(false);
      }
    })();

    return () => { cancelled = true; };
  }, [file]);

  const handleFileSelected = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const f = files[0];
    if (f.type === 'application/pdf' || f.name.toLowerCase().endsWith('.pdf')) {
      setFile(f);
      setRangeInput('');
      setEveryN('1');
    }
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSplit = async () => {
    if (!file) return;

    let pageIndices: number[][];
    if (mode === 'range') {
      pageIndices = parsePageRange(rangeInput, totalPages);
      if (pageIndices.length === 0) {
        setError('Please enter valid page ranges (e.g. "1-3,5,7-9").');
        return;
      }
    } else {
      pageIndices = computeEveryN(everyN, totalPages);
      if (pageIndices.length === 0) {
        setError('Please enter a valid number (1 or greater).');
        return;
      }
    }

    setProcessing(true);
    setError('');
    setResult(null);
    try {
      const zipBytes = await splitPDF(file, pageIndices);
      setResult(zipBytes);
    } catch (err) {
      console.error('Split failed:', err);
      setError('Failed to split PDF. The file may be corrupted or encrypted.');
    } finally {
      setProcessing(false);
    }
  };

  const handleDownload = () => {
    if (!result) return;
    const blob = new Blob([result.buffer as ArrayBuffer], { type: 'application/zip' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'split_pdfs.zip';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDropArea = (e: DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer?.files) {
      handleFileSelected(e.dataTransfer.files);
    }
  };

  const handleDragOverArea = (e: DragEvent) => {
    e.preventDefault();
  };

  const handleFileInputClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div class="space-y-6">
      {/* File input area */}
      <div
        class="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center cursor-pointer hover:border-zen-500 hover:bg-zen-50/50 transition-colors"
        onClick={handleFileInputClick}
        onDrop={handleDropArea}
        onDragOver={handleDragOverArea}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf"
          onChange={(e) => handleFileSelected((e.target as HTMLInputElement).files)}
          class="hidden"
        />
        <div class="text-4xl mb-3">📄</div>
        <p class="text-gray-600 text-sm mb-1">Click to select a PDF file, or drag and drop it here</p>
        <p class="text-gray-400 text-xs">Accepts .pdf files only</p>
      </div>

      {/* Selected file info */}
      {file && (
        <div class="p-3 bg-gray-50 rounded-lg border border-gray-200 flex items-center justify-between">
          <div class="flex items-center gap-3 min-w-0">
            <span class="text-xl">📄</span>
            <div class="min-w-0">
              <div class="text-sm font-medium text-gray-800 truncate">{file.name}</div>
              <div class="text-xs text-gray-500">
                {formatSize(file.size)}{totalPages > 0 ? ` — ${totalPages} page${totalPages > 1 ? 's' : ''}` : ''}
              </div>
            </div>
          </div>
          <button
            onClick={handleFileInputClick}
            class="px-3 py-1 text-xs rounded-lg text-zen-500 hover:bg-zen-50 font-medium shrink-0"
          >Change File</button>
        </div>
      )}

      {/* Thumbnails */}
      {loadingThumbs && (
        <div class="flex items-center gap-2 text-zen-500 text-sm">
          <svg class="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          Loading thumbnails...
        </div>
      )}

      {thumbnails.length > 0 && (
        <div>
          <div class="text-sm text-gray-500 mb-2">{totalPages} page{totalPages > 1 ? 's' : ''}</div>
          <div class="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2 max-h-64 overflow-y-auto p-2 bg-gray-50 rounded-lg border border-gray-200">
            {thumbnails.map((thumb, idx) => (
              <div key={idx} class="relative group">
                <img
                  src={thumb}
                  alt={`Page ${idx + 1}`}
                  class="w-full border border-gray-300 rounded shadow-sm block"
                />
                <div class="text-center text-xs text-gray-500 mt-0.5">{idx + 1}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Split mode selector */}
      {file && totalPages > 0 && (
        <div class="space-y-4">
          <div>
            <label class="text-sm font-medium text-gray-700 mb-2 block">Split Mode</label>
            <div class="flex gap-2">
              <button
                onClick={() => { setMode('range'); setError(''); }}
                class={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${mode === 'range' ? 'bg-zen-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
              >By Page Range</button>
              <button
                onClick={() => { setMode('everyN'); setError(''); }}
                class={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${mode === 'everyN' ? 'bg-zen-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
              >Every N Pages</button>
            </div>
          </div>

          {mode === 'range' ? (
            <div>
              <label class="text-sm font-medium text-gray-700 mb-1 block">Page Ranges</label>
              <input
                type="text"
                value={rangeInput}
                onInput={(e) => { setRangeInput((e.target as HTMLInputElement).value); setError(''); }}
                placeholder="e.g. 1-3,5,7-9"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-zen-500 focus:border-transparent"
              />
              <p class="text-xs text-gray-400 mt-1">Use commas to separate entries, hyphens for ranges. Total pages: {totalPages}.</p>
            </div>
          ) : (
            <div>
              <label class="text-sm font-medium text-gray-700 mb-1 block">Pages per split</label>
              <input
                type="number"
                min="1"
                value={everyN}
                onInput={(e) => { setEveryN((e.target as HTMLInputElement).value); setError(''); }}
                class="w-24 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-zen-500 focus:border-transparent"
              />
              <p class="text-xs text-gray-400 mt-1">Each split PDF will contain up to {everyN || '?'} page(s). Total pages: {totalPages}.</p>
            </div>
          )}

          {/* Error */}
          {error && (
            <div class="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">{error}</div>
          )}

          {/* Split button */}
          <button
            onClick={handleSplit}
            disabled={processing}
            class="px-6 py-2 bg-zen-500 text-white rounded-lg text-sm font-medium hover:bg-zen-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {processing ? 'Processing...' : 'Split PDF'}
          </button>
        </div>
      )}

      {/* Processing state */}
      {processing && (
        <div class="flex items-center gap-2 text-zen-500 text-sm">
          <svg class="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          Processing...
        </div>
      )}

      {/* Result / Download */}
      {result && !processing && (
        <div class="p-4 bg-green-50 border border-green-200 rounded-xl flex items-center justify-between">
          <div>
            <div class="text-sm font-medium text-green-800">Split complete!</div>
            <div class="text-xs text-green-600 mt-0.5">{(result.length / 1024).toFixed(1)} KB ZIP file</div>
          </div>
          <button
            onClick={handleDownload}
            class="px-4 py-2 bg-green-500 text-white rounded-lg text-sm font-medium hover:bg-green-600"
          >Download ZIP</button>
        </div>
      )}
    </div>
  );
}
