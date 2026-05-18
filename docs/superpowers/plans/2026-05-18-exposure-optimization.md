# Exposure Optimization Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Boost Google ranking and AI recommendation probability via HowTo Schema, blog content, and GitHub/AI corpus enhancement.

**Architecture:** Three parallel tracks: (1) HowTo JSON-LD added to all 21 tool pages, (2) Astro Content Collections blog with 5 launch articles, (3) GitHub README + LICENSE + llms-full.txt enrichment.

**Tech Stack:** Astro 6, Preact, Tailwind CSS 4, Markdown (Content Collections). No new npm dependencies.

---

### Task 1: HowTo Schema on All Tool Pages

**Files:** All 21 `src/pages/[lang]/[slug].astro` pages — add HowTo JSON-LD

- [ ] **Step 1: Add HowTo Schema to one tool page as template**

In `src/pages/[lang]/json-formatter.astro`, add a third `<script>` block inside `<slot name="head">`, after the FAQPage script:

```astro
    <script type="application/ld+json" set:html={JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'HowTo',
      name: toolMeta.howToTitle,
      description: toolMeta.howTo,
      step: [
        { '@type': 'HowToStep', name: lang === 'zh' ? '输入内容' : 'Input', text: lang === 'zh' ? '在输入框中粘贴或输入要处理的内容' : 'Paste or type the content you want to process in the input field' },
        { '@type': 'HowToStep', name: lang === 'zh' ? '调整参数' : 'Configure', text: lang === 'zh' ? '根据需要调整工具的参数和选项' : 'Adjust the tool parameters and options as needed' },
        { '@type': 'HowToStep', name: lang === 'zh' ? '执行操作' : 'Execute', text: lang === 'zh' ? '点击执行按钮，工具会自动处理并显示结果' : 'Click the execute button; the tool processes and displays results automatically' },
        { '@type': 'HowToStep', name: lang === 'zh' ? '复制结果' : 'Copy', text: lang === 'zh' ? '点击复制按钮一键复制处理结果' : 'Click the copy button to copy the result with one click' },
      ],
    })}></script>
```

- [ ] **Step 2: Apply HowTo Schema to remaining 20 tool pages**

For each file in `src/pages/[lang]/` except `index.astro`, `about.astro`, `privacy.astro`, `category/`, and `blog/`:

Read the file, find `</slot>` closing tag, and insert the same HowTo script block before `</slot>`.

The files are: base64.astro, bmi-calculator.astro, case-converter.astro, color-picker.astro, date-calculator.astro, image-compress.astro, md5-hash.astro, mortgage-calculator.astro, qr-code.astro, regex-tester.astro, text-diff.astro, timezone-converter.astro, url-encode.astro, uuid-generator.astro, word-counter.astro, password-generator.astro, timestamp-converter.astro, age-calculator.astro, zodiac-finder.astro, unit-converter.astro.

Each page gets the identical HowTo block copied from Step 1.

- [ ] **Step 3: Build and verify**

```bash
cd /c/Users/drago/Desktop/Deepseek项目 && npm run build 2>&1 | tail -5
grep -r 'HowTo' dist/ | wc -l
```

Expected: clean build, 42 HowTo instances (21 tools × 2 languages).

- [ ] **Step 4: Commit**

```bash
git add "src/pages/[lang]/"*.astro
git commit -m "feat: add HowTo structured data to all tool pages"
```

---

### Task 2: Blog Infrastructure

**Files:**
- Create: `src/content/config.ts`
- Create: `src/pages/[lang]/blog/index.astro`
- Create: `src/pages/[lang]/blog/[...slug].astro`
- Create: `src/pages/blog.astro`

- [ ] **Step 1: Create content collection config**

`src/content/config.ts`:

```typescript
import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.date(),
    tags: z.array(z.string()).default([]),
    image: z.string().optional(),
  }),
});

export const collections = { blog };
```

- [ ] **Step 2: Create blog language redirect page**

