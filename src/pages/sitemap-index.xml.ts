import { TOOLS, CATEGORIES } from '../utils/tools';

export async function GET() {
  const base = 'https://toolzen.com';
  const urls = [
    { loc: base, priority: '1.0' },
    { loc: `${base}/about/`, priority: '0.5' },
    ...TOOLS.map(t => ({ loc: `${base}/${t.slug}/`, priority: '0.9' })),
    ...CATEGORIES.map(c => ({ loc: `${base}/category/${c.slug}/`, priority: '0.7' })),
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${urls.map(u => `  <url><loc>${u.loc}</loc><priority>${u.priority}</priority></url>`).join('\n')}
</urlset>`;

  return new Response(xml, {
    headers: { 'Content-Type': 'application/xml' },
  });
}
