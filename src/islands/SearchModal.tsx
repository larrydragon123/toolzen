import { useState, useEffect, useRef } from 'preact/hooks';
import { TOOLS } from '../utils/tools';
import { useLanguage } from '../hooks/useLanguage';

export default function SearchModal() {
  const { t } = useLanguage();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setOpen(true);
      }
      if (e.key === 'Escape' && open) {
        setOpen(false);
        setQuery('');
      }
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [open]);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      document.body.style.overflow = '';
    }
  }, [open]);

  const filtered = query.trim()
    ? TOOLS.filter(t => t.title.includes(query) || t.slug.includes(query))
    : [];

  const navigate = (slug: string) => {
    setOpen(false);
    setQuery('');
    window.location.href = `/${slug}/`;
  };

  const handleKey = (e: KeyboardEvent) => {
    if (e.key === 'Enter' && filtered.length > 0) {
      navigate(filtered[0].slug);
    }
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        class="px-3 py-2 text-gray-500 hover:text-gray-700 bg-transparent border-0 cursor-pointer"
        aria-label="搜索"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
        </svg>
      </button>

      {open && (
        <div
          class="fixed inset-0 z-100 flex justify-center"
          style="background:rgba(0,0,0,0.3);"
          onClick={(e) => { if (e.target === e.currentTarget) { setOpen(false); setQuery(''); } }}
        >
          <div
            class="absolute bg-white rounded-xl shadow-2xl overflow-hidden"
            style="top:60px;width:100%;max-width:480px;"
            onClick={(e) => e.stopPropagation()}
          >
            <div class="flex items-center px-4 py-3 border-b border-gray-100 gap-3">
              <svg class="w-5 h-5 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
              </svg>
              <input
                ref={inputRef}
                type="text"
                value={query}
                onInput={(e) => setQuery((e.target as HTMLInputElement).value)}
                onKeyDown={handleKey}
                placeholder={t.nav.searchPlaceholder}
                class="flex-1 border-0 outline-none text-base text-gray-900 bg-transparent"
              />
              <button
                onClick={() => { setOpen(false); setQuery(''); }}
                class="bg-transparent border-0 text-gray-400 cursor-pointer text-lg leading-none"
              >
                ✕
              </button>
            </div>
            <div class="max-h-80 overflow-y-auto p-2">
              {query.trim() === '' ? (
                <div class="p-8 text-center text-gray-400 text-sm">{t.nav.searchHint}</div>
              ) : filtered.length === 0 ? (
                <div class="p-8 text-center text-gray-400 text-sm">{t.nav.searchEmpty}</div>
              ) : (
                filtered.map(tool => (
                  <a
                    key={tool.slug}
                    href={`/${tool.slug}/`}
                    onClick={(e) => { e.preventDefault(); navigate(tool.slug); }}
                    class="flex items-center gap-3 px-4 py-3 rounded-lg no-underline text-gray-900 hover:bg-zen-50"
                  >
                    <span class="text-sm flex-1">{tool.title}</span>
                    <span class="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded">
                      {t.nav[tool.category as keyof typeof t.nav] || tool.category}
                    </span>
                  </a>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
