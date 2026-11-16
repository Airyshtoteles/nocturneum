'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import CandleSVG from './CandleSVG';
import TimerControls from './TimerControls';
import {
  calculateCandleHeight,
  applyTimeAcceleration,
  formatTime,
  minutesToSeconds,
  clampDuration,
  saveTimerState,
  loadTimerState,
} from '@/lib/timer/timer-logic';
import { useJudgeMode } from '@/hooks/useJudgeMode';

export interface CandleTimerProps {
  /** Initial timer duration in minutes (default 25) */
  initialDuration?: number;
  /** Force judge mode acceleration (otherwise auto-detected via useJudgeMode) */
  judgeMode?: boolean;
  /** Callback fired upon countdown reaching 0 */
  onComplete?: () => void;
  /** Optional container class name */
  className?: string;
}

/**
 * CandleTimer Main Component
 * Implements a drift-compensated Victorian Gothic pomodoro timer:
 * - Dynamic candle melting with CSS scaleY and SVG filters.
 * - 60x judge mode time acceleration for hackathon evaluations.
 * - State persistence to localStorage across sessions.
 * - Millisecond-accurate drift compensation.
 * Validates Requirements 1.2, 1.4, 1.7, 1.8, 1.9
 */
export default function CandleTimer({
  initialDuration = 25,
  judgeMode: propJudgeMode,
  onComplete,
  className = '',
}: CandleTimerProps) {
  const { isJudgeMode: detectedJudgeMode } = useJudgeMode();
  const isJudgeMode = propJudgeMode ?? detectedJudgeMode;

  const [durationMinutes, setDurationMinutes] = useState<number>(() => {
    if (initialDuration !== 25) {
      return clampDuration(initialDuration);
    }
    const saved = loadTimerState();
    return saved?.duration ? clampDuration(saved.duration) : initialDuration;
  });

  const totalSeconds = minutesToSeconds(durationMinutes);
  const [remainingSeconds, setRemainingSeconds] = useState<number>(totalSeconds);
  const [isActive, setIsActive] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);

  // References for drift compensation
  const lastTickTimeRef = useRef<number | null>(null);
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Synchronize duration changes when idle
  const handleDurationChange = useCallback((newMinutes: number) => {
    const clamped = clampDuration(newMinutes);
    setDurationMinutes(clamped);
    if (!isActive) {
      setRemainingSeconds(minutesToSeconds(clamped));
      setIsCompleted(false);
    }
    saveTimerState({
      duration: clamped,
      lastActiveSession: null,
    });
  }, [isActive]);

  // Persist current session progress
  const persistState = useCallback(
    (remaining: number, active: boolean) => {
      saveTimerState({
        duration: durationMinutes,
        lastActiveSession: active
          ? {
              startTime: Date.now(),
              duration: totalSeconds,
              elapsed: totalSeconds - remaining,
            }
          : null,
      });
    },
    [durationMinutes, totalSeconds]
  );

  // Clear running timer interval
  const stopInterval = useCallback(() => {
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }
    lastTickTimeRef.current = null;
  }, []);

  // Timer Tick Function with Drift Compensation & Judge Mode Acceleration
  const tick = useCallback(() => {
    const now = Date.now();
    if (lastTickTimeRef.current === null) {
      lastTickTimeRef.current = now;
      return;
    }

    const rawDeltaMs = Math.max(0, now - lastTickTimeRef.current);
    lastTickTimeRef.current = now;

    // Apply Judge Mode 60x acceleration (Δt * 60)
    const acceleratedDeltaMs = applyTimeAcceleration(rawDeltaMs, isJudgeMode);
    const elapsedSeconds = acceleratedDeltaMs / 1000;

    setRemainingSeconds((prev) => {
      const nextRemaining = prev - elapsedSeconds;
      if (nextRemaining <= 0) {
        stopInterval();
        setIsActive(false);
        setIsPaused(false);
        setIsCompleted(true);
        persistState(0, false);
        onComplete?.();
        return 0;
      }
      return nextRemaining;
    });
  }, [isJudgeMode, stopInterval, persistState, onComplete]);

  // Setup / teardown interval based on active & paused state
  useEffect(() => {
    if (isActive && !isPaused) {
      lastTickTimeRef.current = Date.now();
      // Tick every 100ms for smooth acceleration tracking
      timerIntervalRef.current = setInterval(tick, 100);
    } else {
      stopInterval();
    }

    return () => stopInterval();
  }, [isActive, isPaused, tick, stopInterval]);

  // Controls Handlers
  const handleStart = () => {
    setIsActive(true);
    setIsPaused(false);
    setIsCompleted(false);
    if (remainingSeconds <= 0) {
      setRemainingSeconds(totalSeconds);
    }
    persistState(remainingSeconds > 0 ? remainingSeconds : totalSeconds, true);
  };

  const handlePause = () => {
    setIsPaused(true);
    persistState(remainingSeconds, false);
  };

  const handleResume = () => {
    setIsPaused(false);
    lastTickTimeRef.current = Date.now();
    persistState(remainingSeconds, true);
  };

  const handleReset = () => {
    stopInterval();
    setIsActive(false);
    setIsPaused(false);
    setIsCompleted(false);
    setRemainingSeconds(totalSeconds);
    persistState(totalSeconds, false);
  };

  const candleHeight = calculateCandleHeight(remainingSeconds, totalSeconds);

  return (
    <div
      className={`flex flex-col items-center justify-between p-6 rounded-2xl bg-gradient-to-b from-parchment-dark/80 to-obsidian/95 border border-gold/30 shadow-[0_8px_32px_rgba(0,0,0,0.85)] max-w-md w-full ${className}`}
      data-testid="candle-timer-module"
    >
      {/* Gothic Module Header */}
      <div className="w-full text-center pb-2 border-b border-gold/20 mb-2">
        <h2 className="font-cinzel text-xl font-bold tracking-widest text-gold drop-shadow-[0_2px_8px_rgba(230,184,106,0.3)]">
          🕯️ Crucible of Hours
        </h2>
        <p className="text-xs font-serif text-mist/70 italic mt-0.5">
          {isJudgeMode ? '⚡ Judge Mode Active (60× Acceleration)' : 'Observe the solemn descent of melted wax'}
        </p>
      </div>

      {/* SVG Melting Candle Visualizer */}
      <div className="w-full flex justify-center py-2 relative">
        <CandleSVG
          candleHeight={candleHeight}
          isActive={isActive && !isPaused}
          isCompleted={isCompleted}
          className="w-48 sm:w-56"
        />
      </div>

      {/* Numerical Countdown Display */}
      <div className="text-center my-3" aria-live="polite">
        <span className="font-mono text-4xl sm:text-5xl font-bold tracking-widest text-gold drop-shadow-[0_0_12px_rgba(230,184,106,0.4)]">
          {formatTime(remainingSeconds)}
        </span>
        <div className="text-xs font-mono text-mist/60 mt-1 uppercase tracking-wider">
          {isCompleted
            ? '🔥 Ritual Fulfilled'
            : isActive
            ? isPaused
              ? '⏸ Paused in Time'
              : '⏳ Wax Consuming'
            : '🕯️ Quenched & Ready'}
        </div>
      </div>

      {/* Controls and Duration Selector */}
      <div className="w-full mt-2">
        <TimerControls
          isActive={isActive}
          isPaused={isPaused}
          duration={durationMinutes}
          onStart={handleStart}
          onPause={handlePause}
          onResume={handleResume}
          onReset={handleReset}
          onDurationChange={handleDurationChange}
        />
      </div>
    </div>
  );
}
