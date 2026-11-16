import { describe, test, expect, beforeEach } from 'vitest';
import {
  calculateCandleHeight,
  applyTimeAcceleration,
  calculateDriftCompensation,
  formatTime,
  minutesToSeconds,
  clampDuration,
  saveTimerState,
  loadTimerState,
} from '../timer-logic';

describe('Timer Logic and Calculations', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test('calculateCandleHeight accurately calculates percentage and boundaries', () => {
    expect(calculateCandleHeight(60, 60)).toBe(100);
    expect(calculateCandleHeight(30, 60)).toBe(50);
    expect(calculateCandleHeight(0, 60)).toBe(0);
    expect(calculateCandleHeight(-5, 60)).toBe(0);
    expect(calculateCandleHeight(100, 0)).toBe(0);
    expect(calculateCandleHeight(70, 60)).toBe(100); // capped at 100
  });

  test('applyTimeAcceleration multiplies by 60 in judge mode', () => {
    expect(applyTimeAcceleration(1000, false)).toBe(1000);
    expect(applyTimeAcceleration(1000, true)).toBe(60000);
  });

  test('calculateDriftCompensation compensates correctly', () => {
    // Expected 1000ms, actual took 1020ms -> drift is 20ms -> next interval 980ms
    expect(calculateDriftCompensation(1000, 1020)).toBe(980);
    // Expected 1000ms, actual took 1000ms -> 1000ms
    expect(calculateDriftCompensation(1000, 1000)).toBe(1000);
    // Huge drift clamped to 0
    expect(calculateDriftCompensation(1000, 3000)).toBe(0);
  });

  test('formatTime formats seconds into MM:SS correctly', () => {
    expect(formatTime(125)).toBe('02:05');
    expect(formatTime(0)).toBe('00:00');
    expect(formatTime(600)).toBe('10:00');
    expect(formatTime(3599)).toBe('59:59');
  });

  test('minutesToSeconds converts correctly', () => {
    expect(minutesToSeconds(1)).toBe(60);
    expect(minutesToSeconds(25)).toBe(1500);
    expect(minutesToSeconds(0)).toBe(0);
  });

  test('clampDuration clamps between 1 and 120', () => {
    expect(clampDuration(0)).toBe(1);
    expect(clampDuration(-10)).toBe(1);
    expect(clampDuration(25)).toBe(25);
    expect(clampDuration(150)).toBe(120);
    expect(clampDuration(25.4)).toBe(25);
  });

  test('saveTimerState and loadTimerState persist correctly', () => {
    const state = {
      duration: 30,
      lastActiveSession: {
        startTime: Date.now(),
        duration: 1800,
        elapsed: 300,
      },
    };

    expect(saveTimerState(state)).toBe(true);
    const loaded = loadTimerState();
    expect(loaded).toEqual(state);
  });
});
