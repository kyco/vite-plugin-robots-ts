# vite-plugin-robots-ts

A Vite plugin to generate a `robots.txt` file. Supports blocking AI training crawlers and also works in development mode by creating middleware to create `/robots.txt`.

## Installation

```bash
npm install -D vite-plugin-robots-ts
```

## Usage

```ts
// vite.config.ts
import { defineConfig } from 'vite'
import { robots } from 'vite-plugin-robots-ts'

export default defineConfig({
  plugins: [
    robots(), // blocks all robots by default
  ],
})
```

### Examples

Block only AI training crawlers:

```ts
robots({
  block: 'ai-training'
})
```

Allow all robots:

```ts
robots({
  block: 'none'
})
```

Custom content using built-in presets:

```ts
import { ROBOTS_BLOCK_AI_TRAINING, ROBOTS_BLOCK_ALL, robots } from 'vite-plugin-robots-ts'

robots({
  content: process.env.NODE_ENV === 'production' ? ROBOTS_BLOCK_AI_TRAINING : ROBOTS_BLOCK_ALL,
})
```

### Options

All options are optional.

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| enabled | *boolean* | `true` | Toggle the plugin on or off |
| block | *`'all' \| 'ai-training' \| 'none'`* | `'all'` | Control how robots are blocked |
| content | *string* | N/A | Custom `robots.txt` content (overrides **block** option) |
