import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import TimerControls from '../TimerControls';

describe('TimerControls Component', () => {
  it('renders duration dropdown and action buttons', () => {
    render(
      <TimerControls
        isActive={false}
        isPaused={false}
        duration={25}
        onStart={vi.fn()}
        onPause={vi.fn()}
        onResume={vi.fn()}
        onReset={vi.fn()}
        onDurationChange={vi.fn()}
      />
    );

    expect(screen.getByRole('region', { name: /candle timer controls/i })).toBeDefined();
    expect(screen.getByRole('button', { name: /light the candle/i })).toBeDefined();
    expect(screen.getByRole('button', { name: /extinguish flame/i })).toBeDefined();
  });

  it('triggers onStart when light flame button is clicked', () => {
    const handleStart = vi.fn();
    render(
      <TimerControls
        isActive={false}
        isPaused={false}
        duration={25}
        onStart={handleStart}
        onPause={vi.fn()}
        onResume={vi.fn()}
        onReset={vi.fn()}
        onDurationChange={vi.fn()}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: /light the candle/i }));
    expect(handleStart).toHaveBeenCalledTimes(1);
  });

  it('triggers onPause when active and pause button is clicked', () => {
    const handlePause = vi.fn();
    render(
      <TimerControls
        isActive={true}
        isPaused={false}
        duration={25}
        onStart={vi.fn()}
        onPause={handlePause}
        onResume={vi.fn()}
        onReset={vi.fn()}
        onDurationChange={vi.fn()}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: /pause timer/i }));
    expect(handlePause).toHaveBeenCalledTimes(1);
  });

  it('triggers onResume when paused and resume button is clicked', () => {
    const handleResume = vi.fn();
    render(
      <TimerControls
        isActive={true}
        isPaused={true}
        duration={25}
        onStart={vi.fn()}
        onPause={vi.fn()}
        onResume={handleResume}
        onReset={vi.fn()}
        onDurationChange={vi.fn()}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: /resume timer/i }));
    expect(handleResume).toHaveBeenCalledTimes(1);
  });

  it('triggers onDurationChange when dropdown selection changes', () => {
    const handleDurationChange = vi.fn();
    render(
      <TimerControls
        isActive={false}
        isPaused={false}
        duration={25}
        onStart={vi.fn()}
        onPause={vi.fn()}
        onResume={vi.fn()}
        onReset={vi.fn()}
        onDurationChange={handleDurationChange}
      />
    );

    const select = screen.getByLabelText(/select session duration/i);
    fireEvent.change(select, { target: { value: '45' } });
    expect(handleDurationChange).toHaveBeenCalledWith(45);
  });
});
