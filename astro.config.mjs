// @ts-check
import { defineConfig } from 'astro/config';

import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';

import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://glamping-cumbre-molinos.pages.dev',
  integrations: [react(), sitemap()],

  vite: {
    plugins: [tailwindcss()]
  }
});