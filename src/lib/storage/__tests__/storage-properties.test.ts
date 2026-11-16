// Feature: nocturneum-core, Property 3: Storage Round-Trip Preservation
import { describe, test, expect } from 'vitest';
import * as fc from 'fast-check';
import {
  serializeJSON,
  deserializeJSON,
} from '../storage-manager';
import {
  validateTimerState,
  validateSoundscapeSettings,
  validateFlashcardData,
  validateBestiaryEntry,
  validateBestiaryLog,
} from '../schema-validator';
import {
  StoredTimerState,
  StoredSoundscapeSettings,
  StoredFlashcardData,
  BestiaryEntry,
} from '@/types';

// Custom Arbitraries for Fast-Check

const timerStateArbitrary: fc.Arbitrary<StoredTimerState> = fc.record({
  duration: fc.integer({ min: 1, max: 120 }),
  lastActiveSession: fc.oneof(
    fc.constant(null),
    fc.record({
      startTime: fc.integer({ min: 1, max: 2000000000000 }),
      duration: fc.integer({ min: 1, max: 7200 }),
      elapsed: fc.integer({ min: 0, max: 7200 }),
    })
  ),
});

const soundEffectSettingArbitrary = fc.record({
  enabled: fc.boolean(),
  volume: fc.integer({ min: 0, max: 100 }),
});

const soundscapeSettingsArbitrary: fc.Arbitrary<StoredSoundscapeSettings> = fc.record({
  rain: soundEffectSettingArbitrary,
  tick: soundEffectSettingArbitrary,
  thunder: soundEffectSettingArbitrary,
  flip: soundEffectSettingArbitrary,
});

const flashcardArbitrary = fc.record({
  id: fc.uuid(),
  front: fc.string({ minLength: 1, maxLength: 200 }),
  back: fc.string({ minLength: 1, maxLength: 200 }),
});

const flashcardDeckArbitrary = fc.record({
  id: fc.uuid(),
  name: fc.string({ minLength: 1, maxLength: 50 }),
  cards: fc.array(flashcardArbitrary, { minLength: 0, maxLength: 10 }),
  createdAt: fc.integer({ min: 1, max: 2000000000000 }),
});

const flashcardDataArbitrary: fc.Arbitrary<StoredFlashcardData> = fc.record({
  decks: fc.array(flashcardDeckArbitrary, { minLength: 0, maxLength: 5 }),
  lastActiveDeckId: fc.oneof(fc.constant(null), fc.uuid()),
});

const bestiaryEntryArbitrary: fc.Arbitrary<BestiaryEntry> = fc.record({
  id: fc.uuid(),
  timestamp: fc.integer({ min: 1, max: 2000000000000 }),
  errorText: fc.string({ minLength: 1, maxLength: 500 }),
  detectedPattern: fc.oneof(fc.constant(null), fc.string({ minLength: 1, maxLength: 50 })),
  matchedLanguage: fc.oneof(
    fc.constant(null),
    fc.constantFrom('javascript' as const, 'typescript' as const, 'python' as const)
  ),
});

describe('Property 3: Storage Round-Trip Preservation', () => {
  // Validates: Requirements 1.7, 8.4, 8.5, 8.9
  test('timer state serialization round-trip preservation', () => {
    fc.assert(
      fc.property(timerStateArbitrary, (state) => {
        const serialized = serializeJSON(state);
        const deserialized = deserializeJSON<StoredTimerState>(serialized);
        expect(deserialized).toEqual(state);

        const validation = validateTimerState(deserialized);
        expect(validation.isValid).toBe(true);
      }),
      { numRuns: 100 }
    );
  });

  // Validates: Requirements 2.8, 8.4, 8.5, 8.9
  test('soundscape settings serialization round-trip preservation', () => {
    fc.assert(
      fc.property(soundscapeSettingsArbitrary, (settings) => {
        const serialized = serializeJSON(settings);
        const deserialized = deserializeJSON<StoredSoundscapeSettings>(serialized);
        expect(deserialized).toEqual(settings);

        const validation = validateSoundscapeSettings(deserialized);
        expect(validation.isValid).toBe(true);
      }),
      { numRuns: 100 }
    );
  });

  // Validates: Requirements 4.5, 8.4, 8.5, 8.9
  test('flashcard deck data serialization round-trip preservation', () => {
    fc.assert(
      fc.property(flashcardDataArbitrary, (data) => {
        const serialized = serializeJSON(data);
        const deserialized = deserializeJSON<StoredFlashcardData>(serialized);
        expect(deserialized).toEqual(data);

        const validation = validateFlashcardData(deserialized);
        expect(validation.isValid).toBe(true);
      }),
      { numRuns: 100 }
    );
  });

  // Validates: Requirements 3.10, 8.4, 8.5, 8.9
  test('bestiary entry serialization round-trip preservation', () => {
    fc.assert(
      fc.property(bestiaryEntryArbitrary, (entry) => {
        const serialized = serializeJSON(entry);
        const deserialized = deserializeJSON<BestiaryEntry>(serialized);
        expect(deserialized).toEqual(entry);

        const validation = validateBestiaryEntry(deserialized);
        expect(validation.isValid).toBe(true);
      }),
      { numRuns: 100 }
    );
  });

  // Validates: Requirements 3.10, 8.4, 8.5, 8.9
  test('bestiary log collection serialization round-trip preservation', () => {
    fc.assert(
      fc.property(fc.array(bestiaryEntryArbitrary, { minLength: 0, maxLength: 20 }), (entries) => {
        const serialized = serializeJSON(entries);
        const deserialized = deserializeJSON<BestiaryEntry[]>(serialized);
        expect(deserialized).toEqual(entries);

        const validation = validateBestiaryLog(deserialized);
        expect(validation.isValid).toBe(true);
      }),
      { numRuns: 100 }
    );
  });
});
