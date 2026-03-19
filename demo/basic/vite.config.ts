import { defineConfig } from 'vite'

import { BLOCK_AI_ALLOW_REST, robots } from '../../src/index.ts'

export default defineConfig({
  plugins: [
    robots({
      content: BLOCK_AI_ALLOW_REST,
      sitemap: 'https://example.com/sitemap.xml',
    }),
  ],
})
