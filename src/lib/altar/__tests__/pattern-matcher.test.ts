import { describe, test, expect } from 'vitest';
import {
  analyzeError,
  matchErrorPatternSync,
  FALLBACK_NO_MATCH_MESSAGE,
} from '../pattern-matcher';

describe('Bug Exorcism Pattern Matcher', () => {
  test('matchErrorPatternSync accurately matches JavaScript undefined error', () => {
    const errorText = "TypeError: Cannot read properties of undefined (reading 'transmute')";
    const match = matchErrorPatternSync(errorText);
    expect(match).not.toBeNull();
    expect(match?.language).toBe('javascript');
    expect(match?.explanation).toBeTruthy();
    expect(match?.solutions.length).toBeGreaterThan(0);
  });

  test('matchErrorPatternSync accurately matches TypeScript type mismatch', () => {
    const errorText = "Type 'string' is not assignable to type 'AlchemicalElement'";
    const match = matchErrorPatternSync(errorText);
    expect(match).not.toBeNull();
    expect(match?.language).toBe('typescript');
  });

  test('matchErrorPatternSync accurately matches Python NameError', () => {
    const errorText = "NameError: name 'homunculus' is not defined";
    const match = matchErrorPatternSync(errorText);
    expect(match).not.toBeNull();
    expect(match?.language).toBe('python');
  });

  test('returns fallback message for unknown occult errors', async () => {
    const result = await analyzeError('Some completely bizarre unknown non-standard error text 12345');
    expect(result.matched).toBe(false);
    expect(result.pattern).toBeUndefined();
    expect(result.fallbackMessage).toBe(FALLBACK_NO_MATCH_MESSAGE);
  });

  test('completes async analysis within 200ms SLA', async () => {
    const startTime = Date.now();
    const result = await analyzeError("TypeError: Cannot read properties of undefined (reading 'ignite')", {
      timeoutMs: 200,
    });
    const duration = Date.now() - startTime;

    expect(duration).toBeLessThanOrEqual(200);
    expect(result.matched).toBe(true);
    expect(result.pattern?.id).toBe('js-undefined-property');
    expect(result.matchedLanguage).toBe('javascript');
  });

  test('handles empty or whitespace input gracefully', async () => {
    const result = await analyzeError('   ');
    expect(result.matched).toBe(false);
    expect(result.fallbackMessage).toBe(FALLBACK_NO_MATCH_MESSAGE);
  });
});
