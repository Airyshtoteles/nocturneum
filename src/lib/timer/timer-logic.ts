/**
 * Timer Logic and Core Calculations
 * Implements drift-compensated timer with candle height calculation and judge mode acceleration.
 * Validates Requirements 1.2, 1.4, 1.7, 1.8, 1.9
 */

import { StoredTimerState } from '@/types';
import { getLocalStorageItem, setLocalStorageItem } from '@/lib/storage';

/**
 * Calculate candle height percentage based on remaining and total time.
 * Property 1: Timer Height Calculation Invariant
 * For any timer with duration D and remaining time R:
 *   height = (R / D) × 100, and when R = 0, height = 0.
 * Validates Requirements 1.2, 1.9
 *
 * @param remainingSeconds - The remaining timer duration in seconds
 * @param totalSeconds - The total initial timer duration in seconds
 * @returns Height percentage between 0 and 100
 */
export function calculateCandleHeight(remainingSeconds: number, totalSeconds: number): number {
  if (totalSeconds <= 0) return 0;
  if (remainingSeconds <= 0) return 0;
  const height = (remainingSeconds / totalSeconds) * 100;
  return Math.min(100, Math.max(0, height));
}

/**
 * Apply judge mode acceleration to a time delta.
 * Property 2: Judge Mode Time Acceleration
 * For any time delta Δt in normal mode, when judge mode is active:
 *   effective elapsed = Δt × 60
 * Validates Requirements 1.4, 7.6
 *
 * @param deltaMs - Raw delta elapsed in milliseconds
 * @param judgeMode - Whether judge mode 60x acceleration is active
 * @returns Accelerated delta in milliseconds
 */
export function applyTimeAcceleration(deltaMs: number, judgeMode: boolean): number {
  const multiplier = judgeMode ? 60 : 1;
  return deltaMs * multiplier;
}

/**
 * Calculate drift-compensated interval for the next tick.
 * Uses the difference between expected and actual elapsed time to adjust.
 * Validates Requirement 1.8
 *
 * @param expectedIntervalMs - Nominal tick interval in milliseconds
 * @param actualElapsedMs - Actual elapsed interval measured via performance.now
 * @returns Compensated delay in milliseconds for the subsequent tick
 */
export function calculateDriftCompensation(
  expectedIntervalMs: number,
  actualElapsedMs: number
): number {
  const drift = actualElapsedMs - expectedIntervalMs;
  return Math.max(0, expectedIntervalMs - drift);
}

/**
 * Format remaining time as MM:SS string.
 *
 * @param totalSeconds - Duration in seconds
 * @returns Formatted MM:SS time string
 */
export function formatTime(totalSeconds: number): string {
  const clamped = Math.max(0, Math.floor(totalSeconds));
  const minutes = Math.floor(clamped / 60);
  const seconds = clamped % 60;
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

/**
 * Save timer state to localStorage.
 * Validates Requirement 1.7
 *
 * @param state - The serialized timer state to persist
 * @returns True if successfully persisted
 */
export function saveTimerState(state: StoredTimerState): boolean {
  return setLocalStorageItem('nocturneum_timer', state);
}

/**
 * Load timer state from localStorage.
 * Validates Requirement 1.7
 *
 * @returns The retrieved timer state or default fallback
 */
export function loadTimerState(): StoredTimerState {
  return getLocalStorageItem('nocturneum_timer');
}

/**
 * Convert minutes to seconds.
 *
 * @param minutes - Duration in minutes
 * @returns Equivalent duration in seconds
 */
export function minutesToSeconds(minutes: number): number {
  return Math.max(0, minutes) * 60;
}

/**
 * Clamp a duration value to the valid range [1, 120] minutes.
 * Validates Requirement 1.8 (input validation).
 *
 * @param minutes - User input duration in minutes
 * @returns Clamped duration within [1, 120]
 */
export function clampDuration(minutes: number): number {
  return Math.min(120, Math.max(1, Math.round(minutes)));
}
