# ToolZen i18n Design: Chinese & English Support

## Overview

Add bilingual support to ToolZen with automatic language detection, serving Chinese and English versions under path-prefixed URLs.

## URL Strategy

| Route | Language |
|---|---|
| `/` | Auto-detect → 302 redirect to `/zh/` or `/en/` |
| `/zh/` | Chinese home |
| `/en/` | English home |
| `/zh/<slug>/` | Chinese tool page |
| `/en/<slug>/` | English tool page |
| `/zh/category/<slug>/` | Chinese category page |
| `/en/category/<slug>/` | English category page |
| `/zh/about/`, `/zh/privacy/` | Chinese static pages |
| `/en/about/`, `/en/privacy/` | English static pages |

### Language Detection

- Read `Accept-Language` header on first visit to `/`
- `zh` prefix or Chinese-preferred browser → `/zh/`
- Everything else → `/en/`
- Language switcher click sets a cookie so return visits respect the choice (cookie overrides header)

## Translation Data Architecture

Single-source dictionaries under `src/i18n/`:

```
src/i18n/
  index.ts       → detectLanguage(), getLangFromPath(), type exports
  zh.ts          → Chinese dictionary
  en.ts          → English dictionary
  ui.ts          → TranslationKey type, createTranslator()
```

### Dictionary structure

Top-level namespaces aligned with pages/components:

- `site` — site name, tagline
- `home` — hero, features, FAQ on index page
- `nav` — header navigation labels, search placeholder
- `footer` — copyright, about/privacy/contact links
- `categories` — category titles, descriptions
- `tools` — each tool's title, description, keywords, flow text (how-to, FAQ)
- `about` — about page content
- `privacy` — privacy page content
- `seo` — fallback OG/sitemap strings

### Type safety

A single `TranslationDict` interface from `ui.ts` ensures both `zh.ts` and `en.ts` export identical keys. TypeScript errors if either file is missing a key.

## How Pages Get Translations

### Astro pages (.astro)

```astro
---
const lang = getLangFromPath(Astro.url.pathname); // 'zh' | 'en'
const t = createTranslator(lang);
---
<BaseLayout lang={lang} title={t.seo.homeTitle} description={t.seo.homeDesc}>
  <h1>{t.home.hero}</h1>
</BaseLayout>
```

### Preact Islands (.tsx)

A `useLanguage()` hook reads `document.documentElement.lang`, imports the matching dictionary, and returns the translator. No prop drilling needed.

```tsx
const { t } = useLanguage();
<button>{t.tools.jsonFormatter.format}</button>
```

### Components (.astro)

Receive `lang` as a prop from the parent page, construct translator inline.

## Language Switcher

- Placed in `Header.astro` (right side, before search icon)
- Shows the other language: on `/zh/*` pages shows "EN", on `/en/*` pages shows "中文"
- Navigates directly to the equivalent path in the other language
- Sets cookie `lang=zh|en` with 1-year expiry

## SEO

### hreflang tags

BaseLayout outputs `<link rel="alternate" hreflang="...">` for every page, pointing to its counterpart in the other language.

### Sitemap

`sitemap-index.xml.ts` generates entries for both languages, with `xhtml:link` alternates per URL.

### OG & JSON-LD

All meta content (title, description, structured data) uses the active language's dictionary.

## Page Routing (Astro Dynamic Route)

All pages move under `src/pages/[lang]/` with `getStaticPaths()` generating both language variants. No file duplication — each page file produces both `/zh/...` and `/en/...` at build time.

```
src/pages/
  index.astro                    → root redirect (JS-based, detects navigator.language)
  sitemap-index.xml.ts           → lists all zh + en URLs
  [lang]/
    index.astro                  → home page
    about.astro                  → about page
    privacy.astro                → privacy page
    json-formatter.astro         → tool page
    base64.astro                 → tool page
    ... (all 15 tools)
    category/
      [cat].astro                → category page (5 categories)
```

Each page's `getStaticPaths()`:
```ts
export function getStaticPaths() {
  return [{ params: { lang: 'zh' } }, { params: { lang: 'en' } }];
}
```

## Root Redirect

`src/pages/index.astro` outputs a minimal HTML page that:
1. Checks for `lang` cookie (set by language switcher)
2. Falls back to `navigator.language` detection
3. Redirects via `window.location.replace()` to `/zh/` or `/en/`

## Build Output

```
dist/
  zh/
    index.html
    about/index.html
    privacy/index.html
    json-formatter/index.html
    base64/index.html
    ... (all 15 tools)
    category/dev/index.html
    ... (all 5 categories)
  en/
    (mirror structure)
  index.html                  → redirect page
  sitemap-index.xml
```

## Scope

- **In scope**: All 15 tools, 5 categories, home, about, privacy. Header, footer, search, breadcrumbs, related tools. All SEO metadata.
- **Out of scope**: RTL languages, more than 2 languages, dynamic content translation.

## Implementation Order

1. Create `src/i18n/` dictionary files and type system
2. Move pages to `src/pages/[lang]/` with `getStaticPaths()`, add root redirect
3. Update `BaseLayout` for lang, hreflang, and translation injection
4. Update all Astro components (Header, Footer, Breadcrumb, ToolCard, etc.) to accept translations
5. Add `useLanguage()` hook for Preact islands
6. Add language switcher to Header
7. Update sitemap for bilingual URLs
8. Verify build output and SEO tags
