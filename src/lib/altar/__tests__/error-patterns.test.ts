import { describe, test, expect } from 'vitest';
import { getCompiledPatterns, getPatternCounts } from '../error-patterns-loader';

describe('Error Pattern Database', () => {
  test('contains exactly 45 compiled patterns (15 JS, 15 TS, 15 Python)', () => {
    const counts = getPatternCounts();
    expect(counts.javascript).toBe(15);
    expect(counts.typescript).toBe(15);
    expect(counts.python).toBe(15);

    const patterns = getCompiledPatterns();
    expect(patterns).toHaveLength(45);
  });

  test('all patterns have valid regexes, non-empty explanations and solutions', () => {
    const patterns = getCompiledPatterns();
    for (const p of patterns) {
      expect(p.id).toBeTruthy();
      expect(p.regex).toBeInstanceOf(RegExp);
      expect(p.explanation.trim().length).toBeGreaterThan(10);
      expect(p.solutions.length).toBeGreaterThanOrEqual(1);
      for (const sol of p.solutions) {
        expect(sol.trim().length).toBeGreaterThan(5);
      }
    }
  });

  test('matches JavaScript errors accurately', () => {
    const patterns = getCompiledPatterns().filter((p) => p.language === 'javascript');
    const undefinedProp = patterns.find((p) => p.id === 'js-undefined-property');
    expect(undefinedProp?.regex.test("TypeError: Cannot read properties of undefined (reading 'ignite')")).toBe(true);

    const notAFunction = patterns.find((p) => p.id === 'js-not-a-function');
    expect(notAFunction?.regex.test('TypeError: transmutate is not a function')).toBe(true);

    const refError = patterns.find((p) => p.id === 'js-reference-not-defined');
    expect(refError?.regex.test('ReferenceError: philosopherStone is not defined')).toBe(true);
  });

  test('matches TypeScript errors accurately', () => {
    const patterns = getCompiledPatterns().filter((p) => p.language === 'typescript');
    const notExist = patterns.find((p) => p.id === 'ts-property-not-exist');
    expect(notExist?.regex.test("Property 'elixir' does not exist on type 'Grimoire'")).toBe(true);

    const notAssignable = patterns.find((p) => p.id === 'ts-type-not-assignable');
    expect(notAssignable?.regex.test("Type 'string' is not assignable to type 'AlchemicalElement'")).toBe(true);
  });

  test('matches Python errors accurately', () => {
    const patterns = getCompiledPatterns().filter((p) => p.language === 'python');
    const nameError = patterns.find((p) => p.id === 'py-name-not-defined');
    expect(nameError?.regex.test("NameError: name 'homunculus' is not defined")).toBe(true);

    const typeError = patterns.find((p) => p.id === 'py-type-error-args');
    expect(typeError?.regex.test("TypeError: brew() missing 1 required positional argument: 'essence'")).toBe(true);

    const indentError = patterns.find((p) => p.id === 'py-indentation-error');
    expect(indentError?.regex.test('IndentationError: unexpected indent')).toBe(true);
  });
});
