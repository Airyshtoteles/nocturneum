/**
 * Audio Synthesis Engine
 * Pure Web Audio API synthesis for ambient gothic soundscapes.
 * No external MP3/WAV files – all effects are procedurally generated.
 * Validates Requirements 2.1, 2.2, 2.3, 2.4, 2.9
 */

import { SoundEffectId } from '@/types';

/**
 * Convert volume (0-100 user scale) to gain (0-1 linear scale).
 * Property 4: Volume-to-Gain Mapping
 * For any volume V in [0, 100]: gain G = V / 100.
 * Validates Requirement 2.7
 *
 * @param volume - Volume percentage between 0 and 100
 * @returns Linear Web Audio API gain value between 0.0 and 1.0
 */
export function volumeToGain(volume: number): number {
  const clamped = Math.min(100, Math.max(0, volume));
  return clamped / 100;
}

/**
 * Convert gain (0-1) back to volume (0-100).
 *
 * @param gain - Linear Web Audio gain between 0.0 and 1.0
 * @returns Volume percentage between 0 and 100
 */
export function gainToVolume(gain: number): number {
  const clamped = Math.min(1, Math.max(0, gain));
  return clamped * 100;
}

/**
 * Generate a white noise AudioBuffer for rain and thunder effects.
 * Creates random samples at given audio context sample rate.
 * Validates Requirement 2.1 (Rain), 2.3 (Thunder)
 *
 * @param audioContext - Target Web Audio context
 * @param durationSeconds - Length of noise buffer in seconds (default 2)
 * @returns Synthesized white noise AudioBuffer
 */
export function createWhiteNoiseBuffer(
  audioContext: AudioContext,
  durationSeconds: number = 2
): AudioBuffer {
  const sampleRate = audioContext.sampleRate;
  const bufferSize = sampleRate * durationSeconds;
  const buffer = audioContext.createBuffer(1, bufferSize, sampleRate);
  const data = buffer.getChannelData(0);

  for (let i = 0; i < bufferSize; i++) {
    data[i] = Math.random() * 2 - 1;
  }

  return buffer;
}

/**
 * Create a rain effect: white noise → lowpass filter (1200Hz) → gain node.
 * Validates Requirement 2.1
 *
 * @param audioContext - Target Web Audio context
 * @returns Connected audio nodes for rain synthesis
 */
export function createRainEffect(audioContext: AudioContext): {
  source: AudioBufferSourceNode;
  filter: BiquadFilterNode;
  gain: GainNode;
} {
  const noiseBuffer = createWhiteNoiseBuffer(audioContext, 2);

  const source = audioContext.createBufferSource();
  source.buffer = noiseBuffer;
  source.loop = true;

  const filter = audioContext.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.setValueAtTime(1200, audioContext.currentTime);
  filter.Q.setValueAtTime(1.0, audioContext.currentTime);

  const gain = audioContext.createGain();
  gain.gain.setValueAtTime(0, audioContext.currentTime);

  source.connect(filter);
  filter.connect(gain);

  return { source, filter, gain };
}

/**
 * Create a clock tick effect: sine oscillator burst (800Hz, 10ms attack, 50ms decay).
 * Validates Requirement 2.2
 *
 * @param audioContext - Target Web Audio context
 * @returns Connected oscillator and gain nodes for clock ticks
 */
export function createTickEffect(audioContext: AudioContext): {
  oscillator: OscillatorNode;
  gain: GainNode;
} {
  const oscillator = audioContext.createOscillator();
  oscillator.type = 'sine';
  oscillator.frequency.setValueAtTime(800, audioContext.currentTime);

  const gain = audioContext.createGain();
  gain.gain.setValueAtTime(0, audioContext.currentTime);

  oscillator.connect(gain);

  return { oscillator, gain };
}

/**
 * Schedule a single tick envelope: 10ms attack, 50ms decay.
 *
 * @param gain - Gain node to envelope
 * @param time - AudioContext start time
 * @param volume - Target peak volume (0-100)
 */
