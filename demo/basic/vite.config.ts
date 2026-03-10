import { defineConfig } from 'vite'
import { robots } from 'vite-plugin-robots-ts'

export default defineConfig({
  plugins: [
    robots({
      block: 'ai-training',
    }),
  ],
})
