import { TOOLS, CATEGORIES } from '../utils/tools';
import { getCollection } from 'astro:content';

export async function GET() {
  const base = 'https://tool-zen.com';
  const langs = ['zh', 'en'];
  const urls: Array<{ loc: string; priority: string; lastmod?: string; changefreq?: string }> = [];

  const blogPosts = await getCollection('blog');

  for (const lang of langs) {
    urls.push({ loc: `${base}/${lang}/`, priority: '1.0', changefreq: 'daily' });
    urls.push({ loc: `${base}/${lang}/about/`, priority: '0.5', changefreq: 'monthly' });
    urls.push({ loc: `${base}/${lang}/privacy/`, priority: '0.5', changefreq: 'monthly' });
    urls.push({ loc: `${base}/${lang}/blog/`, priority: '0.8', lastmod: new Date().toISOString().split('T')[0], changefreq: 'weekly' });
    for (const tool of TOOLS) {
      urls.push({ loc: `${base}/${lang}/${tool.slug}/`, priority: '0.9', changefreq: 'monthly' });
    }
    for (const cat of CATEGORIES) {
      urls.push({ loc: `${base}/${lang}/category/${cat.slug}/`, priority: '0.7', changefreq: 'monthly' });
    }
    for (const post of blogPosts) {
      if (post.id.startsWith(`${lang}/`)) {
        const slug = post.id.split('/').slice(1).join('/');
        const lastmod = post.data.date.toISOString().split('T')[0];
        urls.push({ loc: `${base}/${lang}/blog/${slug}/`, priority: '0.7', lastmod, changefreq: 'monthly' });
      }
    }
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(u => {
    const lastmod = u.lastmod ? `\n    <lastmod>${u.lastmod}</lastmod>` : '';
    const changefreq = u.changefreq ? `\n    <changefreq>${u.changefreq}</changefreq>` : '';
    return `  <url>\n    <loc>${u.loc}</loc>\n    <priority>${u.priority}</priority>${lastmod}${changefreq}\n  </url>`;
  }).join('\n')}
</urlset>`;

  return new Response(xml, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
}
