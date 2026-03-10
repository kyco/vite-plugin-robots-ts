import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import viteReact from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { robots } from 'vite-plugin-robots-ts'
import tsConfigPaths from 'vite-tsconfig-paths'
export default defineConfig({
  server: {
    port: 5173,
  },
  plugins: [
    tsConfigPaths({
      projects: ['./tsconfig.json'],
    }),
    tanstackStart({
      srcDirectory: 'src',
    }),
    viteReact(),
    robots(),
  ],
})
