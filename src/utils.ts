export const ROBOTS_ALLOW_ALL = `User-agent: *
Disallow:
`

export const ROBOTS_BLOCK_ALL = `User-agent: *
Disallow: /
`

export const ROBOTS_BLOCK_AI_TRAINING = `User-agent: Amazonbot
User-agent: Applebot-Extended
User-agent: Bytespider
User-agent: CCBot
User-agent: ClaudeBot
User-agent: Google-Extended
User-agent: GPTBot
User-agent: meta-externalagent
Disallow: /

User-agent: *
Disallow:
`

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
