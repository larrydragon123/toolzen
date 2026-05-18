# Week 1 Optimization Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add 5 new tools, a `life` category, AI discoverability files, and FAQ schema to boost traffic and search visibility.

**Architecture:** All new tools follow the existing pattern: `tools.ts` entry → Preact island component → Astro page → i18n translations. Each tool is self-contained with no cross-dependencies.

**Tech Stack:** Astro 6, Preact, TypeScript, Tailwind CSS 4. No new npm dependencies.

---

### Task 1: New `life` Category + i18n Infrastructure

**Files:**
- Modify: `src/utils/tools.ts` — add `'life'` to type + CATEGORIES
- Modify: `src/components/Header.astro` — add nav item
- Modify: `src/i18n/ui.ts` — add password/timestamp/age/zodiac/unit UI fields + life category
- Modify: `src/i18n/zh.ts` — add Chinese translations
- Modify: `src/i18n/en.ts` — add English translations

- [ ] **Step 1: Add `life` category and expand UIDict type**

In `src/utils/tools.ts`, update the `Tool` interface and `CATEGORIES`:

```typescript
export interface Tool {
  slug: string;
  title: string;
  description: string;
  category: 'dev' | 'text' | 'image' | 'crypto' | 'calculators' | 'life';
  keywords: string[];
  complexity: 'low' | 'medium';
}

// Add to CATEGORIES array:
export const CATEGORIES: Category[] = [
  { slug: 'dev', title: '开发者工具', icon: '💻', description: 'JSON、Base64、正则等开发者常用工具' },
  { slug: 'text', title: '文本工具', icon: '📝', description: '文本对比、字数统计等文字处理工具' },
  { slug: 'image', title: '图片工具', icon: '🖼️', description: '图片压缩、二维码生成等图像工具' },
  { slug: 'crypto', title: '编码加密', icon: '🔐', description: 'MD5、SHA哈希、URL编解码工具' },
  { slug: 'calculators', title: '计算器', icon: '🔢', description: '房贷、BMI等实用计算器' },
  { slug: 'life', title: '生活工具', icon: '🌟', description: '生肖星座、年龄查询等生活实用工具' },
];
```

In `src/i18n/ui.ts`, add new UI fields to `UIDict`:

```typescript
export interface UIDict {
  // ... existing fields ...

  // Password Generator
  pwLength: string; pwUppercase: string; pwLowercase: string;
  pwNumbers: string; pwSymbols: string; pwGenerate: string;
  pwStrength: string; pwVeryWeak: string; pwWeak: string;
  pwFair: string; pwStrong: string; pwVeryStrong: string;

  // Timestamp Converter
  tsCurrent: string; tsToDate: string; tsToTimestamp: string;
  tsEnterTs: string; tsEnterDate: string; tsConvert: string;
  tsSeconds: string; tsMilliseconds: string;

  // Age Calculator
  ageBirthDate: string; ageCalculate: string; ageYearsOld: string;
  ageMonthsOld: string; ageDaysOld: string; ageNextBirthday: string;
  ageDaysUntil: string;

  // Zodiac Finder
  zodiacSelect: string; zodiacAnimal: string; zodiacConstellation: string;
  zodiacShengxiao: string; zodiacXingzuo: string;

  // Unit Converter
  unitCategory: string; unitFrom: string; unitTo: string;
  unitLength: string; unitWeight: string; unitTemperature: string;
  unitArea: string; unitVolume: string; unitSpeed: string;
  // Unit names
  meter: string; kilometer: string; centimeter: string; millimeter: string;
  inch: string; foot: string; yard: string; mile: string;
  kilogram: string; gram: string; milligram: string; ton: string;
  pound: string; ounce: string;
  celsius: string; fahrenheit: string; kelvin: string;
  sqMeter: string; sqKilometer: string; sqCentimeter: string;
  hectare: string; acre: string; sqFoot: string;
  liter: string; milliliter: string; cubicMeter: string;
  gallon: string; quart: string; cup: string;
  kmPerHour: string; mPerSecond: string; mph: string; knot: string;
}
```

In `src/components/Header.astro`, add the `life` nav item after `calculators`:

