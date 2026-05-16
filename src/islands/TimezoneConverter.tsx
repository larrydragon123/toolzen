import { useState, useEffect } from 'preact/hooks';

const TIMEZONES = [
  { label: 'UTC', offset: 'UTC+0' },
  { label: '北京 (CST)', offset: 'UTC+8' },
  { label: '东京 (JST)', offset: 'UTC+9' },
  { label: '纽约 (EST)', offset: 'UTC-5' },
  { label: '洛杉矶 (PST)', offset: 'UTC-8' },
  { label: '伦敦 (GMT)', offset: 'UTC+0' },
  { label: '巴黎 (CET)', offset: 'UTC+1' },
  { label: '悉尼 (AEDT)', offset: 'UTC+11' },
  { label: '迪拜 (GST)', offset: 'UTC+4' },
  { label: '新加坡 (SGT)', offset: 'UTC+8' },
  { label: '莫斯科 (MSK)', offset: 'UTC+3' },
  { label: '孟买 (IST)', offset: 'UTC+5:30' },
];

function getUTCOffset(offset: string): number {
  const match = offset.match(/UTC([+-]\d+):?(\d+)?/);
  if (!match) return 0;
  const sign = match[1].startsWith('-') ? -1 : 1;
  const hours = parseInt(match[1].replace(/[+-]/, ''));
  const mins = parseInt(match[2] || '0');
  return sign * (hours + mins / 60);
}

function getTimeInZone(utcOffset: number): Date {
  const now = new Date();
  const utc = now.getTime() + now.getTimezoneOffset() * 60000;
  return new Date(utc + utcOffset * 3600000);
}

function formatTime(date: Date): string {
  return date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
}

function formatDate(date: Date): string {
  return date.toLocaleDateString('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit', weekday: 'short' });
}

function getDateDiff(baseDate: Date, targetDate: Date): string {
  const baseDay = baseDate.toISOString().slice(0, 10);
  const targetDay = targetDate.toISOString().slice(0, 10);
  if (baseDay === targetDay) return '';
  if (targetDay < baseDay) return '-1天';
  if (targetDay > baseDay) return '+1天';
  return '';
}

export default function TimezoneConverter() {
  const [now, setNow] = useState(new Date());
  const [selectedZones, setSelectedZones] = useState<string[]>([
    'UTC+8', 'UTC-5', 'UTC+0', 'UTC+9'
  ]);
  const [customTime, setCustomTime] = useState('');
  const [useCustom, setUseCustom] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const toggleZone = (offset: string) => {
    setSelectedZones(prev =>
      prev.includes(offset) ? prev.filter(z => z !== offset) : [...prev, offset]
    );
  };

  const displayTime = useCustom && customTime ? new Date(customTime) : now;

  return (
    <div class="space-y-6">
      {/* Timezone selector */}
      <div>
        <label class="block text-sm text-gray-500 mb-2">选择时区（点击切换）</label>
        <div class="flex gap-2 flex-wrap">
          {TIMEZONES.map(tz => (
            <button onClick={() => toggleZone(tz.offset)}
              class={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                selectedZones.includes(tz.offset)
                  ? 'bg-zen-500 text-white'
                  : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
              }`}>
              {tz.label} ({tz.offset})
            </button>
          ))}
        </div>
      </div>

      {/* Custom time toggle */}
      <div class="flex items-center gap-2">
        <label class="text-sm text-gray-500">自定义时间:</label>
        <input type="datetime-local" value={customTime}
          onInput={(e) => {
            setCustomTime((e.target as HTMLInputElement).value);
            setUseCustom(true);
          }}
          class="p-2 border border-gray-200 rounded-lg text-sm focus:border-zen-500 outline-none" />
        {useCustom && (
          <button onClick={() => { setUseCustom(false); setCustomTime(''); }}
            class="text-xs text-zen-500 hover:text-zen-600">使用当前时间</button>
        )}
      </div>

      {/* Time cards */}
      <div class="space-y-3">
        {selectedZones.map(offset => {
          const utcOff = getUTCOffset(offset);
          const zoneTime = getTimeInZone(utcOff);
          // Apply custom time offset if using custom time
          let displayDate = zoneTime;
          if (useCustom && customTime) {
            const custom = new Date(customTime);
            const utc = custom.getTime() - getUTCOffset('UTC+8') * 3600000;
            displayDate = new Date(utc + utcOff * 3600000);
          }
          const tz = TIMEZONES.find(t => t.offset === offset);
          const diff = getDateDiff(now, zoneTime);
          return (
            <div class="flex items-center justify-between p-4 bg-white border border-gray-100 rounded-xl hover:border-zen-100 transition-colors">
              <div>
                <div class="font-medium text-gray-900">{tz?.label?.split(' (')[0] || offset}</div>
                <div class="text-xs text-gray-400">{offset} {diff && <span class="text-orange-500 ml-1">{diff}</span>}</div>
              </div>
              <div class="text-right">
                <div class="text-2xl font-mono font-bold text-gray-900">{formatTime(displayDate)}</div>
                <div class="text-xs text-gray-400">{formatDate(displayDate)}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Meeting planner note */}
      <div class="p-4 bg-zen-50 rounded-lg text-sm text-gray-600">
        <strong>提示：</strong>选择多个时区可以对比各地当前时间。点击时区按钮添加或移除。使用自定义时间可以规划跨国会议。
      </div>
    </div>
  );
}
