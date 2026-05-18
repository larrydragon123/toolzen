import { useState } from 'preact/hooks';
import { useLanguage } from '../hooks/useLanguage';

interface ZodiacInfo {
  animal: string; animalZh: string; emoji: string;
  constellation: string; constZh: string; symbol: string;
  desc: string;
}

const SHENGXIAO = [
  { animal: 'Rat', animalZh: '鼠', emoji: '🐭' },
  { animal: 'Ox', animalZh: '牛', emoji: '🐮' },
  { animal: 'Tiger', animalZh: '虎', emoji: '🐯' },
  { animal: 'Rabbit', animalZh: '兔', emoji: '🐰' },
  { animal: 'Dragon', animalZh: '龙', emoji: '🐲' },
  { animal: 'Snake', animalZh: '蛇', emoji: '🐍' },
  { animal: 'Horse', animalZh: '马', emoji: '🐴' },
  { animal: 'Goat', animalZh: '羊', emoji: '🐑' },
  { animal: 'Monkey', animalZh: '猴', emoji: '🐵' },
  { animal: 'Rooster', animalZh: '鸡', emoji: '🐔' },
  { animal: 'Dog', animalZh: '狗', emoji: '🐶' },
  { animal: 'Pig', animalZh: '猪', emoji: '🐷' },
];

const CONSTELLATIONS = [
  { name: 'Aries', zh: '白羊座', symbol: '♈', start: [3, 21], end: [4, 19] },
  { name: 'Taurus', zh: '金牛座', symbol: '♉', start: [4, 20], end: [5, 20] },
  { name: 'Gemini', zh: '双子座', symbol: '♊', start: [5, 21], end: [6, 21] },
  { name: 'Cancer', zh: '巨蟹座', symbol: '♋', start: [6, 22], end: [7, 22] },
  { name: 'Leo', zh: '狮子座', symbol: '♌', start: [7, 23], end: [8, 22] },
  { name: 'Virgo', zh: '处女座', symbol: '♍', start: [8, 23], end: [9, 22] },
  { name: 'Libra', zh: '天秤座', symbol: '♎', start: [9, 23], end: [10, 23] },
  { name: 'Scorpio', zh: '天蝎座', symbol: '♏', start: [10, 24], end: [11, 22] },
  { name: 'Sagittarius', zh: '射手座', symbol: '♐', start: [11, 23], end: [12, 21] },
  { name: 'Capricorn', zh: '摩羯座', symbol: '♑', start: [12, 22], end: [1, 19] },
  { name: 'Aquarius', zh: '水瓶座', symbol: '♒', start: [1, 20], end: [2, 18] },
  { name: 'Pisces', zh: '双鱼座', symbol: '♓', start: [2, 19], end: [3, 20] },
];

function getShengxiaoYear(year: number, month: number, day: number): number {
  if (month < 2 || (month === 2 && day < 4)) return year - 1;
  return year;
}

function getConstellation(month: number, day: number): typeof CONSTELLATIONS[0] {
  for (const c of CONSTELLATIONS) {
    const [sm, sd] = c.start, [em, ed] = c.end;
    if (sm > em) {
      if ((month === sm && day >= sd) || month > sm || month < em || (month === em && day <= ed)) return c;
    } else {
      if ((month === sm && day >= sd) || (month === em && day <= ed)) return c;
    }
  }
  return CONSTELLATIONS[0];
}

export default function ZodiacFinder() {
  const { t } = useLanguage();
  const [date, setDate] = useState('');
  const [result, setResult] = useState<ZodiacInfo | null>(null);

  const find = () => {
    if (!date) return;
    const d = new Date(date);
    const year = d.getFullYear();
    const month = d.getMonth() + 1;
    const day = d.getDate();

    const sxYear = getShengxiaoYear(year, month, day);
    const idx = ((sxYear - 4) % 12 + 12) % 12;
    const sx = SHENGXIAO[idx];
    const con = getConstellation(month, day);

    setResult({
      animal: sx.animal, animalZh: sx.animalZh, emoji: sx.emoji,
      constellation: con.name, constZh: con.zh, symbol: con.symbol,
      desc: `属${sx.animalZh}，${con.zh}${con.symbol}`,
    });
  };

  return (
    <div class="space-y-4">
      <div>
        <label class="block text-sm text-gray-500 mb-1">{t.ui.zodiacSelect}</label>
        <input type="date" value={date}
          onInput={(e) => { setDate((e.target as HTMLInputElement).value); find(); }}
          class="w-full p-2 border border-gray-200 rounded-lg text-sm focus:border-zen-500 outline-none" />
      </div>

      {result && (
        <div class="grid grid-cols-2 gap-4">
          <div class="p-6 bg-red-50 rounded-xl text-center space-y-2">
            <div class="text-xs text-red-500">{t.ui.zodiacShengxiao}</div>
            <div class="text-5xl">{result.emoji}</div>
            <div class="text-2xl font-bold text-red-700">{result.animalZh}</div>
            <div class="text-sm text-red-400">{result.animal}</div>
          </div>
          <div class="p-6 bg-purple-50 rounded-xl text-center space-y-2">
            <div class="text-xs text-purple-500">{t.ui.zodiacXingzuo}</div>
            <div class="text-5xl">{result.symbol}</div>
            <div class="text-2xl font-bold text-purple-700">{result.constZh}</div>
            <div class="text-sm text-purple-400">{result.constellation}</div>
          </div>
        </div>
      )}
    </div>
  );
}
