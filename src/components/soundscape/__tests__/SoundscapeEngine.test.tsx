import React from 'react';
import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import SoundscapeEngine from '../SoundscapeEngine';

describe('SoundscapeEngine Component', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('renders audio channels and activation prompt', () => {
    render(<SoundscapeEngine />);

    expect(screen.getByTestId('soundscape-engine-module')).toBeDefined();
    expect(screen.getByText('🌧️ Alchemical Soundscape')).toBeDefined();
    expect(screen.getByText(/Awaken Audio Engine/i)).toBeDefined();
    expect(screen.getByLabelText(/toggle rain effect on/i)).toBeDefined();
    expect(screen.getByLabelText(/toggle tick effect on/i)).toBeDefined();
  });

  it('awakens audio context on user click', () => {
    render(<SoundscapeEngine />);

    const awakenBtn = screen.getByText(/Awaken Audio Engine/i);
    fireEvent.click(awakenBtn);

    // Prompt disappears once awakened
    expect(screen.queryByText(/Awaken Audio Engine/i)).toBeNull();
  });

  it('toggles sound effect and persists state to localStorage', () => {
    render(<SoundscapeEngine />);

    const rainToggle = screen.getByLabelText(/toggle rain effect on/i);
    fireEvent.click(rainToggle);

    expect(screen.getByLabelText(/toggle rain effect off/i)).toBeDefined();
    const stored = JSON.parse(localStorage.getItem('nocturneum_soundscape') || '{}');
    expect(stored.rain.enabled).toBe(true);
  });

  it('updates volume slider and persists', () => {
    render(<SoundscapeEngine />);

    const rainSlider = screen.getByLabelText(/rain volume/i);
    fireEvent.change(rainSlider, { target: { value: '85' } });

    const stored = JSON.parse(localStorage.getItem('nocturneum_soundscape') || '{}');
    expect(stored.rain.volume).toBe(85);
  });
});
