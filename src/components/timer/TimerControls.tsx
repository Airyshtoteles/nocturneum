'use client';

import React from 'react';

export interface TimerControlsProps {
  /** Whether the timer session has started */
  isActive: boolean;
  /** Whether the timer session is currently paused */
  isPaused: boolean;
  /** Selected session duration in minutes (1 to 120) */
  duration: number;
  /** Handler to initiate the countdown */
  onStart: () => void;
  /** Handler to pause the active countdown */
  onPause: () => void;
  /** Handler to resume the paused countdown */
  onResume: () => void;
  /** Handler to reset countdown to initial duration */
  onReset: () => void;
  /** Handler when user changes duration */
  onDurationChange: (minutes: number) => void;
  /** Optional container class name */
  className?: string;
}

/** Predefined alchemical ritual durations in minutes */
const PRESET_DURATIONS = [5, 15, 25, 45, 60, 90, 120];

/**
 * TimerControls Component
 * Provides gothic styled controls for the Melting Candle Timer:
 * - Start / Pause / Resume / Extinguish (Reset) actions.
 * - Duration selector dropdown and presets (1 - 120 minutes).
 * - Full ARIA accessibility support and gothic alchemist aesthetics.
 * Validates Requirement 1.8
 */
export default function TimerControls({
  isActive,
  isPaused,
  duration,
  onStart,
  onPause,
  onResume,
  onReset,
  onDurationChange,
  className = '',
}: TimerControlsProps) {
  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = parseInt(e.target.value, 10);
    if (!isNaN(val) && val >= 1 && val <= 120) {
      onDurationChange(val);
    }
  };

  return (
    <div
      className={`flex flex-col items-center gap-4 p-4 rounded-xl bg-parchment-dark/60 border border-gold/20 shadow-gothic-glow backdrop-blur-sm ${className}`}
      role="region"
      aria-label="Candle Timer Controls"
    >
      {/* Duration Configuration */}
      <div className="flex items-center gap-3 text-sm font-cinzel text-mist">
        <label htmlFor="duration-select" className="text-gold/90 font-medium">
          Ritual Duration:
        </label>
        <select
          id="duration-select"
          value={duration}
          onChange={handleSelectChange}
          disabled={isActive && !isPaused}
          className="bg-obsidian/90 text-gold font-mono px-3 py-1.5 rounded border border-gold/40 focus:outline-none focus:ring-2 focus:ring-gold/60 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          aria-label="Select session duration in minutes"
        >
          {PRESET_DURATIONS.map((mins) => (
            <option key={mins} value={mins} className="bg-obsidian text-gold">
              {mins} Minutes {mins === 25 ? '(Pomodoro)' : ''}
            </option>
          ))}
        </select>
      </div>

      {/* Primary Action Buttons */}
      <div className="flex items-center gap-3">
        {!isActive ? (
          <button
            onClick={onStart}
            className="px-6 py-2 rounded-lg font-cinzel text-sm uppercase tracking-wider font-semibold text-obsidian bg-gradient-to-r from-gold to-amber-500 hover:from-amber-400 hover:to-gold shadow-[0_0_15px_rgba(230,184,106,0.35)] transition-all duration-200 active:scale-95"
            aria-label="Light the candle and start timer"
          >
            🔥 Light Flame
          </button>
        ) : isPaused ? (
          <button
            onClick={onResume}
            className="px-6 py-2 rounded-lg font-cinzel text-sm uppercase tracking-wider font-semibold text-gold bg-crimson/80 border border-gold/50 hover:bg-crimson hover:border-gold shadow-[0_0_15px_rgba(122,28,36,0.5)] transition-all duration-200 active:scale-95"
            aria-label="Resume timer"
          >
            ▶ Resume
          </button>
        ) : (
          <button
            onClick={onPause}
            className="px-6 py-2 rounded-lg font-cinzel text-sm uppercase tracking-wider font-semibold text-mist bg-obsidian border border-mist/40 hover:text-gold hover:border-gold/60 transition-all duration-200 active:scale-95"
            aria-label="Pause timer"
          >
            ⏸ Pause
          </button>
        )}

        <button
          onClick={onReset}
          className="px-4 py-2 rounded-lg font-cinzel text-sm uppercase tracking-wider text-mist/80 bg-obsidian/80 border border-gold/20 hover:text-crimson-light hover:border-crimson/60 transition-all duration-200 active:scale-95"
          aria-label="Extinguish flame and reset timer"
        >
          🕯️ Extinguish
        </button>
      </div>
    </div>
  );
}
