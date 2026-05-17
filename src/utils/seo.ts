import type { Tool, Category } from './tools';

export function generateSEOMeta(params: {
  title: string;
  description: string;
  path: string;
  type?: 'website' | 'article';
  image?: string;
}): {
  title: string;
  meta: Array<Record<string, string>>;
  script: Array<Record<string, string>>;
} {
  const fullTitle = `${params.title} | ToolZen`;

  const meta: Array<Record<string, string>> = [
    { name: 'description', content: params.description },
    { property: 'og:title', content: fullTitle },
    { property: 'og:description', content: params.description },
    { property: 'og:type', content: params.type || 'website' },
    { property: 'og:url', content: `https://tool-zen.com${params.path}` },
    { property: 'og:image', content: params.image || 'https://tool-zen.com/og-default.png' },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: fullTitle },
    { name: 'twitter:description', content: params.description },
  ];

  const script: Array<Record<string, string>> = [];

  return { title: fullTitle, meta, script };
}

export function generateToolSEOMeta(tool: Tool): ReturnType<typeof generateSEOMeta> {
  const base = generateSEOMeta({
    title: `在线${tool.title} - 免费在线工具 无需上传`,
    description: tool.description,
    path: `/${tool.slug}/`,
  });

  // JSON-LD for WebApplication
  base.script.push({
    type: 'application/ld+json',
    innerHTML: JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'WebApplication',
      name: `在线${tool.title}`,
      description: tool.description,
      url: `https://tool-zen.com/${tool.slug}/`,
      applicationCategory: 'UtilityApplication',
      operatingSystem: 'All',
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    }),
  });

  return base;
}

export function generateCategorySEOMeta(cat: Category): ReturnType<typeof generateSEOMeta> {
  return generateSEOMeta({
    title: `${cat.title} - 免费在线${cat.title}`,
    description: cat.description,
    path: `/category/${cat.slug}/`,
  });
}

export function generateBreadcrumbLD(items: Array<{ name: string; url: string }>) {
  return {
    type: 'application/ld+json',
    innerHTML: JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: items.map((item, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        name: item.name,
        item: item.url,
      })),
    }),
  };
}
