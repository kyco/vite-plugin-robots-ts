import { defineConfig } from 'vite'

import { robots } from '../../src/index.ts'

export default defineConfig({
  plugins: [
    robots({
      block: 'ai-training',
      sitemap: 'https://example.com/sitemap.xml',
    }),
  ],
})
