// src/i18n/ui.ts

export interface HomeDict {
  hero: string;
  heroHighlight: string;
  subtitle: string;
  popular: string;
  allCategories: string;
  whyTitle: string;
  privacy: { title: string; desc: string };
  speed: { title: string; desc: string };
  free: { title: string; desc: string };
  faqTitle: string;
  faq: Array<{ q: string; a: string }>;
}

export interface NavDict {
  dev: string;
  text: string;
  image: string;
  crypto: string;
  calculators: string;
  searchPlaceholder: string;
  searchHint: string;
  searchEmpty: string;
}

export interface FooterDict {
  copyright: string;
  about: string;
  privacy: string;
  contact: string;
}

export interface CategoryMeta {
  title: string;
  description: string;
}

export interface ToolMeta {
  title: string;
  description: string;
  keywords: string[];
  howToTitle: string;
  howTo: string;
  faq: Array<{ q: string; a: string }>;
}

export interface SeoDict {
  homeTitle: string;
  homeDesc: string;
  aboutTitle: string;
  aboutDesc: string;
  privacyTitle: string;
  privacyDesc: string;
  categoryPrefix: string;
}

export interface UIDict {
  format: string; compress: string; validate: string; copy: string;
  encode: string; decode: string; swap: string; generate: string; download: string;
  calculate: string; clear: string;
  characters: string; charactersNoSpaces: string; words: string; lines: string; bytes: string;
  input: string; output: string; typeOrPaste: string; outputPlaceholder: string;
  content: string; size: string; fgColor: string; bgColor: string;
  enterContent: string; downloadPng: string; generateFailed: string;
  loanAmount: string; annualRate: string; loanYears: string;
  repaymentMethod: string; equalPayment: string; equalPrincipal: string;
  monthlyPayment: string; totalPayment: string; totalInterest: string;
  totalMonths: string; viewSchedule: string; period: string;
  principal: string; interest: string; balance: string;
  height: string; weight: string; yourBmi: string;
  underweight: string; normal: string; overweight: string; obese: string;
  dateDiff: string; dateAdd: string; startDate: string; endDate: string;
  addDays: string; totalDays: string; naturalDays: string;
  workdays: string; weekdays: string; weekends: string; targetDate: string;
  calcDiff: string; calcDate: string; weekDayNames: string[];
  upperCase: string; lowerCase: string; titleCase: string;
  s2t: string; t2s: string; numS2F: string; numF2S: string; invertCase: string;
  enterText: string; result: string;
  selectAlgorithm: string; generateUuid: string; copyAll: string;
  selectImage: string; quality: string; compressImage: string;
  pattern: string; testString: string;
  originalText: string; modifiedText: string;
  pickColor: string;
  sourceTimezone: string; targetTimezone: string; convertTime: string;
}

export interface TranslationDict {
  site: { name: string; tagline: string };
  home: HomeDict;
  nav: NavDict;
  footer: FooterDict;
  categories: Record<string, CategoryMeta>;
  tools: Record<string, ToolMeta>;
  about: { h1: string; p1: string; p2: string; p3: string; contactTitle: string; contact: string };
  privacy: { h1: string; updated: string; noCollectTitle: string; noCollect: string; analyticsTitle: string; analytics: string; cookiesTitle: string; cookies: string; contactTitle: string; contact: string };
  seo: SeoDict;
  ui: UIDict;
  relatedTools: string;
  toolCount: (n: number) => string;
  breadcrumbHome: string;
}

export type Lang = 'zh' | 'en';
export type Translations = TranslationDict;

export function createTranslator(dict: TranslationDict) {
  return dict;
}
