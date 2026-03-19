import { mkdirSync, writeFileSync } from 'node:fs'
import { join, resolve } from 'node:path'

import type { Plugin, ResolvedConfig } from 'vite'

import type { Options } from './types'
import { BLOCK_ALL } from './content'
import { getErrorMsg, LOGGER_CLEAR, LOGGER_PREFIX, LOGGER_SUCCESS, logColor, logStart, logSuccess } from './utils'

const BASE_PATH = '/'
const FILE_NAME = 'robots.txt'
const ROBOTS_PATH = `${BASE_PATH}${FILE_NAME}`

export function robots(options: Options = {}): Plugin {
  let config: ResolvedConfig
  let robotsContent = options.content ?? BLOCK_ALL
  const sitemap = options.sitemap ?? ''
  const customOutDir = options.outDir ?? undefined

  if (sitemap) {
    robotsContent += `\n\nSitemap: ${sitemap}`
  }

  return {
    name: 'vite-plugin-robots-ts',

    configResolved(resolvedConfig) {
      config = resolvedConfig
    },

    configureServer(server) {
      server.middlewares.use(ROBOTS_PATH, (_req, res) => {
        res.setHeader('Content-Type', 'text/plain; charset=utf-8')
        res.end(robotsContent)
      })

      config.logger.info(
        `${LOGGER_CLEAR}${LOGGER_SUCCESS} ${LOGGER_PREFIX} Exposed new route: ${logColor('green', ROBOTS_PATH)}`,
      )

      if (customOutDir) {
        config.logger.info(
          `${LOGGER_CLEAR}- ${LOGGER_PREFIX} Custom outDir: ${logColor('green', customOutDir)} (will be used during build)`,
        )
      }
    },

    generateBundle() {
      /**
       * Environment API only available since Vite v6, hence the conditional checking around it.
       * We only want to create robots.txt on the client and only when running a build.
       */
      if (this.environment) {
        if (this.environment.name !== 'client' || this.environment.mode === 'dev') {
          return
        }
      }

      if (customOutDir) {
        try {
          const normalisedOutDir = customOutDir.replace(/^\/+/, '')
          const resolvedOutDir = resolve(config.root, normalisedOutDir)
          const filePath = join(resolvedOutDir, FILE_NAME)

          logStart(config, filePath)

          mkdirSync(resolvedOutDir, { recursive: true })
          writeFileSync(filePath, robotsContent)

          logSuccess(config)
        } catch (err) {
          throw new Error(getErrorMsg(err))
        }

        return
      }

      try {
        const normalisedOutDir = config.build.outDir.endsWith('/server')
          ? config.build.outDir.replace(/\/server$/, '/client')
          : config.build.outDir
        const resolvedOutDir = resolve(config.root, normalisedOutDir)
        const filePath = join(resolvedOutDir, FILE_NAME)

        logStart(config, filePath)

        this.emitFile({
          type: 'asset',
          fileName: FILE_NAME,
          source: robotsContent,
        })

        logSuccess(config)
      } catch (err) {
        throw new Error(getErrorMsg(err))
      }
    },
  }
}
