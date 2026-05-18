import { useState } from 'preact/hooks';
import { useLanguage } from '../hooks/useLanguage';

interface UnitDef { key: string; toBase: (v: number) => number; fromBase: (v: number) => number; }

const CATEGORIES: Record<string, { units: Record<string, UnitDef> }> = {
  length: {
    units: {
      meter:      { key: 'meter', toBase: v => v, fromBase: v => v },
      kilometer:  { key: 'kilometer', toBase: v => v * 1000, fromBase: v => v / 1000 },
      centimeter: { key: 'centimeter', toBase: v => v / 100, fromBase: v => v * 100 },
      millimeter: { key: 'millimeter', toBase: v => v / 1000, fromBase: v => v * 1000 },
      inch:       { key: 'inch', toBase: v => v * 0.0254, fromBase: v => v / 0.0254 },
      foot:       { key: 'foot', toBase: v => v * 0.3048, fromBase: v => v / 0.3048 },
      yard:       { key: 'yard', toBase: v => v * 0.9144, fromBase: v => v / 0.9144 },
      mile:       { key: 'mile', toBase: v => v * 1609.344, fromBase: v => v / 1609.344 },
    },
  },
  weight: {
    units: {
      kilogram:  { key: 'kilogram', toBase: v => v, fromBase: v => v },
      gram:      { key: 'gram', toBase: v => v / 1000, fromBase: v => v * 1000 },
      milligram: { key: 'milligram', toBase: v => v / 1e6, fromBase: v => v * 1e6 },
      ton:       { key: 'ton', toBase: v => v * 1000, fromBase: v => v / 1000 },
      pound:     { key: 'pound', toBase: v => v * 0.453592, fromBase: v => v / 0.453592 },
      ounce:     { key: 'ounce', toBase: v => v * 0.0283495, fromBase: v => v / 0.0283495 },
    },
  },
  temperature: {
    units: {
      celsius:    { key: 'celsius', toBase: v => v, fromBase: v => v },
      fahrenheit: { key: 'fahrenheit', toBase: v => (v - 32) * 5 / 9, fromBase: v => v * 9 / 5 + 32 },
      kelvin:     { key: 'kelvin', toBase: v => v - 273.15, fromBase: v => v + 273.15 },
    },
  },
  area: {
    units: {
      sqMeter:      { key: 'sqMeter', toBase: v => v, fromBase: v => v },
      sqKilometer:  { key: 'sqKilometer', toBase: v => v * 1e6, fromBase: v => v / 1e6 },
      sqCentimeter: { key: 'sqCentimeter', toBase: v => v / 10000, fromBase: v => v * 10000 },
      hectare:      { key: 'hectare', toBase: v => v * 10000, fromBase: v => v / 10000 },
      acre:         { key: 'acre', toBase: v => v * 4046.86, fromBase: v => v / 4046.86 },
      sqFoot:       { key: 'sqFoot', toBase: v => v * 0.092903, fromBase: v => v / 0.092903 },
    },
  },
  volume: {
    units: {
      liter:      { key: 'liter', toBase: v => v, fromBase: v => v },
      milliliter: { key: 'milliliter', toBase: v => v / 1000, fromBase: v => v * 1000 },
      cubicMeter: { key: 'cubicMeter', toBase: v => v * 1000, fromBase: v => v / 1000 },
      gallon:     { key: 'gallon', toBase: v => v * 3.78541, fromBase: v => v / 3.78541 },
      quart:      { key: 'quart', toBase: v => v * 0.946353, fromBase: v => v / 0.946353 },
      cup:        { key: 'cup', toBase: v => v * 0.236588, fromBase: v => v / 0.236588 },
    },
  },
  speed: {
    units: {
      kmPerHour:  { key: 'kmPerHour', toBase: v => v, fromBase: v => v },
      mPerSecond: { key: 'mPerSecond', toBase: v => v * 3.6, fromBase: v => v / 3.6 },
      mph:        { key: 'mph', toBase: v => v * 1.60934, fromBase: v => v / 1.60934 },
      knot:       { key: 'knot', toBase: v => v * 1.852, fromBase: v => v / 1.852 },
    },
  },
};

const CAT_KEYS = ['length', 'weight', 'temperature', 'area', 'volume', 'speed'] as const;
const CAT_UI_KEYS: Record<string, string> = {
  length: 'unitLength', weight: 'unitWeight', temperature: 'unitTemperature',
  area: 'unitArea', volume: 'unitVolume', speed: 'unitSpeed',
};

export default function UnitConverter() {
  const { t } = useLanguage();
  const [cat, setCat] = useState('length');
  const [fromVal, setFromVal] = useState('1');
  const [fromUnit, setFromUnit] = useState('meter');
  const [toUnit, setToUnit] = useState('foot');

  const category = CATEGORIES[cat];
  const unitKeys = Object.keys(category.units);

  const convert = () => {
    const val = parseFloat(fromVal);
    if (isNaN(val)) return '';
    const base = category.units[fromUnit]?.toBase(val) ?? 0;
    const result = category.units[toUnit]?.fromBase(base) ?? 0;
    if (Math.abs(result) < 1e-10) return '0';
    if (Math.abs(result) < 0.0001 || Math.abs(result) > 1e10) return result.toExponential(6);
    return parseFloat(result.toFixed(6)).toString();
  };

  // Sync selected units when category changes
  const handleCatChange = (newCat: string) => {
    const keys = Object.keys(CATEGORIES[newCat].units);
    setCat(newCat);
    setFromUnit(keys[0]);
    setToUnit(keys[1] || keys[0]);
  };

  return (
    <div class="space-y-4">
      <div class="flex flex-wrap gap-1.5">
        {CAT_KEYS.map(k => (
          <button key={k} onClick={() => handleCatChange(k)}
            class={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              cat === k ? 'bg-zen-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}>
            {t.ui[CAT_UI_KEYS[k] as keyof typeof t.ui]}
          </button>
        ))}
      </div>

      <div class="flex gap-2 items-end">
        <div class="flex-1">
          <label class="block text-xs text-gray-500 mb-1">{t.ui.unitFrom}</label>
          <input type="number" value={fromVal} onInput={(e) => setFromVal((e.target as HTMLInputElement).value)}
            class="w-full p-2 border border-gray-200 rounded-lg text-sm font-mono" />
        </div>
        <div>
          <select value={fromUnit} onChange={(e) => setFromUnit((e.target as HTMLSelectElement).value)}
            class="p-2 border border-gray-200 rounded-lg text-sm bg-white">
            {unitKeys.map(k => (
              <option key={k} value={k}>{t.ui[category.units[k].key as keyof typeof t.ui]}</option>
            ))}
          </select>
        </div>
      </div>

      <div class="flex gap-2 items-end">
        <div class="flex-1">
          <label class="block text-xs text-gray-500 mb-1">{t.ui.unitTo}</label>
          <input type="text" value={convert()} readOnly
            class="w-full p-2 bg-gray-50 border border-gray-200 rounded-lg text-sm font-mono" />
        </div>
        <div>
          <select value={toUnit} onChange={(e) => setToUnit((e.target as HTMLSelectElement).value)}
            class="p-2 border border-gray-200 rounded-lg text-sm bg-white">
            {unitKeys.map(k => (
              <option key={k} value={k}>{t.ui[category.units[k].key as keyof typeof t.ui]}</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