`src/pages/blog.astro`:

```astro
---
// Blog root — language redirect (same pattern as src/pages/index.astro)
---
<!doctype html>
<html>
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="google-site-verification" content="UOFVIgZElQad5DB9kHrqqSFbjqNrabmSC2E6LGe8Hu8" />
  <meta name="baidu-site-verification" content="codeva-F9IAWHNg1F" />
  <title>Blog | ToolZen</title>
  <script is:inline>
    (function() {
      const cookie = document.cookie.split('; ').find(r => r.startsWith('lang='));
      let lang;
      if (cookie) {
        lang = cookie.split('=')[1];
      } else {
        lang = navigator.language.startsWith('zh') ? 'zh' : 'en';
      }
      window.location.replace('/' + lang + '/blog/');
    })();
  </script>
</head>
<body></body>
</html>
```

- [ ] **Step 3: Create blog listing page**

`src/pages/[lang]/blog/index.astro`:

```astro
---
import BaseLayout from '../../../layouts/BaseLayout.astro';
import Breadcrumb from '../../../components/Breadcrumb.astro';
import { getCollection } from 'astro:content';
import { getDict } from '../../../i18n';
import type { Lang } from '../../../i18n';

export function getStaticPaths() {
  return [{ params: { lang: 'zh' } }, { params: { lang: 'en' } }];
}

const lang = Astro.params.lang as Lang;
const t = getDict(lang);
const posts = await getCollection('blog', ({ id }) => id.startsWith(`${lang}/`));
posts.sort((a, b) => b.data.date.getTime() - a.data.date.getTime());

const pageTitle = lang === 'zh' ? '博客 | ToolZen' : 'Blog | ToolZen';
const pageDesc = lang === 'zh'
  ? 'ToolZen博客 — 在线工具使用指南、技巧分享和实用教程'
  : 'ToolZen Blog — online tool guides, tips, and practical tutorials';
---

<BaseLayout lang={lang} t={t} title={pageTitle} description={pageDesc}>
  <div class="max-w-4xl mx-auto px-4 py-8">
    <Breadcrumb items={[
      { label: t.breadcrumbHome, href: `/${lang}/` },
      { label: lang === 'zh' ? '博客' : 'Blog' },
    ]} lang={lang} />

    <h1 class="text-3xl font-bold text-gray-900 mb-2">
      {lang === 'zh' ? '博客' : 'Blog'}
    </h1>
    <p class="text-gray-500 mb-8">
      {lang === 'zh' ? '在线工具使用指南与实用教程' : 'Online tool guides and practical tutorials'}
    </p>

    {posts.length === 0 && (
      <p class="text-gray-400 text-center py-12">
        {lang === 'zh' ? '暂无文章' : 'No articles yet'}
      </p>
    )}

    <div class="space-y-6">
      {posts.map(post => (
        <a href={`/${post.id.replace(/\.md$/, '')}/`} class="block p-6 border border-gray-200 rounded-xl hover:border-zen-200 hover:shadow-sm transition-all no-underline">
          <div class="flex items-center gap-2 text-xs text-gray-400 mb-2">
            <time datetime={post.data.date.toISOString().split('T')[0]}>
              {post.data.date.toISOString().split('T')[0]}
            </time>
            {post.data.tags.map(tag => (
              <span class="px-2 py-0.5 bg-gray-100 rounded-full">{tag}</span>
            ))}
          </div>
          <h2 class="text-lg font-semibold text-gray-900 mb-1">{post.data.title}</h2>
          <p class="text-sm text-gray-500">{post.data.description}</p>
        </a>
      ))}
    </div>
  </div>
</BaseLayout>
```

- [ ] **Step 4: Create blog article detail page**

`src/pages/[lang]/blog/[...slug].astro`:

