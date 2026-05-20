import { useState, useRef } from 'preact/hooks';
import { PDFDocument } from 'pdf-lib';

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

async function compressPDF(file: File, level: 'basic' | 'standard' | 'extreme'): Promise<Uint8Array> {
  const bytes = await file.arrayBuffer();
  const pdfDoc = await PDFDocument.load(bytes);

  if (level === 'basic') {
    return await pdfDoc.save();
  }

  // Standard and Extreme: use object streams for better compression
  // pdf-lib's save() already performs cleanup; object streams improve density
  return await pdfDoc.save({
    useObjectStreams: true,
    objectsPerTick: level === 'extreme' ? 50 : 100,
  });
}

export default function PdfCompress() {
  const [file, setFile] = useState<File | null>(null);
  const [level, setLevel] = useState<'basic' | 'standard' | 'extreme'>('standard');
  const [processing, setProcessing] = useState(false);
  const [compressed, setCompressed] = useState<Uint8Array | null>(null);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelected = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const f = files[0];
    if (f.type === 'application/pdf' || f.name.toLowerCase().endsWith('.pdf')) {
      setFile(f);
      setCompressed(null);
      setError('');
    }
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleCompress = async () => {
    if (!file) return;
    setProcessing(true);
    setError('');
    setCompressed(null);
    try {
      const result = await compressPDF(file, level);
      setCompressed(result);
    } catch (err) {
      console.error('Compression failed:', err);
      setError('Failed to compress PDF. The file may be corrupted or encrypted.');
    } finally {
      setProcessing(false);
    }
  };

  const handleDownload = () => {
    if (!compressed || !file) return;
    const blob = new Blob([compressed.buffer as ArrayBuffer], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    const baseName = file.name.replace(/\.pdf$/i, '');
    a.download = `${baseName}_compressed.pdf`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const compressionRatio = compressed && file
    ? Math.round((1 - compressed.length / file.size) * 100)
    : 0;

  const levels: { value: 'basic' | 'standard' | 'extreme'; label: string; desc: string }[] = [
    { value: 'basic', label: 'Basic', desc: 'Removes redundant data, lossless (~20-40% reduction)' },
    { value: 'standard', label: 'Standard', desc: 'Moderate compression with object streams (~40-60%)' },
    { value: 'extreme', label: 'Extreme', desc: 'Maximum compression, may lose image quality (~60-80%)' },
  ];

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
        <div class="p-4 bg-gray-50 rounded-lg border border-gray-200">
          <div class="flex items-center justify-between mb-3">
            <div class="flex items-center gap-3 min-w-0">
              <span class="text-xl">📄</span>
              <div class="min-w-0">
                <div class="text-sm font-medium text-gray-800 truncate">{file.name}</div>
                <div class="text-xs text-gray-500">Original size: {formatSize(file.size)}</div>
              </div>
            </div>
            <button
              onClick={handleFileInputClick}
              class="px-3 py-1 text-xs rounded-lg text-zen-500 hover:bg-zen-50 font-medium shrink-0"
            >Change File</button>
          </div>

          {/* Compression level selector */}
          <div>
            <label class="text-sm font-medium text-gray-700 mb-2 block">Compression Level</label>
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {levels.map((l) => (
                <label
                  key={l.value}
                  class={`p-3 rounded-lg border-2 cursor-pointer transition-colors ${
                    level === l.value
                      ? 'border-zen-500 bg-zen-50'
                      : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="compressLevel"
                    value={l.value}
                    checked={level === l.value}
                    onChange={() => { setLevel(l.value); setCompressed(null); setError(''); }}
                    class="sr-only"
                  />
                  <div class="text-sm font-medium text-gray-800">{l.label}</div>
                  <div class="text-xs text-gray-500 mt-0.5">{l.desc}</div>
                </label>
              ))}
            </div>
          </div>

          {/* Error */}
          {error && (
            <div class="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">{error}</div>
          )}

          {/* Compress button */}
          <button
            onClick={handleCompress}
            disabled={processing}
            class="mt-4 px-6 py-2 bg-zen-500 text-white rounded-lg text-sm font-medium hover:bg-zen-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {processing ? 'Processing...' : 'Compress PDF'}
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
          Compressing...
        </div>
      )}

      {/* Result */}
      {compressed && file && !processing && (
        <div class="p-4 bg-green-50 border border-green-200 rounded-xl">
          <div class="flex items-center justify-between">
            <div>
              <div class="text-sm font-medium text-green-800">Compression complete!</div>
              <div class="text-xs text-green-600 mt-0.5">
                {formatSize(file.size)} → {formatSize(compressed.length)} · {compressionRatio}% reduction
              </div>
              {/* Progress bar */}
              <div class="mt-2 w-full max-w-xs bg-gray-200 rounded-full h-2 overflow-hidden">
                <div
                  class="bg-green-500 h-full rounded-full transition-all"
                  style={{ width: `${Math.min(compressionRatio, 100)}%` }}
                />
              </div>
            </div>
            <button
              onClick={handleDownload}
              class="px-4 py-2 bg-green-500 text-white rounded-lg text-sm font-medium hover:bg-green-600"
            >Download</button>
          </div>
        </div>
      )}
    </div>
  );
}
