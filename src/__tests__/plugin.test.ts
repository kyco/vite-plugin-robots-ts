import { mkdirSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'

import { describe, expect, it, vi } from 'vitest'

import type { Options } from '../types'
import { ALLOW_ALL, BLOCK_AI, BLOCK_AI_ALLOW_REST, BLOCK_ALL } from '../content'
import { robots } from '../plugin'

vi.mock('node:fs', () => ({
  mkdirSync: vi.fn(),
  writeFileSync: vi.fn(),
}))

const mockLogger = { info: vi.fn() }
const mockConfig = {
  root: '/project',
  build: { outDir: 'dist' },
  logger: mockLogger,
}

const getPlugin = (options: Options = {}) => {
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
    describe('- `outDir`', () => {
      it('should write robots.txt to the custom outDir', () => {
        const plugin = getPlugin({ outDir: 'custom-out' })
        const emitFile = vi.fn()
        plugin.generateBundle.call({ emitFile })

        expect(emitFile).not.toHaveBeenCalled()
        expect(mkdirSync).toHaveBeenCalledWith(resolve('/project', 'custom-out'), {
          recursive: true,
        })
        expect(writeFileSync).toHaveBeenCalledWith(resolve('/project', 'custom-out', 'robots.txt'), BLOCK_ALL)
      })

      it('should resolve absolute outDir paths relative to project root', () => {
        vi.mocked(mkdirSync).mockClear()
        const plugin = getPlugin({ outDir: '/bano' })
        const emitFile = vi.fn()
        plugin.generateBundle.call({ emitFile })

        expect(mkdirSync).toHaveBeenCalledWith(resolve('/project', 'bano'), { recursive: true })
      })

      it('should write custom content to custom outDir', () => {
        vi.mocked(writeFileSync).mockClear()
        const custom = 'User-agent: *\nAllow: /\n'
        const plugin = getPlugin({ outDir: 'custom-out', content: custom })
        const emitFile = vi.fn()
        plugin.generateBundle.call({ emitFile })

        expect(emitFile).not.toHaveBeenCalled()
        expect(writeFileSync).toHaveBeenCalledWith(resolve('/project', 'custom-out', 'robots.txt'), custom)
      })

      it('should throw when mkdirSync fails', () => {
        vi.mocked(mkdirSync).mockImplementationOnce(() => {
          throw new Error('permission denied')
        })

        const plugin = getPlugin({ outDir: 'custom-out' })
        const emitFile = vi.fn()

        expect(() => plugin.generateBundle.call({ emitFile })).toThrow('Failed to write robots.txt!')
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
    })

    describe('- `sitemap`', () => {
      it('should append sitemap directive to default content', () => {
        const plugin = getPlugin({ sitemap: 'https://example.com/sitemap.xml' })
        const emitFile = vi.fn()
        plugin.generateBundle.call({ emitFile })

        expect(emitFile).toHaveBeenCalledWith(
          expect.objectContaining({
            source: `${BLOCK_ALL}\n\nSitemap: https://example.com/sitemap.xml`,
          }),
        )
      })

      it('should append sitemap directive to custom content', () => {
        const custom = 'User-agent: *\nAllow: /\n'
        const plugin = getPlugin({ content: custom, sitemap: 'https://example.com/sitemap.xml' })
        const emitFile = vi.fn()
        plugin.generateBundle.call({ emitFile })

        expect(emitFile).toHaveBeenCalledWith(
          expect.objectContaining({
            source: `${custom}\n\nSitemap: https://example.com/sitemap.xml`,
          }),
        )
      })

      it('should not append sitemap directive when sitemap is empty', () => {
        const plugin = getPlugin({ sitemap: '' })
        const emitFile = vi.fn()
        plugin.generateBundle.call({ emitFile })

        expect(emitFile).toHaveBeenCalledWith(expect.objectContaining({ source: BLOCK_ALL }))
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
      const plugin = getPlugin()
      const use = vi.fn()
      plugin.configureServer({ middlewares: { use } })

      const handler = use.mock.calls[0][1]
      const res = { setHeader: vi.fn(), end: vi.fn() }
      handler({}, res)

      expect(res.setHeader).toHaveBeenCalledWith('Content-Type', 'text/plain; charset=utf-8')
      expect(res.end).toHaveBeenCalledWith(BLOCK_ALL)
    })
  })

  describe('- hook:generateBundle()', () => {
    it('should emit robots.txt in the client bundle only (Vite v6+)', () => {
      const plugin = getPlugin()
      const emitFile = vi.fn()

      plugin.generateBundle.call({ emitFile, environment: { name: 'ssr' } })
      expect(emitFile).not.toHaveBeenCalled()

      plugin.generateBundle.call({ emitFile, environment: { name: 'client' } })
      expect(emitFile).toHaveBeenCalledTimes(1)
    })

    it('should skip emit when environment mode is dev (Vite v6+)', () => {
      const plugin = getPlugin()
      const emitFile = vi.fn()

      plugin.generateBundle.call({ emitFile, environment: { name: 'client', mode: 'dev' } })
      expect(emitFile).not.toHaveBeenCalled()
    })

    it('should rewrite /server outDir to /client for SSR builds', () => {
      const plugin = robots() as any
      plugin.configResolved({
        ...mockConfig,
        build: { outDir: 'dist/server' },
      })
      const emitFile = vi.fn()
      plugin.generateBundle.call({ emitFile })

      expect(mockLogger.info).toHaveBeenCalledWith(expect.stringContaining('dist/client'))
    })

    it('should emit robots.txt when Environment API is not available (Vite pre v6)', () => {
      const plugin = getPlugin()
      const emitFile = vi.fn()

      plugin.generateBundle.call({ emitFile })
      expect(emitFile).toHaveBeenCalledTimes(1)
    })

    it('should throw when robots.txt generation fails', () => {
      const plugin = getPlugin()
      const emitFile = vi.fn(() => {
        throw new Error('fail')
      })

      expect(() => plugin.generateBundle.call({ emitFile })).toThrow('Failed to write robots.txt! fail')
    })
  })

  describe('- exported constants', () => {
    it('should export ALLOW_ALL with "allow all" policy', () => {
      expect(ALLOW_ALL).toContain('User-agent: *\nDisallow:\n')
    })

    it('should export BLOCK_ALL with "block all" policy', () => {
      expect(BLOCK_ALL).toContain('User-agent: *\nDisallow: /\n')
    })

    it('should export BLOCK_AI without "allow all" policy', () => {
      expect(BLOCK_AI).toContain('User-agent: Amazonbot')
      expect(BLOCK_AI).toContain('User-agent: Applebot-Extended')
      expect(BLOCK_AI).toContain('User-agent: Bytespider')
      expect(BLOCK_AI).toContain('User-agent: CCBot')
      expect(BLOCK_AI).toContain('User-agent: ClaudeBot')
      expect(BLOCK_AI).toContain('User-agent: Google-Extended')
      expect(BLOCK_AI).toContain('User-agent: GPTBot')
      expect(BLOCK_AI).toContain('User-agent: meta-externalagent')
      expect(BLOCK_AI).not.toContain('User-agent: *\nDisallow:\n')
    })

    it('should export BLOCK_AI_ALLOW_REST with "allow all" policy', () => {
      expect(BLOCK_AI_ALLOW_REST).toContain('User-agent: Amazonbot')
      expect(BLOCK_AI_ALLOW_REST).toContain('User-agent: Applebot-Extended')
      expect(BLOCK_AI_ALLOW_REST).toContain('User-agent: Bytespider')
      expect(BLOCK_AI_ALLOW_REST).toContain('User-agent: CCBot')
      expect(BLOCK_AI_ALLOW_REST).toContain('User-agent: ClaudeBot')
      expect(BLOCK_AI_ALLOW_REST).toContain('User-agent: Google-Extended')
      expect(BLOCK_AI_ALLOW_REST).toContain('User-agent: GPTBot')
      expect(BLOCK_AI_ALLOW_REST).toContain('User-agent: meta-externalagent')
      expect(BLOCK_AI_ALLOW_REST).toContain('User-agent: *\nDisallow:')
    })
  })
})
