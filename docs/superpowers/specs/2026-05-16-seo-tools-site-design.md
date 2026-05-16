# SEO工具站设计规格

## 目标

构建一个SEO驱动的在线工具网站，通过Google AdSense实现被动收入。主攻浏览器端工具 + 利基计算器，利用长尾关键词获取免费搜索流量。

## 技术决策

- **框架**: Astro (静态站点生成，零JS默认输出)
- **托管**: Vercel (免费层) + Cloudflare (CDN/DNS)
- **样式**: 极简白底 + 蓝色(#2563eb)渐变点缀
- **交互**: 工具页使用Preact/React岛 (仅在有交互需求的页面加载JS)
- **分析**: Google Search Console + Google Analytics 4 + PostHog (可选)

## 站点架构

### 页面层级

```
/                         首页 (分类网格 + Hero搜索)
/json-formatter/          JSON格式化/验证器
/base64/                  Base64编解码
/uuid-generator/          UUID/ULID生成器
/qr-code/                 二维码生成器
/image-compress/          图片压缩
/text-diff/               文本Diff对比
/word-counter/            字数统计
/regex-tester/            正则表达式测试器
/color-picker/            颜色选择器
/md5-hash/                MD5/SHA哈希生成
/url-encode/              URL编解码
/category/json/           分类聚合页 - JSON工具
/category/text/           分类聚合页 - 文本工具
/category/image/          分类聚合页 - 图片工具
/category/dev/            分类聚合页 - 开发者工具
/category/calculators/    分类聚合页 - 计算器
/blog/                    博客列表 (后续迭代)
/about/                   关于页 (E-E-A-T信号)
/sitemap.xml              XML站点地图
```

### 导航结构

- 全局顶栏: Logo | JSON工具 | 文本工具 | 图片工具 | 开发者工具 | 计算器 | 搜索按钮
- 面包屑: 首页 > 分类 > 工具名
- 底部: 相关工具推荐 (每个工具页3-5个内链)
- 页脚: 关于 | 隐私政策 | 联系 | ©2026

### 首页设计

```
┌─────────────────────────────────┐
│  Logo    导航分类    🔍搜索      │  全局顶栏
├─────────────────────────────────┤
│                                 │
│   🔧 免费在线工具集              │  Hero区
│   快速、隐私、无需上传            │
│   [🔍 搜索工具...              ] │  搜索栏
│                                 │
├─────────────────────────────────┤
│  ⭐ 热门工具                     │
│  ┌─────┐ ┌─────┐ ┌─────┐ ┌───┐│
│  │JSON │ │Base │ │QR   │ │图片││  横向卡片
│  │格式化│ │64   │ │生成 │ │压缩││
│  └─────┘ └─────┘ └─────┘ └───┘│
├─────────────────────────────────┤
│  📂 全部分类                     │
│  ┌────────┐ ┌────────┐ ┌─────┐ │
│  │📝 文本  │ │💻 开发  │ │🖼 图片││  分类网格
│  │工具(3) │ │工具(5) │ │工具(2)││
│  └────────┘ └────────┘ └─────┘ │
│  ┌────────┐ ┌────────┐         │
│  │🔢 计算  │ │🔐 编码  │         │
│  │器  (2) │ │工具(3) │         │
│  └────────┘ └────────┘         │
├─────────────────────────────────┤
│  页脚: 关于 | 隐私 | 联系        │
└─────────────────────────────────┘
```

## 工具实现原则

### 核心原则

1. **隐私优先**: 所有数据处理在浏览器端完成，文件不离开用户设备。这是关键差异化卖点，也是ChatGPT推荐此类工具的主要原因。
2. **零后端**: 无API调用、无数据库、无服务器。纯静态文件。
3. **即时响应**: 工具操作无加载延迟，输入即输出。
4. **独立页面**: 每个工具一个URL，独立SEO优化。

### 工具技术实现

| 工具 | 实现方式 | 复杂度 |
|------|---------|--------|
| JSON格式化/验证 | 纯JS (JSON.parse/stringify + 语法高亮) | 低 |
| Base64编解码 | 纯JS (btoa/atob + TextEncoder) | 低 |
| UUID生成器 | 纯JS (crypto.randomUUID) | 低 |
| 二维码生成 | qrcode.js库 (约30KB) | 低 |
| 图片压缩 | Canvas API (纯浏览器) | 中 |
| 文本Diff | diff.js库 | 中 |
| 字数统计 | 纯JS | 低 |
| 正则测试器 | 纯JS (RegExp + 高亮) | 低 |
| 颜色选择器 | 纯HTML/CSS/JS (input[type=color]) | 低 |
| MD5/SHA哈希 | Web Crypto API / 纯JS实现 | 低 |
| URL编解码 | 纯JS (encodeURIComponent) | 低 |
| 房贷计算器 | 纯JS公式计算 | 低 |

## SEO策略

### 每个工具页必须包含

- 唯一标题: `<title>免费在线XXX工具 - 无需上传 | 站名</title>`
- Meta描述: 包含"免费""在线""隐私""无需上传"等关键词
- H1: "在线XXX工具"
- H2: 工具介绍 + 使用说明 (200-300字，含长尾关键词)
- JSON-LD: WebApplication Schema结构化数据
- Open Graph: 社交媒体分享标签
- 面包屑: Schema标记
- 相关工具: 3-5个内链
- FAQ区: 3-5个问答 (目标Google People Also Ask)

### 技术SEO

- Astro自动生成sitemap.xml
- robots.txt
- 所有页面静态HTML (Astro SSG)
- 图片懒加载
- Core Web Vitals目标: 全部绿色 (LCP<2.5s, FID<100ms, CLS<0.1)
- 移动端优先响应式设计

### 关键词策略

每个工具页目标3-5个关键词变体:
- 主关键词: "在线XXX工具"
- 长尾: "免费XXX工具 无需上传"
- 意图词: "XXX格式化"/"XXX转换"/"在线XXX"

## 变现方案

### 第一阶段 (0-1万月访客)
- 不放置广告，专注用户体验和SEO排名
- 通过Google Search Console积累数据

### 第二阶段 (1-5万月访客)
- 申请Google AdSense
- 每个工具页1-2个广告位 (顶部横幅 + 侧边栏)
- 仅使用自动广告，不手动优化

### 第三阶段 (5万+月访客)
- 升级到Mediavine/Raptive (更高级的广告网络，RPM更高)
- 考虑赞助工具位 ($200-500/月/位)

## 性能目标

- 首页Lighthouse分数: 95+
- 工具页Lighthouse分数: 90+
- 首次加载JS总量: <50KB (每个工具页)
- 全部页面静态生成，无服务端渲染

## 后续迭代

### 模块2: 计算器 (第2个月)
- 房贷计算器、BMI计算器、SaaS ROI计算器

### 模块3: 程序化SEO (第3个月)
- "工具A vs 工具B"对比页
- 自动生成数百个对比页面

### 模块4: 博客 (第3个月)
- SEO教程、工具使用指南
- 内容驱动额外流量和反向链接

## 项目结构

```
/
├── public/
│   ├── favicon.ico
│   └── robots.txt
├── src/
│   ├── layouts/
│   │   └── BaseLayout.astro       # 全局布局 (顶栏+页脚+SEO标签)
│   ├── components/
│   │   ├── Header.astro           # 全局导航
│   │   ├── Footer.astro           # 页脚
│   │   ├── SearchBar.astro        # 搜索组件
│   │   ├── ToolCard.astro         # 工具卡片
│   │   ├── CategoryGrid.astro     # 分类网格
│   │   ├── RelatedTools.astro     # 相关工具推荐
│   │   ├── Breadcrumb.astro       # 面包屑
│   │   └── AdSlot.astro           # AdSense广告位 (后续)
│   ├── pages/
│   │   ├── index.astro            # 首页
│   │   ├── json-formatter.astro   # JSON格式化
│   │   ├── base64.astro           # Base64编解码
│   │   ├── uuid-generator.astro
│   │   ├── qr-code.astro
│   │   ├── image-compress.astro
│   │   ├── text-diff.astro
│   │   ├── word-counter.astro
│   │   ├── regex-tester.astro
│   │   ├── color-picker.astro
│   │   ├── md5-hash.astro
│   │   ├── url-encode.astro
│   │   ├── about.astro
│   │   └── category/
│   │       ├── json.astro
│   │       ├── text.astro
│   │       ├── image.astro
│   │       ├── dev.astro
│   │       └── calculators.astro
│   ├── islands/                   # Astro交互组件 (按需加载JS)
│   │   ├── JsonFormatter.tsx
│   │   ├── Base64Tool.tsx
│   │   ├── UuidGenerator.tsx
│   │   ├── QrCodeGenerator.tsx
│   │   ├── ImageCompress.tsx
│   │   ├── TextDiff.tsx
│   │   ├── WordCounter.tsx
│   │   ├── RegexTester.tsx
│   │   ├── ColorPicker.tsx
│   │   ├── HashGenerator.tsx
│   │   └── UrlEncoder.tsx
│   └── utils/
│       ├── seo.ts                  # SEO meta生成工具函数
│       └── tools.ts                # 工具元数据 (名称、路径、分类、描述)
├── astro.config.mjs
├── package.json
└── tsconfig.json
```

## 品牌

- **站名**: ToolZen
- **标语**: "工具之道，简即是多" / "Free Online Tools — Privacy First, Zero Upload"
- **域名**: toolzen.com (待购买；备选 toolzen.io / toolzen.dev)
- **品牌调性**: 禅意简洁，对抗SmallSEOTools的广告轰炸，建立"干净、专业、可信赖"的第一印象
