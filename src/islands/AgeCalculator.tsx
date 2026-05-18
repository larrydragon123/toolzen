import { useState } from 'preact/hooks';
import { useLanguage } from '../hooks/useLanguage';

export default function AgeCalculator() {
  const { t } = useLanguage();
  const [birth, setBirth] = useState('');
  const [result, setResult] = useState<{ y: number; m: number; d: number; nextBirthday: number } | null>(null);
  const [error, setError] = useState('');

  const calculate = () => {
    setError('');
    if (!birth) { setError('Please select a birth date'); return; }
    const b = new Date(birth);
    const now = new Date();
    if (b > now) { setError('Birth date cannot be in the future'); return; }

    let years = now.getFullYear() - b.getFullYear();
    let months = now.getMonth() - b.getMonth();
    let days = now.getDate() - b.getDate();

    if (days < 0) {
      months--;
      const prevMonth = new Date(now.getFullYear(), now.getMonth(), 0);
      days += prevMonth.getDate();
    }
    if (months < 0) { years--; months += 12; }

    const nextBday = new Date(now.getFullYear(), b.getMonth(), b.getDate());
    if (nextBday <= now) nextBday.setFullYear(now.getFullYear() + 1);
    const daysUntil = Math.ceil((nextBday.getTime() - now.getTime()) / 86400000);

    setResult({ y: years, m: months, d: days, nextBirthday: daysUntil });
  };

  return (
    <div class="space-y-4">
      <div>
        <label class="block text-sm text-gray-500 mb-1">{t.ui.ageBirthDate}</label>
        <input type="date" value={birth} onInput={(e) => setBirth((e.target as HTMLInputElement).value)}
          class="w-full p-2 border border-gray-200 rounded-lg text-sm focus:border-zen-500 outline-none" />
      </div>

      <button onClick={calculate}
        class="w-full px-4 py-2 bg-zen-500 text-white rounded-lg text-sm font-medium hover:bg-zen-600">
        {t.ui.ageCalculate}
      </button>

      {error && <div class="text-red-500 text-sm text-center">{error}</div>}

      {result && (
        <div class="space-y-4">
          <div class="grid grid-cols-3 gap-3 text-center">
            <div class="p-4 bg-zen-50 rounded-xl">
              <div class="text-3xl font-bold text-gray-900">{result.y}</div>
              <div class="text-sm text-gray-500">{t.ui.ageYearsOld}</div>
            </div>
            <div class="p-4 bg-zen-50 rounded-xl">
              <div class="text-3xl font-bold text-gray-900">{result.m}</div>
              <div class="text-sm text-gray-500">{t.ui.ageMonthsOld}</div>
            </div>
            <div class="p-4 bg-zen-50 rounded-xl">
              <div class="text-3xl font-bold text-gray-900">{result.d}</div>
              <div class="text-sm text-gray-500">{t.ui.ageDaysOld}</div>
            </div>
          </div>
          <div class="p-4 bg-purple-50 rounded-xl text-center">
            <div class="text-sm text-purple-500">{t.ui.ageNextBirthday}</div>
            <div class="text-2xl font-bold text-purple-700">
              {result.nextBirthday} {t.ui.ageDaysUntil}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
