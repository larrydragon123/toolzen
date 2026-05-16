import { useState } from 'preact/hooks';

function hexToRgb(hex: string) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return { r, g, b };
}

function hexToHsl(hex: string) {
  let { r, g, b } = hexToRgb(hex);
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0, l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
      case g: h = ((b - r) / d + 2) / 6; break;
      case b: h = ((r - g) / d + 4) / 6; break;
    }
  }
  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
}

export default function ColorPicker() {
  const [hex, setHex] = useState('#2563eb');
  const [copied, setCopied] = useState('');

  const rgb = hexToRgb(hex);
  const hsl = hexToHsl(hex);

  const copy = (text: string, label: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(label);
      setTimeout(() => setCopied(''), 1500);
    }).catch(() => {});
  };

  return (
    <div class="space-y-4">
      <div class="flex gap-4 items-start flex-wrap">
        <div>
          <input type="color" value={hex} onInput={(e) => setHex((e.target as HTMLInputElement).value)}
            class="w-24 h-24 rounded-lg cursor-pointer border-0" />
        </div>
        <div class="space-y-2 flex-1">
          <div class="flex items-center gap-2">
            <span class="text-sm text-gray-500 w-8">HEX</span>
            <code class="px-2 py-1 bg-gray-50 rounded text-sm">{hex}</code>
            <button onClick={() => copy(hex, 'HEX')} class="text-xs text-zen-500 hover:text-zen-600">
              {copied === 'HEX' ? 'Copied!' : 'Copy'}
            </button>
          </div>
          <div class="flex items-center gap-2">
            <span class="text-sm text-gray-500 w-8">RGB</span>
            <code class="px-2 py-1 bg-gray-50 rounded text-sm">rgb({rgb.r}, {rgb.g}, {rgb.b})</code>
            <button onClick={() => copy(`rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`, 'RGB')} class="text-xs text-zen-500 hover:text-zen-600">
              {copied === 'RGB' ? 'Copied!' : 'Copy'}
            </button>
          </div>
          <div class="flex items-center gap-2">
            <span class="text-sm text-gray-500 w-8">HSL</span>
            <code class="px-2 py-1 bg-gray-50 rounded text-sm">hsl({hsl.h}, {hsl.s}%, {hsl.l}%)</code>
            <button onClick={() => copy(`hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`, 'HSL')} class="text-xs text-zen-500 hover:text-zen-600">
              {copied === 'HSL' ? 'Copied!' : 'Copy'}
            </button>
          </div>
        </div>
      </div>
      <input value={hex} onInput={(e) => setHex((e.target as HTMLInputElement).value)}
        placeholder="#000000"
        class="w-full max-w-xs p-2 border border-gray-200 rounded-lg font-mono text-sm focus:border-zen-500 outline-none" />
    </div>
  );
}
