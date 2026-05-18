# ToolZen Exposure Optimization — Design Doc

> 2026-05-18 | Status: Approved

## Goal

Boost organic search traffic (Google) and AI recommendation probability through three simultaneous tracks: structured data enhancement, content marketing via blog, and AI corpus presence via GitHub.

## 1. HowTo Structured Data

Add `HowTo` JSON-LD Schema to all 21 tool pages. Each tool already has `howTo` text in i18n.

**Schema structure per tool:**
```json
{
  "@type": "HowTo",
  "name": "如何使用<工具名>",
  "description": "<howTo from i18n>",
  "step": [
    { "@type": "HowToStep", "name": "输入", "text": "输入或粘贴要处理的文本/数据" },
    { "@type": "HowToStep", "name": "设置", "text": "根据需要调整参数选项" },
    { "@type": "HowToStep", "name": "执行", "text": "点击执行按钮获取结果" },
    { "@type": "HowToStep", "name": "复制", "text": "一键复制或下载结果" }
  ]
}
```

**Files**: 21 `.astro` pages under `src/pages/[lang]/`

**SEO benefit**: HowTo rich results in Google SERP, higher CTR, AI models extract procedural knowledge.

## 2. Blog Section

**Tech**: Astro Content Collections. Markdown files in `src/content/blog/`, auto-generated pages.

**Routes**:
- `/zh/blog/` — blog index (zh)
- `/zh/blog/{slug}/` — article detail (zh)
- `/en/blog/` — blog index (en)
- `/en/blog/{slug}/` — article detail (en)
- `/blog/` — language redirect

**Content Collection config** (`src/content/config.ts`):
```typescript
import { defineCollection, z } from 'astro:content';
const blog = defineCollection({
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.date(),
    tags: z.array(z.string()),
  }),
});
export const collections = { blog };
```

**Files created**:
- `src/content/config.ts`
- `src/content/blog/zh/<5 articles>.md`
- `src/pages/[lang]/blog/index.astro`
- `src/pages/[lang]/blog/[...slug].astro`
- `src/pages/blog.astro` — lang redirect

**5 initial articles** (Chinese, ~800 words each):

| # | Title | Target KW | Leads to |
|---|-------|-----------|----------|
| 1 | 开发者必备的10个在线工具 | 开发者在线工具 | JSON, Base64, UUID, RegEx, Color |
| 2 | JSON格式化怎么用？5个实用场景 | JSON格式化 | json-formatter |
| 3 | 选等额本息还是等额本金？ | 房贷计算器 | mortgage-calculator |
| 4 | 你的密码够安全吗？强密码指南 | 密码生成器 密码安全 | password-generator |
| 5 | 在线图片压缩完全指南 | 图片压缩 在线压缩 | image-compress |

**Blog features**:
- Breadcrumbs on each article page
- BlogPosting JSON-LD Schema
- Previous/next article navigation
- Related tools sidebar on article pages
- RSS feed (`/rss.xml`)

## 3. GitHub + AI Corpus

**README.md** enhancements:
- English-first with Chinese section
- Full tool list table (21 tools × 6 categories)
- Privacy-first selling point
- Tech stack badges
- Deploy on Cloudflare Pages button

**LICENSE**: MIT

**llms-full.txt** update: add detailed per-tool descriptions (existing file has brief ones).

## 4. Non-goals
- No CMS integration (static markdown only)
- No comments system
- No email newsletter
- No ad placement (yet)
