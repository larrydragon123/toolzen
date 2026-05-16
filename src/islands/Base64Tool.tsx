import { useState } from 'preact/hooks';

export default function Base64Tool() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');

  const encode = () => setOutput(btoa(unescape(encodeURIComponent(input))));
  const decode = () => {
    try { setOutput(decodeURIComponent(escape(atob(input)))); }
    catch { setOutput('Invalid Base64 input'); }
  };
  const copy = () => navigator.clipboard.writeText(output);
  const swap = () => { setInput(output); setOutput(input); };

  return (
    <div class="space-y-4">
      <div class="flex gap-2 flex-wrap">
        <button onClick={encode} class="px-4 py-2 bg-zen-500 text-white rounded-lg text-sm font-medium hover:bg-zen-600">Encode</button>
        <button onClick={decode} class="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200">Decode</button>
        <button onClick={swap} class="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200">Swap</button>
        <button onClick={copy} class="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200">Copy</button>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label class="block text-sm text-gray-500 mb-1">Input</label>
          <textarea value={input} onInput={(e) => setInput((e.target as HTMLTextAreaElement).value)}
            rows={8} class="w-full p-3 border border-gray-200 rounded-lg font-mono text-sm focus:border-zen-500 outline-none resize-y" />
        </div>
        <div>
          <label class="block text-sm text-gray-500 mb-1">Output</label>
          <textarea value={output} readOnly rows={8}
            class="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg font-mono text-sm resize-y" />
        </div>
      </div>
    </div>
  );
}
