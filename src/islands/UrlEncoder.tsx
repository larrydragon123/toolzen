import { useState } from 'preact/hooks';

export default function UrlEncoder() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');

  const encode = () => setOutput(encodeURIComponent(input));
  const decode = () => {
    try { setOutput(decodeURIComponent(input)); }
    catch { setOutput('Invalid URL-encoded input'); }
  };
  const copy = () => navigator.clipboard.writeText(output);

  return (
    <div class="space-y-4">
      <div class="flex gap-2 flex-wrap">
        <button onClick={encode} class="px-4 py-2 bg-zen-500 text-white rounded-lg text-sm font-medium hover:bg-zen-600">Encode URL</button>
        <button onClick={decode} class="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200">Decode URL</button>
        <button onClick={copy} class="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200">Copy</button>
      </div>
      <textarea value={input} onInput={(e) => setInput((e.target as HTMLTextAreaElement).value)}
        rows={6} placeholder="Enter URL or text to encode/decode..."
        class="w-full p-3 border border-gray-200 rounded-lg font-mono text-sm focus:border-zen-500 outline-none resize-y" />
      <textarea value={output} readOnly rows={6}
        class="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg font-mono text-sm resize-y" />
    </div>
  );
}
