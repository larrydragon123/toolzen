import { useEffect, useState } from 'preact/hooks';
import { fitImageToSize } from '../utils/fitImageToSize';
import type { Lang } from '../i18n';

const copy = {
  zh: {
    file: '选择图片', types: '支持 JPG、PNG、WebP。图片只在当前设备处理。',
    limit: '文件大小上限', resize: '必要时允许缩小像素尺寸', run: '生成达标图片', busy: '正在处理…',
    same: '原图已达标', fit: '已达到大小要求', save: '下载图片', failed: '无法读取或编码这张图片。请换用有效的 JPG、PNG 或 WebP。',
    miss: '当前设置下无法达到上限。可提高上限，或允许缩小像素尺寸。', bad: '请输入大于零的整数 KB。',
    original: '原图', output: '结果', preview: '下载图片预览', note: '超过上限的图片将导出为静态 JPG，透明区域填充为白色。',
  },
  en: {
    file: 'Choose an image', types: 'JPG, PNG or WebP. Your image stays on this device.',
    limit: 'File size limit', resize: 'Allow smaller dimensions if needed', run: 'Fit image to limit', busy: 'Processing…',
    same: 'Original already fits', fit: 'Image fits your limit', save: 'Download image', failed: 'Could not read or encode this image. Try a valid JPG, PNG or WebP.',
    miss: 'The image could not fit with these settings. Raise the limit or allow smaller dimensions.', bad: 'Enter a positive whole number of KB.',
    original: 'Original', output: 'Result', preview: 'Download preview', note: 'Oversized images are exported as a still JPG with a white background for transparent areas.',
  },
};
type Download = { url: string; bytes: number; width: number; height: number; name: string; original: boolean };

export default function ImageSizeLimit({ lang }: { lang: Lang }) {
  const t = copy[lang];
  const [file, setFile] = useState<File | null>(null);
  const [limit, setLimit] = useState('200');
  const [resize, setResize] = useState(true);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  const [result, setResult] = useState<Download | null>(null);
  useEffect(() => () => { if (result) URL.revokeObjectURL(result.url); }, [result]);

  const clear = () => { setResult(null); setMessage(''); };
  function changeLimit(value: string) { clear(); setLimit(value); }
  async function submit(e: Event) {
    e.preventDefault();
    if (!file || busy) return;
    clear();
    const bytes = Number(limit) * 1000;
    if (!Number.isSafeInteger(bytes) || !Number.isInteger(Number(limit)) || bytes <= 0) { setMessage(t.bad); return; }
    setBusy(true);
    try {
      const fitted = await fitImageToSize(file, bytes, resize);
      if (!fitted) { setMessage(t.miss); return; }
      const ext = fitted.blob.type === 'image/jpeg' ? 'jpg' : fitted.blob.type.split('/')[1];
      const base = file.name.replace(/\.[^.]+$/, '') || 'image';
      setResult({
        url: URL.createObjectURL(fitted.blob), bytes: fitted.blob.size, width: fitted.width, height: fitted.height,
        name: fitted.original ? base + '.' + ext : base + '-' + limit + 'kb.jpg', original: fitted.original,
      });
    } catch {
      setMessage(t.failed);
    } finally {
      setBusy(false);
    }
  }

  return <div class="border border-gray-200 rounded-2xl p-5 sm:p-7 bg-white">
    <form onSubmit={submit} class="space-y-5">
      <fieldset disabled={busy} class="space-y-5 min-w-0">
        <div class="rounded-xl border border-dashed border-zen-200 bg-zen-50 p-4">
          <label for="limit-file" class="block font-semibold mb-2">{t.file}</label>
          <input id="limit-file" type="file" accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp" required
            class="block w-full text-sm file:mr-3 file:px-3 file:py-2 file:bg-white file:border file:border-gray-200 file:rounded-lg"
            onChange={e => { clear(); setFile(e.currentTarget.files?.[0] ?? null); }} />
          <p class="mt-2 text-sm text-gray-600">{t.types}</p>
        </div>
        <div>
          <label for="limit-kb" class="block font-semibold mb-2">{t.limit}</label>
          <div class="flex flex-wrap items-center gap-2">
            <input id="limit-kb" type="number" inputMode="numeric" min="1" step="1" required value={limit}
              onInput={e => changeLimit(e.currentTarget.value)} class="w-24 rounded-lg border border-gray-300 px-3 py-2" />
            <span class="text-sm mr-2">KB</span>
            {[100, 200, 500].map(kb => <button key={kb} type="button" aria-pressed={limit === String(kb)}
              onClick={() => changeLimit(String(kb))} class="rounded-full border border-gray-200 px-3 py-1 text-sm aria-pressed:bg-zen-50 aria-pressed:text-zen-600">{kb} KB</button>)}
          </div>
        </div>
        <label class="flex items-center gap-2 text-sm"><input type="checkbox" checked={resize} onChange={e => { clear(); setResize(e.currentTarget.checked); }} />{t.resize}</label>
        <p class="text-sm text-gray-600">{t.note}</p>
        <button type="submit" disabled={!file || busy} class="rounded-lg bg-zen-500 px-5 py-2.5 font-medium text-white disabled:opacity-50">{busy ? t.busy : t.run}</button>
      </fieldset>
    </form>
    <div aria-live="polite">
      {message && <p role="alert" class="mt-4 text-sm text-red-700">{message}</p>}
      {result && file && <section class="mt-5 border-t border-gray-200 pt-5">
        <h2 class="font-semibold text-lg">{result.original ? t.same : t.fit}</h2>
        <p class="mt-1 text-sm text-gray-600">{t.original} {(file.size / 1000).toFixed(1)} KB · {t.output} {result.bytes.toLocaleString(lang)} B · {result.width} × {result.height} px</p>
        <img src={result.url} alt={t.preview} class="my-4 max-h-64 max-w-full rounded-lg" />
        <a download={result.name} href={result.url} class="inline-block rounded-lg bg-zen-500 px-5 py-2.5 font-medium text-white">{t.save}</a>
      </section>}
    </div>
  </div>;
}