```astro
---
import BaseLayout from '../../../layouts/BaseLayout.astro';
import Breadcrumb from '../../../components/Breadcrumb.astro';
import { getCollection } from 'astro:content';
import { getDict } from '../../../i18n';
import type { Lang } from '../../../i18n';

export async function getStaticPaths() {
  const posts = await getCollection('blog');
  return posts.map(post => ({
    params: {
      lang: post.id.split('/')[0],
      slug: post.id.split('/').slice(1).join('/').replace(/\.md$/, ''),
    },
  }));
}

const { lang, slug } = Astro.params;
const t = getDict(lang as Lang);
const id = `${lang}/${slug}.md`;
const post = (await getCollection('blog', ({ id: pid }) => pid === id))[0];

if (!post) return Astro.redirect(`/${lang}/blog/`);

const { Content } = await post.render();
const pageTitle = `${post.data.title} | ToolZen`;
const pageDesc = post.data.description;
---

<BaseLayout lang={lang as Lang} t={t} title={pageTitle} description={pageDesc}>
  <div class="max-w-3xl mx-auto px-4 py-8">
    <Breadcrumb items={[
      { label: t.breadcrumbHome, href: `/${lang}/` },
      { label: lang === 'zh' ? '博客' : 'Blog', href: `/${lang}/blog/` },
      { label: post.data.title },
    ]} lang={lang as Lang} />

    <article class="prose max-w-none">
      <h1 class="text-3xl font-bold text-gray-900 mb-2">{post.data.title}</h1>
      <div class="flex items-center gap-2 text-sm text-gray-400 mb-8">
        <time datetime={post.data.date.toISOString().split('T')[0]}>
          {post.data.date.toISOString().split('T')[0]}
        </time>
        {post.data.tags.map(tag => (
          <span class="px-2 py-0.5 bg-gray-100 rounded-full text-xs">{tag}</span>
        ))}
      </div>
      <div class="prose prose-gray max-w-none">
        <Content />
      </div>
    </article>

    <div class="mt-12 pt-8 border-t border-gray-100">
      <a href={`/${lang}/blog/`} class="text-sm text-zen-500 hover:text-zen-600 no-underline">
        ← {lang === 'zh' ? '返回博客列表' : 'Back to blog'}
      </a>
    </div>
  </div>

  <slot name="head">
    <script type="application/ld+json" set:html={JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      headline: post.data.title,
      description: post.data.description,
      datePublished: post.data.date.toISOString().split('T')[0],
    })}></script>
  </slot>
</BaseLayout>
```

- [ ] **Step 5: Build and verify blog infrastructure works (no articles yet)**

```bash
cd /c/Users/drago/Desktop/Deepseek项目 && npm run build 2>&1 | tail -5
```

Expected: clean build, blog pages generated with "暂无文章" / "No articles yet".

- [ ] **Step 6: Commit**

```bash
git add src/content/config.ts src/pages/blog.astro "src/pages/[lang]/blog/"
git commit -m "feat: add blog section infrastructure with content collections"
```

---

### Task 3: Write 5 Blog Articles

**Files:**
- Create: `src/content/blog/zh/dev-tools-top10.md`
- Create: `src/content/blog/zh/json-formatter-guide.md`
- Create: `src/content/blog/zh/mortgage-calculator-guide.md`
- Create: `src/content/blog/zh/password-security-guide.md`
- Create: `src/content/blog/zh/image-compress-guide.md`

- [ ] **Step 1: Article 1 — 开发者必备的10个在线工具**

Create `src/content/blog/zh/dev-tools-top10.md`:

