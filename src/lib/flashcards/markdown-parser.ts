/**
 * Markdown Parser
 * Parses markdown syntax to HTML using the marked library.
 * Supports bold, italic, code blocks, bullet lists, and tables.
 * Includes memoization to avoid re-parsing identical content.
 * Validates Requirements 4.3, 4.4
 */

import { marked } from 'marked';

// Configure marked for Grimoire flashcards
marked.setOptions({
  gfm: true,
  breaks: true,
});

// Memoization cache: markdown string → HTML string
const parseCache = new Map<string, string>();
const MAX_CACHE_SIZE = 200;

/**
 * Parse markdown string to HTML with memoization.
 * Returns consistent HTML structure:
 *  - bold (**text**) → <strong>
 *  - italic (*text*) → <em>
 *  - code blocks (```code```) → <pre><code>
 *  - inline code (`code`) → <code>
 *  - bullet lists (- item) → <ul><li>
 */
export function parseMarkdown(markdown: string): string {
  if (!markdown) return '';

  const cached = parseCache.get(markdown);
  if (cached !== undefined) return cached;

  const html = marked.parse(markdown, { async: false }) as string;

  // Evict oldest entries if cache exceeds limit
  if (parseCache.size >= MAX_CACHE_SIZE) {
    const firstKey = parseCache.keys().next().value;
    if (firstKey !== undefined) {
      parseCache.delete(firstKey);
    }
  }

  parseCache.set(markdown, html);
  return html;
}

/**
 * Parse markdown synchronously (alias for parseMarkdown).
 */
export function parseMarkdownSync(markdown: string): string {
  return parseMarkdown(markdown);
}

/**
 * Clear the markdown parse cache.
 */
export function clearParseCache(): void {
  parseCache.clear();
}

/**
 * Get the current cache size (for diagnostics).
 */
export function getParseCacheSize(): number {
  return parseCache.size;
}
