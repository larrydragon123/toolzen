import { useState, useRef } from 'preact/hooks';

export default function ImageCompress() {
  const [original, setOriginal] = useState<{ file: File; url: string; size: number } | null>(null);
  const [compressed, setCompressed] = useState<{ url: string; size: number } | null>(null);
  const [quality, setQuality] = useState(0.7);
  const [format, setFormat] = useState('image/jpeg');
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleFile = (e: Event) => {
    const file = (e.target as HTMLInputElement).files?.[0];
    if (!file) return;
    setOriginal({ file, url: URL.createObjectURL(file), size: file.size });
    setCompressed(null);
  };

  const compress = () => {
    if (!original || !canvasRef.current) return;
    const img = new Image();
    img.onload = () => {
      const canvas = canvasRef.current!;
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d')!;
      ctx.drawImage(img, 0, 0);
      canvas.toBlob((blob) => {
        if (blob) {
          setCompressed({
            url: URL.createObjectURL(blob),
            size: blob.size,
          });
        }
      }, format, quality);
    };
    img.src = original.url;
  };

  const download = () => {
    if (!compressed) return;
    const a = document.createElement('a');
    a.href = compressed.url;
    a.download = `compressed.${format.split('/')[1]}`;
    a.click();
  };

  const saved = original && compressed ? ((original.size - compressed.size) / original.size * 100).toFixed(1) : null;

  return (
    <div class="space-y-4">
      <div class="flex gap-2 flex-wrap items-end">
        <div>
          <label class="block text-sm text-gray-500 mb-1">Quality</label>
          <input type="range" min="0.1" max="1" step="0.1" value={quality}
            onInput={(e) => setQuality(parseFloat((e.target as HTMLInputElement).value))}
            class="w-32" />
          <span class="text-sm text-gray-500 ml-2">{Math.round(quality * 100)}%</span>
        </div>
        <div>
          <label class="block text-sm text-gray-500 mb-1">Format</label>
          <select value={format} onChange={(e) => setFormat((e.target as HTMLSelectElement).value)}
            class="p-2 border border-gray-200 rounded-lg text-sm">
            <option value="image/jpeg">JPEG</option>
            <option value="image/png">PNG</option>
            <option value="image/webp">WebP</option>
          </select>
        </div>
      </div>
      <input type="file" accept="image/*" onChange={handleFile}
        class="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:bg-zen-50 file:text-zen-600 hover:file:bg-zen-100" />
      {original && (
        <div>
          <button onClick={compress} class="px-4 py-2 bg-zen-500 text-white rounded-lg text-sm font-medium hover:bg-zen-600">Compress</button>
        </div>
      )}
      <canvas ref={canvasRef} class="hidden" />
      {original && (
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <div class="text-sm text-gray-500 mb-1">Original ({(original.size / 1024).toFixed(1)} KB)</div>
            <img src={original.url} alt="Original" class="max-h-64 rounded-lg border border-gray-100" />
          </div>
          {compressed && (
            <div>
              <div class="text-sm text-gray-500 mb-1">
                Compressed ({(compressed.size / 1024).toFixed(1)} KB)
                {saved && <span class="text-green-600 ml-2">Saved {saved}%</span>}
              </div>
              <img src={compressed.url} alt="Compressed" class="max-h-64 rounded-lg border border-gray-100" />
              <button onClick={download} class="mt-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200">Download</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
