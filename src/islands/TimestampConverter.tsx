import { useState, useEffect } from 'preact/hooks';
import { useLanguage } from '../hooks/useLanguage';

export default function TimestampConverter() {
  const { t } = useLanguage();
  const [now, setNow] = useState(Math.floor(Date.now() / 1000));
  const [tsInput, setTsInput] = useState('');
  const [tsResult, setTsResult] = useState('');
  const [dateInput, setDateInput] = useState('');
  const [dateResult, setDateResult] = useState('');

  useEffect(() => {
    const id = setInterval(() => setNow(Math.floor(Date.now() / 1000)), 1000);
    return () => clearInterval(id);
  }, []);

  const convertTsToDate = () => {
    const ts = parseInt(tsInput);
    if (isNaN(ts)) { setTsResult('Invalid'); return; }
    const ms = ts > 9999999999 ? ts : ts * 1000;
    setTsResult(new Date(ms).toLocaleString());
  };

  const convertDateToTs = () => {
    if (!dateInput) return;
    const d = new Date(dateInput);
    const sec = Math.floor(d.getTime() / 1000);
    setDateResult(sec.toString());
  };

  const copyNow = () => navigator.clipboard.writeText(now.toString());

  return (
    <div class="space-y-6">
      <div class="p-6 bg-zen-50 rounded-xl text-center space-y-3">
        <div class="text-sm text-gray-500">{t.ui.tsCurrent}</div>
        <div class="text-3xl font-mono font-bold text-gray-900">{now}</div>
        <div class="text-sm text-gray-400">{t.ui.tsSeconds} · {t.ui.tsMilliseconds}: {now}000</div>
        <button onClick={copyNow}
          class="px-4 py-1.5 bg-white border border-gray-200 rounded-lg text-sm hover:bg-gray-50">{t.ui.copy}</button>
      </div>

      <div class="p-4 border border-gray-200 rounded-xl space-y-3">
        <h3 class="text-sm font-semibold text-gray-700">{t.ui.tsToDate}</h3>
        <div class="flex gap-2">
          <input type="number" value={tsInput} onInput={(e) => setTsInput((e.target as HTMLInputElement).value)}
            placeholder={t.ui.tsEnterTs} class="flex-1 p-2 border border-gray-200 rounded-lg text-sm font-mono" />
          <button onClick={convertTsToDate}
            class="px-4 py-2 bg-zen-500 text-white rounded-lg text-sm hover:bg-zen-600">{t.ui.tsConvert}</button>
        </div>
        {tsResult && <div class="p-3 bg-gray-50 rounded-lg font-mono text-sm">{tsResult}</div>}
      </div>

      <div class="p-4 border border-gray-200 rounded-xl space-y-3">
        <h3 class="text-sm font-semibold text-gray-700">{t.ui.tsToTimestamp}</h3>
        <div class="flex gap-2">
          <input type="datetime-local" value={dateInput} onInput={(e) => setDateInput((e.target as HTMLInputElement).value)}
            class="flex-1 p-2 border border-gray-200 rounded-lg text-sm" />
          <button onClick={convertDateToTs}
            class="px-4 py-2 bg-zen-500 text-white rounded-lg text-sm hover:bg-zen-600">{t.ui.tsConvert}</button>
        </div>
        {dateResult && (
          <div class="flex gap-2 items-center">
            <div class="flex-1 p-3 bg-gray-50 rounded-lg font-mono text-sm">{dateResult}</div>
            <button onClick={() => navigator.clipboard.writeText(dateResult)}
              class="px-3 py-2 bg-gray-100 rounded-lg text-sm hover:bg-gray-200">{t.ui.copy}</button>
          </div>
        )}
      </div>
    </div>
  );
}