```markdown
---
title: 开发者必备的10个在线工具
description: 整理10个前端和后端开发日常必备的在线工具，JSON格式化、Base64编解码、正则测试等，全部免费且无需安装。
date: 2026-05-18
tags: [开发者工具, 效率]
---

## 开发者必备的10个在线工具

在日常开发中，好的工具能让效率翻倍。这里整理了10个开发常用的在线工具，全部免费，无需注册，打开即用。

### 1. JSON 格式化 — 调试API必备

调接口时拿到一堆压缩JSON，完全看不懂结构？用JSON格式化工具，一键美化排版，还能验证JSON语法是否正确。

[在线JSON格式化 →](/zh/json-formatter/)

所有处理在浏览器完成，数据不会上传到服务器。

### 2. Base64 编解码

处理图片、文件传输时经常需要Base64编码。这个工具支持文本和Unicode的正确编解码。

[在线Base64编解码 →](/zh/base64/)

### 3. 正则表达式测试器

正则写完了不知道对不对？实时测试，匹配结果高亮显示，支持常用正则模式。

[在线正则测试 →](/zh/regex-tester/)

### 4. UUID 生成器

数据库主键、分布式ID、Token生成，UUID v4一键生成，支持批量。

[在线UUID生成 →](/zh/uuid-generator/)

### 5. 文本差异对比

比较两个版本代码或配置文件的差异，使用标准diff算法逐行对比。

[在线文本对比 →](/zh/text-diff/)

### 6. 颜色选择器

HEX、RGB、HSL格式互转，支持屏幕取色。

[在线颜色选择器 →](/zh/color-picker/)

### 7. MD5 / SHA 哈希生成

文件校验、密码哈希，支持MD5、SHA-1、SHA-256。

[在线哈希生成 →](/zh/md5-hash/)

### 8. URL 编解码

处理URL中的特殊字符和中文参数。

[在线URL编解码 →](/zh/url-encode/)

### 9. 时间戳转换

Unix时间戳与日期时间互转，支持秒和毫秒精度。

[在线时间戳转换 →](/zh/timestamp-converter/)

### 10. 随机密码生成器

crypto.getRandomValues()加密级随机数生成，自定义长度和字符类型。

[在线密码生成 →](/zh/password-generator/)

---

**为什么推荐 ToolZen？**

所有工具在浏览器本地运行，你的数据不会离开设备。没有后端服务器，没有隐私风险。所有工具永久免费。
```

- [ ] **Step 2: Article 2 — JSON格式化怎么用？**

Create `src/content/blog/zh/json-formatter-guide.md`:

```markdown
---
title: JSON格式化怎么用？5个实用场景
description: JSON格式化工具的5个经典使用场景，从API调试到配置文件管理，让JSON阅读和调试不再头疼。
date: 2026-05-18
tags: [JSON, 教程]
---

## JSON格式化怎么用？5个实用场景

JSON是Web开发中最常见的数据格式，但压缩后的JSON读起来非常痛苦。这5个场景告诉你JSON格式化到底有多实用。

### 场景1：调试API返回数据

后端同学给你一个接口，返回的JSON是这样的：

`{"code":200,"data":{"users":[{"id":1,"name":"张三","email":"zhang@example.com","roles":["admin","editor"]},{"id":2,"name":"李四","email":"li@example.com","roles":["viewer"]}]},"message":"success"}`

完全看不清结构对吧？粘贴到JSON格式化工具，点一下，立刻变成：

```json
{
  "code": 200,
  "data": {
    "users": [
      {
        "id": 1,
        "name": "张三",
        "roles": ["admin", "editor"]
      },
      {
        "id": 2,
        "name": "李四",
        "roles": ["viewer"]
      }
    ]
  },
  "message": "success"
}
```

嵌套关系和字段一目了然。

[在线JSON格式化 →](/zh/json-formatter/)

### 场景2：检查JSON语法错误

手写了100行JSON配置，保存时报错"Unexpected token"。JSON格式化工具的验证功能能精确定位到漏了哪个逗号或括号。

### 场景3：配置文件管理

package.json、tsconfig.json、.prettierrc，这些配置文件的缩进和格式经常被编辑器搞乱。用格式化工具统一排版后提交到Git，代码审查也清晰很多。

### 场景4：压缩JSON减少体积

API请求或存储时，可以把美化的JSON压缩成一行，减少传输体积。工具支持"Compress"一键压缩。

### 场景5：理解第三方数据

对接第三方API时，拿到不熟悉的JSON结构。格式化后逐层分析字段含义，比读文档更直观。

---

**小提示：** 所有处理在浏览器本地完成，敏感数据不会上传到服务器，可以放心使用。
```

