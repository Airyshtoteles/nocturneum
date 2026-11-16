'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  SoundEffectId,
  StoredSoundscapeSettings,
} from '@/types';
import {
  createRainEffect,
  createTickEffect,
  scheduleTickEnvelope,
  createThunderEffect,
  scheduleThunderRumble,
  createFlipEffect,
  scheduleFlipEnvelope,
  volumeToGain,
  getEffectLabel,
} from '@/lib/soundscape/audio-synthesis';
import { getLocalStorageItem, setLocalStorageItem } from '@/lib/storage';
import { useJudgeMode } from '@/hooks/useJudgeMode';

export interface SoundscapeEngineProps {
  /** Force judge mode acceleration (otherwise auto-detected via useJudgeMode) */
  judgeMode?: boolean;
  /** Optional container styling */
  className?: string;
}

const DEFAULT_SETTINGS: StoredSoundscapeSettings = {
  rain: { enabled: false, volume: 50 },
  tick: { enabled: false, volume: 40 },
  thunder: { enabled: false, volume: 60 },
  flip: { enabled: false, volume: 50 },
};

/**
 * SoundscapeEngine Component
 * Pure Web Audio API synthesis engine for Victorian gothic soundscapes.
 * Features:
 * - Autoplay policy compliance: AudioContext initialized upon user gesture.
 * - Procedural ambient effects: Rain, Clock Tick, Thunder, and Card Flip.
 * - Real-time volume scaling and node lifecycle management.
 * - LocalStorage persistence for user preferences.
 * - Complete unmount cleanup preventing audio resource leaks.
 * Validates Requirements 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 2.7, 2.8, 2.11
 */
