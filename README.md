# ToolZen

> The Zen of Tools — Less is More

**21 free online tools. Privacy-first. No uploads. All processing happens in your browser.**

[![Astro](https://img.shields.io/badge/Astro-6.3-FF5D01?logo=astro)](https://astro.build)
[![Preact](https://img.shields.io/badge/Preact-10.29-673AB8?logo=preact)](https://preactjs.com)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.3-06B6D4?logo=tailwindcss)](https://tailwindcss.com)
[![License](https://img.shields.io/badge/License-MIT-green)](./LICENSE)

## Live Site

**[tool-zen.com](https://tool-zen.com)** — Available in Chinese and English.

## Tools (21)

### Developer Tools
| Tool | Description |
|------|------------|
| **JSON Formatter** | Format, validate, and compress JSON with syntax highlighting |
| **Base64 Encoder/Decoder** | Encode/decode text and files to Base64, Unicode support |
| **UUID Generator** | Generate UUID v4 identifiers, batch support |
| **RegEx Tester** | Real-time regex match highlighting and testing |
| **Color Picker** | HEX, RGB, HSL conversion with eyedropper |
| **Unix Timestamp Converter** | Timestamp ↔ datetime, second and millisecond precision |

### Text Tools
| Tool | Description |
|------|------------|
| **Text Diff Checker** | Side-by-side and unified diff views, standard diff algorithm |
| **Word Counter** | Real-time character, word, line, and byte counting |
| **Case Converter** | Uppercase, lowercase, title case, simplified/traditional Chinese |

### Image Tools
| Tool | Description |
|------|------------|
| **QR Code Generator** | Custom colors and size, downloadable PNG |
| **Image Compressor** | PNG, JPEG, WebP compression, local processing |

### Crypto & Encoding
| Tool | Description |
|------|------------|
| **MD5 / SHA Hash Generator** | MD5, SHA-1, SHA-256 for text and files |
| **URL Encoder/Decoder** | encodeURI/decodeURI for URL special characters |
| **Password Generator** | crypto.getRandomValues(), customizable character types |

### Calculators
| Tool | Description |
|------|------------|
| **Mortgage Calculator** | Equal payment and equal principal, amortization schedule |
| **BMI Calculator** | WHO classification with health status |
| **Date Calculator** | Day counting, workdays, date math |
| **Timezone Converter** | IANA timezone support, DST aware |
| **Age Calculator** | Precise years/months/days, next birthday countdown |
| **Unit Converter** | 6 categories, 34 units, real-time conversion |

### Life Tools
| Tool | Description |
|------|------------|
| **Zodiac & Constellation Finder** | Chinese zodiac animal and Western constellation |

## Why ToolZen?

- **Privacy First** — All tools run locally in your browser. Your data never leaves your device. No backend servers.
- **Blazing Fast** — Pure static site on Cloudflare Pages global CDN. Instant results.
- **Completely Free** — All 21 tools are free forever. No registration, no feature limits.

## Tech Stack

- [Astro 6](https://astro.build) — static site generation
- [Preact](https://preactjs.com) — lightweight UI components (islands architecture)
- [Tailwind CSS 4](https://tailwindcss.com) — utility-first CSS
- [Cloudflare Pages](https://pages.cloudflare.com) — hosting, CDN, and auto-deploy

## Getting Started

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build      # outputs to dist/
```

Deploy `dist/` to any static hosting. Connected to Cloudflare Pages via GitHub for auto-deploy on push.

## Project Structure

```
src/
  components/    # Shared Astro components (Header, Footer, Breadcrumb, etc.)
  content/       # Blog articles (Markdown via Content Collections)
  islands/       # Interactive Preact components (one per tool)
  i18n/          # Chinese/English translations
  layouts/       # Base HTML layout
  pages/         # Astro pages with [lang] routing
  utils/         # Tool registry, SEO helpers
public/          # Static files (favicon, robots.txt, llms.txt, verification)
```

## License

MIT — see [LICENSE](./LICENSE) for details.
