# vite-plugin-robots-ts

A Vite plugin to generate `robots.txt`. Supports blocking AI training crawlers and works in development mode by proxying middleware to `/robots.txt`.

## Installation

```bash
npm install -D vite-plugin-robots-ts
pnpm add -D vite-plugin-robots-ts
yarn add -D vite-plugin-robots-ts
bun add -D vite-plugin-robots-ts
deno add -D npm:vite-plugin-robots-ts
```

## Usage

```ts
// vite.config.ts
import { robots } from 'vite-plugin-robots-ts'

export default {
  plugins: [
    robots(), // block all robots by default
  ],
}
```

## Examples

### Block all (default):

```ts
robots()

// or

import { BLOCK_ALL, robots } from 'vite-plugin-robots-ts'

robots({ content: BLOCK_ALL })
```
*Output:*
```txt
User-agent: *
Disallow: /
```

### Allow all:

```ts
import { ALLOW_ALL, robots } from 'vite-plugin-robots-ts'

robots({ content: ALLOW_ALL })
```
*Output:*
```txt
User-agent: *
Disallow:
```

### Block only AI training crawlers (allow rest):

```ts
import { BLOCK_AI_ALLOW_REST, robots } from 'vite-plugin-robots-ts'

robots({ content: BLOCK_AI_ALLOW_REST })
```
*Output:*
```txt
User-agent: Amazonbot
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

User-agent: *
Disallow:
```

### Use built-in presets:

```ts
import { BLOCK_AI, BLOCK_ALL, robots } from 'vite-plugin-robots-ts'

robots({
  content:
    process.env.NODE_ENV === 'production'
      ? `${BLOCK_AI}\n<Custom content here>`
      : BLOCK_ALL,
})
```
*Output (production):*
```txt (production)
User-agent: Amazonbot
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

<Custom content here>
```
*Output (all other environments):*
```txt (other)
User-agent: *
Disallow: /
```

### Use custom content:

```ts
robots({
  content: `User-agent: *
Disallow: /admin
Disallow: /secret`,
})
```
*Output:*
```txt
User-agent: *
Disallow: /admin
Disallow: /secret
```

### Append sitemap directive:

```ts
import { ALLOW_ALL, robots } from 'vite-plugin-robots-ts'

robots({
  content: ALLOW_ALL,
  sitemap: 'https://example.com/sitemap.xml'
})
```
*Output:*
```txt
User-agent: *
Disallow:

Sitemap: https://example.com/sitemap.xml
```

### Multiple sitemaps:

```ts
import { ALLOW_ALL, robots } from 'vite-plugin-robots-ts'

robots({
  content: ALLOW_ALL,
  sitemap: [
    'https://example.com/sitemap.xml',
    'https://example.com/sitemap-news.xml',
  ]
})
```
*Output:*
```txt
User-agent: *
Disallow:

Sitemap: https://example.com/sitemap.xml
Sitemap: https://example.com/sitemap-news.xml
```

## Options

All options are optional.

| Option  | Type                 | Default     | Description                                                                  |
|---------|----------------------|-------------|------------------------------------------------------------------------------|
| content | *string*             | `BLOCK_ALL` | Custom content for `robots.txt`                                              |
| sitemap | *string \| string[]* | -           | Adds `Sitemap` directive(s) to `robots.txt`                                  |
| outDir  | *string*             | -           | Custom output directory for `robots.txt` (resolved relative to project root) |

## Constants

The plugin exports preset constants that can be used with the `content` option or composed into custom configurations:

| Constant              | Description                                                   |
|-----------------------|---------------------------------------------------------------|
| `ALLOW_ALL`           | Allows all robots (`User-agent: * / Disallow:`)               |
| `BLOCK_ALL`           | Blocks all robots (`User-agent: * / Disallow: /`)             |
| `BLOCK_AI`            | Blocks known AI training crawlers only                        |
| `BLOCK_AI_ALLOW_REST` | Blocks known AI training crawlers and allows all other robots |

### Usage

```ts
import {
  ALLOW_ALL,
  BLOCK_ALL,
  BLOCK_AI,
  BLOCK_AI_ALLOW_REST,
} from 'vite-plugin-robots-ts'
```