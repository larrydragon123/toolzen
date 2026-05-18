# ToolZen Week 1 Optimization Design

## Overview

Add 5 new tools (3 mass-appeal, 1 hybrid, 1 developer), create a new `life` category, enhance AI discoverability, and submit sitemaps to search engines.

## 1. New Tools

All follow the existing pattern: `tools.ts` entry → island `.tsx` component → `.astro` page → i18n translations.

### 1.1 Password Generator (`password-generator`)
- **Category**: `crypto`
- **UI**: Length slider (4-64), checkboxes for uppercase/lowercase/numbers/symbols, generate button, copy button, password strength bar
- **Keywords (zh)**: 随机密码生成, 密码生成器, 强密码, 密码强度, 在线密码
- **Keywords (en)**: password generator, strong password, random password, password strength, online password

### 1.2 Unix Timestamp Converter (`timestamp-converter`)
- **Category**: `dev`
- **UI**: Live-updating current timestamp display, timestamp→datetime input, datetime→timestamp input, copy buttons
- **Keywords (zh)**: Unix时间戳, 时间戳转换, 时间戳在线, 日期转时间戳
- **Keywords (en)**: unix timestamp, epoch converter, timestamp to date, date to timestamp

### 1.3 Age Calculator (`age-calculator`)
- **Category**: `calculators`
- **UI**: Birth date picker, calculate button, result showing years/months/days, next birthday countdown
- **Keywords (zh)**: 年龄计算器, 在线年龄, 周岁计算, 出生日期计算, 年龄查询
- **Keywords (en)**: age calculator, online age, birthday calculator, age in years, how old am I

### 1.4 Chinese Zodiac & Constellation (`zodiac-finder`)
- **Category**: `life` (new)
- **UI**: Date picker, display zodiac animal (with emoji icon), Western constellation (with symbol), brief personality snippet
- **Keywords (zh)**: 生肖查询, 星座查询, 属相, 生日查生肖, 十二星座, 十二生肖
- **Keywords (en)**: Chinese zodiac, zodiac sign, constellation finder, birth zodiac, western zodiac

### 1.5 Unit Converter (`unit-converter`)
- **Category**: `calculators`
- **UI**: Category tabs (length/weight/temperature/area/volume/speed), two input rows each with value+unit select, real-time bidirectional conversion
- **Keywords (zh)**: 单位换算, 长度换算, 重量换算, 温度换算, 在线换算器
- **Keywords (en)**: unit converter, length converter, weight converter, temperature converter, metric imperial

## 2. New Category: `life` (生活工具)

- **slug**: `life`
- **zh**: 标题"生活工具", 描述"生肖、星座等日常生活实用工具"
- **en**: title "Life Tools", description "Zodiac, constellation and daily life utilities"
- Added to `CATEGORIES`, navigation, and type unions
- Initially contains only `zodiac-finder`

## 3. AI Discoverability

### 3.1 `llms.txt` and `llms-full.txt`
- Create `public/llms.txt` following the [llmstxt.org](https://llmstxt.org/) standard
- Includes: site summary, tool list with URLs, category pages
- `llms-full.txt` includes tool descriptions for deeper context

### 3.2 `robots.txt`
- Create `public/robots.txt` explicitly allowing GPTBot, Claude-Web, PerplexityBot, Google-Extended
- Keep the sitemap directive

### 3.3 FAQ Schema Enhancement
- Add `FAQPage` schema to each tool page (already have WebApplication + BreadcrumbList)
- FAQ content already exists in i18n, just needs structured data markup

## 4. Sitemap Submission (Manual)
- Submit `https://tool-zen.com/sitemap-index.xml` to Google Search Console
- Submit to Baidu Webmaster Platform (百度站长平台)

## 5. Files Changed

| File | Change |
|------|--------|
| `src/utils/tools.ts` | Add 5 tools + 1 category |
| `src/i18n/ui.ts` | Add UIDict fields for new tools + life category |
| `src/i18n/zh.ts` | Full Chinese translations for 5 tools + life category |
| `src/i18n/en.ts` | Full English translations for 5 tools + life category |
| `src/components/Header.astro` | Add `life` to nav items |
| `src/islands/PasswordGenerator.tsx` | New island |
| `src/islands/TimestampConverter.tsx` | New island |
| `src/islands/AgeCalculator.tsx` | New island |
| `src/islands/ZodiacFinder.tsx` | New island |
| `src/islands/UnitConverter.tsx` | New island |
| `src/pages/[lang]/password-generator.astro` | New page |
| `src/pages/[lang]/timestamp-converter.astro` | New page |
| `src/pages/[lang]/age-calculator.astro` | New page |
| `src/pages/[lang]/zodiac-finder.astro` | New page |
| `src/pages/[lang]/unit-converter.astro` | New page |
| `public/llms.txt` | New file |
| `public/llms-full.txt` | New file |
| `public/robots.txt` | New file |
| `src/pages/robots.txt.ts` | Remove if using static, or keep existing dynamic approach |

## 6. Non-goals
- No backend APIs (all tools run client-side)
- No new npm dependencies
- No design system or layout changes
- No refactoring of existing tools
