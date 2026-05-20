# PDF Tools Implementation Plan

> **For agentic workers:** Use superpowers:subagent-driven-development to implement task-by-task.

**Goal:** Add 3 PDF tools (merge, split, compress) to ToolZen as a new "PDF 工具" category.

**Architecture:** Each tool = 1 Astro page + 1 Preact island component. Shared PDF processing uses pdf-lib (modify/save) and pdfjs-dist (render thumbnails). JSZip bundles split pages. All 100% client-side.

**Tech Stack:** pdf-lib@1.17.1, pdfjs-dist (for thumbnails), jszip (for split downloads), Preact + TypeScript islands

---

### Task 1: Install npm dependencies

**Files:**
- Modify: `package.json`

- [ ] **Step 1: Install pdf-lib, jszip**

```bash
npm install pdf-lib jszip
```

No pdfjs-dist needed initially — only the split tool uses it for thumbnails, and we can lazy-load it.

- [ ] **Step 2: Commit**

```bash
git add package.json package-lock.json
git commit -m "chore: add pdf-lib and jszip for PDF tools"
```

---

### Task 2: Register pdf category and tools in tools.ts

**Files:**
- Modify: `src/utils/tools.ts:3-5` (add 'pdf' to category union)
- Modify: `src/utils/tools.ts:17-24` (add pdf category)
- Modify: `src/utils/tools.ts:195-` (add 3 tools to TOOLS array)

- [ ] **Step 1: Add 'pdf' to category type**

```typescript
// Line 5: change
category: 'dev' | 'text' | 'image' | 'crypto' | 'calculators' | 'life';
// to
category: 'dev' | 'text' | 'image' | 'crypto' | 'calculators' | 'life' | 'pdf';
```

- [ ] **Step 2: Add pdf category**

```typescript
// After line 23 (life category), add:
{ slug: 'pdf', title: 'PDF 工具', icon: '📄', description: 'PDF合并、拆分、压缩，所有处理在浏览器端完成' },
```

- [ ] **Step 3: Add 3 tools**

```typescript
// After the last tool, add:
{
  slug: 'pdf-merge',
  title: 'PDF 合并',
  description: '在线PDF合并工具。将多个PDF文件合并为一个，支持拖拽排序，所有处理在浏览器端完成。',
  category: 'pdf',
  keywords: ['PDF合并', '合并PDF', '在线PDF合并', 'PDF拼接', 'Merge PDF'],
  complexity: 'low',
},
{
  slug: 'pdf-split',
  title: 'PDF 拆分',
  description: '在线PDF拆分工具。按页面范围或每N页拆分PDF，支持预览缩略图，所有处理在浏览器端完成。',
  category: 'pdf',
  keywords: ['PDF拆分', '拆分PDF', '在线PDF拆分', 'PDF分割', 'Split PDF'],
  complexity: 'medium',
},
{
  slug: 'pdf-compress',
  title: 'PDF 压缩',
  description: '在线PDF压缩工具。减少PDF文件体积，支持多种压缩等级，压缩过程在浏览器本地完成，保护隐私。',
  category: 'pdf',
  keywords: ['PDF压缩', '压缩PDF', '在线PDF压缩', 'PDF瘦身', 'Compress PDF'],
  complexity: 'low',
},
```

- [ ] **Step 4: Commit**

---

### Task 3: Add i18n translations

