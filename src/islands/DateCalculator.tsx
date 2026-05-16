import { useState } from 'preact/hooks';

function countWorkdays(start: Date, end: Date): number {
  let count = 0;
  const current = new Date(start);
  while (current <= end) {
    const day = current.getDay();
    if (day !== 0 && day !== 6) count++;
    current.setDate(current.getDate() + 1);
  }
  return count;
}

export default function DateCalculator() {
  const today = new Date().toISOString().slice(0, 10);
  const [mode, setMode] = useState<'diff' | 'add'>('diff');
  const [startDate, setStartDate] = useState(today);
  const [endDate, setEndDate] = useState(today);
  const [addDays, setAddDays] = useState(30);
  const [result, setResult] = useState<{ total: number; workdays: number; weekends: number; endDate: string } | null>(null);

  const calcDiff = () => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    if (end < start) return;
    const diffMs = end.getTime() - start.getTime();
    const total = Math.floor(diffMs / (1000 * 60 * 60 * 24)) + 1; // inclusive
    const workdays = countWorkdays(start, end);
    setResult({ total, workdays, weekends: total - workdays, endDate: '' });
  };

  const calcAdd = () => {
    const start = new Date(startDate);
    const end = new Date(start);
    end.setDate(end.getDate() + addDays);
    const endStr = end.toISOString().slice(0, 10);
    const workdays = countWorkdays(new Date(startDate), end);
    const total = addDays + 1;
    setResult({ total, workdays, weekends: total - workdays, endDate: endStr });
  };

  const weekDayNames = ['日', '一', '二', '三', '四', '五', '六'];

  return (
    <div class="space-y-6">
      {/* Mode toggle */}
      <div class="flex gap-1 bg-gray-100 rounded-lg p-1 w-fit">
        <button onClick={() => { setMode('diff'); setResult(null); }}
          class={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${mode === 'diff' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
          日期差值
        </button>
        <button onClick={() => { setMode('add'); setResult(null); }}
          class={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${mode === 'add' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
          日期推算
        </button>
      </div>

      {mode === 'diff' ? (
        <div class="space-y-4">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm text-gray-500 mb-1">开始日期</label>
              <input type="date" value={startDate} onInput={(e) => setStartDate((e.target as HTMLInputElement).value)}
                class="w-full p-2 border border-gray-200 rounded-lg text-sm focus:border-zen-500 outline-none" />
              <div class="mt-1 text-xs text-gray-400">
                {startDate ? `周${weekDayNames[new Date(startDate).getDay()]}` : ''}
              </div>
            </div>
            <div>
              <label class="block text-sm text-gray-500 mb-1">结束日期</label>
              <input type="date" value={endDate} onInput={(e) => setEndDate((e.target as HTMLInputElement).value)}
                class="w-full p-2 border border-gray-200 rounded-lg text-sm focus:border-zen-500 outline-none" />
              <div class="mt-1 text-xs text-gray-400">
                {endDate ? `周${weekDayNames[new Date(endDate).getDay()]}` : ''}
              </div>
            </div>
          </div>
          <button onClick={calcDiff} class="px-6 py-2 bg-zen-500 text-white rounded-lg text-sm font-medium hover:bg-zen-600 transition-colors">计算差值</button>
        </div>
      ) : (
        <div class="space-y-4">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm text-gray-500 mb-1">起始日期</label>
              <input type="date" value={startDate} onInput={(e) => setStartDate((e.target as HTMLInputElement).value)}
                class="w-full p-2 border border-gray-200 rounded-lg text-sm focus:border-zen-500 outline-none" />
            </div>
            <div>
              <label class="block text-sm text-gray-500 mb-1">往后推 (天)</label>
              <input type="number" value={addDays} onInput={(e) => setAddDays(Number((e.target as HTMLInputElement).value) || 0)}
                min="0" max="36500"
                class="w-full p-2 border border-gray-200 rounded-lg text-sm focus:border-zen-500 outline-none" />
            </div>
          </div>
          <button onClick={calcAdd} class="px-6 py-2 bg-zen-500 text-white rounded-lg text-sm font-medium hover:bg-zen-600 transition-colors">推算日期</button>
        </div>
      )}

      {result && (
        <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div class="p-4 bg-zen-50 rounded-lg text-center">
            <div class="text-xs text-gray-500 mb-1">总天数</div>
            <div class="text-2xl font-bold text-zen-600">{result.total}</div>
            <div class="text-xs text-gray-400">自然日</div>
          </div>
          <div class="p-4 bg-green-50 rounded-lg text-center">
            <div class="text-xs text-gray-500 mb-1">工作日</div>
            <div class="text-2xl font-bold text-green-600">{result.workdays}</div>
            <div class="text-xs text-gray-400">周一至周五</div>
          </div>
          <div class="p-4 bg-orange-50 rounded-lg text-center">
            <div class="text-xs text-gray-500 mb-1">周末</div>
            <div class="text-2xl font-bold text-orange-600">{result.weekends}</div>
            <div class="text-xs text-gray-400">周六+周日</div>
          </div>
          {result.endDate && (
            <div class="p-4 bg-purple-50 rounded-lg text-center">
              <div class="text-xs text-gray-500 mb-1">目标日期</div>
              <div class="text-xl font-bold text-purple-600">{result.endDate}</div>
              <div class="text-xs text-gray-400">周{weekDayNames[new Date(result.endDate).getDay()]}</div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
