// Feature: nocturneum-core, Property 14: Demo Data Schema Consistency
import { describe, test, expect } from 'vitest';
import * as fc from 'fast-check';
import {
  DEMO_FLASHCARD_DECKS,
  DEMO_BESTIARY_ENTRIES,
  DEMO_TIMER_STATE,
} from '../demo-seeder';
import {
  validateFlashcardData,
  validateBestiaryEntry,
  validateBestiaryLog,
  validateTimerState,
  validateStorageData,
} from '@/lib/storage/schema-validator';
import { FlashcardDeck, BestiaryEntry } from '@/types';

describe('Property 14: Demo Data Schema Consistency', () => {
  // Validates: Requirement 7.8
  test('all demo flashcard decks satisfy exact user flashcard schema with zero errors', () => {
    const data = {
      decks: DEMO_FLASHCARD_DECKS,
      lastActiveDeckId: DEMO_FLASHCARD_DECKS[0].id,
    };
    const result = validateFlashcardData(data);
    expect(result.isValid).toBe(true);
    expect(result.errors).toHaveLength(0);
    expect(result.data).not.toBeNull();
  });

  // Validates: Requirement 7.8
  test('all 10 demo bestiary entries satisfy exact bestiary schema with zero errors', () => {
    expect(DEMO_BESTIARY_ENTRIES).toHaveLength(10);

    for (const entry of DEMO_BESTIARY_ENTRIES) {
      const result = validateBestiaryEntry(entry);
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
      expect(result.data).not.toBeNull();
    }

    const logResult = validateBestiaryLog(DEMO_BESTIARY_ENTRIES);
    expect(logResult.isValid).toBe(true);
    expect(logResult.errors).toHaveLength(0);
  });

  // Validates: Requirement 7.5, 7.8
  test('demo timer state satisfies exact timer configuration schema with 2-minute session', () => {
    const result = validateTimerState(DEMO_TIMER_STATE);
    expect(result.isValid).toBe(true);
    expect(result.errors).toHaveLength(0);
    expect(DEMO_TIMER_STATE.duration).toBe(2);
  });

  // Validates: Requirement 7.8
  test('random subsets and combinations of demo decks remain strictly schema-compliant', () => {
    fc.assert(
      fc.property(
        fc.subarray(DEMO_FLASHCARD_DECKS, { minLength: 1 }),
        fc.oneof(fc.constant(null), fc.constantFrom(...DEMO_FLASHCARD_DECKS.map((d) => d.id))),
        (decks: FlashcardDeck[], lastActiveDeckId) => {
          const payload = { decks, lastActiveDeckId };
          const validation = validateFlashcardData(payload);
          expect(validation.isValid).toBe(true);
          expect(validation.errors).toHaveLength(0);

          const routerValidation = validateStorageData('nocturneum_flashcards', payload);
          expect(routerValidation.isValid).toBe(true);
        }
      ),
      { numRuns: 100 }
    );
  });

  // Validates: Requirement 7.8
  test('random subsets of demo bestiary entries remain strictly schema-compliant', () => {
    fc.assert(
      fc.property(
        fc.subarray(DEMO_BESTIARY_ENTRIES, { minLength: 0 }),
        (entries: BestiaryEntry[]) => {
          const validation = validateBestiaryLog(entries);
          expect(validation.isValid).toBe(true);
          expect(validation.errors).toHaveLength(0);

          const routerValidation = validateStorageData('nocturneum_bestiary', entries);
          expect(routerValidation.isValid).toBe(true);
        }
      ),
      { numRuns: 100 }
    );
  });
});
