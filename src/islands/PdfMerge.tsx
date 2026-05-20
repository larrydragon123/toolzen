import { useState, useRef } from 'preact/hooks';
import { PDFDocument } from 'pdf-lib';

interface PdfFile {
  id: number;
  file: File;
  name: string;
  size: string;
}

let nextId = 0;

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

async function mergePDFs(files: File[]): Promise<Uint8Array> {
  const merged = await PDFDocument.create();
  for (const file of files) {
    const bytes = await file.arrayBuffer();
    const pdf = await PDFDocument.load(bytes);
    const pages = await merged.copyPages(pdf, pdf.getPageIndices());
    pages.forEach(p => merged.addPage(p));
  }
  return await merged.save();
}

function downloadPDF(bytes: Uint8Array, filename: string) {
  const blob = new Blob([bytes.buffer as ArrayBuffer], { type: 'application/pdf' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export default function PdfMerge() {
  const [files, setFiles] = useState<PdfFile[]>([]);
  const [processing, setProcessing] = useState(false);
  const [merged, setMerged] = useState<Uint8Array | null>(null);
  const [dragIdx, setDragIdx] = useState<number | null>(null);
  const [dragOverIdx, setDragOverIdx] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const addFiles = (newFiles: FileList | null) => {
    if (!newFiles) return;
    const entries: PdfFile[] = [];
    for (let i = 0; i < newFiles.length; i++) {
      const f = newFiles[i];
      if (f.type === 'application/pdf' || f.name.toLowerCase().endsWith('.pdf')) {
        entries.push({ id: nextId++, file: f, name: f.name, size: formatSize(f.size) });
      }
    }
    setFiles(prev => [...prev, ...entries]);
    setMerged(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const removeFile = (id: number) => {
    setFiles(prev => prev.filter(f => f.id !== id));
    setMerged(null);
  };

  const moveFile = (idx: number, dir: -1 | 1) => {
    const target = idx + dir;
    if (target < 0 || target >= files.length) return;
    setFiles(prev => {
      const next = [...prev];
      [next[idx], next[target]] = [next[target], next[idx]];
      return next;
    });
    setMerged(null);
  };

  const onDragStart = (idx: number) => {
    setDragIdx(idx);
  };

  const onDragOver = (e: DragEvent, idx: number) => {
    e.preventDefault();
    if (dragIdx !== null && dragIdx !== idx) {
      setDragOverIdx(idx);
    }
  };

  const onDragLeave = () => {
    setDragOverIdx(null);
  };

  const onDrop = (idx: number) => {
    if (dragIdx === null || dragIdx === idx) {
      setDragIdx(null);
      setDragOverIdx(null);
      return;
    }
    setFiles(prev => {
      const next = [...prev];
      const [moved] = next.splice(dragIdx, 1);
      next.splice(idx, 0, moved);
      return next;
    });
    setDragIdx(null);
    setDragOverIdx(null);
    setMerged(null);
  };

  const onDragEnd = () => {
    setDragIdx(null);
    setDragOverIdx(null);
  };

  const handleMerge = async () => {
    if (files.length < 2) return;
    setProcessing(true);
    try {
      const result = await mergePDFs(files.map(f => f.file));
      setMerged(result);
    } catch (e) {
      console.error('Merge failed:', e);
    } finally {
      setProcessing(false);
    }
  };

  const handleDownload = () => {
    if (!merged) return;
    downloadPDF(merged, 'merged.pdf');
  };

  const handleFileInputClick = () => {
    fileInputRef.current?.click();
  };

  const handleDropArea = (e: DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer?.files) {
      addFiles(e.dataTransfer.files);
    }
  };

  const handleDragOverArea = (e: DragEvent) => {
    e.preventDefault();
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
          multiple
          onChange={(e) => addFiles((e.target as HTMLInputElement).files)}
          class="hidden"
        />
        <div class="text-4xl mb-3">📄</div>
        <p class="text-gray-600 text-sm mb-1">Click to select PDF files, or drag and drop them here</p>
        <p class="text-gray-400 text-xs">Accepts .pdf files only</p>
      </div>

      {/* File list */}
      {files.length > 0 && (
        <div>
          <div class="text-sm text-gray-500 mb-2">{files.length} file{files.length > 1 ? 's' : ''} selected</div>
          <div class="space-y-2">
            {files.map((f, idx) => (
              <div
                key={f.id}
                class={`flex items-center gap-3 p-3 rounded-lg border transition-colors ${
                  dragIdx === idx ? 'opacity-50 border-zen-500 bg-zen-50' :
                  dragOverIdx === idx ? 'border-zen-500 bg-zen-50 border-dashed' :
                  'border-gray-200 bg-white'
                }`}
                draggable
                onDragStart={() => onDragStart(idx)}
                onDragOver={(e) => onDragOver(e, idx)}
                onDragLeave={onDragLeave}
                onDrop={() => onDrop(idx)}
                onDragEnd={onDragEnd}
              >
                <div class="text-gray-400 cursor-grab select-none" title="Drag to reorder">⋮⋮</div>
                <span class="text-sm font-mono text-gray-500 w-6 text-center">{idx + 1}</span>
                <div class="flex-1 min-w-0">
                  <div class="text-sm text-gray-800 truncate">{f.name}</div>
                  <div class="text-xs text-gray-400">{f.size}</div>
                </div>
                {files.length > 1 && (
                  <div class="flex gap-0.5">
                    <button
                      onClick={() => moveFile(idx, -1)}
                      disabled={idx === 0}
                      class="px-2 py-1 text-xs rounded text-gray-500 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed"
                      title="Move up"
                    >▲</button>
                    <button
                      onClick={() => moveFile(idx, 1)}
                      disabled={idx === files.length - 1}
                      class="px-2 py-1 text-xs rounded text-gray-500 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed"
                      title="Move down"
                    >▼</button>
                  </div>
                )}
                <button
                  onClick={() => removeFile(f.id)}
                  class="px-3 py-1 text-xs rounded-lg text-red-500 hover:bg-red-50 font-medium"
                >Remove</button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Actions */}
      {files.length > 0 && (
        <div class="flex gap-3">
          <button
            onClick={handleFileInputClick}
            class="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200"
          >Add More Files</button>
          <button
            onClick={handleMerge}
            disabled={files.length < 2 || processing}
            class="px-6 py-2 bg-zen-500 text-white rounded-lg text-sm font-medium hover:bg-zen-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {processing ? 'Processing...' : 'Merge PDFs'}
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

      {/* Download */}
      {merged && !processing && (
        <div class="p-4 bg-green-50 border border-green-200 rounded-xl flex items-center justify-between">
          <div>
            <div class="text-sm font-medium text-green-800">Merge complete!</div>
            <div class="text-xs text-green-600 mt-0.5">{(merged.length / 1024).toFixed(1)} KB merged PDF</div>
          </div>
          <button
            onClick={handleDownload}
            class="px-4 py-2 bg-green-500 text-white rounded-lg text-sm font-medium hover:bg-green-600"
          >Download</button>
        </div>
      )}
    </div>
  );
}
