import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import CandleTimer from '../CandleTimer';

describe('CandleTimer Component', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.useRealTimers();
  });

  it('renders initial timer countdown and SVG visualization', () => {
    render(<CandleTimer initialDuration={25} />);

    expect(screen.getByTestId('candle-timer-module')).toBeDefined();
    expect(screen.getByText('25:00')).toBeDefined();
    expect(screen.getByText('🕯️ Crucible of Hours')).toBeDefined();
  });

  it('starts countdown when light flame is clicked', () => {
    render(<CandleTimer initialDuration={1} />);

    const startBtn = screen.getByRole('button', { name: /light the candle/i });
    fireEvent.click(startBtn);

    expect(screen.getByText(/wax consuming/i)).toBeDefined();
    expect(screen.getByRole('button', { name: /pause timer/i })).toBeDefined();
  });

  it('pauses and resumes countdown cleanly', () => {
    render(<CandleTimer initialDuration={1} />);

    fireEvent.click(screen.getByRole('button', { name: /light the candle/i }));
    fireEvent.click(screen.getByRole('button', { name: /pause timer/i }));

    expect(screen.getByText(/paused in time/i)).toBeDefined();
    expect(screen.getByRole('button', { name: /resume timer/i })).toBeDefined();

    fireEvent.click(screen.getByRole('button', { name: /resume timer/i }));
    expect(screen.getByText(/wax consuming/i)).toBeDefined();
  });

  it('resets countdown when extinguish is clicked', () => {
    render(<CandleTimer initialDuration={1} />);

    fireEvent.click(screen.getByRole('button', { name: /light the candle/i }));
    fireEvent.click(screen.getByRole('button', { name: /extinguish flame/i }));

    expect(screen.getByText('01:00')).toBeDefined();
    expect(screen.getByRole('button', { name: /light the candle/i })).toBeDefined();
  });

  it('accelerates in judge mode and fires onComplete when reaching zero', () => {
    vi.useFakeTimers();
    const handleComplete = vi.fn();
    render(<CandleTimer initialDuration={1} judgeMode={true} onComplete={handleComplete} />);

    fireEvent.click(screen.getByRole('button', { name: /light the candle/i }));

    // In judge mode (60x acceleration), 1 minute = 60s passes in 1 second (1000ms)
    act(() => {
      vi.advanceTimersByTime(1200);
    });

    expect(handleComplete).toHaveBeenCalled();
    expect(screen.getByText('00:00')).toBeDefined();
    expect(screen.getByText(/ritual fulfilled/i)).toBeDefined();
  });
});
