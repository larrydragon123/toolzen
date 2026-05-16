import { useState } from 'preact/hooks';

export default function UuidGenerator() {
  const [uuids, setUuids] = useState<string[]>([]);
  const [count, setCount] = useState(1);

  const generate = () => {
    const arr: string[] = [];
    for (let i = 0; i < count; i++) arr.push(crypto.randomUUID());
    setUuids(arr);
  };

  const copyAll = () => navigator.clipboard.writeText(uuids.join('\n'));

  return (
    <div class="space-y-4">
      <div class="flex gap-2 flex-wrap items-end">
        <div>
          <label class="block text-sm text-gray-500 mb-1">Count</label>
          <input type="number" min="1" max="100" value={count}
            onInput={(e) => setCount(parseInt((e.target as HTMLInputElement).value) || 1)}
            class="w-20 p-2 border border-gray-200 rounded-lg text-sm" />
        </div>
        <button onClick={generate} class="px-4 py-2 bg-zen-500 text-white rounded-lg text-sm font-medium hover:bg-zen-600">Generate</button>
        {uuids.length > 0 && (
          <button onClick={copyAll} class="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200">Copy All</button>
        )}
      </div>
      {uuids.length > 0 && (
        <div class="p-3 bg-gray-50 border border-gray-200 rounded-lg font-mono text-sm space-y-1 max-h-60 overflow-y-auto">
          {uuids.map((id, i) => <div key={i}>{id}</div>)}
        </div>
      )}
    </div>
  );
}