```astro
const navItems = [
  { label: t.nav.dev, href: `/${lang}/category/dev/` },
  { label: t.nav.text, href: `/${lang}/category/text/` },
  { label: t.nav.image, href: `/${lang}/category/image/` },
  { label: t.nav.crypto, href: `/${lang}/category/crypto/` },
  { label: t.nav.calculators, href: `/${lang}/category/calculators/` },
  { label: t.nav.life, href: `/${lang}/category/life/` },
];
```

- [ ] **Step 2: Add i18n translations for new category and UI strings**

In `src/i18n/zh.ts`, add to `nav` and `categories` and `ui` sections:

```typescript
// nav (inside existing nav object):
life: '生活工具',

// categories (inside existing categories object):
life: { title: '生活工具', description: '生肖星座、年龄查询等生活实用工具' },

// ui (inside existing ui object):
// Password
pwLength: '密码长度', pwUppercase: '包含大写字母', pwLowercase: '包含小写字母',
pwNumbers: '包含数字', pwSymbols: '包含符号', pwGenerate: '生成密码',
pwStrength: '密码强度', pwVeryWeak: '很弱', pwWeak: '弱',
pwFair: '一般', pwStrong: '强', pwVeryStrong: '很强',

// Timestamp
tsCurrent: '当前时间戳', tsToDate: '时间戳 → 日期',
tsToTimestamp: '日期 → 时间戳', tsEnterTs: '输入时间戳（秒）',
tsEnterDate: '选择日期时间', tsConvert: '转换',
tsSeconds: '秒', tsMilliseconds: '毫秒',

// Age
ageBirthDate: '出生日期', ageCalculate: '计算年龄',
ageYearsOld: '岁', ageMonthsOld: '个月', ageDaysOld: '天',
ageNextBirthday: '下次生日', ageDaysUntil: '还有',

// Zodiac
zodiacSelect: '选择出生日期', zodiacAnimal: '生肖',
zodiacConstellation: '星座', zodiacShengxiao: '生肖',
zodiacXingzuo: '星座',

// Unit
unitCategory: '类别', unitFrom: '从', unitTo: '到',
unitLength: '长度', unitWeight: '重量', unitTemperature: '温度',
unitArea: '面积', unitVolume: '体积', unitSpeed: '速度',
meter: '米 (m)', kilometer: '千米 (km)', centimeter: '厘米 (cm)',
millimeter: '毫米 (mm)', inch: '英寸 (in)', foot: '英尺 (ft)',
yard: '码 (yd)', mile: '英里 (mi)',
kilogram: '千克 (kg)', gram: '克 (g)', milligram: '毫克 (mg)',
ton: '吨 (t)', pound: '磅 (lb)', ounce: '盎司 (oz)',
celsius: '摄氏度 (°C)', fahrenheit: '华氏度 (°F)', kelvin: '开尔文 (K)',
sqMeter: '平方米 (m²)', sqKilometer: '平方千米 (km²)',
sqCentimeter: '平方厘米 (cm²)', hectare: '公顷 (ha)',
acre: '英亩 (ac)', sqFoot: '平方英尺 (ft²)',
liter: '升 (L)', milliliter: '毫升 (mL)', cubicMeter: '立方米 (m³)',
gallon: '加仑 (gal)', quart: '夸脱 (qt)', cup: '杯 (cup)',
kmPerHour: '千米/时 (km/h)', mPerSecond: '米/秒 (m/s)',
mph: '英里/时 (mph)', knot: '节 (kn)',
```

In `src/i18n/en.ts`, add the same keys with English values (mirror structure).

- [ ] **Step 3: Build and verify no TypeScript errors**

```bash
cd /c/Users/drago/Desktop/Deepseek项目 && npm run build 2>&1 | tail -20
```

