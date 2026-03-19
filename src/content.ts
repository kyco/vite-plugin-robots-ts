export const ALLOW_ALL = `User-agent: *
Disallow:
`

export const BLOCK_ALL = `User-agent: *
Disallow: /
`

export const BLOCK_AI = `User-agent: Amazonbot
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

export const BLOCK_AI_ALLOW_REST = `${BLOCK_AI}\n${ALLOW_ALL}`