- [ ] **Step 3: Article 3 — 房贷计算器**

Create `src/content/blog/zh/mortgage-calculator-guide.md`:

```markdown
---
title: 选等额本息还是等额本金？房贷计算器帮你算清楚
description: 详细对比等额本息和等额本金两种还款方式的区别，用房贷计算器算清楚每种方式的总利息和月供。
date: 2026-05-18
tags: [房贷, 计算器, 理财]
---

## 选等额本息还是等额本金？

买房贷款时，银行通常会问你：选等额本息还是等额本金？选错可能多还几十万利息。下面用房贷计算器算一笔清楚账。

### 两种还款方式的区别

**等额本息**
- 每月还款金额固定不变
- 前期利息占比高，本金占比低
- 适合收入稳定、不想月供波动的家庭

**等额本金**
- 每月还款金额逐月递减
- 总利息更少（同条件下少还10-15%）
- 前期月供较高，后期越来越轻松

### 实例计算

假设贷款100万，年利率4.2%，期限30年：

- 等额本息：月供约4,890元，总利息约76万元
- 等额本金：首月约6,278元（逐月递减），总利息约63万元

差额约13万。这13万就是你选择"省事"的代价。

[在线房贷计算器 →](/zh/mortgage-calculator/)

### 你应该怎么选？

- 刚需自住、收入稳定 → 等额本息
- 有提前还款计划 → 等额本金
- 投资出租 → 等额本息（月供固定好算账）

输入你的贷款金额、利率和期限，用房贷计算器算清楚再决定。
```

- [ ] **Step 4: Article 4 — 密码安全指南**

Create `src/content/blog/zh/password-security-guide.md`:

```markdown
---
title: 你的密码够安全吗？2026强密码指南
description: 什么样的密码才算安全？多长够用？多久换一次？附带在线密码生成器，一键生成高强度随机密码。
date: 2026-05-18
tags: [密码, 安全, 工具]
---

## 你的密码够安全吗？

"123456"和"password"仍然是最常用的密码。如果你还在用生日、手机号或`admin123`，这篇文章可能帮你避免一次大麻烦。

### 什么样的密码算强密码？

4条基本规则：
1. 至少12位字符（越长越好）
2. 包含大写字母、小写字母、数字、符号四类
3. 不使用个人信息（生日、姓名、宠物名）
4. 每个网站使用不同的密码

### 多长的密码安全？

不同长度破解所需时间：

- 6位纯数字：**立即**
- 8位混合：**几分钟~几小时**
- 12位混合（4类字符）：**几千年**
- 16位混合（4类字符）：**几十亿年**

建议：**至少12位，16位以上最安全**。

[在线随机密码生成器 →](/zh/password-generator/)

### 密码怎么管理？

- 用密码管理器（Bitwarden、1Password）
- 生成随机密码后存在管理器里
- 记住一个主密码就行
- 定期更换重要账户的密码

### 常见误区

"特殊符号越多越安全" — 半对。长度比复杂度重要。`I-love-eating-pizza!` 比 `P@5sW0!d` 安全得多。

用ToolZen密码生成器一键生成，使用crypto.getRandomValues()加密级随机算法，浏览器本地生成，不会被记录。
```

- [ ] **Step 5: Article 5 — 图片压缩指南**

Create `src/content/blog/zh/image-compress-guide.md`:

