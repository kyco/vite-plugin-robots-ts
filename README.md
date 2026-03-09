# vite-plugin-robots-ts

A Vite plugin to generate `robots.txt`. Supports blocking AI training crawlers and also works in development mode by proxying middleware to `/robots.txt`.

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
    robots(), // blocks all robots by default
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
```

### Use built-in presets:

```ts
import { ROBOTS_BLOCK_AI_TRAINING, ROBOTS_BLOCK_ALL, robots } from 'vite-plugin-robots-ts'

robots({
  content: process.env.NODE_ENV === 'production' ? ROBOTS_BLOCK_AI_TRAINING : ROBOTS_BLOCK_ALL,
})
```
*Output (production):*
```txt (production)
User-agent: Amazonbot
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

## Options

All options are optional.

| Option  | Type                               | Default | Description                                              |
|---------|------------------------------------|---------|----------------------------------------------------------|
| enabled | *boolean*                          | `true`  | Toggle the plugin on or off                              |
| block   | `'all' \| 'ai-training' \| 'none'` | `'all'` | Control how robots are blocked                           |
| content | *string*                           | -   | Custom `robots.txt` content (overrides **block** option) |
