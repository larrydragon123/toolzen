import { toolAnalytics } from '../utils/toolAnalytics';
import { useState } from 'preact/hooks';

const track = toolAnalytics('json-formatter');

export default function JsonFormatter() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');

  const format = () => {
    track('tool_start', 'format');
    try {
      const obj = JSON.parse(input);
      setOutput(JSON.stringify(obj, null, 2));
      track('tool_complete', 'format');
      setError('');
    } catch (e) {
      setError((e as Error).message);
      setOutput('');
    }
  };

  const compress = () => {
    track('tool_start', 'compress');
    try {
      const obj = JSON.parse(input);
      setOutput(JSON.stringify(obj));
      track('tool_complete', 'compress');
      setError('');
    } catch (e) {
      setError((e as Error).message);
      setOutput('');
    }
  };

  const validate = () => {
    track('tool_start', 'validate');
    try {
      JSON.parse(input);
      setError('');
      setOutput('✓ Valid JSON');
      track('tool_complete', 'validate');
    } catch (e) {
      setError((e as Error).message);
      setOutput('');
    }
  };

  const copy = () => { navigator.clipboard.writeText(output); };

  return (
    <div class="space-y-4">
      <div class="flex gap-2 flex-wrap">
        <button onClick={format} class="px-4 py-2 bg-zen-500 text-white rounded-lg text-sm font-medium hover:bg-zen-600 transition-colors">Format</button>
        <button onClick={compress} class="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors">Compress</button>
        <button onClick={validate} class="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors">Validate</button>
        <button onClick={copy} class="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors">Copy</button>
      </div>
      <textarea value={input} onInput={(e) => setInput((e.target as HTMLTextAreaElement).value)}
        placeholder='{"key": "value"}'
        rows={10}
        class="w-full p-3 border border-gray-200 rounded-lg font-mono text-sm focus:border-zen-500 focus:ring-1 focus:ring-zen-100 outline-none resize-y" />
      {error && <div class="p-3 bg-red-50 border border-red-100 rounded-lg text-sm text-red-600 font-mono">{error}</div>}
      <textarea value={output} readOnly rows={10}
        class="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg font-mono text-sm resize-y"
        placeholder="Output..." />
    </div>
  );
}