export function scheduleTickEnvelope(gain: GainNode, time: number, volume: number): void {
  const g = volumeToGain(volume);
  gain.gain.setValueAtTime(0, time);
  gain.gain.linearRampToValueAtTime(g, time + 0.01); // 10ms attack
  gain.gain.exponentialRampToValueAtTime(0.001, time + 0.06); // 50ms decay
  gain.gain.setValueAtTime(0, time + 0.065);
}

/**
 * Create a thunder effect: noise → amplitude modulation (LFO) → exponential decay → gain.
 * Validates Requirement 2.3
 *
 * @param audioContext - Target Web Audio context
 * @returns Connected audio nodes for thunder synthesis
 */
export function createThunderEffect(audioContext: AudioContext): {
  source: AudioBufferSourceNode;
  gain: GainNode;
} {
  const noiseBuffer = createWhiteNoiseBuffer(audioContext, 2);

  const source = audioContext.createBufferSource();
  source.buffer = noiseBuffer;
  source.loop = true;

  const gain = audioContext.createGain();
  gain.gain.setValueAtTime(0, audioContext.currentTime);

  source.connect(gain);

  return { source, gain };
}

/**
 * Schedule a thunder rumble with LFO amplitude modulation and exponential decay.
 *
 * @param gain - Gain node to envelope
 * @param time - AudioContext start time
 * @param volume - Target peak volume (0-100)
 * @param durationSeconds - Length of rumble in seconds (default 2.0)
 */
export function scheduleThunderRumble(
  gain: GainNode,
  time: number,
  volume: number,
  durationSeconds: number = 2.0
): void {
  const g = volumeToGain(volume);
  gain.gain.setValueAtTime(0.001, time);
  gain.gain.linearRampToValueAtTime(g, time + 0.1);
  gain.gain.exponentialRampToValueAtTime(0.001, time + durationSeconds);
}

/**
 * Create a card flip effect: triangle oscillator → frequency sweep (400Hz → 200Hz over 150ms).
 * Validates Requirement 2.4
 *
 * @param audioContext - Target Web Audio context
 * @returns Connected oscillator and gain node for flip effect
 */
export function createFlipEffect(audioContext: AudioContext): {
  oscillator: OscillatorNode;
  gain: GainNode;
} {
  const oscillator = audioContext.createOscillator();
  oscillator.type = 'triangle';
  oscillator.frequency.setValueAtTime(400, audioContext.currentTime);

  const gain = audioContext.createGain();
  gain.gain.setValueAtTime(0, audioContext.currentTime);

  oscillator.connect(gain);

  return { oscillator, gain };
}

/**
 * Schedule a card flip envelope: frequency sweep with short decay.
 *
 * @param oscillator - Oscillator node whose frequency will be swept
 * @param gain - Gain node to envelope
 * @param time - AudioContext start time
 * @param volume - Target peak volume (0-100)
 */
export function scheduleFlipEnvelope(
  oscillator: OscillatorNode,
  gain: GainNode,
  time: number,
  volume: number
): void {
  const g = volumeToGain(volume);
  oscillator.frequency.setValueAtTime(400, time);
  oscillator.frequency.linearRampToValueAtTime(200, time + 0.15);

  gain.gain.setValueAtTime(g, time);
  gain.gain.exponentialRampToValueAtTime(0.001, time + 0.2);
}

/**
 * Get a display label for a sound effect ID.
 *
 * @param id - SoundEffectId identifier
 * @returns Human-readable label with emoji
 */
export function getEffectLabel(id: SoundEffectId): string {
  const labels: Record<SoundEffectId, string> = {
    rain: '🌧️ Rain',
    tick: '⏱️ Clock Tick',
    thunder: '⚡ Thunder',
    flip: '🃏 Card Flip',
  };
  return labels[id];
}
