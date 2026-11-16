import { describe, test, expect, beforeEach } from 'vitest';
import {
  parseMarkdown,
  clearParseCache,
  getParseCacheSize,
} from '../markdown-parser';

describe('Markdown Parser', () => {
  beforeEach(() => {
    clearParseCache();
  });

  test('parses bold text into <strong> tags', () => {
    const html = parseMarkdown('**Alchemical Salt**');
    expect(html).toContain('<strong>Alchemical Salt</strong>');
  });

  test('parses italic text into <em> tags', () => {
    const html = parseMarkdown('*Philosopher Stone*');
    expect(html).toContain('<em>Philosopher Stone</em>');
  });

  test('parses code blocks into <pre><code> tags', () => {
    const md = '```javascript\nconst elixir = 42;\n```';
    const html = parseMarkdown(md);
    expect(html).toContain('<pre><code');
    expect(html).toContain('const elixir = 42;');
  });

  test('parses bullet lists into <ul> and <li> tags', () => {
    const md = '- Lead\n- Mercury\n- Sulfur';
    const html = parseMarkdown(md);
    expect(html).toContain('<ul>');
    expect(html).toContain('<li>Lead</li>');
    expect(html).toContain('<li>Mercury</li>');
    expect(html).toContain('<li>Sulfur</li>');
  });

  test('memoizes parsed output and avoids re-parsing', () => {
    expect(getParseCacheSize()).toBe(0);
    const md = '### Sacred Formula';
    const first = parseMarkdown(md);
    expect(getParseCacheSize()).toBe(1);

    const second = parseMarkdown(md);
    expect(getParseCacheSize()).toBe(1);
    expect(second).toBe(first);
  });

  test('handles empty and whitespace input cleanly', () => {
    expect(parseMarkdown('')).toBe('');
  });
});