Expected: build completes without TS errors (may have unused import warnings for new UI fields — that's fine until tools use them).

---

### Task 2: Password Generator Tool

**Files:**
- Create: `src/islands/PasswordGenerator.tsx`
- Create: `src/pages/[lang]/password-generator.astro`
- Modify: `src/utils/tools.ts` — add tool entry
- Modify: `src/i18n/zh.ts` — add tool translations
- Modify: `src/i18n/en.ts` — add tool translations

- [ ] **Step 1: Add tool entry and translations**

In `src/utils/tools.ts`, add to `TOOLS` array:

```typescript
{
  slug: 'password-generator',
  title: '随机密码生成器',
  description: '在线随机密码生成工具。自定义长度和字符类型，一键生成高强度密码。所有生成过程在浏览器本地完成。',
  category: 'crypto',
  keywords: ['随机密码生成', '密码生成器', '强密码', '密码强度', '在线密码'],
  complexity: 'low',
},
```

In `src/i18n/zh.ts`, add to `tools` object:

```typescript
'password-generator': {
  title: '随机密码生成器',
  description: '在线随机密码生成工具。自定义长度和字符类型，一键生成高强度密码。所有生成过程在浏览器本地完成。',
  keywords: ['随机密码生成', '密码生成器', '强密码', '密码强度', '在线密码'],
  howToTitle: '如何使用随机密码生成器',
  howTo: '拖动滑块设置密码长度（4-64位），勾选需要的字符类型（大写字母、小写字母、数字、符号），点击"生成密码"按钮即可获得高强度随机密码。生成的密码可一键复制。所有生成过程在浏览器本地完成，密码不会上传到任何服务器。',
  faq: [
    { q: '生成的密码安全吗？', a: '使用 crypto.getRandomValues() 加密级随机数生成，确保每个字符都是不可预测的真随机，适合用于各类账号密码。密码强度条会根据长度和字符类型数量评估强度。' },
    { q: '生成的密码会被记录吗？', a: '不会。所有生成操作在浏览器本地完成，密码不会被存储、传输或记录。关闭页面后生成的密码即被清除。' },
    { q: '多长的密码最安全？', a: '一般建议至少12位，包含大小写字母、数字和符号四类字符。16位以上且包含全部四类字符的密码强度最高。' },
  ],
},
```

Add same structure in `src/i18n/en.ts` with English translations.

- [ ] **Step 2: Create the PasswordGenerator island**

```tsx
// src/islands/PasswordGenerator.tsx
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
```

- [ ] **Step 3: Create the Astro page**

Create `src/pages/[lang]/password-generator.astro` following the uuid-generator pattern, substituting:
- `import PasswordGenerator from '../../islands/PasswordGenerator';`
- `const slug = 'password-generator';`
- `<PasswordGenerator client:load />`

(Complete code pattern identical to uuid-generator.astro but with `password-generator` slug and `PasswordGenerator` component.)

- [ ] **Step 4: Build and verify**

```bash
cd /c/Users/drago/Desktop/Deepseek项目 && npm run build 2>&1 | tail -20
```

- [ ] **Step 5: Commit**

```bash
git add src/utils/tools.ts src/i18n/ src/islands/PasswordGenerator.tsx "src/pages/[lang]/password-generator.astro"
git commit -m "feat: add password generator tool"
```

---

### Task 3: Unix Timestamp Converter Tool

**Files:**
- Create: `src/islands/TimestampConverter.tsx`
- Create: `src/pages/[lang]/timestamp-converter.astro`
- Modify: `src/utils/tools.ts`
- Modify: `src/i18n/zh.ts`, `src/i18n/en.ts`

- [ ] **Step 1: Add tool entry and translations**

In `src/utils/tools.ts`, add to TOOLS:

```typescript
{
  slug: 'timestamp-converter',
  title: 'Unix 时间戳转换',
  description: '在线Unix时间戳和日期时间互转工具。实时显示当前时间戳，支持秒和毫秒精度，所有计算在浏览器端完成。',
  category: 'dev',
  keywords: ['Unix时间戳', '时间戳转换', '时间戳在线', '日期转时间戳', 'Epoch转换'],
  complexity: 'low',
},
```

In `src/i18n/zh.ts`, add to tools:

```typescript
'timestamp-converter': {
  title: 'Unix 时间戳转换',
  description: '在线Unix时间戳和日期时间互转工具。实时显示当前时间戳，支持秒和毫秒精度，所有计算在浏览器端完成。',
  keywords: ['Unix时间戳', '时间戳转换', '时间戳在线', '日期转时间戳', 'Epoch转换'],
  howToTitle: '如何使用Unix时间戳转换工具',
  howTo: '页面顶部实时显示当前Unix时间戳（秒和毫秒），每秒自动更新。输入时间戳可转换为日期时间，或选择日期时间转换为时间戳。所有转换在浏览器本地完成。',
  faq: [
    { q: '什么是Unix时间戳？', a: 'Unix时间戳是从1970年1月1日00:00:00 UTC到指定时间的秒数（或毫秒数），是计算机系统中广泛使用的时间表示方式。' },
    { q: '秒和毫秒时间戳有什么区别？', a: '秒级时间戳是10位数字，毫秒级是13位数字。JavaScript和多数现代系统使用毫秒，而传统Unix/Python等使用秒。本工具自动识别并显示两种精度。' },
    { q: '时间戳和时区有关吗？', a: 'Unix时间戳本身是UTC时间，不受时区影响。转换到日期时间时，工具使用您浏览器的本地时区进行显示。' },
  ],
},
```

- [ ] **Step 2: Create the TimestampConverter island**

```tsx
// src/islands/TimestampConverter.tsx
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
      {/* Current timestamp */}
      <div class="p-6 bg-zen-50 rounded-xl text-center space-y-3">
        <div class="text-sm text-gray-500">{t.ui.tsCurrent}</div>
        <div class="text-3xl font-mono font-bold text-gray-900">{now}</div>
        <div class="text-sm text-gray-400">{t.ui.tsSeconds} · {t.ui.tsMilliseconds}: {now}000</div>
        <button onClick={copyNow}
          class="px-4 py-1.5 bg-white border border-gray-200 rounded-lg text-sm hover:bg-gray-50">{t.ui.copy}</button>
      </div>

      {/* Timestamp → Date */}
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

      {/* Date → Timestamp */}
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
```

- [ ] **Step 3: Create Astro page** — same pattern as uuid-generator.astro, slug `timestamp-converter`, component `TimestampConverter`.

- [ ] **Step 4: Build and commit**

```bash
cd /c/Users/drago/Desktop/Deepseek项目 && npm run build 2>&1 | tail -5
git add src/utils/tools.ts src/i18n/ src/islands/TimestampConverter.tsx "src/pages/[lang]/timestamp-converter.astro"
git commit -m "feat: add unix timestamp converter tool"
```

---

### Task 4: Age Calculator Tool

**Files:**
- Create: `src/islands/AgeCalculator.tsx`
- Create: `src/pages/[lang]/age-calculator.astro`
- Modify: `src/utils/tools.ts`, `src/i18n/zh.ts`, `src/i18n/en.ts`

- [ ] **Step 1: Add tool entry and translations**

In `src/utils/tools.ts`:

```typescript
{
  slug: 'age-calculator',
  title: '年龄计算器',
  description: '在线年龄计算工具。精确计算周岁年龄（年月日），显示下次生日倒计时。所有计算在浏览器端完成。',
  category: 'calculators',
  keywords: ['年龄计算器', '在线年龄', '周岁计算', '出生日期计算', '年龄查询', '生日倒计时'],
  complexity: 'low',
},
```

In `src/i18n/zh.ts` tools:

```typescript
'age-calculator': {
  title: '年龄计算器',
  description: '在线年龄计算工具。精确计算周岁年龄（年月日），显示下次生日倒计时。所有计算在浏览器端完成。',
  keywords: ['年龄计算器', '在线年龄', '周岁计算', '出生日期计算', '年龄查询', '生日倒计时'],
  howToTitle: '如何使用年龄计算器',
  howTo: '选择您的出生日期，点击"计算年龄"按钮，即可获得精确到天的周岁年龄。同时显示距离下次生日的倒计时天数。所有计算在浏览器本地完成。',
  faq: [
    { q: '年龄计算精确吗？', a: '精确到天。工具会计算出生日期到今天的总天数，然后转换为年、月、日，考虑了闰年和每个月的实际天数。' },
    { q: '周岁和虚岁有什么区别？', a: '周岁是从出生到现在的实际年数（国际标准），虚岁是中国传统计龄方式，出生即算1岁且每过一个春节加1岁。本工具计算的是周岁。' },
    { q: '可以计算未来日期的年龄吗？', a: '选择未来的日期会显示"尚未出生"。工具主要用于计算已出生人员的当前年龄。' },
  ],
},
```

- [ ] **Step 2: Create the AgeCalculator island**

```tsx
// src/islands/AgeCalculator.tsx
import { useState } from 'preact/hooks';
import { useLanguage } from '../hooks/useLanguage';

export default function AgeCalculator() {
  const { t } = useLanguage();
  const [birth, setBirth] = useState('');
  const [result, setResult] = useState<{ y: number; m: number; d: number; nextBirthday: number } | null>(null);
  const [error, setError] = useState('');

  const calculate = () => {
    setError('');
    if (!birth) { setError('请选择出生日期'); return; }
    const b = new Date(birth);
    const now = new Date();
    if (b > now) { setError('出生日期不能是未来'); return; }

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
              {t.ui.ageDaysUntil} {result.nextBirthday} {t.ui.ageDaysOld}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 3: Create Astro page** — pattern, slug `age-calculator`.

- [ ] **Step 4: Build and commit**

---

### Task 5: Zodiac Finder Tool

**Files:**
- Create: `src/islands/ZodiacFinder.tsx`
- Create: `src/pages/[lang]/zodiac-finder.astro`
- Modify: `src/utils/tools.ts`, `src/i18n/zh.ts`, `src/i18n/en.ts`

- [ ] **Step 1: Add tool entry and translations**

In `src/utils/tools.ts`:

```typescript
{
  slug: 'zodiac-finder',
  title: '生肖星座查询',
  description: '在线生肖星座查询工具。输入出生日期，即可查询对应的生肖属相和西方星座，所有计算在浏览器端完成。',
  category: 'life',
  keywords: ['生肖查询', '星座查询', '属相', '生日查生肖', '十二星座', '十二生肖'],
  complexity: 'low',
},
```

In `src/i18n/zh.ts` tools:

```typescript
'zodiac-finder': {
  title: '生肖星座查询',
  description: '在线生肖星座查询工具。输入出生日期，即可查询对应的生肖属相和西方星座，所有计算在浏览器端完成。',
  keywords: ['生肖查询', '星座查询', '属相', '生日查生肖', '十二星座', '十二生肖'],
  howToTitle: '如何使用生肖星座查询工具',
  howTo: '选择您的出生日期（公历），工具会自动计算并显示您的生肖属相和西方星座。生肖按农历年份推算（以立春为界），星座根据公历日期范围判断。所有查询在浏览器本地完成。',
  faq: [
    { q: '生肖是怎么计算的？', a: '生肖以农历年份为周期，12年一轮。本工具按农历立春（约2月4日）为生肖切换点进行推算。注意生肖不是以公历元旦或农历正月初一为界，而是以立春为界。' },
    { q: '星座的日期划分是什么？', a: '星座根据公历日期划分：白羊(3.21-4.19)、金牛(4.20-5.20)、双子(5.21-6.21)、巨蟹(6.22-7.22)、狮子(7.23-8.22)、处女(8.23-9.22)、天秤(9.23-10.23)、天蝎(10.24-11.22)、射手(11.23-12.21)、摩羯(12.22-1.19)、水瓶(1.20-2.18)、双鱼(2.19-3.20)。' },
    { q: '为什么我的属相和印象中不一样？', a: '如果您出生在公历1-2月（春节前后），由于立春日期每年略有浮动，生肖可能与传统说法有1天的偏差。如需确认，请参考当年农历。' },
  ],
},
```

- [ ] **Step 2: Create the ZodiacFinder island**

```tsx
// src/islands/ZodiacFinder.tsx
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

// Approximate Lichun date for recent decades (month=2, day=4±1)
function getShengxiaoYear(year: number, month: number, day: number): number {
  // Lichun is approximately Feb 4. If before Feb 4, use previous year's zodiac.
  if (month < 2 || (month === 2 && day < 4)) return year - 1;
  return year;
}

function getConstellation(month: number, day: number): typeof CONSTELLATIONS[0] {
  for (const c of CONSTELLATIONS) {
    const [sm, sd] = c.start, [em, ed] = c.end;
    if ((month === sm && day >= sd) || (month === em && day <= ed)) return c;
    // Handle Capricorn spanning year boundary
    if (sm > em) {
      if ((month === sm && day >= sd) || month > sm || month < em || (month === em && day <= ed)) return c;
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
    const sx = SHENGXIAO[(sxYear - 4) % 12 >= 0 ? (sxYear - 4) % 12 : ((sxYear - 4) % 12 + 12) % 12];
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
        <input type="date" value={date} onInput={(e) => { setDate((e.target as HTMLInputElement).value); find(); }}
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
```

- [ ] **Step 3: Create Astro page** — pattern, slug `zodiac-finder`.

- [ ] **Step 4: Build and commit**

---

### Task 6: Unit Converter Tool

**Files:**
- Create: `src/islands/UnitConverter.tsx`
- Create: `src/pages/[lang]/unit-converter.astro`
- Modify: `src/utils/tools.ts`, `src/i18n/zh.ts`, `src/i18n/en.ts`

- [ ] **Step 1: Add tool entry and translations**

In `src/utils/tools.ts`:

```typescript
{
  slug: 'unit-converter',
  title: '单位换算',
  description: '在线单位换算工具。支持长度、重量、温度、面积、体积、速度等常用单位实时转换，所有计算在浏览器端完成。',
  category: 'calculators',
  keywords: ['单位换算', '长度换算', '重量换算', '温度换算', '面积换算', '体积换算', '速度换算', '在线换算器'],
  complexity: 'medium',
},
```

In `src/i18n/zh.ts` tools:

```typescript
'unit-converter': {
  title: '单位换算',
  description: '在线单位换算工具。支持长度、重量、温度、面积、体积、速度等常用单位实时转换，所有计算在浏览器端完成。',
  keywords: ['单位换算', '长度换算', '重量换算', '温度换算', '面积换算', '体积换算', '速度换算', '在线换算器'],
  howToTitle: '如何使用单位换算工具',
  howTo: '选择换算类别（长度/重量/温度/面积/体积/速度），输入数值，选择源单位和目标单位，实时显示转换结果。支持公制、英制和中国市制单位。',
  faq: [
    { q: '支持哪些单位换算？', a: '支持6大类常用单位：长度（米、千米、英里等8种）、重量（千克、磅等6种）、温度（摄氏度、华氏度、开尔文）、面积（平方米、英亩等6种）、体积（升、加仑等6种）、速度（千米/时、英里/时等4种）。' },
    { q: '换算结果准确吗？', a: '基于国际标准换算系数计算，精度足够日常使用。科学计算或精密工程建议使用专业工具。' },
    { q: '温度换算公式是什么？', a: '°F = °C × 9/5 + 32，K = °C + 273.15。工具自动处理这些非线性换算。' },
  ],
},
```

- [ ] **Step 2: Create the UnitConverter island**

```tsx
// src/islands/UnitConverter.tsx
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
  const [cat, setCat] = useState<string>('length');
  const [fromVal, setFromVal] = useState('1');
  const [fromUnit, setFromUnit] = useState('meter');
  const [toUnit, setToUnit] = useState('foot');

  const category = CATEGORIES[cat];
  const unitKeys = Object.keys(category.units);

  // Ensure selected units exist in current category
  if (!category.units[fromUnit]) setFromUnit(unitKeys[0]);
  if (!category.units[toUnit]) setToUnit(unitKeys[1] || unitKeys[0]);

  const convert = () => {
    const val = parseFloat(fromVal);
    if (isNaN(val)) return '';
    const base = category.units[fromUnit]?.toBase(val) ?? 0;
    const result = category.units[toUnit]?.fromBase(base) ?? 0;
    if (Math.abs(result) < 1e-10) return '0';
    if (Math.abs(result) < 0.0001 || Math.abs(result) > 1e10) return result.toExponential(6);
    return result.toFixed(6).replace(/0+$/, '').replace(/\.$/, '');
  };

  return (
    <div class="space-y-4">
      {/* Category tabs */}
      <div class="flex flex-wrap gap-1.5">
        {CAT_KEYS.map(k => (
          <button key={k} onClick={() => setCat(k)}
            class={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              cat === k ? 'bg-zen-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}>
            {t.ui[CAT_UI_KEYS[k] as keyof typeof t.ui]}
          </button>
        ))}
      </div>

      {/* From */}
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

      {/* To */}
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
```

- [ ] **Step 3: Create Astro page** — pattern, slug `unit-converter`.

- [ ] **Step 4: Build and commit**

---

### Task 7: AI Discoverability Files

**Files:**
- Create: `public/llms.txt`
- Create: `public/llms-full.txt`
- Modify: `public/robots.txt`

- [ ] **Step 1: Create llms.txt**

Create `public/llms.txt`:

```
# ToolZen
> Free online tools — privacy-first, no upload needed. All processing happens in your browser.

## Tools
- JSON Formatter: https://tool-zen.com/zh/json-formatter/ | https://tool-zen.com/en/json-formatter/
- Base64 Encoder/Decoder: https://tool-zen.com/zh/base64/ | https://tool-zen.com/en/base64/
- UUID Generator: https://tool-zen.com/zh/uuid-generator/ | https://tool-zen.com/en/uuid-generator/
- QR Code Generator: https://tool-zen.com/zh/qr-code/ | https://tool-zen.com/en/qr-code/
- Image Compressor: https://tool-zen.com/zh/image-compress/ | https://tool-zen.com/en/image-compress/
- Text Diff Checker: https://tool-zen.com/zh/text-diff/ | https://tool-zen.com/en/text-diff/
- Word Counter: https://tool-zen.com/zh/word-counter/ | https://tool-zen.com/en/word-counter/
- RegEx Tester: https://tool-zen.com/zh/regex-tester/ | https://tool-zen.com/en/regex-tester/
- Color Picker: https://tool-zen.com/zh/color-picker/ | https://tool-zen.com/en/color-picker/
- MD5 / SHA Hash Generator: https://tool-zen.com/zh/md5-hash/ | https://tool-zen.com/en/md5-hash/
- URL Encoder/Decoder: https://tool-zen.com/zh/url-encode/ | https://tool-zen.com/en/url-encode/
- Mortgage Calculator: https://tool-zen.com/zh/mortgage-calculator/ | https://tool-zen.com/en/mortgage-calculator/
- BMI Calculator: https://tool-zen.com/zh/bmi-calculator/ | https://tool-zen.com/en/bmi-calculator/
- Date Calculator: https://tool-zen.com/zh/date-calculator/ | https://tool-zen.com/en/date-calculator/
- Case Converter: https://tool-zen.com/zh/case-converter/ | https://tool-zen.com/en/case-converter/
- Timezone Converter: https://tool-zen.com/zh/timezone-converter/ | https://tool-zen.com/en/timezone-converter/
- Password Generator: https://tool-zen.com/zh/password-generator/ | https://tool-zen.com/en/password-generator/
- Unix Timestamp Converter: https://tool-zen.com/zh/timestamp-converter/ | https://tool-zen.com/en/timestamp-converter/
- Age Calculator: https://tool-zen.com/zh/age-calculator/ | https://tool-zen.com/en/age-calculator/
- Zodiac & Constellation Finder: https://tool-zen.com/zh/zodiac-finder/ | https://tool-zen.com/en/zodiac-finder/
- Unit Converter: https://tool-zen.com/zh/unit-converter/ | https://tool-zen.com/en/unit-converter/

## Categories
- Developer Tools: https://tool-zen.com/zh/category/dev/
- Text Tools: https://tool-zen.com/zh/category/text/
- Image Tools: https://tool-zen.com/zh/category/image/
- Crypto & Encoding: https://tool-zen.com/zh/category/crypto/
- Calculators: https://tool-zen.com/zh/category/calculators/
- Life Tools: https://tool-zen.com/zh/category/life/

## Optional
- About: https://tool-zen.com/zh/about/
- Privacy: https://tool-zen.com/zh/privacy/
- Full info: https://tool-zen.com/llms-full.txt
```

- [ ] **Step 2: Create llms-full.txt**

Create `public/llms-full.txt` with tool descriptions included. Format:

```
# ToolZen — Complete Tool Reference

> Free online tools — privacy-first, no upload needed. All processing happens in your browser.
> Available in Chinese (zh) and English (en). All tool URLs follow /{lang}/{slug}/ pattern.

## JSON Formatter
Online JSON formatting, validation, and compression. Syntax highlighting and error detection.
URL: https://tool-zen.com/zh/json-formatter/

## Base64 Encoder/Decoder
Online Base64 encoding and decoding. Text-to-Base64 conversion.
URL: https://tool-zen.com/zh/base64/

[... all 21 tools with descriptions ...]

## About ToolZen
ToolZen is a collection of free online tools. Unlike many similar sites, all tools run locally in your browser — no data ever leaves your device.
```

- [ ] **Step 3: Fix robots.txt domain and add AI crawler rules**

Rewrite `public/robots.txt`:

```
User-agent: *
Allow: /

User-agent: GPTBot
Allow: /

User-agent: Claude-Web
Allow: /

User-agent: anthropic-ai
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: Google-Extended
Allow: /

User-agent: CCBot
Allow: /

Sitemap: https://tool-zen.com/sitemap-index.xml
```

- [ ] **Step 4: Commit**

```bash
git add public/llms.txt public/llms-full.txt public/robots.txt
git commit -m "feat: add llms.txt and update robots.txt for AI crawler discoverability"
```

---

### Task 8: FAQ Schema Enhancement on Tool Pages

**Files:**
- Modify: all 21 tool `.astro` pages under `src/pages/[lang]/`

- [ ] **Step 1: Add FAQPage structured data to one tool page as template**

In each tool page (e.g., `json-formatter.astro`), add a second `<script type="application/ld+json">` block in the `<slot name="head">`:

```astro
<slot name="head">
  <script type="application/ld+json" set:html={JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: toolMeta.title,
    description: toolMeta.description,
    url: `${Astro.site}${lang}/${slug}/`,
    applicationCategory: 'UtilityApplication',
    operatingSystem: 'All',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  })}></script>
  <script type="application/ld+json" set:html={JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: toolMeta.faq.map(item => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: { '@type': 'Answer', text: item.a },
    })),
  })}></script>
