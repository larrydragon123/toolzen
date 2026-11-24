import { useEffect, useRef, useState } from 'preact/hooks';
import { toolAnalytics } from '../utils/toolAnalytics';

const track = toolAnalytics('image-compress');
type Format = 'image/jpeg' | 'image/webp' | 'image/png';
type Preview = { url: string; size: number };
const message = {
  en: 'This image could not be compressed. Try a valid JPEG, PNG or WebP.',
  zh: '图片处理失败，请尝试有效的 JPEG、PNG 或 WebP 图片。',
};

export default function ImageCompress({ lang }: { lang: 'en' | 'zh' }) {
  const [original, setOriginal] = useState<Preview | null>(null);
  const [compressed, setCompressed] = useState<Preview | null>(null);
  const [quality, setQuality] = useState(0.7);
  const [format, setFormat] = useState<Format>('image/jpeg');
  const [processing, setProcessing] = useState(false);
  const [failed, setFailed] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => () => { if (original) URL.revokeObjectURL(original.url); }, [original]);
  useEffect(() => () => { if (compressed) URL.revokeObjectURL(compressed.url); }, [compressed]);

  const resetResult = () => {
    setCompressed(null);
    setFailed(false);
  };

  const handleFile = (e: Event) => {
    const file = (e.currentTarget as HTMLInputElement).files?.[0];
    if (!file) return;
    setOriginal({ url: URL.createObjectURL(file), size: file.size });
    resetResult();
  };

  const compress = async () => {
    const canvas = canvasRef.current;
    if (!original || !canvas || processing) return;
    const operation = format.split('/')[1];
    setProcessing(true);
    resetResult();
    track('tool_start', operation);
    try {
      const img = new Image();
      img.src = original.url;
      await img.decode();
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Canvas unavailable');
      ctx.drawImage(img, 0, 0);
      const blob = await new Promise<Blob | null>(resolve => canvas.toBlob(resolve, format, quality));
      if (!blob?.size || blob.type !== format) throw new Error('Image encoding failed');
      setCompressed({ url: URL.createObjectURL(blob), size: blob.size });
      const sizeChange = blob.size < original.size ? 'smaller' : blob.size > original.size ? 'larger' : 'same';
      track('tool_complete', operation, { size_change: sizeChange });
    } catch {
      setFailed(true);
      track('tool_error', operation, { error_type: 'image_processing' });
    } finally {
      setProcessing(false);
    }
  };

  const download = () => {
    if (!compressed) return;
    const operation = format.split('/')[1];
    const a = document.createElement('a');
    a.href = compressed.url;
    a.download = 'compressed.' + operation;
    a.click();
    track('download_click', operation);
  };

  const saved = original && compressed ? (1 - compressed.size / original.size) * 100 : 0;

  return (
    <div class="space-y-4">
      <div class="flex gap-2 flex-wrap items-end">
        <div>
          <label class="block text-sm text-gray-500 mb-1">Quality</label>
          <input type="range" min="0.1" max="1" step="0.1" value={quality}
            disabled={processing || format === 'image/png'} aria-label="Quality"
            onInput={(e) => { setQuality(Number(e.currentTarget.value)); resetResult(); }}
            class="w-32" />
          <span class="text-sm text-gray-500 ml-2">{format === 'image/png' ? 'Lossless' : Math.round(quality * 100) + '%'}</span>
        </div>
        <div>
          <label class="block text-sm text-gray-500 mb-1">Format</label>
          <select value={format} aria-label="Format" disabled={processing} onChange={(e) => { setFormat(e.currentTarget.value as Format); resetResult(); }}
            class="p-2 border border-gray-200 rounded-lg text-sm">
            <option value="image/jpeg">JPEG</option>
            <option value="image/png">PNG</option>
            <option value="image/webp">WebP</option>
          </select>
        </div>
      </div>
      <input type="file" accept="image/*" disabled={processing} onChange={handleFile}
        class="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:bg-zen-50 file:text-zen-600 hover:file:bg-zen-100" />
      {original && (
        <div>
          <button disabled={processing} onClick={compress} class="px-4 py-2 bg-zen-500 text-white rounded-lg text-sm font-medium hover:bg-zen-600">{processing ? 'Compressing…' : 'Compress'}</button>
        </div>
      )}
      {failed && <p role="alert" class="text-sm text-red-700">{message[lang]}</p>}
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
                <span class="ml-2">{saved > 0 ? 'Saved ' + saved.toFixed(1) + '%' : saved < 0 ? Math.abs(saved).toFixed(1) + '% larger' : 'Same size'}</span>
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
