import { useState, useRef } from 'preact/hooks';
import qrcode from 'qrcode-generator';
import { useLanguage } from '../hooks/useLanguage';

export default function QrCodeGenerator() {
  const { t } = useLanguage();
  const [text, setText] = useState('');
  const [qrDataUrl, setQrDataUrl] = useState('');
  const [size, setSize] = useState(256);
  const [fgColor, setFgColor] = useState('#000000');
  const [bgColor, setBgColor] = useState('#ffffff');
  const [error, setError] = useState('');
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const generate = () => {
    const val = text.trim();
    if (!val) {
      setError(t.ui.enterContent);
      return;
    }
    setError('');
    try {
      const qr = qrcode(0, 'M');
      qr.addData(val);
      qr.make();

      const moduleCount = qr.getModuleCount();
      const margin = 4;
      const totalModules = moduleCount + margin * 2;
      const moduleSize = Math.floor(size / totalModules);

      const canvas = canvasRef.current;
      if (!canvas) return;
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Background
      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, size, size);

      // Draw modules
      ctx.fillStyle = fgColor;
      for (let row = 0; row < moduleCount; row++) {
        for (let col = 0; col < moduleCount; col++) {
          if (qr.isDark(row, col)) {
            const x = (col + margin) * moduleSize;
            const y = (row + margin) * moduleSize;
            ctx.fillRect(x, y, moduleSize, moduleSize);
          }
        }
      }

      setQrDataUrl(canvas.toDataURL('image/png'));
    } catch (e: any) {
      setError(t.ui.generateFailed + ': ' + (e?.message || ''));
    }
  };

  const download = () => {
    if (!qrDataUrl) return;
    const a = document.createElement('a');
    a.href = qrDataUrl;
    a.download = 'qrcode.png';
    a.click();
  };

  return (
    <div class="space-y-4">
      <div class="flex gap-2 flex-wrap items-end">
        <div class="flex-1 min-w-48">
          <label class="block text-sm text-gray-500 mb-1">{t.ui.content}</label>
          <input value={text} onInput={(e) => setText((e.target as HTMLInputElement).value)}
            placeholder="https://example.com"
            class="w-full p-2 border border-gray-200 rounded-lg text-sm focus:border-zen-500 outline-none" />
        </div>
        <div>
          <label class="block text-sm text-gray-500 mb-1">{t.ui.size}</label>
          <select value={size} onChange={(e) => setSize(Number((e.target as HTMLSelectElement).value))}
            class="p-2 border border-gray-200 rounded-lg text-sm">
            <option value={128}>128</option>
            <option value={256}>256</option>
            <option value={512}>512</option>
          </select>
        </div>
        <button onClick={generate}
          class="px-4 py-2 bg-zen-500 text-white rounded-lg text-sm font-medium hover:bg-zen-600 transition-colors">
          {t.ui.generate}
        </button>
      </div>
      <div class="flex gap-4">
        <div>
          <label class="block text-xs text-gray-400 mb-1">{t.ui.fgColor}</label>
          <input type="color" value={fgColor} onInput={(e) => setFgColor((e.target as HTMLInputElement).value)}
            class="w-10 h-10 rounded cursor-pointer border-0" />
        </div>
        <div>
          <label class="block text-xs text-gray-400 mb-1">{t.ui.bgColor}</label>
          <input type="color" value={bgColor} onInput={(e) => setBgColor((e.target as HTMLInputElement).value)}
            class="w-10 h-10 rounded cursor-pointer border-0" />
        </div>
      </div>
      <canvas ref={canvasRef} style="display:none" />
      {error && <div class="p-3 bg-red-50 border border-red-100 rounded-lg text-sm text-red-600">{error}</div>}
      {qrDataUrl && (
        <div class="space-y-2">
          <img src={qrDataUrl} alt="QR Code" class="border border-gray-100 rounded-lg max-w-full" />
          <button onClick={download} class="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200">{t.ui.downloadPng}</button>
        </div>
      )}
    </div>
  );
}
