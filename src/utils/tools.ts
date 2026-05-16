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
