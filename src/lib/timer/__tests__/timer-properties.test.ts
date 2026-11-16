// Feature: nocturneum-core, Property 1: Timer Height Calculation Invariant
// Feature: nocturneum-core, Property 2: Judge Mode Time Acceleration
import { describe, test, expect } from 'vitest';
import * as fc from 'fast-check';
import { calculateCandleHeight, applyTimeAcceleration } from '../timer-logic';

describe('Property 1: Timer Height Calculation Invariant', () => {
  // Validates: Requirements 1.2, 1.9
  test('candle height percentage equals (remaining / duration) * 100, exactly 0 at zero remaining', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 1, max: 7200 }), // duration in seconds (1s to 2 hours)
        fc.integer({ min: 0, max: 7200 }), // remaining in seconds
        (duration, remaining) => {
          const clampedRemaining = Math.min(remaining, duration);
          const height = calculateCandleHeight(clampedRemaining, duration);

          if (clampedRemaining === 0) {
            expect(height).toBe(0);
          } else {
            const expected = (clampedRemaining / duration) * 100;
            expect(height).toBeCloseTo(expected, 4);
            expect(height).toBeGreaterThan(0);
            expect(height).toBeLessThanOrEqual(100);
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  // Validates: Requirements 1.2, 1.9
  test('height is exactly 0 for zero or negative remaining time across all durations', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 1, max: 10000 }),
        fc.integer({ min: -1000, max: 0 }),
        (duration, remaining) => {
          expect(calculateCandleHeight(remaining, duration)).toBe(0);
        }
      ),
      { numRuns: 100 }
    );
  });
});

describe('Property 2: Judge Mode Time Acceleration', () => {
  // Validates: Requirements 1.4, 7.6
  test('effective time elapsed equals delta * 60 in judge mode and delta * 1 in normal mode', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 0, max: 100000 }), // delta in ms
        fc.boolean(), // judgeMode flag
        (deltaMs, judgeMode) => {
          const accelerated = applyTimeAcceleration(deltaMs, judgeMode);
          if (judgeMode) {
            expect(accelerated).toBe(deltaMs * 60);
          } else {
            expect(accelerated).toBe(deltaMs * 1);
          }
        }
      ),
      { numRuns: 100 }
    );
  });
});
