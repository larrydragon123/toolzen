import { useLayoutEffect, useRef, useState } from 'preact/hooks';
import { getDict, type Lang } from '../i18n';
import { toolAnalytics } from '../utils/toolAnalytics';

const track = toolAnalytics('word-counter');
const han = /\p{Script=Han}/u;
const latin = /\p{Script=Latin}/u;
const segmenter = typeof Intl.Segmenter === 'function'
  ? new Intl.Segmenter('zh', { granularity: 'word' })
  : null;

function countWords(text: string) {
  if (!segmenter) return null;
  let total = 0;
  let chinese = 0;
  let latinWords = 0;
  for (const { segment, isWordLike } of segmenter.segment(text)) {
    if (!isWordLike) continue;
    total++;
    if (han.test(segment)) chinese++;
    if (latin.test(segment)) latinWords++;
  }
  return { total, chinese, latinWords };
}

export default function WordCounter({ lang }: { lang: Lang }) {
  const { ui } = getDict(lang);
  const [text, setText] = useState('');
  const pending = useRef(false);
  const inEntry = useRef(false);
  const updateText = (value: string) => {
    if (!value.trim()) {
      inEntry.current = false;
      pending.current = false;
    } else if (!inEntry.current) {
      track('tool_start', 'count');
      inEntry.current = true;
      pending.current = true;
    }
    setText(value);
  };

  useLayoutEffect(() => {
    if (pending.current) {
      pending.current = false;
      track('tool_complete', 'count');
    }
  }, [text]);

  const words = countWords(text);
  let chars = 0;
  let charsNoSpaces = 0;
  let hanCount = 0;
  for (const char of text) {
    chars++;
    if (!/\s/u.test(char)) charsNoSpaces++;
    if (han.test(char)) hanCount++;
  }
  const stats = [
    { label: lang === 'en' ? 'Han characters' : '汉字数', value: hanCount },
    { label: lang === 'en' ? 'Chinese words (estimate)' : '中文词数（估算）', value: words?.chinese },
    { label: lang === 'en' ? 'Latin-script words' : '拉丁字母词数', value: words?.latinWords },
    { label: ui.words, value: words?.total },
    { label: ui.characters, value: chars },
    { label: ui.charactersNoSpaces, value: charsNoSpaces },
    { label: ui.lines, value: text ? text.split('\n').length : 0 },
    { label: ui.bytes, value: new Blob([text]).size },
  ];

  return (
    <div class="space-y-4">
      <div class="grid grid-cols-2 md:grid-cols-4 gap-2">
        {stats.map(s => (
          <div key={s.label} class="p-3 bg-zen-50 rounded-lg text-center">
            <div class="text-2xl font-bold text-zen-600">{s.value ?? '—'}</div>
            <div class="text-xs text-gray-500 mt-1">{s.label}</div>
          </div>
        ))}
      </div>
      {!segmenter && <p class="text-sm">{lang === 'en'
        ? 'Word estimates require a browser with Intl.Segmenter. Character counts update as you type.'
        : '当前浏览器不支持分词。仍可输入文本查看字符与汉字统计。'}</p>}
      <textarea value={text} onInput={e => updateText(e.currentTarget.value)}
        rows={10} placeholder={ui.typeOrPaste} aria-label={ui.typeOrPaste}
        class="w-full p-3 border border-gray-200 rounded-lg text-sm focus:border-zen-500 outline-none resize-y" />
    </div>
  );
}