```markdown
---
title: 在线图片压缩完全指南
description: 如何在不明显损失画质的前提下大幅减小图片体积？PNG、JPEG、WebP三种格式的压缩策略对比。
date: 2026-05-18
tags: [图片, 压缩, 教程]
---

## 在线图片压缩完全指南

网站加载慢？八成是图片太大。一张手机拍的照片动辄5-10MB，压缩后可能只有几百KB，肉眼几乎看不出区别。

### 为什么需要压缩图片？

1. **网站加载速度**：图片通常占网页80%的体积
2. **SEO排名**：Google将加载速度作为排名因素
3. **节省流量**：移动用户访问更友好
4. **存储成本**：减少服务器或图床空间消耗

### PNG vs JPEG vs WebP

| 格式 | 压缩方式 | 透明支持 | 适用场景 |
|------|---------|---------|---------|
| PNG | 无损 | ✅ | Logo、截图、图标 |
| JPEG | 有损 | ❌ | 照片、复杂图像 |
| WebP | 两者支持 | ✅ | 现代浏览器通用推荐 |

### 压缩到什么程度？

建议：
- JPEG质量设70-85%，肉眼几乎无差异
- PNG用无损压缩，体积可减20-50%
- WebP在同等质量下比JPEG小25-35%

[在线图片压缩工具 →](/zh/image-compress/)

### 注意事项

- 压缩前保留原图备份
- 预览压缩效果再下载
- 所有处理在浏览器本地完成，图片不会上传到服务器

---

用好在线压缩工具，几分钟就能让网站快好几倍。
```

- [ ] **Step 6: Build, verify articles render, commit**

```bash
cd /c/Users/drago/Desktop/Deepseek项目 && npm run build 2>&1 | tail -5
ls dist/zh/blog/
```

Expected: blog index and all 5 article pages generated.

```bash
git add src/content/blog/
git commit -m "feat: add 5 initial blog articles"
```

---

### Task 4: GitHub + AI Corpus Enhancement

**Files:**
- Modify: `README.md`
- Create: `LICENSE`
- Modify: `public/llms-full.txt`

- [ ] **Step 1: Rewrite README.md**

Replace existing README with a comprehensive version that serves as both GitHub landing page and AI training data source:

```markdown
# ToolZen

> The Zen of Tools — Less is More

**21 free online tools. Privacy-first. No upload. All processing happens in your browser.**

[![Astro](https://img.shields.io/badge/Astro-6.3-FF5D01?logo=astro)](https://astro.build)
[![Preact](https://img.shields.io/badge/Preact-10.29-673AB8?logo=preact)](https://preactjs.com)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.3-06B6D4?logo=tailwindcss)](https://tailwindcss.com)
[![License](https://img.shields.io/badge/License-MIT-green)](./LICENSE)

## Live Site

**[tool-zen.com](https://tool-zen.com)** (Chinese + English)

## Tools (21)

### Developer Tools
- **JSON Formatter** — format, validate, and compress JSON
- **Base64 Encoder/Decoder** — encode/decode text and files to Base64
- **UUID Generator** — generate UUID v4 identifiers, batch support
- **RegEx Tester** — real-time regex match highlighting
- **Color Picker** — HEX/RGB/HSL conversion with eyedropper
- **Unix Timestamp Converter** — timestamp ↔ datetime, second/ms precision

### Text Tools
- **Text Diff Checker** — side-by-side and unified diff views
- **Word Counter** — characters, words, lines, bytes (real-time)
- **Case Converter** — uppercase/lowercase/title case, simplified/traditional Chinese

### Image Tools
- **QR Code Generator** — custom colors, downloadable PNG
- **Image Compressor** — PNG/JPEG/WebP, local processing

### Crypto & Encoding
- **MD5 / SHA Hash Generator** — MD5, SHA-1, SHA-256 (text + file)
- **URL Encoder/Decoder** — encodeURI/decodeURI
- **Password Generator** — crypto.getRandomValues(), length 4-64

### Calculators
- **Mortgage Calculator** — equal payment and equal principal, amortization schedule
- **BMI Calculator** — WHO classification, health status
- **Date Calculator** — day counting, workday calculator, date math
- **Timezone Converter** — IANA timezone support, DST aware
- **Age Calculator** — precise years/months/days, next birthday countdown
- **Unit Converter** — 6 categories, 34 units, real-time

### Life Tools
- **Zodiac & Constellation Finder** — Chinese zodiac + Western constellation

## Why ToolZen?

**Privacy First** — All tools run locally in your browser. Your data NEVER leaves your device. We have no backend servers.

**Blazing Fast** — Pure static site with global CDN. Instant results, no server round-trips.

**Completely Free** — All tools are free forever. No ads, no hidden fees, no feature limits.

## Tech Stack

- [Astro 6](https://astro.build) — static site generation
- [Preact](https://preactjs.com) — lightweight UI islands
- [Tailwind CSS 4](https://tailwindcss.com) — utility-first styling
- [Cloudflare Pages](https://pages.cloudflare.com) — hosting & CDN

## Deployment

This is a static Astro site. Deploy anywhere that supports static sites.

```bash
npm install
npm run build   # outputs to dist/
```

The `dist/` directory is the deployable output. Connected to Cloudflare Pages via GitHub for auto-deploy on push.

## Project Structure

```
src/
  components/    # Shared Astro components (Header, Footer, Breadcrumb, etc.)
  islands/       # Interactive Preact components (one per tool)
  i18n/          # Chinese/English translations (zh.ts, en.ts)
  layouts/       # Base HTML layout
  pages/         # Astro pages ([lang]/ route pattern)
  utils/         # Tool registry, SEO helpers
