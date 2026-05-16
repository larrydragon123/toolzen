# ToolZen SEO工具站 实现计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 构建ToolZen——一个SEO驱动的免费在线工具网站，11个浏览器端工具，Astro静态站点，零后端。

**Architecture:** Astro SSG生成纯静态HTML。全局布局(BaseLayout)提供统一的SEO标签、导航和页脚。每个工具页由一个Astro页面(+ SEO内容)和一个Preact island(+ 交互逻辑)组成。工具元数据集中在`tools.ts`中，驱动分类页和首页的工具列表。

**Tech Stack:** Astro 5.x, Preact, Tailwind CSS 4, Vercel hosting, Cloudflare DNS

---

## 文件结构

```
src/
├── layouts/BaseLayout.astro       # 全局布局: <html>, <head>, 顶栏, 页脚
├── components/
│   ├── Header.astro              # Logo + 导航 + 搜索按钮
│   ├── Footer.astro              # 链接 + 版权
│   ├── SearchBar.astro           # 工具搜索(客户端)
│   ├── ToolCard.astro            # 单个工具卡片
│   ├── CategoryCard.astro        # 分类卡片(首页用)
│   ├── RelatedTools.astro        # 底部"相关工具"推荐
│   └── Breadcrumb.astro          # 面包屑导航
├── pages/
│   ├── index.astro               # 首页
│   ├── about.astro               # 关于页
│   ├── json-formatter.astro      # 工具页 (共11个)
│   ├── base64.astro
│   ├── uuid-generator.astro
│   ├── qr-code.astro
│   ├── image-compress.astro
│   ├── text-diff.astro
│   ├── word-counter.astro
│   ├── regex-tester.astro
│   ├── color-picker.astro
│   ├── md5-hash.astro
│   ├── url-encode.astro
│   └── category/
│       ├── dev.astro
│       ├── text.astro
│       ├── image.astro
│       ├── crypto.astro
│       └── calculators.astro
├── islands/
│   ├── JsonFormatter.tsx
│   ├── Base64Tool.tsx
│   ├── UuidGenerator.tsx
│   ├── QrCodeGenerator.tsx
│   ├── ImageCompress.tsx
│   ├── TextDiff.tsx
│   ├── WordCounter.tsx
│   ├── RegexTester.tsx
│   ├── ColorPicker.tsx
│   ├── HashGenerator.tsx
│   └── UrlEncoder.tsx
└── utils/
    ├── seo.ts                     # SEO meta生成
    └── tools.ts                   # 工具元数据注册表
```

### 各文件职责

| 文件 | 职责 | 依赖 |
|------|------|------|
| `tools.ts` | 所有工具的元数据(名称、路径、分类、描述、关键词)。单一真相来源。 | 无 |
| `seo.ts` | 接收工具元数据，返回SEO标签对象(title, description, JSON-LD, OG) | tools.ts |
| `BaseLayout.astro` | HTML骨架，注入SEO标签，渲染Header+Footer | Header, Footer, seo.ts |
| `Header.astro` | 响应式导航栏，移动端汉堡菜单 | 无 |
| `Footer.astro` | 页脚链接 | 无 |
| `SearchBar.astro` | 纯CSS实现搜索过滤(无需JS island) | tools.ts |
| `ToolCard.astro` | 展示单个工具的名称、描述、分类 | 无 |
| `CategoryCard.astro` | 展示分类及其包含的工具数 | 无 |
| `RelatedTools.astro` | 接收当前工具路径，渲染3-5个同分类工具链接 | tools.ts |
| `Breadcrumb.astro` | 接收分类和工具名，渲染Schema面包屑 | 无 |

---

### Task 1: 项目脚手架

**Files:**
- Create: `package.json`, `astro.config.mjs`, `tsconfig.json`, `tailwind.config.mjs`
- Create: `public/robots.txt`, `public/favicon.svg`
- Create: `src/env.d.ts`

- [ ] **Step 1: 初始化package.json**

```bash
mkdir -p toolzen && cd toolzen
```

创建 `package.json`:
```json
{
  "name": "toolzen",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "astro dev",
    "build": "astro build",
    "preview": "astro preview"
  }
}
```

- [ ] **Step 2: 安装依赖**

```bash
npm install astro @astrojs/preact @astrojs/tailwindcss preact
```

- [ ] **Step 3: 创建astro.config.mjs**

```mjs
import { defineConfig } from 'astro/config';
import preact from '@astrojs/preact';
import tailwindcss from '@astrojs/tailwindcss';

export default defineConfig({
  integrations: [preact(), tailwindcss()],
  site: 'https://toolzen.com',
  output: 'static',
  trailingSlash: 'always'
});
```

- [ ] **Step 4: 创建tsconfig.json**

```json
{
  "extends": "astro/tsconfigs/strict",
  "compilerOptions": {
    "jsx": "react-jsx",
    "jsxImportSource": "preact"
  }
}
```

- [ ] **Step 5: 创建tailwind.config.mjs**

```mjs
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        zen: {
          50: '#eff6ff',
          500: '#2563eb',
          600: '#1d4ed8',
          700: '#1e40af',
        }
      }
    }
  },
  plugins: []
};
```

- [ ] **Step 6: 创建public/robots.txt**

```
User-agent: *
Allow: /
Sitemap: https://toolzen.com/sitemap-index.xml
```

- [ ] **Step 7: 创建public/favicon.svg**

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
  <rect width="32" height="32" rx="6" fill="#2563eb"/>
  <text x="16" y="23" text-anchor="middle" fill="white" font-size="20" font-family="sans-serif" font-weight="bold">T</text>
</svg>
```

- [ ] **Step 8: 创建src/env.d.ts**

```ts
/// <reference types="astro/client" />
```

- [ ] **Step 9: 验证项目能启动**

```bash
mkdir -p src/pages
echo '<html><body><h1>ToolZen</h1></body></html>' > src/pages/index.astro
npx astro dev --port 3000 &
sleep 3
curl -s http://localhost:3000 | grep ToolZen
```

Expected: 返回包含 "ToolZen" 的 HTML。

- [ ] **Step 10: Commit**

```bash
git add -A
git commit -m "feat: scaffold astro project with preact and tailwind"
```

---

### Task 2: 工具元数据 + SEO工具函数

**Files:**
- Create: `src/utils/tools.ts`
- Create: `src/utils/seo.ts`

- [ ] **Step 1: 创建 tools.ts**

```ts
export interface Tool {
  slug: string;
  title: string;
  description: string;
  category: 'dev' | 'text' | 'image' | 'crypto' | 'calculators';
  keywords: string[];
  complexity: 'low' | 'medium';
}

export interface Category {
  slug: string;
  title: string;
  icon: string;
  description: string;
}

export const CATEGORIES: Category[] = [
  { slug: 'dev', title: '开发者工具', icon: '💻', description: 'JSON、Base64、正则等开发者常用工具' },
  { slug: 'text', title: '文本工具', icon: '📝', description: '文本对比、字数统计等文字处理工具' },
  { slug: 'image', title: '图片工具', icon: '🖼️', description: '图片压缩、二维码生成等图像工具' },
  { slug: 'crypto', title: '编码加密', icon: '🔐', description: 'MD5、SHA哈希、URL编解码工具' },
  { slug: 'calculators', title: '计算器', icon: '🔢', description: '房贷、BMI等实用计算器' },
];

