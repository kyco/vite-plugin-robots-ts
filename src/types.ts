export type Options = {
  /**
   * Custom content for the generated `robots.txt` file.
   *
   * **Default: `BLOCK_ALL`**
   *
   * ---
   *
   * Example:
   * ```typescript
   * import { BLOCK_AI_ALLOW_REST, BLOCK_ALL, robots } from 'vite-plugin-robots-ts'
   *
   * robots({
   *   content:
   *     process.env.NODE_ENV === 'production'
   *       ? BLOCK_AI_ALLOW_REST
   *       : BLOCK_ALL,
   * })
   * ```
   */
  content?: string

  /**
   * Adds a `Sitemap` directive to the generated `robots.txt` file.
   *
   * **Default: `undefined`**
   *
   * ---
   *
   * Example:
   * ```typescript
   * import { robots } from 'vite-plugin-robots-ts'
   *
   * robots({
   *   sitemap: 'https://example.com/sitemap.xml',
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
  sitemap?: string

  /**
   * Custom output directory for the generated `robots.txt` file. When specified, the file is
   * written to this directory instead of the default Vite build output directory.
   *
   * The path is resolved relative to the Vite project root.
   *
   * **Default: `undefined`** (uses Vite's `build.outDir`)
   *
   * ---
   *
   * Example:
   * ```typescript
   * robots({
   *   outDir: 'public',
   * })
   * ```
   */
  outDir?: string
}
