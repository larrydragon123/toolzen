import { TOOLS, CATEGORIES } from '../utils/tools';

export async function GET() {
  const base = 'https://tool-zen.com';
  const langs = ['zh', 'en'];
  const urls: Array<{ loc: string; priority: string }> = [];

  for (const lang of langs) {
    urls.push({ loc: `${base}/${lang}/`, priority: '1.0' });
    urls.push({ loc: `${base}/${lang}/about/`, priority: '0.5' });
    urls.push({ loc: `${base}/${lang}/privacy/`, priority: '0.5' });
    for (const tool of TOOLS) {
      urls.push({ loc: `${base}/${lang}/${tool.slug}/`, priority: '0.9' });
    }
    for (const cat of CATEGORIES) {
      urls.push({ loc: `${base}/${lang}/category/${cat.slug}/`, priority: '0.7' });
    }
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${urls.map(u => `  <url><loc>${u.loc}</loc><priority>${u.priority}</priority></url>`).join('\n')}
</urlset>`;

  return new Response(xml, {
    headers: { 'Content-Type': 'application/xml' },
  });
}
