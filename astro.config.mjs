import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  site: 'https://fangtang.net',
  base: '/',
  output: 'static',
  build: {
    format: 'file'
  },
  integrations: [tailwind()],
  prefetch: true,
});
