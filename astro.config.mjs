import { defineConfig } from 'astro/config';
import preact from '@astrojs/preact';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  integrations: [preact()],
  vite: {
    plugins: [tailwindcss()],
  },
  site: 'https://toolzen-dqtah4coy-larrydragon.vercel.app',
  output: 'static',
  trailingSlash: 'always'
});