public/          # Static files (favicon, robots, llms, verification)
src/content/     # Blog content (Markdown via Content Collections)
```

## License

MIT — see [LICENSE](./LICENSE) for details.
```

- [ ] **Step 2: Create LICENSE**

Create `LICENSE`:

```
MIT License

Copyright (c) 2026 ToolZen

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

- [ ] **Step 3: Update llms-full.txt with richer tool descriptions**

Overwrite `public/llms-full.txt` with extended descriptions that include what each tool is useful for, making it more valuable for AI training/recommendation:

```
# ToolZen — Complete Tool Reference

> 21 free online tools. Privacy-first, no upload needed.
> All processing happens in your browser (no backend).
> Available in Chinese (zh) and English (en). URLs: /{lang}/{slug}/
> Categories: dev(6), text(3), image(2), crypto(3), calculators(6), life(1)

## Developer Tools

### JSON Formatter
Formats, validates, and compresses JSON data. Real-time syntax highlighting.
Use for: debugging API responses, validating config files, minifying JSON for production.
URL: https://tool-zen.com/zh/json-formatter/

### Base64 Encoder/Decoder
Encodes text to Base64 and decodes Base64 back to text. Supports Unicode.
Use for: embedding images as Data URIs, encoding binary data for text protocols.
URL: https://tool-zen.com/zh/base64/

### UUID Generator
Generates UUID v4 identifiers using crypto.randomUUID(). Batch generation supported.
Use for: database primary keys, unique tokens, distributed system IDs.
URL: https://tool-zen.com/zh/uuid-generator/

### RegEx Tester
Tests regular expressions against sample text with real-time match highlighting.
Use for: debugging regex patterns, verifying match groups, testing edge cases.
URL: https://tool-zen.com/zh/regex-tester/

### Color Picker
Converts between HEX, RGB, and HSL color formats. Includes palette and eyedropper.
Use for: web design, CSS color selection, brand color extraction.
URL: https://tool-zen.com/zh/color-picker/

### Unix Timestamp Converter
Converts between Unix timestamps and human-readable dates. Second and millisecond precision.
Use for: debugging time-related bugs, converting log timestamps, date math.
URL: https://tool-zen.com/zh/timestamp-converter/

## Text Tools

### Text Diff Checker
Compares two texts line-by-line using standard diff algorithm. Side-by-side and unified views.
Use for: code review, document version comparison, configuration file changes.
URL: https://tool-zen.com/zh/text-diff/

