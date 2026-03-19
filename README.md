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
robots({ block: 'all' })
```
*Output:*
```txt
User-agent: *
Disallow: /
```

### Allow all:

```ts
robots({ block: 'none' })
```
*Output:*
```txt
User-agent: *
Disallow:
```

### Block only AI training crawlers:

```ts
robots({ block: 'ai-training' })
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
import { ROBOTS_BLOCK_AI_TRAINING, ROBOTS_BLOCK_ALL, robots } from 'vite-plugin-robots-ts'

robots({
  content:
    process.env.NODE_ENV === 'production'
      ? `${ROBOTS_BLOCK_AI_TRAINING}\n<Custom content here>`
      : ROBOTS_BLOCK_ALL,
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

Sitemap: https://example.com/sitemap.xml`,
})
```
*Output:*
```txt
User-agent: *
Disallow: /admin

Sitemap: https://example.com/sitemap.xml
```

### Append sitemap directive:

```ts
robots({
  block: 'none',
  sitemap: 'https://example.com/sitemap.xml'
})
```
*Output:*
```txt
User-agent: *
Disallow:

Sitemap: https://example.com/sitemap.xml
```

## Options

All options are optional.

| Option  | Type                               | Default | Description                                                                  |
|---------|------------------------------------|---------|------------------------------------------------------------------------------|
| enabled | *boolean*                          | `true`  | Toggle the plugin on or off                                                  |
| block   | `'all' \| 'ai-training' \| 'none'` | `'all'` | Control how robots are blocked                                               |
| content | *string*                           | -       | Custom content for `robots.txt` (takes precedence over the **block** option) |
| sitemap | *string*                           | -       | Adds a `Sitemap` directive to `robots.txt`                                   |
| outDir  | *string*                           | -       | Custom output directory for `robots.txt` (resolved relative to project root) |

## Constants

The plugin exports preset constants that can be used with the `content` option or composed into custom configurations:

| Constant                             | Description                                                   |
|--------------------------------------|---------------------------------------------------------------|
| `ROBOTS_ALLOW_ALL`                   | Allows all robots (`User-agent: * / Disallow:`)               |
| `ROBOTS_BLOCK_ALL`                   | Blocks all robots (`User-agent: * / Disallow: /`)             |
| `ROBOTS_BLOCK_AI_TRAINING`           | Blocks known AI training crawlers only                        |
| `ROBOTS_BLOCK_AI_TRAINING_ALLOW_ALL` | Blocks known AI training crawlers and allows all other robots |

### Usage

```ts
import {
  ROBOTS_ALLOW_ALL,
  ROBOTS_BLOCK_AI_TRAINING,
  ROBOTS_BLOCK_AI_TRAINING_ALLOW_ALL,
  ROBOTS_BLOCK_ALL,
} from 'vite-plugin-robots-ts'
```