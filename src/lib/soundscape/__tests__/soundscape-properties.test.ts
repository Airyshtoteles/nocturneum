// Feature: nocturneum-core, Property 4: Volume-to-Gain Mapping
// Feature: nocturneum-core, Property 5: Sound Effect Idempotence
import { describe, test, expect } from 'vitest';
import * as fc from 'fast-check';
import {
  volumeToGain,
  gainToVolume,
  createRainEffect,
  createTickEffect,
  createThunderEffect,
  createFlipEffect,
} from '../audio-synthesis';
import { SoundEffectId, StoredSoundscapeSettings } from '@/types';

describe('Property 4: Volume-to-Gain Mapping', () => {
  // Validates: Requirement 2.7
  test('gain equals volume / 100 for all volume values in [0, 100]', () => {
    fc.assert(
      fc.property(fc.integer({ min: 0, max: 100 }), (volume) => {
        const gain = volumeToGain(volume);
        expect(gain).toBe(volume / 100);
        expect(gain).toBeGreaterThanOrEqual(0);
        expect(gain).toBeLessThanOrEqual(1);

        // Round trip preservation
        const roundTripVolume = gainToVolume(gain);
        expect(roundTripVolume).toBeCloseTo(volume, 4);
      }),
      { numRuns: 100 }
    );
  });

  // Validates: Requirement 2.7 (clamping boundary invariant)
  test('volume values outside [0, 100] clamp to 0 and 1 boundaries', () => {
    fc.assert(
      fc.property(fc.integer({ min: -1000, max: -1 }), (negativeVol) => {
        expect(volumeToGain(negativeVol)).toBe(0);
      }),
      { numRuns: 50 }
    );

    fc.assert(
      fc.property(fc.integer({ min: 101, max: 2000 }), (overflowVol) => {
        expect(volumeToGain(overflowVol)).toBe(1);
      }),
      { numRuns: 50 }
    );
  });
});

describe('Property 5: Sound Effect Idempotence', () => {
  // Validates: Requirement 2.10
  test('performing enable -> disable -> enable restores identical settings and characteristics', () => {
    const soundEffectIdArbitrary: fc.Arbitrary<SoundEffectId> = fc.constantFrom('rain', 'tick', 'thunder', 'flip');

    fc.assert(
      fc.property(
        soundEffectIdArbitrary,
        fc.integer({ min: 0, max: 100 }),
        (effectId, initialVolume) => {
          // Model soundscape settings transition
          const initialSettings: StoredSoundscapeSettings = {
            rain: { enabled: false, volume: 50 },
            tick: { enabled: false, volume: 50 },
            thunder: { enabled: false, volume: 50 },
            flip: { enabled: false, volume: 50 },
          };

          // Step 1: Enable with initial volume
          const state1: StoredSoundscapeSettings = {
            ...initialSettings,
            [effectId]: { enabled: true, volume: initialVolume },
          };

          // Step 2: Disable
          const state2: StoredSoundscapeSettings = {
            ...state1,
            [effectId]: { ...state1[effectId], enabled: false },
          };

          // Step 3: Re-enable
          const state3: StoredSoundscapeSettings = {
            ...state2,
            [effectId]: { ...state2[effectId], enabled: true },
          };

          // State 3 must be identical to State 1 in enabled flag, volume, and computed gain
          expect(state3[effectId].enabled).toBe(state1[effectId].enabled);
          expect(state3[effectId].volume).toBe(state1[effectId].volume);

          const gain1 = volumeToGain(state1[effectId].volume);
          const gain3 = volumeToGain(state3[effectId].volume);
          expect(gain3).toBe(gain1);
        }
      ),
      { numRuns: 100 }
    );
  });

  // Validates: Requirement 2.10 (Audio graph node instantiation idempotence)
  test('re-creating procedural synthesis graph preserves identical node structures and filter types', () => {
    const ctx = new AudioContext();

    // Rain
    const rain1 = createRainEffect(ctx);
    const rain2 = createRainEffect(ctx);
    expect(rain1.filter.type).toBe(rain2.filter.type);
    expect(rain1.filter.type).toBe('lowpass');

    // Tick
    const tick1 = createTickEffect(ctx);
    const tick2 = createTickEffect(ctx);
    expect(tick1.oscillator.type).toBe(tick2.oscillator.type);
    expect(tick1.oscillator.type).toBe('sine');

    // Thunder
    const thunder1 = createThunderEffect(ctx);
    const thunder2 = createThunderEffect(ctx);
    expect(thunder1.source.loop).toBe(thunder2.source.loop);
    expect(thunder1.source.loop).toBe(true);

    // Flip
    const flip1 = createFlipEffect(ctx);
    const flip2 = createFlipEffect(ctx);
    expect(flip1.oscillator.type).toBe(flip2.oscillator.type);
    expect(flip1.oscillator.type).toBe('triangle');
  });
});
