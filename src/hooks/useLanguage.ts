// src/hooks/useLanguage.ts
import { useState, useEffect } from 'preact/hooks';
import type { Translations, Lang } from '../i18n';
import { getDict } from '../i18n';

export function useLanguage(): { t: Translations; lang: Lang } {
  const [lang, setLang] = useState<Lang>('en');

  useEffect(() => {
    const htmlLang = document.documentElement.lang;
    if (htmlLang.startsWith('zh')) {
      setLang('zh');
    } else {
      setLang('en');
    }
  }, []);

  return { t: getDict(lang), lang };
}
