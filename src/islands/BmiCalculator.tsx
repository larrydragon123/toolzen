import { useState } from 'preact/hooks';

export default function BmiCalculator() {
  const [height, setHeight] = useState(170);
  const [weight, setWeight] = useState(65);

  const h = height / 100;
  const bmi = weight / (h * h);

  const getResult = () => {
    if (bmi < 18.5) return { label: '偏瘦', color: 'text-yellow-600', bg: 'bg-yellow-50' };
    if (bmi < 24) return { label: '正常', color: 'text-green-600', bg: 'bg-green-50' };
    if (bmi < 28) return { label: '偏胖', color: 'text-orange-600', bg: 'bg-orange-50' };
    return { label: '肥胖', color: 'text-red-600', bg: 'bg-red-50' };
  };

  const result = getResult();

  return (
    <div class="space-y-4">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label class="block text-sm text-gray-500 mb-1">身高 (cm)</label>
          <input type="number" value={height} onInput={(e) => setHeight(Number((e.target as HTMLInputElement).value))}
            class="w-full p-2 border border-gray-200 rounded-lg text-sm focus:border-zen-500 outline-none" />
        </div>
        <div>
          <label class="block text-sm text-gray-500 mb-1">体重 (kg)</label>
          <input type="number" value={weight} onInput={(e) => setWeight(Number((e.target as HTMLInputElement).value))}
            class="w-full p-2 border border-gray-200 rounded-lg text-sm focus:border-zen-500 outline-none" />
        </div>
      </div>

      <div class="p-6 bg-zen-50 rounded-xl text-center">
        <div class="text-sm text-gray-500 mb-2">您的 BMI</div>
        <div class="text-5xl font-bold text-gray-900 mb-2">{bmi.toFixed(1)}</div>
        <div class={`inline-block px-4 py-1 rounded-full text-sm font-medium ${result.color} ${result.bg}`}>{result.label}</div>
      </div>

      <div class="grid grid-cols-4 gap-2 text-center text-xs">
        <div class="p-2 bg-yellow-50 rounded-lg">
          <div class="font-semibold text-yellow-700">偏瘦</div>
          <div class="text-yellow-600">&lt; 18.5</div>
        </div>
        <div class="p-2 bg-green-50 rounded-lg">
          <div class="font-semibold text-green-700">正常</div>
          <div class="text-green-600">18.5 - 24</div>
        </div>
        <div class="p-2 bg-orange-50 rounded-lg">
          <div class="font-semibold text-orange-700">偏胖</div>
          <div class="text-orange-600">24 - 28</div>
        </div>
        <div class="p-2 bg-red-50 rounded-lg">
          <div class="font-semibold text-red-700">肥胖</div>
          <div class="text-red-600">&ge; 28</div>
        </div>
      </div>
    </div>
  );
}
