import { useState } from 'preact/hooks';

export default function WordCounter() {
  const [text, setText] = useState('');

  const chars = text.length;
  const charsNoSpaces = text.replace(/\s/g, '').length;
  const words = text.trim() ? text.trim().split(/\s+/).length : 0;
  const lines = text ? text.split('\n').length : 0;
  const bytes = new Blob([text]).size;

  const stats = [
    { label: 'Characters', value: chars },
    { label: 'Characters (no spaces)', value: charsNoSpaces },
    { label: 'Words', value: words },
    { label: 'Lines', value: lines },
    { label: 'Bytes', value: bytes },
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
        rows={10} placeholder="Type or paste text here..."
        class="w-full p-3 border border-gray-200 rounded-lg text-sm focus:border-zen-500 outline-none resize-y" />
    </div>
  );
}