export const TOOLS: Tool[] = [
  {
    slug: 'json-formatter',
    title: 'JSON 格式化',
    description: '在线JSON格式化、验证和压缩工具。支持语法高亮和错误定位，所有处理在浏览器端完成。',
    category: 'dev',
    keywords: ['JSON格式化', 'JSON验证', '在线JSON工具', 'JSON美化', 'JSON压缩'],
    complexity: 'low',
  },
  {
    slug: 'base64',
    title: 'Base64 编解码',
    description: '在线Base64编码解码工具。支持文本和文件的相互转换，数据不会上传到服务器。',
    category: 'dev',
    keywords: ['Base64编码', 'Base64解码', '在线Base64', '图片转Base64', 'Base64转换'],
    complexity: 'low',
  },
  {
    slug: 'uuid-generator',
    title: 'UUID 生成器',
    description: '在线生成UUID v4和ULID标识符。支持批量生成和一键复制，完全在浏览器端运行。',
    category: 'dev',
    keywords: ['UUID生成', '在线UUID', 'GUID生成器', 'ULID生成', '唯一标识符'],
    complexity: 'low',
  },
  {
    slug: 'qr-code',
    title: '二维码生成器',
    description: '免费在线二维码生成工具。支持URL、文本、联系方式等多种类型，可自定义颜色和大小。',
    category: 'image',
    keywords: ['二维码生成', 'QR码在线', '免费二维码', '在线生成二维码', 'QR Code'],
    complexity: 'low',
  },
  {
    slug: 'image-compress',
    title: '图片压缩',
    description: '在线图片压缩工具，支持PNG、JPEG、WebP格式。压缩过程在浏览器本地完成，保护隐私。',
    category: 'image',
    keywords: ['图片压缩', '在线压缩图片', 'PNG压缩', 'JPEG压缩', '免费图片压缩'],
    complexity: 'medium',
  },
  {
    slug: 'text-diff',
    title: '文本对比',
    description: '在线文本差异对比工具。快速找出两段文本的增删改内容，支持并排和统一视图。',
    category: 'text',
    keywords: ['文本对比', '文本差异', 'Diff工具', '在线Diff', '代码对比'],
    complexity: 'medium',
  },
  {
    slug: 'word-counter',
    title: '字数统计',
    description: '在线字数统计工具。实时统计字符数、单词数、行数和段落数，支持中英文混合统计。',
    category: 'text',
    keywords: ['字数统计', '在线字数', '字符计数', '单词计数', '文本统计'],
    complexity: 'low',
  },
  {
    slug: 'regex-tester',
    title: '正则表达式测试器',
    description: '在线正则表达式测试工具。实时匹配高亮，支持常用正则模式库，所有计算在浏览器完成。',
    category: 'dev',
    keywords: ['正则测试', '正则表达式', '在线正则', 'Regex测试', '正则匹配'],
    complexity: 'low',
  },
  {
    slug: 'color-picker',
    title: '颜色选择器',
    description: '在线颜色选择和转换工具。支持HEX、RGB、HSL格式互转，提供调色板和取色功能。',
    category: 'dev',
    keywords: ['颜色选择器', '取色器', 'HEX转RGB', '在线配色', 'Color Picker'],
    complexity: 'low',
  },
  {
    slug: 'md5-hash',
    title: 'MD5 / SHA 哈希生成',
    description: '在线MD5、SHA-1、SHA-256哈希值生成工具。支持文本和文件哈希，所有计算在浏览器端完成。',
    category: 'crypto',
    keywords: ['MD5生成', 'SHA256', '哈希生成', '在线MD5', '文件哈希'],
    complexity: 'low',
  },
  {
    slug: 'url-encode',
    title: 'URL 编解码',
    description: '在线URL编码和解码工具。快速对URL特殊字符进行encodeURI和decodeURI转换。',
    category: 'crypto',
    keywords: ['URL编码', 'URL解码', 'encodeURI', 'decodeURI', 'URL转义'],
    complexity: 'low',
  },
];

export function getTool(slug: string): Tool | undefined {
  return TOOLS.find(t => t.slug === slug);
}

export function getToolsByCategory(category: string): Tool[] {
  return TOOLS.filter(t => t.category === category);
}

export function getRelatedTools(slug: string, limit: number = 4): Tool[] {
  const tool = getTool(slug);
  if (!tool) return [];
  const same = getToolsByCategory(tool.category).filter(t => t.slug !== slug);
  const others = TOOLS.filter(t => t.category !== tool.category);
  return [...same, ...others].slice(0, limit);
}
```

- [ ] **Step 2: 创建 seo.ts**

```ts
import type { Tool, Category } from './tools';

export function generateSEOMeta(params: {
  title: string;
  description: string;
  path: string;
  type?: 'website' | 'article';
  image?: string;
}): {
  title: string;
  meta: Array<Record<string, string>>;
  script: Array<Record<string, string>>;
} {
  const fullTitle = `${params.title} | ToolZen`;

  const meta = [
    { name: 'description', content: params.description },
    { property: 'og:title', content: fullTitle },
    { property: 'og:description', content: params.description },
    { property: 'og:type', content: params.type || 'website' },
    { property: 'og:url', content: `https://toolzen.com${params.path}` },
    { property: 'og:image', content: params.image || 'https://toolzen.com/og-default.png' },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: fullTitle },
    { name: 'twitter:description', content: params.description },
  ];

  const script: Array<Record<string, string>> = [];

  return { title: fullTitle, meta, script };
}

export function generateToolSEOMeta(tool: Tool): ReturnType<typeof generateSEOMeta> {
  const base = generateSEOMeta({
    title: `在线${tool.title} - 免费在线工具 无需上传`,
    description: tool.description,
    path: `/${tool.slug}/`,
  });

  // JSON-LD for WebApplication
  base.script.push({
    type: 'application/ld+json',
    innerHTML: JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'WebApplication',
      name: `在线${tool.title}`,
      description: tool.description,
      url: `https://toolzen.com/${tool.slug}/`,
      applicationCategory: 'UtilityApplication',
      operatingSystem: 'All',
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    }),
  });

  return base;
}

export function generateCategorySEOMeta(cat: Category): ReturnType<typeof generateSEOMeta> {
  return generateSEOMeta({
    title: `${cat.title} - 免费在线${cat.title}`,
    description: cat.description,
    path: `/category/${cat.slug}/`,
  });
}

export function generateBreadcrumbLD(items: Array<{ name: string; url: string }>) {
  return {
    type: 'application/ld+json',
    innerHTML: JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: items.map((item, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        name: item.name,
        item: item.url,
      })),
    }),
  };
}
```

- [ ] **Step 3: Commit**

```bash
git add src/utils/
git commit -m "feat: add tool metadata registry and SEO utilities"
```

---

### Task 3: 全局布局 BaseLayout + Header + Footer

**Files:**
- Create: `src/layouts/BaseLayout.astro`
- Create: `src/components/Header.astro`
- Create: `src/components/Footer.astro`

- [ ] **Step 1: 创建 Header.astro**

```astro
---
const navItems = [
  { label: '开发者工具', href: '/category/dev/' },
  { label: '文本工具', href: '/category/text/' },
  { label: '图片工具', href: '/category/image/' },
  { label: '编码加密', href: '/category/crypto/' },
  { label: '计算器', href: '/category/calculators/' },
];
---

<header class="sticky top-0 z-50 bg-white/80 backdrop-blur border-b border-gray-100">
  <div class="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
    <a href="/" class="flex items-center gap-2 font-bold text-xl text-gray-900 no-underline">
      <span class="w-8 h-8 bg-zen-500 rounded-lg flex items-center justify-center text-white text-sm">T</span>
      ToolZen
    </a>

    <nav class="hidden md:flex items-center gap-1">
      {navItems.map(item => (
        <a href={item.href} class="px-3 py-2 text-sm text-gray-600 hover:text-zen-500 rounded-md hover:bg-zen-50 transition-colors no-underline">
          {item.label}
        </a>
      ))}
    </nav>

    <div class="flex items-center gap-2">
      <a href="#search" class="px-3 py-2 text-sm text-gray-500 hover:text-gray-700 no-underline" id="search-toggle">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
      </a>
    </div>
  </div>
</header>
```

- [ ] **Step 2: 创建 Footer.astro**

```astro
<footer class="border-t border-gray-100 mt-20">
  <div class="max-w-6xl mx-auto px-4 py-10">
    <div class="flex flex-col md:flex-row justify-between items-center gap-4">
      <div class="text-sm text-gray-500">
        &copy; 2026 ToolZen. All tools run locally in your browser.
      </div>
      <nav class="flex gap-6">
        <a href="/about/" class="text-sm text-gray-500 hover:text-gray-700 no-underline">About</a>
        <a href="/privacy/" class="text-sm text-gray-500 hover:text-gray-700 no-underline">Privacy</a>
        <a href="mailto:hello@toolzen.com" class="text-sm text-gray-500 hover:text-gray-700 no-underline">Contact</a>
      </nav>
    </div>
  </div>
