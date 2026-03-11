import { defineConfig } from 'vite'

import { robots } from '../../src/index.ts'

export default defineConfig({
  plugins: [
    robots({
      block: 'ai-training',
      sitemapUrl: 'https://example.com/sitemap.xml',
    }),
  ],
})
