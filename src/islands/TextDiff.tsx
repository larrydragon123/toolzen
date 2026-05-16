import { useState } from 'preact/hooks';
import { diffWords, diffLines } from 'diff';

type DiffResult = { value: string; added?: boolean; removed?: boolean }[];

export default function TextDiff() {
  const [left, setLeft] = useState('');
  const [right, setRight] = useState('');
  const [result, setResult] = useState<DiffResult>([]);
  const [mode, setMode] = useState<'words' | 'lines'>('words');

  const compare = () => {
    const fn = mode === 'words' ? diffWords : diffLines;
    setResult(fn(left, right));
  };

  return (
    <div class="space-y-4">
      <div class="flex gap-2">
        <button onClick={() => { setMode('words'); compare(); }}
          class={`px-3 py-1 rounded text-sm ${mode === 'words' ? 'bg-zen-500 text-white' : 'bg-gray-100 text-gray-600'}`}>Words</button>
        <button onClick={() => { setMode('lines'); compare(); }}
          class={`px-3 py-1 rounded text-sm ${mode === 'lines' ? 'bg-zen-500 text-white' : 'bg-gray-100 text-gray-600'}`}>Lines</button>
        <button onClick={compare} class="ml-auto px-4 py-2 bg-zen-500 text-white rounded-lg text-sm font-medium hover:bg-zen-600">Compare</button>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <textarea value={left} onInput={(e) => setLeft((e.target as HTMLTextAreaElement).value)}
          rows={8} placeholder="Original text..."
          class="w-full p-3 border border-gray-200 rounded-lg font-mono text-sm focus:border-zen-500 outline-none resize-y" />
        <textarea value={right} onInput={(e) => setRight((e.target as HTMLTextAreaElement).value)}
          rows={8} placeholder="Modified text..."
          class="w-full p-3 border border-gray-200 rounded-lg font-mono text-sm focus:border-zen-500 outline-none resize-y" />
      </div>
      {result.length > 0 && (
        <div class="p-4 bg-white border border-gray-200 rounded-lg font-mono text-sm leading-relaxed whitespace-pre-wrap">
          {result.map((part, i) => {
            let cls = '';
            if (part.added) cls = 'bg-green-100 text-green-800';
            else if (part.removed) cls = 'bg-red-100 text-red-800 line-through';
            return <span key={i} class={cls}>{part.value}</span>;
          })}
        </div>
      )}
    </div>
  );
}