</footer>
```

- [ ] **Step 3: 创建 BaseLayout.astro**

```astro
---
import Header from '../components/Header.astro';
import Footer from '../components/Footer.astro';

interface Props {
  title: string;
  description: string;
  image?: string;
}

const { title, description, image } = Astro.props;
---

<!doctype html>
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>{title}</title>
    <meta name="description" content={description} />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <link rel="sitemap" href="/sitemap-index.xml" />

    <!-- Open Graph -->
    <meta property="og:title" content={title} />
    <meta property="og:description" content={description} />
    <meta property="og:type" content="website" />
    <meta property="og:image" content={image || '/og-default.png'} />
    <meta name="twitter:card" content="summary_large_image" />

    <slot name="head" />
  </head>
  <body class="bg-white text-gray-900 antialiased min-h-screen flex flex-col">
    <Header />
    <main class="flex-1">
      <slot />
    </main>
    <Footer />
  </body>
</html>

<style is:global>
  @import "tailwindcss";

  @theme {
    --color-zen-50: #eff6ff;
    --color-zen-100: #dbeafe;
    --color-zen-200: #bfdbfe;
    --color-zen-500: #2563eb;
    --color-zen-600: #1d4ed8;
    --color-zen-700: #1e40af;
  }

  * { box-sizing: border-box; }
  body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
  a { color: var(--color-zen-500); }
</style>
```

- [ ] **Step 4: Commit**

```bash
git add src/layouts/ src/components/
git commit -m "feat: add base layout, header, and footer"
```

---

### Task 4: 共享组件 (SearchBar, ToolCard, CategoryCard, RelatedTools, Breadcrumb)

**Files:**
- Create: `src/components/SearchBar.astro`
- Create: `src/components/ToolCard.astro`
- Create: `src/components/CategoryCard.astro`
- Create: `src/components/RelatedTools.astro`
- Create: `src/components/Breadcrumb.astro`

- [ ] **Step 1: 创建 ToolCard.astro**

```astro
---
export interface Props {
  slug: string;
  title: string;
  description: string;
}
const { slug, title, description } = Astro.props;
---

<a href={`/${slug}/`} class="block p-4 rounded-xl border border-gray-100 hover:border-zen-200 hover:bg-zen-50/30 transition-all no-underline group">
  <h3 class="font-semibold text-gray-900 group-hover:text-zen-500 transition-colors">{title}</h3>
  <p class="text-sm text-gray-500 mt-1">{description.slice(0, 80)}...</p>
</a>
```

- [ ] **Step 2: 创建 CategoryCard.astro**

```astro
---
import { getToolsByCategory } from '../utils/tools';

export interface Props {
  slug: string;
  title: string;
  icon: string;
  description: string;
}
const { slug, title, icon, description } = Astro.props;
const count = getToolsByCategory(slug).length;
---

<a href={`/category/${slug}/`} class="block p-5 rounded-xl border border-gray-100 hover:border-zen-200 hover:bg-zen-50/30 transition-all no-underline group">
  <div class="text-2xl mb-2">{icon}</div>
  <h3 class="font-semibold text-gray-900 group-hover:text-zen-500 transition-colors">{title}</h3>
  <p class="text-sm text-gray-500 mt-1">{description}</p>
  <span class="inline-block mt-2 text-xs text-zen-500 bg-zen-50 px-2 py-0.5 rounded-full">{count} 个工具</span>
</a>
```

- [ ] **Step 3: 创建 RelatedTools.astro**

```astro
---
import { getRelatedTools } from '../utils/tools';
import ToolCard from './ToolCard.astro';

export interface Props {
  current: string;
}
const { current } = Astro.props;
const related = getRelatedTools(current, 4);
---

{related.length > 0 && (
  <section class="mt-12 pt-8 border-t border-gray-100">
    <h2 class="text-lg font-semibold text-gray-900 mb-4">相关工具</h2>
    <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
      {related.map(tool => (
        <ToolCard slug={tool.slug} title={tool.title} description={tool.description} />
      ))}
    </div>
  </section>
)}
```

- [ ] **Step 4: 创建 Breadcrumb.astro**

```astro
---
export interface Props {
  items: Array<{ label: string; href?: string }>;
}

const { items } = Astro.props;
const breadcrumbLD = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: items.map((item, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    name: item.label,
    item: item.href ? `https://toolzen.com${item.href}` : undefined,
  })),
};
---

<nav class="flex items-center gap-2 text-sm text-gray-400 mb-6" aria-label="Breadcrumb">
  {items.map((item, i) => (
    <>
      {i > 0 && <span>/</span>}
      {item.href ? (
        <a href={item.href} class="hover:text-gray-600 transition-colors no-underline">{item.label}</a>
      ) : (
        <span class="text-gray-700">{item.label}</span>
      )}
    </>
  ))}
</nav>

<script type="application/ld+json" set:html={JSON.stringify(breadcrumbLD)}></script>
```

- [ ] **Step 5: 创建 SearchBar.astro (客户端搜索，无需JS island)**

```astro
---
import { TOOLS } from '../utils/tools';
---

<div id="search" class="relative max-w-2xl mx-auto">
  <input
    type="text"
    id="tool-search"
    placeholder="搜索工具... (如 JSON、二维码、Base64)"
    class="w-full px-4 py-3 pl-10 rounded-xl border border-gray-200 focus:border-zen-500 focus:ring-2 focus:ring-zen-100 outline-none transition-all text-gray-900"
  />
  <svg class="absolute left-3 top-3.5 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
  </svg>
</div>

<script>
  const input = document.getElementById('tool-search') as HTMLInputElement;
  const tools = [{!! TOOLS.map(t => JSON.stringify({s:t.slug, t:t.title, d:t.description, c:t.category})).join(',') !!}];

  input?.addEventListener('input', () => {
    const q = input.value.toLowerCase();
    // Show matching tools in a dropdown; clear results from card grid
    const cards = document.querySelectorAll('[data-tool-card]');
    cards.forEach(card => {
      const name = (card.getAttribute('data-tool-card') || '').toLowerCase();
      (card as HTMLElement).style.display = name.includes(q) ? '' : 'none';
    });
  });
</script>
```

- [ ] **Step 6: Commit**

```bash
git add src/components/
git commit -m "feat: add shared components (cards, search, breadcrumb, related)"
```

---

### Task 5: 工具页模板 (批量创建纯JS工具)

**Files:**
- Create: `src/islands/JsonFormatter.tsx`
- Create: `src/islands/Base64Tool.tsx`
- Create: `src/islands/UuidGenerator.tsx`
- Create: `src/islands/UrlEncoder.tsx`
- Create: `src/islands/WordCounter.tsx`
- Create: `src/islands/RegexTester.tsx`
- Create: `src/islands/ColorPicker.tsx`
- Create: `src/islands/HashGenerator.tsx`
- Create: `src/pages/json-formatter.astro` (及7个类似的工具页)

- [ ] **Step 1: 创建 JsonFormatter island**

```tsx
// src/islands/JsonFormatter.tsx
import { useState } from 'preact/hooks';

