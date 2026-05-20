export interface Tool {
  slug: string;
  title: string;
  description: string;
  category: 'dev' | 'text' | 'image' | 'crypto' | 'calculators' | 'life' | 'pdf';
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
  { slug: 'life', title: '生活工具', icon: '🌟', description: '生肖星座、年龄查询等生活实用工具' },
  { slug: 'pdf', title: 'PDF 工具', icon: '📄', description: 'PDF合并、拆分、压缩，所有处理在浏览器端完成' },
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
  {
    slug: 'mortgage-calculator',
    title: '房贷计算器',
    description: '在线房贷计算器。支持等额本息和等额本金两种还款方式，输入贷款金额、年利率和期限即可计算月供和总利息。',
    category: 'calculators',
    keywords: ['房贷计算器', '月供计算', '等额本息', '等额本金', '贷款利率计算'],
    complexity: 'low',
  },
  {
    slug: 'bmi-calculator',
    title: 'BMI 计算器',
    description: '在线BMI身体质量指数计算器。输入身高和体重，自动计算BMI值和健康状态评估。',
    category: 'calculators',
    keywords: ['BMI计算器', '身体质量指数', '体重指数', '在线BMI', '健康体重'],
    complexity: 'low',
  },
  {
    slug: 'date-calculator',
    title: '日期计算器',
    description: '在线日期计算器。可视化日历选择，计算两个日期之间的天数、工作日数，支持日期加减推算。',
    category: 'calculators',
    keywords: ['日期计算', '天数计算', '工作日计算', '日期推算', '日历计算', '在线日期'],
    complexity: 'low',
  },
  {
    slug: 'case-converter',
    title: '大小写转换',
    description: '在线中英文大小写和繁简体转换工具。支持英文大写、小写、首字母大写，中文简体和繁体互转。',
    category: 'text',
    keywords: ['大小写转换', '英文大写', '英文小写', '简体转繁体', '繁体转简体', '文本转换'],
    complexity: 'low',
  },
  {
    slug: 'timezone-converter',
    title: '时区转换器',
    description: '在线时区时间转换工具。同时显示多个时区的当前时间和日期，轻松对比不同地区的时间差异。',
    category: 'calculators',
    keywords: ['时区转换', '世界时间', '时差计算', 'UTC转换', '国际时间', 'TimeZone'],
    complexity: 'low',
  },
  {
    slug: 'password-generator',
    title: '随机密码生成器',
    description: '在线随机密码生成工具。自定义长度和字符类型，一键生成高强度密码。所有生成过程在浏览器本地完成。',
    category: 'crypto',
    keywords: ['随机密码生成', '密码生成器', '强密码', '密码强度', '在线密码'],
    complexity: 'low',
  },
  {
    slug: 'timestamp-converter',
    title: 'Unix 时间戳转换',
    description: '在线Unix时间戳和日期时间互转工具。实时显示当前时间戳，支持秒和毫秒精度，所有计算在浏览器端完成。',
    category: 'dev',
    keywords: ['Unix时间戳', '时间戳转换', '时间戳在线', '日期转时间戳', 'Epoch转换'],
    complexity: 'low',
  },
  {
    slug: 'age-calculator',
    title: '年龄计算器',
    description: '在线年龄计算工具。精确计算周岁年龄（年月日），显示下次生日倒计时。所有计算在浏览器端完成。',
    category: 'calculators',
    keywords: ['年龄计算器', '在线年龄', '周岁计算', '出生日期计算', '年龄查询', '生日倒计时'],
    complexity: 'low',
  },
  {
    slug: 'zodiac-finder',
    title: '生肖星座查询',
    description: '在线生肖星座查询工具。输入出生日期，即可查询对应的生肖属相和西方星座，所有计算在浏览器端完成。',
    category: 'life',
    keywords: ['生肖查询', '星座查询', '属相', '生日查生肖', '十二星座', '十二生肖'],
    complexity: 'low',
  },
  {
    slug: 'unit-converter',
    title: '单位换算',
    description: '在线单位换算工具。支持长度、重量、温度、面积、体积、速度等常用单位实时转换，所有计算在浏览器端完成。',
    category: 'calculators',
    keywords: ['单位换算', '长度换算', '重量换算', '温度换算', '面积换算', '体积换算', '速度换算', '在线换算器'],
    complexity: 'medium',
  },
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
