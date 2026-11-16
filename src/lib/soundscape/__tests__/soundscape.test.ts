import { describe, test, expect } from 'vitest';
import {
  volumeToGain,
  gainToVolume,
  createWhiteNoiseBuffer,
  createRainEffect,
  createTickEffect,
  scheduleTickEnvelope,
  createThunderEffect,
  scheduleThunderRumble,
  createFlipEffect,
  scheduleFlipEnvelope,
  getEffectLabel,
} from '../audio-synthesis';

describe('Soundscape Audio Synthesis', () => {
  const audioContext = new AudioContext();

  test('volumeToGain converts 0-100 scale to 0-1 gain scale', () => {
    expect(volumeToGain(0)).toBe(0);
    expect(volumeToGain(50)).toBe(0.5);
    expect(volumeToGain(100)).toBe(1);
    expect(volumeToGain(-10)).toBe(0); // clamped
    expect(volumeToGain(150)).toBe(1); // clamped
  });

  test('gainToVolume converts 0-1 gain scale to 0-100 volume scale', () => {
    expect(gainToVolume(0)).toBe(0);
    expect(gainToVolume(0.5)).toBe(50);
    expect(gainToVolume(1)).toBe(100);
    expect(gainToVolume(1.5)).toBe(100); // clamped
  });

  test('createWhiteNoiseBuffer creates an AudioBuffer with random samples', () => {
    const buffer = createWhiteNoiseBuffer(audioContext, 1);
    expect(buffer).toBeDefined();
    expect(buffer.numberOfChannels).toBe(1);
    expect(buffer.length).toBe(audioContext.sampleRate * 1);
    const data = buffer.getChannelData(0);
    expect(data.length).toBe(audioContext.sampleRate * 1);
  });

  test('createRainEffect returns connected audio nodes', () => {
    const rain = createRainEffect(audioContext);
    expect(rain.source).toBeDefined();
    expect(rain.filter).toBeDefined();
    expect(rain.gain).toBeDefined();
    expect(rain.filter.type).toBe('lowpass');
  });

  test('createTickEffect returns oscillator and gain node', () => {
    const tick = createTickEffect(audioContext);
    expect(tick.oscillator).toBeDefined();
    expect(tick.gain).toBeDefined();
    expect(tick.oscillator.type).toBe('sine');
    expect(() => scheduleTickEnvelope(tick.gain, 0, 50)).not.toThrow();
  });

  test('createThunderEffect returns source and gain node', () => {
    const thunder = createThunderEffect(audioContext);
    expect(thunder.source).toBeDefined();
    expect(thunder.gain).toBeDefined();
    expect(() => scheduleThunderRumble(thunder.gain, 0, 70, 2)).not.toThrow();
  });

  test('createFlipEffect returns triangle oscillator and gain node', () => {
    const flip = createFlipEffect(audioContext);
    expect(flip.oscillator).toBeDefined();
    expect(flip.gain).toBeDefined();
    expect(flip.oscillator.type).toBe('triangle');
    expect(() => scheduleFlipEnvelope(flip.oscillator, flip.gain, 0, 80)).not.toThrow();
  });

  test('getEffectLabel returns readable label for each effect ID', () => {
    expect(getEffectLabel('rain')).toContain('Rain');
    expect(getEffectLabel('tick')).toContain('Tick');
    expect(getEffectLabel('thunder')).toContain('Thunder');
    expect(getEffectLabel('flip')).toContain('Flip');
  });
});
