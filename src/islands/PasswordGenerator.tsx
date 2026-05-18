import { useState, useCallback } from 'preact/hooks';
import { useLanguage } from '../hooks/useLanguage';

const UPPER = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const LOWER = 'abcdefghijklmnopqrstuvwxyz';
const DIGITS = '0123456789';
const SYMBOLS = '!@#$%^&*()_+-=[]{}|;:,.<>?';

function getStrength(len: number, types: number): { level: number; key: string } {
  if (len < 8) return { level: 0, key: 'pwVeryWeak' };
  if (len < 10 || types === 1) return { level: 1, key: 'pwWeak' };
  if (len < 12 || types === 2) return { level: 2, key: 'pwFair' };
  if (len < 16 || types === 3) return { level: 3, key: 'pwStrong' };
  return { level: 4, key: 'pwVeryStrong' };
}

const COLORS = ['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-green-400', 'bg-green-600'];

export default function PasswordGenerator() {
  const { t } = useLanguage();
  const [len, setLen] = useState(16);
  const [upper, setUpper] = useState(true);
  const [lower, setLower] = useState(true);
  const [digits, setDigits] = useState(true);
  const [symbols, setSymbols] = useState(false);
  const [password, setPassword] = useState('');

  const generate = useCallback(() => {
    let chars = '';
    if (upper) chars += UPPER;
    if (lower) chars += LOWER;
    if (digits) chars += DIGITS;
    if (symbols) chars += SYMBOLS;
    if (!chars) { setPassword(''); return; }

    const arr = new Uint32Array(len);
    crypto.getRandomValues(arr);
    let result = '';
    for (let i = 0; i < len; i++) result += chars[arr[i] % chars.length];
    setPassword(result);
  }, [len, upper, lower, digits, symbols]);

  const activeTypes = [+upper, +lower, +digits, +symbols].reduce((a, b) => a + b, 0);
  const strength = getStrength(len, activeTypes);

  const copy = () => navigator.clipboard.writeText(password);

  const Checkbox = ({ checked, onChange, label }: { checked: boolean; onChange: () => void; label: string }) => (
    <label class="flex items-center gap-2 cursor-pointer">
      <input type="checkbox" checked={checked} onChange={onChange}
        class="w-4 h-4 rounded accent-zen-500" />
      <span class="text-sm text-gray-700">{label}</span>
    </label>
  );

  return (
    <div class="space-y-4">
      <div>
        <label class="block text-sm text-gray-500 mb-1">
          {t.ui.pwLength}: <span class="font-semibold text-gray-700">{len}</span>
        </label>
        <input type="range" min="4" max="64" value={len}
          onInput={(e) => setLen(Number((e.target as HTMLInputElement).value))}
          class="w-full accent-zen-500" />
        <div class="flex justify-between text-xs text-gray-400"><span>4</span><span>64</span></div>
      </div>

      <div class="grid grid-cols-2 gap-2">
        <Checkbox checked={upper} onChange={() => setUpper(!upper)} label={t.ui.pwUppercase} />
        <Checkbox checked={lower} onChange={() => setLower(!lower)} label={t.ui.pwLowercase} />
        <Checkbox checked={digits} onChange={() => setDigits(!digits)} label={t.ui.pwNumbers} />
        <Checkbox checked={symbols} onChange={() => setSymbols(!symbols)} label={t.ui.pwSymbols} />
      </div>

      <button onClick={generate}
        class="w-full px-4 py-2 bg-zen-500 text-white rounded-lg text-sm font-medium hover:bg-zen-600">
        {t.ui.pwGenerate}
      </button>

      {password && (
        <div class="space-y-2">
          <div class="flex gap-1">
            {Array.from({ length: 5 }, (_, i) => (
              <div class={`h-1.5 flex-1 rounded-full ${i <= strength.level ? COLORS[strength.level] : 'bg-gray-200'}`} />
            ))}
          </div>
          <div class="text-xs text-gray-500">{t.ui.pwStrength}: {t.ui[strength.key as keyof typeof t.ui]}</div>
          <div class="flex gap-2">
            <input type="text" value={password} readOnly
              class="flex-1 p-3 bg-gray-50 border border-gray-200 rounded-lg font-mono text-sm" />
            <button onClick={copy}
              class="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm hover:bg-gray-200 whitespace-nowrap">
              {t.ui.copy}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