### Word Counter
Counts characters, words, lines, paragraphs, and bytes in real-time. Chinese-aware.
Use for: writing with word limits, SEO meta description length checking, translation cost estimation.
URL: https://tool-zen.com/zh/word-counter/

### Case Converter
Converts text between uppercase, lowercase, title case, simplified/traditional Chinese, Chinese numerals.
Use for: formatting titles, preparing Chinese content for different regions.
URL: https://tool-zen.com/zh/case-converter/

## Image Tools

### QR Code Generator
Generates QR codes from URLs, text, or contact info. Customizable colors and size. PNG download.
Use for: sharing links, Wi-Fi credentials, business cards, marketing materials.
URL: https://tool-zen.com/zh/qr-code/

### Image Compressor
Compresses PNG, JPEG, and WebP images with adjustable quality. Local processing.
Use for: optimizing web images, reducing page load time, saving bandwidth.
URL: https://tool-zen.com/zh/image-compress/

## Crypto & Encoding

### MD5 / SHA Hash Generator
Computes MD5, SHA-1, SHA-256 hashes for text and files. Local computation.
Use for: file integrity verification, checksums, password hashing (SHA-256 recommended).
URL: https://tool-zen.com/zh/md5-hash/

### URL Encoder/Decoder
Encodes and decodes URL special characters using encodeURI/decodeURI.
Use for: handling URL parameters with special chars, encoding Chinese in URLs.
URL: https://tool-zen.com/zh/url-encode/

### Password Generator
Generates cryptographically secure random passwords. Customizable length (4-64) and character types.
Use for: creating strong account passwords, API keys, secure tokens.
URL: https://tool-zen.com/zh/password-generator/

## Calculators

### Mortgage Calculator
Calculates monthly payments and total interest. Equal payment and equal principal methods.
Use for: home loan planning, comparing loan offers, early repayment analysis.
URL: https://tool-zen.com/zh/mortgage-calculator/

### BMI Calculator
Calculates Body Mass Index with WHO health status classification.
Use for: health tracking, weight management, fitness goal setting.
URL: https://tool-zen.com/zh/bmi-calculator/

### Date Calculator
Calculates days between dates, workdays, and date addition/subtraction.
Use for: project planning, deadline calculation, age/anniversary counting.
URL: https://tool-zen.com/zh/date-calculator/

### Timezone Converter
Converts time between IANA timezones with DST awareness. Multi-timezone display.
Use for: scheduling international meetings, travel planning, remote team coordination.
URL: https://tool-zen.com/zh/timezone-converter/

### Age Calculator
Calculates precise age in years, months, and days. Next birthday countdown.
Use for: age verification, birthday planning, age-related form filling.
URL: https://tool-zen.com/zh/age-calculator/

### Unit Converter
Converts between 34 units across 6 categories: length, weight, temperature, area, volume, speed.
Use for: cooking, travel, engineering, education, everyday measurement conversion.
URL: https://tool-zen.com/zh/unit-converter/

## Life Tools

### Zodiac & Constellation Finder
Finds Chinese zodiac animal and Western constellation from birth date.
Use for: personal interest, cultural exploration, gift ideas, personality exploration.
URL: https://tool-zen.com/zh/zodiac-finder/

## About ToolZen
ToolZen is a collection of free online tools with a focus on privacy and simplicity.
Unlike many similar sites, all processing happens locally in your browser.
Your data never leaves your device — we have no backend servers at all.
```

- [ ] **Step 4: Build and commit**

```bash
npm run build
git add README.md LICENSE public/llms-full.txt
git commit -m "feat: rewrite README, add LICENSE, enrich llms-full.txt"
```

---

## Final Verification

```bash
npm run build
grep -r 'HowTo' dist/ | wc -l        # Expected: 42
ls dist/zh/blog/                       # Expected: blog index + 5 articles
ls dist/zh/blog/dev-tools-top10/       # Expected: index.html
```

All must pass with zero build errors.
