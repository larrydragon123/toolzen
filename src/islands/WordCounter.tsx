import { useState } from 'preact/hooks';
import { useLanguage } from '../hooks/useLanguage';

export default function WordCounter() {
  const { t } = useLanguage();
  const [text, setText] = useState('');

  const chars = text.length;
  const charsNoSpaces = text.replace(/\s/g, '').length;
  const words = text.trim() ? text.trim().split(/\s+/).length : 0;
  const lines = text ? text.split('\n').length : 0;
  const bytes = new Blob([text]).size;

  const stats = [
    { label: t.ui.characters, value: chars },
    { label: t.ui.charactersNoSpaces, value: charsNoSpaces },
    { label: t.ui.words, value: words },
    { label: t.ui.lines, value: lines },
    { label: t.ui.bytes, value: bytes },
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
        rows={10} placeholder={t.ui.typeOrPaste}
        class="w-full p-3 border border-gray-200 rounded-lg text-sm focus:border-zen-500 outline-none resize-y" />
    </div>
  );
}
