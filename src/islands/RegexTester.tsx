import { useState } from 'preact/hooks';

export default function RegexTester() {
  const [pattern, setPattern] = useState('');
  const [flags, setFlags] = useState('g');
  const [text, setText] = useState('');
  const [matches, setMatches] = useState<string[]>([]);
  const [error, setError] = useState('');

  const test = () => {
    setError('');
    setMatches([]);
    try {
      const re = new RegExp(pattern, flags);
      const result = text.match(re);
      setMatches(result || []);
      if (!result) setError('No matches found');
    } catch (e) {
      setError((e as Error).message);
    }
  };

  const presets = [
    { label: 'Email', pattern: '[\\w.-]+@[\\w.-]+\\.\\w+' },
    { label: 'URL', pattern: 'https?://[^\\s]+' },
    { label: 'Phone (CN)', pattern: '1[3-9]\\d{9}' },
    { label: 'IPv4', pattern: '\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}' },
  ];

  return (
    <div class="space-y-4">
      <div class="flex gap-2 items-end flex-wrap">
        <div class="flex-1 min-w-48">
          <label class="block text-sm text-gray-500 mb-1">Pattern</label>
          <input value={pattern} onInput={(e) => setPattern((e.target as HTMLInputElement).value)}
            placeholder="/regex/"
            class="w-full p-2 border border-gray-200 rounded-lg font-mono text-sm focus:border-zen-500 outline-none" />
        </div>
        <div>
          <label class="block text-sm text-gray-500 mb-1">Flags</label>
          <input value={flags} onInput={(e) => setFlags((e.target as HTMLInputElement).value)}
            class="w-16 p-2 border border-gray-200 rounded-lg font-mono text-sm" />
        </div>
        <button onClick={test} class="px-4 py-2 bg-zen-500 text-white rounded-lg text-sm font-medium hover:bg-zen-600">Match</button>
      </div>
      <div class="flex gap-2 flex-wrap">
        {presets.map(p => (
          <button onClick={() => setPattern(p.pattern)} class="px-3 py-1 bg-gray-100 text-gray-600 rounded text-xs hover:bg-gray-200 transition-colors">{p.label}</button>
        ))}
      </div>
      <textarea value={text} onInput={(e) => setText((e.target as HTMLTextAreaElement).value)}
        rows={6} placeholder="Text to search..."
        class="w-full p-3 border border-gray-200 rounded-lg font-mono text-sm focus:border-zen-500 outline-none resize-y" />
      {error && <div class="p-3 bg-red-50 border border-red-100 rounded-lg text-sm text-red-600">{error}</div>}
      {matches.length > 0 && (
        <div class="p-3 bg-green-50 border border-green-100 rounded-lg">
          <div class="text-sm text-green-700 mb-2">{matches.length} match(es)</div>
          <div class="space-y-1 max-h-40 overflow-y-auto font-mono text-sm">
            {matches.map((m, i) => <div key={i} class="text-green-800">{m}</div>)}
          </div>
        </div>
      )}
    </div>
  );
}
