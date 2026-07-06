// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://mcsc-group.com',
  // Netlify serves /path/index.html as /path/ (301 from /path) — keep dev and
  // internal links consistent with that.
  trailingSlash: 'always',
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'fr', 'it'],
    routing: {
      prefixDefaultLocale: false,
    },
  },
  integrations: [
    sitemap({
      i18n: {
        defaultLocale: 'en',
        locales: { en: 'en', fr: 'fr', it: 'it' },
      },
    }),
  ],
  vite: {
    plugins: [tailwindcss()]
  }
});
