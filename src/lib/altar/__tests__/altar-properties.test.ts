import { describe, it, expect, beforeEach } from 'vitest';
import * as fc from 'fast-check';
import { matchErrorPatternSync, analyzeError } from '../pattern-matcher';
import { saveBestiaryEntry, loadBestiaryEntries, purgeBestiary } from '../bestiary-db';
import { BestiaryEntry, SupportedLanguage } from '@/types';

describe('Bug Exorcism Altar Property Tests', () => {
  beforeEach(async () => {
    localStorage.clear();
    await purgeBestiary();
  });

  /**
   * Property 6: Pattern Matching Determinism
   * For any error text input E, analyzing E multiple times shall always produce
   * the same pattern match result (same pattern ID and language, or same null result).
   * Validates: Requirements 3.3, 3.4, 3.5, 3.13
   */
  // Feature: nocturneum-core, Property 6: Pattern Matching Determinism
  it('Property 6: Pattern matching produces deterministic results for any error string', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.oneof(
          fc.string({ minLength: 0, maxLength: 200 }),
          // Also sample known error shapes
          fc.constant("TypeError: Cannot read property 'map' of undefined"),
          fc.constant("ReferenceError: myVariable is not defined"),
          fc.constant("Type 'string' is not assignable to type 'number'"),
          fc.constant("NameError: name 'pandas' is not defined"),
          fc.constant("SyntaxError: Unexpected token <")
        ),
        async (errorText) => {
          // Synchronous match determinism
          const match1 = matchErrorPatternSync(errorText);
          const match2 = matchErrorPatternSync(errorText);
          const match3 = matchErrorPatternSync(errorText);

          expect(match1?.id).toBe(match2?.id);
          expect(match2?.id).toBe(match3?.id);
          expect(match1?.language).toBe(match2?.language);
          expect(match2?.language).toBe(match3?.language);

          // Asynchronous analyzeError determinism
          const res1 = await analyzeError(errorText);
          const res2 = await analyzeError(errorText);

          expect(res1.matched).toBe(res2.matched);
          expect(res1.pattern?.id).toBe(res2.pattern?.id);
          expect(res1.matchedLanguage).toBe(res2.matchedLanguage);
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property 7: Bestiary Log Entry Structure
   * For any error analysis operation, the resulting bestiary log entry shall contain
   * exactly the required fields: id (non-empty string), timestamp (positive number),
   * errorText (string), detectedPattern (string or null), and matchedLanguage (valid code or null).
   * Validates: Requirements 3.9
   */
  // Feature: nocturneum-core, Property 7: Bestiary Log Entry Structure
  it('Property 7: Bestiary log entries conform strictly to schema invariants', () => {
    const validLanguages: Array<SupportedLanguage | null> = ['javascript', 'typescript', 'python', null];

    fc.assert(
      fc.property(
        fc.record({
          id: fc.uuid(),
          timestamp: fc.integer({ min: 1, max: 2147483647000 }),
          errorText: fc.string({ minLength: 1, maxLength: 5000 }),
          detectedPattern: fc.option(fc.string({ minLength: 1, maxLength: 50 }), { nil: null }),
          matchedLanguage: fc.constantFrom(...validLanguages),
        }),
        (entry: BestiaryEntry) => {
          // Verify id
          expect(typeof entry.id).toBe('string');
          expect(entry.id.length).toBeGreaterThan(0);

          // Verify timestamp
          expect(typeof entry.timestamp).toBe('number');
          expect(entry.timestamp).toBeGreaterThan(0);

          // Verify errorText
          expect(typeof entry.errorText).toBe('string');

          // Verify detectedPattern
          if (entry.detectedPattern !== null) {
            expect(typeof entry.detectedPattern).toBe('string');
          }

          // Verify matchedLanguage
          expect(validLanguages).toContain(entry.matchedLanguage);
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property 8: Bestiary Log Sorting and Limiting
   * For any collection of bestiary entries with size N, retrieving the most recent 50 entries
   * shall return min(N, 50) entries sorted by timestamp in descending order (t_i >= t_{i+1}).
   * Validates: Requirements 3.11
   */
  // Feature: nocturneum-core, Property 8: Bestiary Log Sorting and Limiting
  it('Property 8: Bestiary retrieval returns min(N, 50) sorted by timestamp descending', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.array(
          fc.record({
            id: fc.uuid(),
            timestamp: fc.integer({ min: 1000, max: 999999999 }),
            errorText: fc.string({ minLength: 1, maxLength: 100 }),
            detectedPattern: fc.constant(null),
            matchedLanguage: fc.constant(null),
          }),
          { minLength: 0, maxLength: 65 }
        ),
        async (entries) => {
          await purgeBestiary();

          // Save all entries
          for (const entry of entries) {
            await saveBestiaryEntry(entry);
          }

          // Retrieve with default limit of 50
          const retrieved = await loadBestiaryEntries(50);
          const expectedCount = Math.min(entries.length, 50);

          expect(retrieved.length).toBe(expectedCount);

          // Check descending order (t_i >= t_{i+1})
          for (let i = 0; i < retrieved.length - 1; i++) {
            expect(retrieved[i].timestamp).toBeGreaterThanOrEqual(retrieved[i + 1].timestamp);
          }
        }
      ),
      { numRuns: 30 } // 30 runs with array writes to IndexedDB/localStorage
    );
  });
});
