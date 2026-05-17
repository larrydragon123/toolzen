// src/i18n/index.ts
import type { Lang, Translations } from './ui';
import { zh } from './zh';
import { en } from './en';

export type { Lang, Translations } from './ui';
export { createTranslator, type TranslationDict, type ToolMeta, type CategoryMeta } from './ui';

const DICTS: Record<Lang, Translations> = { zh, en };

export function getDict(lang: Lang): Translations {
  return DICTS[lang];
}

export function getLangFromPath(pathname: string): Lang {
  const seg = pathname.split('/')[1];
  if (seg === 'en') return 'en';
  return 'zh';
}

export function getOtherLang(lang: Lang): Lang {
  return lang === 'zh' ? 'en' : 'zh';
}

export function switchPath(pathname: string): string {
  const parts = pathname.split('/').filter(Boolean);
  if (parts.length === 0) return '/';
  if (parts[0] === 'zh' || parts[0] === 'en') {
    parts[0] = parts[0] === 'zh' ? 'en' : 'zh';
  }
  return '/' + parts.join('/') + '/';
}
