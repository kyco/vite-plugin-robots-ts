import type { ResolvedConfig } from 'vite'

export const ROBOTS_ALLOW_ALL = `User-agent: *
Disallow:
`

export const ROBOTS_BLOCK_ALL = `User-agent: *
Disallow: /
`

export const ROBOTS_BLOCK_AI_TRAINING = `User-agent: Amazonbot
Disallow: /

User-agent: Applebot-Extended
Disallow: /

User-agent: Bytespider
Disallow: /

User-agent: CCBot
Disallow: /

User-agent: ClaudeBot
Disallow: /

User-agent: Google-Extended
Disallow: /

User-agent: GPTBot
Disallow: /

User-agent: meta-externalagent
Disallow: /
`

export const ROBOTS_BLOCK_AI_TRAINING_ALLOW_ALL = `${ROBOTS_BLOCK_AI_TRAINING}\n${ROBOTS_ALLOW_ALL}`

export const logColor = (color: 'red' | 'green' | 'yellow', text: string, bold = false) => {
  const colorCode = {
    red: bold ? '\x1b[1;31m' : '\x1b[31m',
    green: bold ? '\x1b[1;32m' : '\x1b[32m',
    yellow: bold ? '\x1b[1;33m' : '\x1b[33m',
  }

  return `${colorCode[color]}${text}${LOGGER_CLEAR}`
}

export const LOGGER_CLEAR = '\x1b[0m'
export const LOGGER_PREFIX = logColor('yellow', '[robots-ts]', true)
export const LOGGER_SUCCESS = logColor('green', '✓', true)
export const LOGGER_FAILURE = logColor('red', '✗', true)

export const logStart = (config: ResolvedConfig, path: string) => {
  config.logger.info(`\n${LOGGER_CLEAR}- ${LOGGER_PREFIX} Writing robots.txt at ${path}`)
}

export const logSuccess = (config: ResolvedConfig) => {
  config.logger.info(`${LOGGER_CLEAR}${LOGGER_SUCCESS} ${LOGGER_PREFIX} Success`)
}

export const getErrorMsg = (err: unknown) => {
  return `Failed to write robots.txt! ${err instanceof Error ? err.message : String(err)}`
}
