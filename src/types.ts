export type Options = {
  /**
   * Toggle the plugin on or off. Useful if you want to disable the plugin, e.g. in development mode.
   *
   * **Default: `true`**
   */
  enabled?: boolean

  /**
   * Control how robots are blocked. When the `content` option is also provided, the `content` option will take precedence.
   *
   * **Default: `'all'`**
   *
   * ---
   * `'all'` — Block all robots:
   *
   * ```bash
   * User-agent: *
   * Disallow: /
   * ```
   *
   * ---
   *
   * `'none'` — Allow all robots:
   *
   * ```bash
   * User-agent: *
   * Disallow:
   * ```
   *
   * ---
   *
   * `'ai-training'` — Block known AI training crawlers, allow everything else:
   *
   * ```bash
   * User-agent: Amazonbot
   * Disallow: /
   *
   * User-agent: Applebot-Extended
   * Disallow: /
   *
   * User-agent: Bytespider
   * Disallow: /
   *
   * User-agent: CCBot
   * Disallow: /
   *
   * User-agent: ClaudeBot
   * Disallow: /
   *
   * User-agent: Google-Extended
   * Disallow: /
   *
   * User-agent: GPTBot
   * Disallow: /
   *
   * User-agent: meta-externalagent
   * Disallow: /
   *
   * User-agent: *
   * Disallow:
   * ```
   */
  block?: 'all' | 'ai-training' | 'none'

  /**
   * Custom content for the generated `robots.txt` file. This option always takes precedence over the `block` option.
   *
   * **Default: `undefined`**
   *
   * ---
   *
   * Example:
   * ```typescript
   * import { ROBOTS_ALLOW_ALL, ROBOTS_BLOCK_ALL, ROBOTS_BLOCK_AI_TRAINING, robots } from 'vite-plugin-robots-ts'
   *
   * robots({
   *   content: process.env.NODE_ENV === 'production' ? ROBOTS_BLOCK_AI_TRAINING : ROBOTS_BLOCK_ALL,
   * })
   * ```
   */
  content?: string

  /**
   * Adds a `Sitemap` directive to the generated `robots.txt` file.
   *
   * **Default: `''`**
   *
   * ---
   *
   * Example:
   * ```typescript
   * robots({
   *   sitemapUrl: 'https://example.com/sitemap.xml',
   * })
   * ```
   *
   * Output:
   * ```bash
   * User-agent: *
   * Disallow: /
   *
   * Sitemap: https://example.com/sitemap.xml
   * ```
   */
  sitemapUrl?: string
}