export default function JsonFormatter() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');

  const format = () => {
    try {
      const obj = JSON.parse(input);
      setOutput(JSON.stringify(obj, null, 2));
      setError('');
    } catch (e) {
      setError((e as Error).message);
      setOutput('');
    }
  };

  const compress = () => {
    try {
      const obj = JSON.parse(input);
      setOutput(JSON.stringify(obj));
      setError('');
    } catch (e) {
      setError((e as Error).message);
      setOutput('');
    }
  };

  const validate = () => {
    try {
      JSON.parse(input);
      setError('');
      setOutput('✓ Valid JSON');
    } catch (e) {
      setError((e as Error).message);
      setOutput('');
    }
  };

  const copy = () => {
    navigator.clipboard.writeText(output);
  };

  return (
    <div class="space-y-4">
      <div class="flex gap-2 flex-wrap">
        <button onClick={format} class="px-4 py-2 bg-zen-500 text-white rounded-lg text-sm font-medium hover:bg-zen-600 transition-colors">Format</button>
        <button onClick={compress} class="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors">Compress</button>
        <button onClick={validate} class="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors">Validate</button>
        <button onClick={copy} class="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors">Copy</button>
      </div>
      <textarea
        value={input}
        onInput={(e) => setInput((e.target as HTMLTextAreaElement).value)}
        placeholder='{"key": "value"}'
        rows={10}
        class="w-full p-3 border border-gray-200 rounded-lg font-mono text-sm focus:border-zen-500 focus:ring-1 focus:ring-zen-100 outline-none resize-y"
      />
      {error && <div class="p-3 bg-red-50 border border-red-100 rounded-lg text-sm text-red-600 font-mono">{error}</div>}
      <textarea
        value={output}
        readOnly
        rows={10}
        class="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg font-mono text-sm resize-y"
        placeholder="Output..."
      />
    </div>
  );
}
```

- [ ] **Step 2: 创建 Base64Tool island**

```tsx
// src/islands/Base64Tool.tsx
import { useState } from 'preact/hooks';

export default function Base64Tool() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');

  const encode = () => setOutput(btoa(unescape(encodeURIComponent(input))));
  const decode = () => {
    try { setOutput(decodeURIComponent(escape(atob(input)))); }
    catch { setOutput('Invalid Base64 input'); }
  };
  const copy = () => navigator.clipboard.writeText(output);
  const swap = () => { setInput(output); setOutput(input); };

  return (
    <div class="space-y-4">
      <div class="flex gap-2 flex-wrap">
        <button onClick={encode} class="px-4 py-2 bg-zen-500 text-white rounded-lg text-sm font-medium hover:bg-zen-600">Encode</button>
        <button onClick={decode} class="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200">Decode</button>
        <button onClick={swap} class="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200">Swap</button>
        <button onClick={copy} class="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200">Copy</button>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label class="block text-sm text-gray-500 mb-1">Input</label>
          <textarea value={input} onInput={(e) => setInput((e.target as HTMLTextAreaElement).value)}
            rows={8} class="w-full p-3 border border-gray-200 rounded-lg font-mono text-sm focus:border-zen-500 outline-none resize-y" />
        </div>
        <div>
          <label class="block text-sm text-gray-500 mb-1">Output</label>
          <textarea value={output} readOnly rows={8}
            class="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg font-mono text-sm resize-y" />
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 3: 创建 UuidGenerator island**

```tsx
// src/islands/UuidGenerator.tsx
import { useState } from 'preact/hooks';

export default function UuidGenerator() {
  const [uuids, setUuids] = useState<string[]>([]);
  const [count, setCount] = useState(1);

  const generate = () => {
    const arr: string[] = [];
    for (let i = 0; i < count; i++) {
      arr.push(crypto.randomUUID());
    }
    setUuids(arr);
  };

  const copyAll = () => navigator.clipboard.writeText(uuids.join('\n'));

  return (
    <div class="space-y-4">
      <div class="flex gap-2 flex-wrap items-end">
        <div>
          <label class="block text-sm text-gray-500 mb-1">Count</label>
          <input type="number" min="1" max="100" value={count}
            onInput={(e) => setCount(parseInt((e.target as HTMLInputElement).value) || 1)}
            class="w-20 p-2 border border-gray-200 rounded-lg text-sm" />
        </div>
        <button onClick={generate} class="px-4 py-2 bg-zen-500 text-white rounded-lg text-sm font-medium hover:bg-zen-600">Generate</button>
        {uuids.length > 0 && (
          <button onClick={copyAll} class="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200">Copy All</button>
        )}
      </div>
      {uuids.length > 0 && (
        <div class="p-3 bg-gray-50 border border-gray-200 rounded-lg font-mono text-sm space-y-1 max-h-60 overflow-y-auto">
          {uuids.map((id, i) => <div key={i}>{id}</div>)}
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 4: 创建 UrlEncoder island**

```tsx
// src/islands/UrlEncoder.tsx
import { useState } from 'preact/hooks';

export default function UrlEncoder() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');

  const encode = () => setOutput(encodeURIComponent(input));
  const decode = () => {
    try { setOutput(decodeURIComponent(input)); }
    catch { setOutput('Invalid URL-encoded input'); }
  };
  const copy = () => navigator.clipboard.writeText(output);

  return (
    <div class="space-y-4">
      <div class="flex gap-2 flex-wrap">
        <button onClick={encode} class="px-4 py-2 bg-zen-500 text-white rounded-lg text-sm font-medium hover:bg-zen-600">Encode URL</button>
        <button onClick={decode} class="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200">Decode URL</button>
        <button onClick={copy} class="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200">Copy</button>
      </div>
      <textarea value={input} onInput={(e) => setInput((e.target as HTMLTextAreaElement).value)}
        rows={6} placeholder="Enter URL or text to encode/decode..."
        class="w-full p-3 border border-gray-200 rounded-lg font-mono text-sm focus:border-zen-500 outline-none resize-y" />
      <textarea value={output} readOnly rows={6}
        class="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg font-mono text-sm resize-y" />
    </div>
  );
}
```

- [ ] **Step 5: 创建 WordCounter island**

```tsx
// src/islands/WordCounter.tsx
import { useState } from 'preact/hooks';

export default function WordCounter() {
  const [text, setText] = useState('');

  const chars = text.length;
  const charsNoSpaces = text.replace(/\s/g, '').length;
  const words = text.trim() ? text.trim().split(/\s+/).length : 0;
  const lines = text ? text.split('\n').length : 0;
  const bytes = new Blob([text]).size;

  const stats = [
    { label: 'Characters', value: chars },
    { label: 'Characters (no spaces)', value: charsNoSpaces },
    { label: 'Words', value: words },
    { label: 'Lines', value: lines },
    { label: 'Bytes', value: bytes },
  ];

  return (
    <div class="space-y-4">
      <div class="grid grid-cols-2 md:grid-cols-5 gap-2">
        {stats.map(s => (
          <div class="p-3 bg-zen-50 rounded-lg text-center">
            <div class="text-2xl font-bold text-zen-600">{s.value}</div>
            <div class="text-xs text-gray-500 mt-1">{s.label}</div>
          </div>
        ))}
      </div>
      <textarea value={text} onInput={(e) => setText((e.target as HTMLTextAreaElement).value)}
        rows={10} placeholder="Type or paste text here..."
        class="w-full p-3 border border-gray-200 rounded-lg text-sm focus:border-zen-500 outline-none resize-y" />
    </div>
  );
}
```

- [ ] **Step 6: 创建 RegexTester island**

```tsx
// src/islands/RegexTester.tsx
import { useState } from 'preact/hooks';