**Files:**
- Modify: `src/i18n/ui.ts` — add `pdf` to CategoryMeta type (no change needed, it's `Record<string, CategoryMeta>`)
- Modify: `src/i18n/ui.ts` — add UI strings for PDF tools (selectFiles, mergeBtn, pageRange, compressLevel, etc.)
- Modify: `src/i18n/zh.ts` — Chinese translations
- Modify: `src/i18n/en.ts` — English translations

- [ ] **Step 1: Add UI dict fields to `ui.ts`**

After `compressImage` line in UIDict, add:
```typescript
// PDF tools
selectFiles: string; merge: string; addFiles: string;
splitMode: string; splitByRange: string; splitByCount: string;
everyPages: string; pages: string; downloadZip: string;
compressLevel: string; basic: string; standard: string; extreme: string;
originalSize: string; compressedSize: string; compressionRatio: string;
```

- [ ] **Step 2: Add zh.ts translations**

In `ui:` section of zh.ts:
```typescript
// PDF
selectFiles: '选择 PDF 文件', merge: '合并', addFiles: '添加文件',
splitMode: '拆分方式', splitByRange: '按页面范围', splitByCount: '每 N 页拆一个',
everyPages: '页', pages: '页', downloadZip: '下载 ZIP',
compressLevel: '压缩等级', basic: '基础', standard: '标准', extreme: '极限',
originalSize: '原始大小', compressedSize: '压缩后', compressionRatio: '压缩率',
```

In `categories:` section:
```typescript
pdf: { title: 'PDF 工具', description: 'PDF合并、拆分、压缩等文档处理工具' },
```

In `tools:` section, add 3 tool entries following existing pattern (title, description, keywords, howToTitle, howTo, faq).

- [ ] **Step 3: Add en.ts translations** (same structure, English values)

- [ ] **Step 4: Commit**

---

### Task 4: Create PdfMerge tool

**Files:**
- Create: `src/islands/PdfMerge.tsx`
- Create: `src/pages/[lang]/pdf-merge.astro`

The island component:
- File input that accepts multiple `.pdf` files
- List of added files with remove button and drag-to-reorder
- "Merge" button that uses pdf-lib to combine all PDFs
- Download button for the merged result

**Key code pattern:**
```tsx
import { PDFDocument } from 'pdf-lib';

async function mergePDFs(files: File[]): Promise<Uint8Array> {
  const merged = await PDFDocument.create();
  for (const file of files) {
    const pdf = await PDFDocument.load(await file.arrayBuffer());
    const pages = await merged.copyPages(pdf, pdf.getPageIndices());
    pages.forEach(p => merged.addPage(p));
  }
  return await merged.save();
}
```

The page file follows the pattern of `image-compress.astro` with PdfMerge island.

- [ ] **Step 5: Commit**

---

### Task 5: Create PdfSplit tool

**Files:**
- Create: `src/islands/PdfSplit.tsx`
- Create: `src/pages/[lang]/pdf-split.astro`

The island component:
- File input for a single PDF
- Render page thumbnails using pdfjs-dist (lazy loaded)
- Split mode selector: "by page range" or "every N pages"
- "Split" button extracts selected pages into individual PDFs
- Package results as ZIP using JSZip and trigger download

**Key code pattern (JSZip):**
```tsx
import JSZip from 'jszip';

const zip = new JSZip();
splitResults.forEach((pdfBytes, i) => {
  zip.file(`page_${i + 1}.pdf`, pdfBytes);
});
const blob = await zip.generateAsync({ type: 'blob' });
// trigger download
```

- [ ] **Step 6: Commit**

---

### Task 6: Create PdfCompress tool

**Files:**
- Create: `src/islands/PdfCompress.tsx`
- Create: `src/pages/[lang]/pdf-compress.astro`

The island component:
- File input for a single PDF
- Show original file size
- Compression level selector: basic (remove redundant objects), standard (recompress images via Canvas), extreme (aggressive image recompression)
- "Compress" button
- Show compressed size + compression ratio
- Download button

**Compression approach:**
- Basic: `pdf.save()` — pdf-lib auto-cleans redundant objects (~20-40% reduction)
- Standard: Extract embedded images → recompress via Canvas API → re-embed
- Extreme: Standard + reduce image quality to 60%

- [ ] **Step 7: Commit**

---

### Task 7: Update sitemap and verify build

**Files:**
- Modify: `src/pages/sitemap-index.xml.ts` — add 3 new PDF tool URLs

- [ ] **Step 1: Add PDF tool URLs to sitemap**

- [ ] **Step 2: Run `npx astro build` and fix any errors**

- [ ] **Step 3: Run `npx astro check` and fix type errors**

- [ ] **Step 4: Commit and push**

---

### Task 8: Update PROGRESS.md

Add a new entry to `PROGRESS.md` documenting these PDF tools.
