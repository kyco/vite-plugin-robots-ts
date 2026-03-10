import { describe, expect, it, vi } from 'vitest'

import { robots } from '../plugin'
import { ROBOTS_ALLOW_ALL, ROBOTS_BLOCK_AI_TRAINING, ROBOTS_BLOCK_ALL } from '../utils'

const mockLogger = { info: vi.fn() }
const mockConfig = {
  build: { outDir: 'dist' },
  logger: mockLogger,
}

const getPlugin = (options = {}) => {
  const plugin = robots(options) as any
  plugin.configResolved(mockConfig)
  return plugin
}

describe('+ robots()', () => {
  it('should return a plugin with the correct name', () => {
    const plugin = robots()
    expect(plugin.name).toBe('vite-plugin-robots-ts')
  })

  describe('- options', () => {
    describe('- `enabled`', () => {
      it('should be `true` by default', () => {
        const plugin = robots() as any
        expect(plugin.apply()).toBe(true)
      })

      it('should be disabled when `enabled: false`', () => {
        const plugin = robots({ enabled: false }) as any
        expect(plugin.apply()).toBe(false)
      })
    })

    describe('- `block`', () => {
      it('should default to blocking all robots', () => {
        const plugin = getPlugin()
        const emitFile = vi.fn()
        plugin.generateBundle.call({ emitFile })

        expect(emitFile).toHaveBeenCalledWith({
          type: 'asset',
          fileName: 'robots.txt',
          source: ROBOTS_BLOCK_ALL,
        })
      })

      it('should allow all when `block: "none"`', () => {
        const plugin = getPlugin({ block: 'none' })
        const emitFile = vi.fn()
        plugin.generateBundle.call({ emitFile })

        expect(emitFile).toHaveBeenCalledWith({
          type: 'asset',
          fileName: 'robots.txt',
          source: ROBOTS_ALLOW_ALL,
        })
      })

      it('should block only AI crawlers when `block: "ai-training"`', () => {
        const plugin = getPlugin({ block: 'ai-training' })
        const emitFile = vi.fn()
        plugin.generateBundle.call({ emitFile })

        expect(emitFile).toHaveBeenCalledWith({
          type: 'asset',
          fileName: 'robots.txt',
          source: ROBOTS_BLOCK_AI_TRAINING,
        })
      })
    })

    describe('- `content`', () => {
      it('should return user provided content', () => {
        const custom = 'User-agent: *\nAllow: /public\nDisallow: /private\n'
        const plugin = getPlugin({ content: custom })
        const emitFile = vi.fn()
        plugin.generateBundle.call({ emitFile })

        expect(emitFile).toHaveBeenCalledWith({
          type: 'asset',
          fileName: 'robots.txt',
          source: custom,
        })
      })

      it('should take precedence over `block` option', () => {
        const custom = 'Sitemap: https://example.com/sitemap.xml\n'
        const plugin = getPlugin({ block: 'none', content: custom })
        const emitFile = vi.fn()
        plugin.generateBundle.call({ emitFile })

        expect(emitFile).toHaveBeenCalledWith(expect.objectContaining({ source: custom }))
      })
    })
  })

  describe('- dev server middleware', () => {
    it('should register middleware on /robots.txt', () => {
      const plugin = getPlugin()
      const use = vi.fn()
      const server = { middlewares: { use } }

      plugin.configureServer(server)

      expect(use).toHaveBeenCalledWith('/robots.txt', expect.any(Function))
    })

    it('should serve robots.txt with correct headers', () => {
      const plugin = getPlugin({ block: 'none' })
      const use = vi.fn()
      plugin.configureServer({ middlewares: { use } })

      const handler = use.mock.calls[0][1]
      const res = { setHeader: vi.fn(), end: vi.fn() }
      handler({}, res)

      expect(res.setHeader).toHaveBeenCalledWith('Content-Type', 'text/plain; charset=utf-8')
      expect(res.end).toHaveBeenCalledWith(ROBOTS_ALLOW_ALL)
    })
  })

  describe('- hook:generateBundle()', () => {
    it('should fail gracefully when robots.txt generation fails', () => {
      const plugin = getPlugin()
      const emitFile = vi.fn(() => {
        throw new Error('fail')
      })

      expect(() => plugin.generateBundle.call({ emitFile })).not.toThrow()
    })
  })
})
