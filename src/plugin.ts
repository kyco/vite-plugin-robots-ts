import type { Plugin, ResolvedConfig } from 'vite'

import type { Options } from './types'
import {
  LOGGER_CLEAR,
  LOGGER_FAILURE,
  LOGGER_PREFIX,
  LOGGER_SUCCESS,
  logColor,
  ROBOTS_ALLOW_ALL,
  ROBOTS_BLOCK_AI_TRAINING,
  ROBOTS_BLOCK_ALL,
} from './utils'

const BASE_PATH = '/'
const FILE_NAME = 'robots.txt'
const ROBOTS_PATH = `${BASE_PATH}${FILE_NAME}`

export function robots(options: Options = {}): Plugin {
  let config: ResolvedConfig
  let success = false
  let robotsContent = ''

  const enabled = options.enabled ?? true
  const block = options.block ?? 'all'
  const content = options.content ?? undefined
  const sitemap = options.sitemap ?? ''

  if (content) {
    robotsContent = content
  } else {
    switch (block) {
      case 'ai-training':
        robotsContent = ROBOTS_BLOCK_AI_TRAINING
        break
      case 'none':
        robotsContent = ROBOTS_ALLOW_ALL
        break
      default:
        robotsContent = ROBOTS_BLOCK_ALL
    }
  }

  if (sitemap) {
    robotsContent += `\n\nSitemap: ${sitemap}`
  }

  return {
    name: 'vite-plugin-robots-ts',

    apply: () => enabled,

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
    },

    generateBundle() {
      /**
       * Environment API only available since Vite v6, hence the conditional checking around it.
       * We only want to emit the robots.txt on the client.
       */
      if (this.environment?.name && this.environment.name !== 'client') {
        return
      }

      config.logger.info(
        `\n- ${LOGGER_CLEAR}${LOGGER_PREFIX} Writing robots.txt at ${config.build.outDir}${ROBOTS_PATH}`,
      )

      try {
        this.emitFile({
          type: 'asset',
          fileName: FILE_NAME,
          source: robotsContent,
        })
        success = true
      } catch (_err) {
        success = false
      }

      config.logger.info(
        `${LOGGER_CLEAR}${success ? LOGGER_SUCCESS : LOGGER_FAILURE} ${LOGGER_PREFIX} ${success ? `Success` : `Failed writing robots.txt!`}`,
      )
    },
  }
}
