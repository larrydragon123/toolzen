import { useState } from 'preact/hooks';

export default function QrCodeGenerator() {
  const [text, setText] = useState('');
  const [qrDataUrl, setQrDataUrl] = useState('');
  const [size, setSize] = useState(256);
  const [fgColor, setFgColor] = useState('#000000');
  const [bgColor, setBgColor] = useState('#ffffff');

  const generate = async () => {
    if (!text.trim()) return;
    const QRCode = (await import('qrcode')).default;
    try {
      const dataUrl = await QRCode.toDataURL(text, {
        width: size,
        color: { dark: fgColor, light: bgColor },
        margin: 2,
      });
      setQrDataUrl(dataUrl);
    } catch (e) {
      console.error('QR generation failed:', e);
    }
  };

  const download = () => {
    const a = document.createElement('a');
    a.href = qrDataUrl;
    a.download = 'qrcode.png';
    a.click();
  };

  return (
    <div class="space-y-4">
      <div class="flex gap-2 flex-wrap items-end">
        <div class="flex-1 min-w-48">
          <label class="block text-sm text-gray-500 mb-1">Content (URL / Text)</label>
          <input value={text} onInput={(e) => setText((e.target as HTMLInputElement).value)}
            placeholder="https://example.com"
            class="w-full p-2 border border-gray-200 rounded-lg text-sm focus:border-zen-500 outline-none" />
        </div>
        <div>
          <label class="block text-sm text-gray-500 mb-1">Size</label>
          <select value={size} onChange={(e) => setSize(Number((e.target as HTMLSelectElement).value))}
            class="p-2 border border-gray-200 rounded-lg text-sm">
            <option value={128}>128</option>
            <option value={256}>256</option>
            <option value={512}>512</option>
          </select>
        </div>
        <button onClick={generate} class="px-4 py-2 bg-zen-500 text-white rounded-lg text-sm font-medium hover:bg-zen-600">Generate</button>
      </div>
      <div class="flex gap-4">
        <div>
          <label class="block text-xs text-gray-400 mb-1">Foreground</label>
          <input type="color" value={fgColor} onInput={(e) => setFgColor((e.target as HTMLInputElement).value)}
            class="w-10 h-10 rounded cursor-pointer border-0" />
        </div>
        <div>
          <label class="block text-xs text-gray-400 mb-1">Background</label>
          <input type="color" value={bgColor} onInput={(e) => setBgColor((e.target as HTMLInputElement).value)}
            class="w-10 h-10 rounded cursor-pointer border-0" />
        </div>
      </div>
      {qrDataUrl && (
        <div class="space-y-2">
          <img src={qrDataUrl} alt="QR Code" class="border border-gray-100 rounded-lg" />
          <button onClick={download} class="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200">Download PNG</button>
        </div>
      )}
    </div>
  );
}
