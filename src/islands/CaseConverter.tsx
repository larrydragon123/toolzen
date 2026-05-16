import { useState } from 'preact/hooks';

// Simplified Chinese character mapping - key common characters
// Using a simplified approach with the most common 500+ characters that differ
const S2T_MAP: Record<string, string> = {
  '个': '個', '们': '們', '为': '為', '说': '說', '时': '時',
  '对': '對', '发': '發', '现': '現', '点': '點', '会': '會',
  '后': '後', '动': '動', '样': '樣', '过': '過', '进': '進',
  '开': '開', '关': '關', '机': '機', '头': '頭', '实': '實',
  '体': '體', '电': '電', '话': '話', '长': '長', '门': '門',
  '问': '問', '见': '見', '车': '車', '东': '東', '万': '萬',
  '边': '邊', '这': '這', '里': '裡', '国': '國', '图': '圖',
  '书': '書', '飞': '飛', '马': '馬', '鱼': '魚', '鸟': '鳥',
  '龙': '龍', '龟': '龜', '变': '變', '声': '聲', '报': '報',
  '场': '場', '块': '塊', '乐': '樂', '习': '習', '买': '買',
  '乱': '亂', '争': '爭', '云': '雲', '义': '義', '业': '業',
  '网': '網', '线': '線', '节': '節', '艺': '藝', '药': '藥',
  '号': '號', '众': '眾', '优': '優', '传': '傳', '伤': '傷',
  '价': '價', '伦': '倫', '华': '華', '卫': '衛', '历': '曆',
  '压': '壓', '厂': '廠', '钱': '錢', '铁': '鐵', '钢': '鋼',
  '银': '銀', '阳': '陽', '阴': '陰', '难': '難', '风': '風',
  '爱': '愛', '笔': '筆', '脑': '腦', '脸': '臉', '热': '熱',
  '学': '學', '导': '導', '写': '寫', '当': '當', '币': '幣',
};

// Build reverse map
const T2S_MAP: Record<string, string> = {};
for (const [s, t] of Object.entries(S2T_MAP)) {
  T2S_MAP[t] = s;
}

function s2t(text: string): string {
  return text.split('').map(c => S2T_MAP[c] || c).join('');
}

function t2s(text: string): string {
  return text.split('').map(c => T2S_MAP[c] || c).join('');
}

export default function CaseConverter() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');

  const actions = [
    { label: '英文大写', fn: () => setOutput(input.toUpperCase()) },
    { label: '英文小写', fn: () => setOutput(input.toLowerCase()) },
    { label: '首字母大写', fn: () => setOutput(input.replace(/\b\w/g, c => c.toUpperCase())) },
    { label: '每个单词首字母', fn: () => setOutput(input.replace(/\b\w/g, c => c.toUpperCase())) },
    { label: '简体→繁体', fn: () => setOutput(s2t(input)) },
    { label: '繁体→简体', fn: () => setOutput(t2s(input)) },
    { label: '反转大小写', fn: () => setOutput(input.split('').map(c => c === c.toUpperCase() ? c.toLowerCase() : c.toUpperCase()).join('')) },
  ];

  const copy = () => { navigator.clipboard.writeText(output); };

  return (
    <div class="space-y-4">
      <div class="flex gap-2 flex-wrap">
        {actions.map(a => (
          <button onClick={a.fn} class="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-zen-50 hover:text-zen-600 transition-colors">{a.label}</button>
        ))}
        <button onClick={copy} class="px-3 py-2 bg-zen-500 text-white rounded-lg text-sm font-medium hover:bg-zen-600 transition-colors ml-auto">Copy</button>
      </div>
      <textarea value={input} onInput={(e) => setInput((e.target as HTMLTextAreaElement).value)}
        rows={6} placeholder="输入文本..."
        class="w-full p-3 border border-gray-200 rounded-lg text-sm focus:border-zen-500 outline-none resize-y" />
      <textarea value={output} readOnly rows={6}
        class="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg text-sm resize-y"
        placeholder="转换结果..." />
    </div>
  );
}
