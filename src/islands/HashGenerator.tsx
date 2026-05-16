import { useState } from 'preact/hooks';

export default function HashGenerator() {
  const [input, setInput] = useState('');
  const [results, setResults] = useState<Record<string, string>>({});

  const hash = async (algo: string) => {
    const encoder = new TextEncoder();
    const data = encoder.encode(input);
    const hashBuffer = await crypto.subtle.digest(algo, data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    setResults(prev => ({ ...prev, [algo]: hashHex }));
  };

  const hashAll = () => {
    hash('SHA-256');
    hash('SHA-1');
  };

  return (
    <div class="space-y-4">
      <textarea value={input} onInput={(e) => setInput((e.target as HTMLTextAreaElement).value)}
        rows={4} placeholder="Enter text to hash..."
        class="w-full p-3 border border-gray-200 rounded-lg font-mono text-sm focus:border-zen-500 outline-none resize-y" />
      <button onClick={hashAll} class="px-4 py-2 bg-zen-500 text-white rounded-lg text-sm font-medium hover:bg-zen-600">Generate Hash</button>
      {Object.entries(results).length > 0 && (
        <div class="space-y-2">
          {Object.entries(results).map(([algo, hashVal]) => (
            <div key={algo}>
              <label class="text-xs text-gray-500">{algo}</label>
              <div class="p-2 bg-gray-50 border border-gray-200 rounded font-mono text-xs break-all">{hashVal}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