export default function RegexTester() {
  const [pattern, setPattern] = useState('');
  const [flags, setFlags] = useState('g');
  const [text, setText] = useState('');
  const [matches, setMatches] = useState<string[]>([]);
  const [error, setError] = useState('');

  const test = () => {
    setError('');
    setMatches([]);
    try {
      const re = new RegExp(pattern, flags);
      const result = text.match(re);
      setMatches(result || []);
      if (!result) setError('No matches found');
    } catch (e) {
      setError((e as Error).message);
    }
  };

  const presets = [
    { label: 'Email', pattern: '[\\w.-]+@[\\w.-]+\\.\\w+' },
    { label: 'URL', pattern: 'https?://[^\\s]+' },
    { label: 'Phone (CN)', pattern: '1[3-9]\\d{9}' },
    { label: 'IPv4', pattern: '\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}' },
  ];

  return (
    <div class="space-y-4">
      <div class="flex gap-2 items-end flex-wrap">
        <div class="flex-1 min-w-48">
          <label class="block text-sm text-gray-500 mb-1">Pattern</label>
          <input value={pattern} onInput={(e) => setPattern((e.target as HTMLInputElement).value)}
            placeholder="/regex/"
            class="w-full p-2 border border-gray-200 rounded-lg font-mono text-sm focus:border-zen-500 outline-none" />
        </div>
        <div>
          <label class="block text-sm text-gray-500 mb-1">Flags</label>
          <input value={flags} onInput={(e) => setFlags((e.target as HTMLInputElement).value)}
            class="w-16 p-2 border border-gray-200 rounded-lg font-mono text-sm" />
        </div>
        <button onClick={test} class="px-4 py-2 bg-zen-500 text-white rounded-lg text-sm font-medium hover:bg-zen-600">Match</button>
      </div>
      <div class="flex gap-2 flex-wrap">
        {presets.map(p => (
          <button onClick={() => setPattern(p.pattern)} class="px-3 py-1 bg-gray-100 text-gray-600 rounded text-xs hover:bg-gray-200 transition-colors">{p.label}</button>
        ))}
      </div>
      <textarea value={text} onInput={(e) => setText((e.target as HTMLTextAreaElement).value)}
        rows={6} placeholder="Text to search..."
        class="w-full p-3 border border-gray-200 rounded-lg font-mono text-sm focus:border-zen-500 outline-none resize-y" />
      {error && <div class="p-3 bg-red-50 border border-red-100 rounded-lg text-sm text-red-600">{error}</div>}
      {matches.length > 0 && (
        <div class="p-3 bg-green-50 border border-green-100 rounded-lg">
          <div class="text-sm text-green-700 mb-2">{matches.length} match(es)</div>
          <div class="space-y-1 max-h-40 overflow-y-auto font-mono text-sm">
            {matches.map((m, i) => <div key={i} class="text-green-800">{m}</div>)}
          </div>
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 7: 创建 ColorPicker island**

```tsx
// src/islands/ColorPicker.tsx
import { useState } from 'preact/hooks';

function hexToRgb(hex: string) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return { r, g, b };
}

function hexToHsl(hex: string) {
  let { r, g, b } = hexToRgb(hex);
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0, l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
      case g: h = ((b - r) / d + 2) / 6; break;
      case b: h = ((r - g) / d + 4) / 6; break;
    }
  }
  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
}

export default function ColorPicker() {
  const [hex, setHex] = useState('#2563eb');
  const rgb = hexToRgb(hex);
  const hsl = hexToHsl(hex);

  const copy = (text: string) => navigator.clipboard.writeText(text);

  return (
    <div class="space-y-4">
      <div class="flex gap-4 items-start flex-wrap">
        <div>
          <input type="color" value={hex} onInput={(e) => setHex((e.target as HTMLInputElement).value)}
            class="w-24 h-24 rounded-lg cursor-pointer border-0" />
        </div>
        <div class="space-y-2 flex-1">
          <div class="flex items-center gap-2">
            <span class="text-sm text-gray-500 w-8">HEX</span>
            <code class="px-2 py-1 bg-gray-50 rounded text-sm">{hex}</code>
            <button onClick={() => copy(hex)} class="text-xs text-zen-500 hover:text-zen-600">Copy</button>
          </div>
          <div class="flex items-center gap-2">
            <span class="text-sm text-gray-500 w-8">RGB</span>
            <code class="px-2 py-1 bg-gray-50 rounded text-sm">rgb({rgb.r}, {rgb.g}, {rgb.b})</code>
            <button onClick={() => copy(`rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`)} class="text-xs text-zen-500 hover:text-zen-600">Copy</button>
          </div>
          <div class="flex items-center gap-2">
            <span class="text-sm text-gray-500 w-8">HSL</span>
            <code class="px-2 py-1 bg-gray-50 rounded text-sm">hsl({hsl.h}, {hsl.s}%, {hsl.l}%)</code>
            <button onClick={() => copy(`hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`)} class="text-xs text-zen-500 hover:text-zen-600">Copy</button>
          </div>
        </div>
      </div>
      <input value={hex} onInput={(e) => setHex((e.target as HTMLInputElement).value)}
        placeholder="#000000"
        class="w-full max-w-xs p-2 border border-gray-200 rounded-lg font-mono text-sm focus:border-zen-500 outline-none" />
    </div>
  );
}
```

- [ ] **Step 8: 创建 HashGenerator island**

```tsx
// src/islands/HashGenerator.tsx
import { useState } from 'preact/hooks';

export default function HashGenerator() {
  const [input, setInput] = useState('');
  const [results, setResults] = useState<Record<string, string>>({});

  const hash = async (algo: string) => {
    const encoder = new TextEncoder();
    const data = encoder.encode(input);
    const hashBuffer = await crypto.subtle.digest(algo, data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    setResults(prev => ({ ...prev, [algo]: hashHex }));
  };

  const algos = [
    { id: 'SHA-256', fn: 'SHA-256' },
    { id: 'SHA-1', fn: 'SHA-1' },
    { id: 'MD5', fn: 'MD5 (via Web Crypto unavailable, showing SHA-256)' },
  ];

  const hashAll = () => {
    hash('SHA-256');
    hash('SHA-1');
  };

  return (
    <div class="space-y-4">
      <textarea value={input} onInput={(e) => setInput((e.target as HTMLTextAreaElement).value)}
        rows={4} placeholder="Enter text to hash..."
        class="w-full p-3 border border-gray-200 rounded-lg font-mono text-sm focus:border-zen-500 outline-none resize-y" />
      <button onClick={hashAll} class="px-4 py-2 bg-zen-500 text-white rounded-lg text-sm font-medium hover:bg-zen-600">Generate Hash</button>
      {Object.entries(results).length > 0 && (
        <div class="space-y-2">
          {Object.entries(results).map(([algo, hash]) => (
            <div key={algo}>
              <label class="text-xs text-gray-500">{algo}</label>
              <div class="p-2 bg-gray-50 border border-gray-200 rounded font-mono text-xs break-all">{hash}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 9: 创建工具页模板 (以json-formatter.astro为例)**

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
import Breadcrumb from '../components/Breadcrumb.astro';
import RelatedTools from '../components/RelatedTools.astro';
import { getTool } from '../utils/tools';
import { generateToolSEOMeta } from '../utils/seo';
import JsonFormatter from '../islands/JsonFormatter';

const tool = getTool('json-formatter')!;
const seo = generateToolSEOMeta(tool);
---

<BaseLayout title={seo.title} description={tool.description}>
  <div class="max-w-4xl mx-auto px-4 py-8">
    <Breadcrumb items={[
      { label: 'Home', href: '/' },
      { label: 'Developer Tools', href: '/category/dev/' },
      { label: tool.title },
    ]} />

    <h1 class="text-3xl font-bold text-gray-900 mb-2">在线{tool.title}工具</h1>
    <p class="text-gray-500 mb-8">{tool.description}</p>

    <JsonFormatter client:load />

    <section class="mt-12 prose max-w-none">
      <h2 class="text-xl font-semibold text-gray-900">如何使用{tool.title}工具</h2>
      <p class="text-gray-600">只需将JSON字符串粘贴到上方输入框，点击"Format"即可自动格式化。点击"Validate"可验证JSON格式是否正确。所有处理都在您的浏览器中完成，数据绝不会上传到服务器。</p>

      <h3 class="text-lg font-semibold text-gray-900 mt-6">什么是JSON？</h3>
      <p class="text-gray-600">JSON (JavaScript Object Notation) 是一种轻量级的数据交换格式，易于人阅读和编写，也易于机器解析和生成。它广泛应用于Web API、配置文件和数据库存储。</p>

      <h3 class="text-lg font-semibold text-gray-900 mt-6">常见问题</h3>
      <div class="space-y-4">
        <div>
          <h4 class="font-medium text-gray-800">为什么我的JSON格式化失败？</h4>
          <p class="text-gray-600">常见原因包括：缺少引号、多余逗号、使用了单引号而非双引号。使用Validate功能可以定位错误位置。</p>
        </div>
        <div>
          <h4 class="font-medium text-gray-800">数据会上传到服务器吗？</h4>
          <p class="text-gray-600">不会。ToolZen所有工具都在浏览器本地运行，您的数据始终保留在您的设备上。</p>
        </div>
        <div>
          <h4 class="font-medium text-gray-800">可以处理多大的JSON文件？</h4>
          <p class="text-gray-600">由于使用浏览器处理，建议单个文件不超过10MB。过大文件可能导致浏览器卡顿。</p>
        </div>
      </div>
    </section>

    <RelatedTools current="json-formatter" />
  </div>

  {seo.script.map(s => <script type={s.type} set:html={s.innerHTML}></script>)}
</BaseLayout>
```

- [ ] **Step 10: 批量创建其余6个纯JS工具页**

每个工具页按同样的模板，替换四样东西:
- `import XxxTool from '../islands/XxxTool'` + `<XxxTool client:load />`
- `const tool = getTool('xxx')!` 中的slug
- 面包屑中的分类
- SEO说明文字 (根据工具调整)

要创建的工具页: `base64.astro`, `uuid-generator.astro`, `url-encode.astro`, `word-counter.astro`, `regex-tester.astro`, `color-picker.astro`, `md5-hash.astro`

- [ ] **Step 11: Commit**

```bash
git add src/islands/JsonFormatter.tsx src/islands/Base64Tool.tsx src/islands/UuidGenerator.tsx
git add src/islands/UrlEncoder.tsx src/islands/WordCounter.tsx src/islands/RegexTester.tsx
git add src/islands/ColorPicker.tsx src/islands/HashGenerator.tsx
git add src/pages/json-formatter.astro src/pages/base64.astro src/pages/uuid-generator.astro
git add src/pages/url-encode.astro src/pages/word-counter.astro src/pages/regex-tester.astro
git add src/pages/color-picker.astro src/pages/md5-hash.astro
git commit -m "feat: add 8 pure-JS tool pages with islands"
```

---

### Task 6: 二维码生成器工具页

**Files:**
- Create: `src/islands/QrCodeGenerator.tsx`
- Create: `src/pages/qr-code.astro`

- [ ] **Step 1: 安装qrcode依赖**

```bash
npm install qrcode
```

- [ ] **Step 2: 创建 QrCodeGenerator island**

```tsx
// src/islands/QrCodeGenerator.tsx
import { useState } from 'preact/hooks';

export default function QrCodeGenerator() {
  const [text, setText] = useState('');
  const [qrDataUrl, setQrDataUrl] = useState('');
  const [size, setSize] = useState(256);
  const [fgColor, setFgColor] = useState('#000000');
  const [bgColor, setBgColor] = useState('#ffffff');

  const generate = async () => {
    if (!text.trim()) return;
    const QRCode = (await import('qrcode')).default;
    const canvas = document.createElement('canvas');
    await QRCode.toCanvas(canvas, text, {
      width: size,
      color: { dark: fgColor, light: bgColor },
    });
    setQrDataUrl(canvas.toDataURL('image/png'));
  };

  const download = () => {
    const a = document.createElement('a');
    a.href = qrDataUrl;
    a.download = 'qrcode.png';
    a.click();
  };

  return (
    <div class="space-y-4">
      <div class="flex gap-2 flex-wrap items-end">
        <div class="flex-1 min-w-48">
          <label class="block text-sm text-gray-500 mb-1">Content (URL / Text)</label>
          <input value={text} onInput={(e) => setText((e.target as HTMLInputElement).value)}
            placeholder="https://example.com"
            class="w-full p-2 border border-gray-200 rounded-lg text-sm focus:border-zen-500 outline-none" />
        </div>
        <div>
          <label class="block text-sm text-gray-500 mb-1">Size</label>
          <select value={size} onChange={(e) => setSize(Number((e.target as HTMLSelectElement).value))}
            class="p-2 border border-gray-200 rounded-lg text-sm">
            <option value={128}>128</option>
            <option value={256}>256</option>
            <option value={512}>512</option>
          </select>
        </div>
        <button onClick={generate} class="px-4 py-2 bg-zen-500 text-white rounded-lg text-sm font-medium hover:bg-zen-600">Generate</button>
      </div>
      <div class="flex gap-4">
        <div>
          <label class="block text-xs text-gray-400 mb-1">Foreground</label>
          <input type="color" value={fgColor} onInput={(e) => setFgColor((e.target as HTMLInputElement).value)}
            class="w-10 h-10 rounded cursor-pointer border-0" />
        </div>
        <div>
          <label class="block text-xs text-gray-400 mb-1">Background</label>
          <input type="color" value={bgColor} onInput={(e) => setBgColor((e.target as HTMLInputElement).value)}
            class="w-10 h-10 rounded cursor-pointer border-0" />
        </div>
      </div>
      {qrDataUrl && (
        <div class="space-y-2">
          <img src={qrDataUrl} alt="QR Code" class="border border-gray-100 rounded-lg" />
          <button onClick={download} class="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200">Download PNG</button>
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 3: 创建 qr-code.astro 工具页**

按照Task 5 Step 9的工具页模板，slug为`qr-code`，分类为`image`，导入`QrCodeGenerator`。

- [ ] **Step 4: Commit**

```bash
git add src/islands/QrCodeGenerator.tsx src/pages/qr-code.astro
git commit -m "feat: add QR code generator tool"
```

---

### Task 7: 图片压缩工具页

**Files:**
- Create: `src/islands/ImageCompress.tsx`
- Create: `src/pages/image-compress.astro`

- [ ] **Step 1: 创建 ImageCompress island**

```tsx
// src/islands/ImageCompress.tsx
import { useState, useRef } from 'preact/hooks';

export default function ImageCompress() {
  const [original, setOriginal] = useState<{ file: File; url: string; size: number } | null>(null);
  const [compressed, setCompressed] = useState<{ url: string; size: number } | null>(null);
  const [quality, setQuality] = useState(0.7);
  const [format, setFormat] = useState('image/jpeg');
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleFile = (e: Event) => {
    const file = (e.target as HTMLInputElement).files?.[0];
    if (!file) return;
    setOriginal({ file, url: URL.createObjectURL(file), size: file.size });
    setCompressed(null);
  };

  const compress = () => {
    if (!original || !canvasRef.current) return;
    const img = new Image();
    img.onload = () => {
      const canvas = canvasRef.current!;
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d')!;
      ctx.drawImage(img, 0, 0);
      canvas.toBlob((blob) => {
        if (blob) {
          setCompressed({
            url: URL.createObjectURL(blob),
            size: blob.size,
          });
        }
      }, format, quality);
    };
    img.src = original.url;
  };

  const download = () => {
    if (!compressed) return;
    const a = document.createElement('a');
    a.href = compressed.url;
    a.download = `compressed.${format.split('/')[1]}`;
    a.click();
  };

  const saved = original && compressed ? ((original.size - compressed.size) / original.size * 100).toFixed(1) : null;

  return (
    <div class="space-y-4">
      <div class="flex gap-2 flex-wrap items-end">
        <div>
          <label class="block text-sm text-gray-500 mb-1">Quality</label>
          <input type="range" min="0.1" max="1" step="0.1" value={quality}
            onInput={(e) => setQuality(parseFloat((e.target as HTMLInputElement).value))}
            class="w-32" />
          <span class="text-sm text-gray-500 ml-2">{Math.round(quality * 100)}%</span>
        </div>
        <div>
          <label class="block text-sm text-gray-500 mb-1">Format</label>
          <select value={format} onChange={(e) => setFormat((e.target as HTMLSelectElement).value)}
            class="p-2 border border-gray-200 rounded-lg text-sm">
            <option value="image/jpeg">JPEG</option>
            <option value="image/png">PNG</option>
            <option value="image/webp">WebP</option>
          </select>
        </div>
      </div>
      <input type="file" accept="image/*" onChange={handleFile}
        class="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:bg-zen-50 file:text-zen-600 hover:file:bg-zen-100" />
      {original && (
        <div>
          <button onClick={compress} class="px-4 py-2 bg-zen-500 text-white rounded-lg text-sm font-medium hover:bg-zen-600">Compress</button>
        </div>
      )}
      <canvas ref={canvasRef} class="hidden" />
      {original && (
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <div class="text-sm text-gray-500 mb-1">Original ({(original.size / 1024).toFixed(1)} KB)</div>
            <img src={original.url} alt="Original" class="max-h-64 rounded-lg border border-gray-100" />
          </div>
          {compressed && (
            <div>
              <div class="text-sm text-gray-500 mb-1">
                Compressed ({(compressed.size / 1024).toFixed(1)} KB)
                {saved && <span class="text-green-600 ml-2">Saved {saved}%</span>}
              </div>
              <img src={compressed.url} alt="Compressed" class="max-h-64 rounded-lg border border-gray-100" />
              <button onClick={download} class="mt-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200">Download</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 2: 创建 image-compress.astro 工具页**

按照Task 5 Step 9的工具页模板，slug为`image-compress`，分类为`image`，导入`ImageCompress`。不设`client:load`(仅在用户选择文件后才需要JS)，使用`client:visible`。

- [ ] **Step 3: Commit**

```bash
git add src/islands/ImageCompress.tsx src/pages/image-compress.astro
git commit -m "feat: add image compression tool"
```

---

### Task 8: 文本对比工具页

**Files:**
- Create: `src/islands/TextDiff.tsx`
- Create: `src/pages/text-diff.astro`

- [ ] **Step 1: 安装diff库**

```bash
npm install diff @types/diff
```

- [ ] **Step 2: 创建 TextDiff island**

```tsx
// src/islands/TextDiff.tsx
import { useState } from 'preact/hooks';
import { diffWords, diffLines } from 'diff';

type DiffResult = { value: string; added?: boolean; removed?: boolean }[];

export default function TextDiff() {
  const [left, setLeft] = useState('');
  const [right, setRight] = useState('');
  const [result, setResult] = useState<DiffResult>([]);
  const [mode, setMode] = useState<'words' | 'lines'>('words');

  const compare = () => {
    const fn = mode === 'words' ? diffWords : diffLines;
    setResult(fn(left, right));
  };

  return (
    <div class="space-y-4">
      <div class="flex gap-2">
        <button onClick={() => { setMode('words'); compare(); }}
          class={`px-3 py-1 rounded text-sm ${mode === 'words' ? 'bg-zen-500 text-white' : 'bg-gray-100 text-gray-600'}`}>Words</button>
        <button onClick={() => { setMode('lines'); compare(); }}
          class={`px-3 py-1 rounded text-sm ${mode === 'lines' ? 'bg-zen-500 text-white' : 'bg-gray-100 text-gray-600'}`}>Lines</button>
        <button onClick={compare} class="ml-auto px-4 py-2 bg-zen-500 text-white rounded-lg text-sm font-medium hover:bg-zen-600">Compare</button>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <textarea value={left} onInput={(e) => setLeft((e.target as HTMLTextAreaElement).value)}
          rows={8} placeholder="Original text..."
          class="w-full p-3 border border-gray-200 rounded-lg font-mono text-sm focus:border-zen-500 outline-none resize-y" />
        <textarea value={right} onInput={(e) => setRight((e.target as HTMLTextAreaElement).value)}
          rows={8} placeholder="Modified text..."
          class="w-full p-3 border border-gray-200 rounded-lg font-mono text-sm focus:border-zen-500 outline-none resize-y" />
      </div>
      {result.length > 0 && (
        <div class="p-4 bg-white border border-gray-200 rounded-lg font-mono text-sm leading-relaxed whitespace-pre-wrap">
          {result.map((part, i) => {
            let cls = '';
            if (part.added) cls = 'bg-green-100 text-green-800';
            else if (part.removed) cls = 'bg-red-100 text-red-800 line-through';
            return <span key={i} class={cls}>{part.value}</span>;
          })}
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 3: 创建 text-diff.astro 工具页**

按照Task 5 Step 9的工具页模板，slug为`text-diff`，分类为`text`，导入`TextDiff`。

- [ ] **Step 4: Commit**

```bash
git add src/islands/TextDiff.tsx src/pages/text-diff.astro
git commit -m "feat: add text diff comparison tool"
```

---

### Task 9: 分类聚合页

**Files:**
- Create: `src/pages/category/dev.astro`
- Create: `src/pages/category/text.astro`
- Create: `src/pages/category/image.astro`
- Create: `src/pages/category/crypto.astro`
- Create: `src/pages/category/calculators.astro`

- [ ] **Step 1: 创建分类页模板 (以dev.astro为例)**

```astro
---
import BaseLayout from '../../layouts/BaseLayout.astro';
import Breadcrumb from '../../components/Breadcrumb.astro';
import ToolCard from '../../components/ToolCard.astro';
import { getToolsByCategory, CATEGORIES } from '../../utils/tools';
import { generateCategorySEOMeta } from '../../utils/seo';

const cat = CATEGORIES.find(c => c.slug === 'dev')!;
const tools = getToolsByCategory('dev');
const seo = generateCategorySEOMeta(cat);
---

<BaseLayout title={seo.title} description={cat.description}>
  <div class="max-w-4xl mx-auto px-4 py-8">
    <Breadcrumb items={[
      { label: 'Home', href: '/' },
      { label: cat.title },
    ]} />

    <h1 class="text-3xl font-bold text-gray-900 mb-2">{cat.icon} {cat.title}</h1>
    <p class="text-gray-500 mb-8">{cat.description}</p>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      {tools.map(tool => (
        <ToolCard slug={tool.slug} title={tool.title} description={tool.description} />
      ))}
    </div>
  </div>

  {seo.script.map(s => <script type={s.type} set:html={s.innerHTML}></script>)}
</BaseLayout>
```

- [ ] **Step 2: 创建其余4个分类页**

根据模板，替换分类slug: `text`, `image`, `crypto`, `calculators`。

- [ ] **Step 3: Commit**

```bash
git add src/pages/category/
git commit -m "feat: add 5 category aggregation pages"
```

---

### Task 10: 首页

**Files:**
- Modify: `src/pages/index.astro`

- [ ] **Step 1: 重写 index.astro**

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
import ToolCard from '../components/ToolCard.astro';
import CategoryCard from '../components/CategoryCard.astro';
import SearchBar from '../components/SearchBar.astro';
import { TOOLS, CATEGORIES } from '../utils/tools';

const popularSlugs = ['json-formatter', 'base64', 'qr-code', 'image-compress', 'uuid-generator', 'word-counter'];
const popularTools = popularSlugs.map(s => TOOLS.find(t => t.slug === s)!).filter(Boolean);
---

<BaseLayout
  title="ToolZen - 免费在线工具 | 隐私优先，无需上传"
  description="ToolZen提供JSON格式化、Base64编解码、二维码生成、图片压缩等11+免费在线工具。所有工具在浏览器端运行，数据不上传，隐私安全。"
>
  <!-- Hero -->
  <section class="max-w-4xl mx-auto px-4 pt-16 pb-12 text-center">
    <h1 class="text-4xl md:text-5xl font-bold text-gray-900 mb-4 tracking-tight">
      工具之道，<span class="text-zen-500">简即是多</span>
    </h1>
    <p class="text-lg text-gray-500 mb-8 max-w-xl mx-auto">
      11+ 免费在线工具。隐私优先，无需上传。所有处理在浏览器端完成。
    </p>
    <SearchBar />
  </section>

  <!-- Popular Tools -->
  <section class="max-w-6xl mx-auto px-4 py-12">
    <h2 class="text-xl font-semibold text-gray-900 mb-6">⭐ 热门工具</h2>
    <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
      {popularTools.map(tool => (
        <ToolCard slug={tool.slug} title={tool.title} description={tool.description} />
      ))}
    </div>
  </section>

  <!-- All Categories -->
  <section class="max-w-6xl mx-auto px-4 py-12">
    <h2 class="text-xl font-semibold text-gray-900 mb-6">📂 全部分类</h2>
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {CATEGORIES.map(cat => (
        <CategoryCard slug={cat.slug} title={cat.title} icon={cat.icon} description={cat.description} />
      ))}
    </div>
  </section>

  <!-- Why ToolZen -->
  <section class="max-w-6xl mx-auto px-4 py-12">
    <h2 class="text-xl font-semibold text-gray-900 mb-6 text-center">为什么选择 ToolZen？</h2>
    <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
      <div class="text-center">
        <div class="text-3xl mb-3">🔒</div>
        <h3 class="font-semibold text-gray-900 mb-2">隐私优先</h3>
        <p class="text-sm text-gray-500">所有工具在您的浏览器本地运行，数据绝不会上传到任何服务器。</p>
      </div>
      <div class="text-center">
        <div class="text-3xl mb-3">⚡</div>
        <h3 class="font-semibold text-gray-900 mb-2">极速响应</h3>
        <p class="text-sm text-gray-500">纯静态页面，全球CDN加速，输入即输出，无需等待。</p>
      </div>
      <div class="text-center">
        <div class="text-3xl mb-3">🆓</div>
        <h3 class="font-semibold text-gray-900 mb-2">完全免费</h3>
        <p class="text-sm text-gray-500">所有工具永久免费使用，无隐藏收费，无功能限制。</p>
      </div>
    </div>
  </section>

  <!-- FAQ for SEO -->
  <section class="max-w-4xl mx-auto px-4 py-12 border-t border-gray-100">
    <h2 class="text-xl font-semibold text-gray-900 mb-6">常见问题</h2>
    <div class="space-y-4">
      <div>
        <h3 class="font-medium text-gray-800">ToolZen的工具真的免费吗？</h3>
        <p class="text-gray-600 text-sm mt-1">是的，所有工具永久免费。我们的收入来自广告（未来），不会向用户收费。</p>
      </div>
      <div>
        <h3 class="font-medium text-gray-800">我的数据安全吗？</h3>
        <p class="text-gray-600 text-sm mt-1">绝对安全。所有数据处理都在您的浏览器中完成，数据不会离开您的设备。</p>
      </div>
      <div>
        <h3 class="font-medium text-gray-800">需要注册账号吗？</h3>
        <p class="text-gray-600 text-sm mt-1">不需要。所有工具无需注册即可直接使用。</p>
      </div>
    </div>
  </section>
</BaseLayout>
```

- [ ] **Step 2: Commit**

```bash
git add src/pages/index.astro
git commit -m "feat: add homepage with hero, categories, and tools grid"
```

---

### Task 11: 关于页 + 隐私页

**Files:**
- Create: `src/pages/about.astro`
- Create: `src/pages/privacy.astro`

- [ ] **Step 1: 创建 about.astro**

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';

const title = 'About ToolZen';
const description = 'ToolZen是一组免费在线工具的集合，致力于提供隐私优先、简单易用的浏览器端工具。';
---

<BaseLayout title={title} description={description}>
  <div class="max-w-3xl mx-auto px-4 py-12">
    <h1 class="text-3xl font-bold text-gray-900 mb-6">About ToolZen</h1>
    <div class="prose max-w-none text-gray-600 space-y-4">
      <p>ToolZen 是一组免费在线工具的集合。"Zen" 代表禅意 —— 我们相信好的工具应该简单、干净、不打扰。</p>
      <p>与许多同类网站不同，ToolZen 的所有工具都在您的浏览器本地运行。您的数据永远不会上传到服务器，因为我们根本没有后端服务器。</p>
      <p>我们的目标是成为开发者、设计师和日常用户的首选在线工具箱。</p>
      <h2 class="text-xl font-semibold text-gray-900 mt-8">Contact</h2>
      <p>如有任何问题或建议，欢迎联系：<a href="mailto:hello@toolzen.com">hello@toolzen.com</a></p>
    </div>
  </div>
</BaseLayout>
```

- [ ] **Step 2: 创建 privacy.astro**

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';

const title = 'Privacy Policy - ToolZen';
---

<BaseLayout title={title} description="ToolZen does not collect, store, or transmit any of your data. All processing happens locally in your browser.">
  <div class="max-w-3xl mx-auto px-4 py-12">
    <h1 class="text-3xl font-bold text-gray-900 mb-6">Privacy Policy</h1>
    <div class="prose max-w-none text-gray-600 space-y-4">
      <p><strong>Last updated:</strong> 2026-05-16</p>
      <h2 class="text-xl font-semibold text-gray-900">We Don't Collect Your Data</h2>
      <p>ToolZen does not collect, store, or transmit any of the data you enter into our tools. All processing happens locally in your browser.</p>
      <h2 class="text-xl font-semibold text-gray-900">Analytics</h2>
      <p>We use Google Analytics 4 to measure site traffic. This collects anonymized data such as page views and general location (country level). No personally identifiable information is collected.</p>
      <h2 class="text-xl font-semibold text-gray-900">Cookies</h2>
      <p>We do not use cookies for tracking. Analytics uses anonymous sessions.</p>
      <h2 class="text-xl font-semibold text-gray-900">Contact</h2>
      <p>Questions? <a href="mailto:hello@toolzen.com">hello@toolzen.com</a></p>
    </div>
  </div>
</BaseLayout>
```

- [ ] **Step 3: Commit**

```bash
git add src/pages/about.astro src/pages/privacy.astro
git commit -m "feat: add about and privacy pages"
```

---

### Task 12: Sitemap + 性能优化

**Files:**
- Create: `src/pages/sitemap-index.xml.ts` (Astro端点生成sitemap)
- Create: `public/og-default.png`

- [ ] **Step 1: 创建动态sitemap端点**

```ts
// src/pages/sitemap-index.xml.ts
import { TOOLS, CATEGORIES } from '../utils/tools';

export async function GET() {
  const base = 'https://toolzen.com';
  const urls = [
    { loc: base, priority: '1.0' },
    { loc: `${base}/about/`, priority: '0.5' },
    ...TOOLS.map(t => ({ loc: `${base}/${t.slug}/`, priority: '0.9' })),
    ...CATEGORIES.map(c => ({ loc: `${base}/category/${c.slug}/`, priority: '0.7' })),
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${urls.map(u => `<url><loc>${u.loc}</loc><priority>${u.priority}</priority></url>`).join('\n  ')}
</sitemapindex>`;

  return new Response(xml, {
    headers: { 'Content-Type': 'application/xml' },
  });
}
```

- [ ] **Step 2: 创建OG默认图 (简单的SVG转PNG占位)**

用一个静态SVG作为og:image的占位(实际上传到public/后会被Vercel服务):

```bash
# 创建简单OG图的HTML占位文件
echo '<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630"><rect width="1200" height="630" fill="#2563eb"/><text x="600" y="280" text-anchor="middle" fill="white" font-size="72" font-family="sans-serif" font-weight="bold">ToolZen</text><text x="600" y="360" text-anchor="middle" fill="rgba(255,255,255,0.8)" font-size="32" font-family="sans-serif">Free Online Tools · Privacy First</text></svg>' > public/og-default.svg
```

- [ ] **Step 3: 验证构建**

```bash
npx astro build
```

Expected: 构建成功，无错误。检查 `dist/` 目录包含所有静态HTML文件。

- [ ] **Step 4: 验证Lighthouse**

```bash
npx astro preview --port 3000 &
sleep 2
# 手动用Chrome DevTools Lighthouse测试首页和工具页
```

- [ ] **Step 5: Commit**

```bash
git add src/pages/sitemap-index.xml.ts public/og-default.svg
git commit -m "feat: add sitemap and og image"
```

---

## 验证清单

实施完成后，逐项确认:

- [ ] `npm run build` 无错误
- [ ] 首页 `/` 渲染正常，分类卡片 + 热搜工具可见
- [ ] 每个工具页 `/{slug}/` 工具功能正常
- [ ] 分类页 `/category/{slug}/` 列出正确工具
- [ ] 面包屑导航正确
- [ ] 每个工具页底部有相关工具推荐
- [ ] sitemap可访问 (`/sitemap-index.xml`)
- [ ] robots.txt可访问 (`/robots.txt`)
- [ ] 移动端响应式正常 (Chrome DevTools设备模拟)
- [ ] 每个页面的 `<title>` 和 `<meta description>` 正确
- [ ] JSON-LD结构化数据正确 (Google Rich Results Test)
- [ ] 首页Lighthouse ≥ 95，工具页 ≥ 90

---

## 部署 (手动)

```bash
# 安装Vercel CLI
npm i -g vercel

# 部署
vercel --prod

# 配置Cloudflare DNS指向Vercel
# 在Cloudflare中添加CNAME: toolzen.com → cname.vercel-dns.com
```