export default function SoundscapeEngine({
  judgeMode: propJudgeMode,
  className = '',
}: SoundscapeEngineProps) {
  const { isJudgeMode: detectedJudgeMode } = useJudgeMode();
  const isJudgeMode = propJudgeMode ?? detectedJudgeMode;

  const [settings, setSettings] = useState<StoredSoundscapeSettings>(() => {
    return getLocalStorageItem('nocturneum_soundscape') || DEFAULT_SETTINGS;
  });

  const [isAudioActive, setIsAudioActive] = useState<boolean>(false);
  const audioContextRef = useRef<AudioContext | null>(null);

  // Audio Node references
  const rainNodesRef = useRef<{
    source: AudioBufferSourceNode;
    filter: BiquadFilterNode;
    gain: GainNode;
  } | null>(null);

  const tickTimerRef = useRef<NodeJS.Timeout | null>(null);
  const thunderTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize or resume Web Audio Context on user interaction
  const ensureAudioContext = useCallback((): AudioContext | null => {
    if (typeof window === 'undefined') return null;

    if (!audioContextRef.current) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        audioContextRef.current = new AudioCtx();
      }
    }

    if (audioContextRef.current && audioContextRef.current.state === 'suspended') {
      audioContextRef.current.resume().catch((err) => {
        console.warn('[Nocturneum Soundscape] AudioContext resume failed:', err);
      });
    }

    setIsAudioActive(true);
    return audioContextRef.current;
  }, []);

  // Update rain sound nodes based on settings
  const syncRain = useCallback(
    (ctx: AudioContext, enabled: boolean, volume: number) => {
      try {
        if (enabled) {
          if (!rainNodesRef.current) {
            const nodes = createRainEffect(ctx);
            nodes.source.start(0);
            nodes.gain.connect(ctx.destination);
            rainNodesRef.current = nodes;
          }
          const gainVal = volumeToGain(volume);
          rainNodesRef.current.gain.gain.setValueAtTime(gainVal, ctx.currentTime);
        } else {
          if (rainNodesRef.current) {
            try {
              rainNodesRef.current.source.stop();
              rainNodesRef.current.gain.disconnect();
            } catch {
              // Ignore if already stopped
            }
            rainNodesRef.current = null;
          }
        }
      } catch (err) {
        console.warn('[Nocturneum Soundscape] Rain sync error:', err);
      }
    },
    []
  );

  // Trigger single tick burst
  const playTick = useCallback(() => {
    const ctx = audioContextRef.current;
    if (!ctx) return;
    try {
      const { oscillator, gain } = createTickEffect(ctx);
      gain.connect(ctx.destination);
      scheduleTickEnvelope(gain, ctx.currentTime, settings.tick.volume);
      oscillator.start(ctx.currentTime);
      oscillator.stop(ctx.currentTime + 0.08);
    } catch {
      // Audio context might be busy
    }
  }, [settings.tick.volume]);

  // Trigger single thunder rumble
  const playThunder = useCallback(() => {
    const ctx = ensureAudioContext();
    if (!ctx) return;
    try {
      const { source, gain } = createThunderEffect(ctx);
      gain.connect(ctx.destination);
      scheduleThunderRumble(gain, ctx.currentTime, settings.thunder.volume, 2.5);
      source.start(ctx.currentTime);
      source.stop(ctx.currentTime + 2.6);
    } catch {
      // Audio context might be busy
    }
  }, [ensureAudioContext, settings.thunder.volume]);

  // Trigger single card flip sound
  const playFlip = useCallback(() => {
    const ctx = ensureAudioContext();
    if (!ctx) return;
    try {
      const { oscillator, gain } = createFlipEffect(ctx);
      gain.connect(ctx.destination);
      scheduleFlipEnvelope(oscillator, gain, ctx.currentTime, settings.flip.volume);
      oscillator.start(ctx.currentTime);
      oscillator.stop(ctx.currentTime + 0.22);
    } catch {
      // Audio context might be busy
    }
  }, [ensureAudioContext, settings.flip.volume]);

  // Synchronize rain state when settings change
  useEffect(() => {
    if (audioContextRef.current && isAudioActive) {
      syncRain(audioContextRef.current, settings.rain.enabled, settings.rain.volume);
    }
  }, [settings.rain, isAudioActive, syncRain]);

  // Synchronize periodic tick timer
  useEffect(() => {
    if (tickTimerRef.current) {
      clearInterval(tickTimerRef.current);
      tickTimerRef.current = null;
    }

    if (isAudioActive && settings.tick.enabled) {
      // Clock tick intervals: 1000ms normal mode, 250ms under judge acceleration
      const intervalMs = isJudgeMode ? 250 : 1000;
      tickTimerRef.current = setInterval(playTick, intervalMs);
    }

    return () => {
      if (tickTimerRef.current) {
        clearInterval(tickTimerRef.current);
        tickTimerRef.current = null;
      }
    };
  }, [isAudioActive, settings.tick.enabled, isJudgeMode, playTick]);

  // Synchronize periodic thunder timer (every ~20 seconds if enabled)
  useEffect(() => {
    if (thunderTimerRef.current) {
      clearInterval(thunderTimerRef.current);
      thunderTimerRef.current = null;
    }

    if (isAudioActive && settings.thunder.enabled) {
      const intervalMs = isJudgeMode ? 5000 : 20000;
      thunderTimerRef.current = setInterval(playThunder, intervalMs);
    }

    return () => {
      if (thunderTimerRef.current) {
        clearInterval(thunderTimerRef.current);
        thunderTimerRef.current = null;
      }
    };
  }, [isAudioActive, settings.thunder.enabled, isJudgeMode, playThunder]);

  // Component unmount cleanup (Requirement 2.11)
  useEffect(() => {
    return () => {
      if (tickTimerRef.current) clearInterval(tickTimerRef.current);
      if (thunderTimerRef.current) clearInterval(thunderTimerRef.current);
      if (rainNodesRef.current) {
        try {
          rainNodesRef.current.source.stop();
          rainNodesRef.current.gain.disconnect();
        } catch {
          // Ignore on disposal
        }
      }
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        try {
          audioContextRef.current.close().catch(() => {});
        } catch {
          // Ignore
        }
      }
    };
  }, []);

  // Update effect setting & persist
  const updateEffect = (id: SoundEffectId, enabled?: boolean, volume?: number) => {
    ensureAudioContext();
    setSettings((prev) => {
      const current = prev[id];
      const updated = {
        ...prev,
        [id]: {
          enabled: enabled !== undefined ? enabled : current.enabled,
          volume: volume !== undefined ? Math.max(0, Math.min(100, volume)) : current.volume,
        },
      };
      setLocalStorageItem('nocturneum_soundscape', updated);
      return updated;
    });
  };

  const effectsList: SoundEffectId[] = ['rain', 'tick', 'thunder', 'flip'];

  return (
    <div
      className={`p-6 rounded-2xl bg-gradient-to-b from-parchment-dark/80 to-obsidian/95 border border-gold/30 shadow-[0_8px_32px_rgba(0,0,0,0.85)] max-w-md w-full ${className}`}
      data-testid="soundscape-engine-module"
    >
      {/* Header */}
      <div className="w-full text-center pb-2 border-b border-gold/20 mb-4">
        <h2 className="font-cinzel text-xl font-bold tracking-widest text-gold drop-shadow-[0_2px_8px_rgba(230,184,106,0.3)]">
          🌧️ Alchemical Soundscape
        </h2>
        <p className="text-xs font-serif text-mist/70 italic mt-0.5">
          Pure Web Audio procedural synthesis • Zero external audio files
        </p>
      </div>

      {/* Autoplay compliance status notice */}
      {!isAudioActive && (
        <div className="mb-4 p-3 rounded-lg bg-gold/10 border border-gold/30 text-center">
          <p className="text-xs font-serif text-gold mb-2">
            Audio requires interaction to awaken the ambient spirits.
          </p>
          <button
            onClick={() => ensureAudioContext()}
            className="px-4 py-1.5 rounded font-cinzel text-xs uppercase tracking-wider font-semibold text-obsidian bg-gold hover:bg-amber-400 transition-colors"
          >
            Awaken Audio Engine
          </button>
        </div>
      )}

      {/* Sound Effect Channels */}
      <div className="space-y-4">
        {effectsList.map((id) => {
          const effect = settings[id];
          return (
            <div
              key={id}
              className={`p-3 rounded-xl border transition-all duration-200 ${
                effect.enabled
                  ? 'bg-parchment-dark/90 border-gold/50 shadow-[0_0_12px_rgba(230,184,106,0.15)]'
                  : 'bg-obsidian/60 border-gold/15 opacity-75'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-cinzel text-sm font-semibold text-gold flex items-center gap-2">
                  {getEffectLabel(id)}
                </span>
                <div className="flex items-center gap-2">
                  {id === 'thunder' && (
                    <button
                      onClick={playThunder}
                      title="Summon Thunder Clap"
                      className="px-2 py-0.5 rounded text-[10px] font-mono text-gold border border-gold/30 hover:bg-gold/10"
                    >
                      ⚡ Clap
                    </button>
                  )}
                  {id === 'flip' && (
                    <button
                      onClick={playFlip}
                      title="Preview Card Flip"
                      className="px-2 py-0.5 rounded text-[10px] font-mono text-gold border border-gold/30 hover:bg-gold/10"
                    >
                      🃏 Flip
                    </button>
                  )}
                  <button
                    onClick={() => updateEffect(id, !effect.enabled)}
                    className={`px-3 py-1 rounded-full text-xs font-mono uppercase tracking-wider transition-colors ${
                      effect.enabled
                        ? 'bg-gold text-obsidian font-bold shadow-[0_0_8px_rgba(230,184,106,0.4)]'
                        : 'bg-obsidian border border-mist/30 text-mist hover:text-gold'
                    }`}
                    aria-label={`Toggle ${id} effect ${effect.enabled ? 'off' : 'on'}`}
                  >
                    {effect.enabled ? 'ON' : 'OFF'}
                  </button>
                </div>
              </div>

              {/* Volume Slider */}
              <div className="flex items-center gap-3">
                <span className="text-[10px] font-mono text-mist/60 w-8">Vol</span>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={effect.volume}
                  onChange={(e) => updateEffect(id, undefined, parseInt(e.target.value, 10))}
                  aria-label={`${id} volume`}
                  className="w-full h-1.5 bg-obsidian rounded-lg appearance-none cursor-pointer accent-gold border border-gold/20"
                />
                <span className="text-xs font-mono text-gold/80 w-8 text-right">
                  {effect.volume}%
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