</slot>
```

- [ ] **Step 2: Apply FAQ schema to all 21 tool pages**

Run a batch edit to add the FAQPage schema block to every tool `.astro` page. Each page's `<slot name="head">` gets the second script tag shown above.

- [ ] **Step 3: Build and verify output**

```bash
cd /c/Users/drago/Desktop/Deepseek项目 && npm run build 2>&1 | tail -5
# Verify FAQ schema exists in output
grep -r 'FAQPage' dist/ | head -10
```

- [ ] **Step 4: Commit**

```bash
git add "src/pages/[lang]/"*.astro
git commit -m "feat: add FAQPage structured data to all tool pages"
```

---

### Task 9: Sitemap Submission (Manual)

**This step requires the user to perform manual actions in web browsers.**

- [ ] **Step 1: Google Search Console**
  1. Visit https://search.google.com/search-console
  2. Select property `tool-zen.com`
  3. Go to Sitemaps → enter `sitemap-index.xml` → Submit

- [ ] **Step 2: Baidu Webmaster Platform**
  1. Visit https://ziyuan.baidu.com/
  2. Select site `tool-zen.com`
  3. Go to 数据引入 → 链接提交 → enter `https://tool-zen.com/sitemap-index.xml` → Submit

---

## Final Verification

After all tasks complete, run the full build and check:

```bash
cd /c/Users/drago/Desktop/Deepseek项目 && npm run build 2>&1
```

Expected: clean build, zero errors. Output in `dist/` should include all 21 tool pages × 2 languages = 42 tool pages, plus category pages, sitemap, llms.txt, robots.txt.
