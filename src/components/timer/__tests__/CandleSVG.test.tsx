import React from 'react';
import { describe, test, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import CandleSVG from '../CandleSVG';

describe('CandleSVG Component', () => {
  test('renders candle svg with correct accessible role and label', () => {
    render(<CandleSVG candleHeight={80} isActive={true} />);
    const svg = screen.getByRole('img');
    expect(svg).toBeDefined();
    expect(svg.getAttribute('aria-label')).toContain('80% remaining');
  });

  test('renders candle wax body with scaleY transform', () => {
    const { container } = render(<CandleSVG candleHeight={50} isActive={true} />);
    const waxBody = container.querySelector('#wax-candle-body');
    expect(waxBody).not.toBeNull();
    const scaledGroup = waxBody?.querySelector('g[style*="scaleY"]');
    expect(scaledGroup?.getAttribute('style')).toContain('scaleY(0.5)');
  });

  test('renders flame and wick when height is above zero and not completed', () => {
    const { container } = render(<CandleSVG candleHeight={75} isActive={true} />);
    const flame = container.querySelector('#candle-wick-and-flame');
    expect(flame).not.toBeNull();
    const burst = container.querySelector('#completion-burst-effect');
    expect(burst).toBeNull();
  });

  test('renders completion burst effect when candle is burnt down or completed', () => {
    const { container } = render(<CandleSVG candleHeight={0} isCompleted={true} />);
    const burst = container.querySelector('#completion-burst-effect');
    expect(burst).not.toBeNull();
  });

  test('renders candelabrum holder base', () => {
    const { container } = render(<CandleSVG candleHeight={100} />);
    const holder = container.querySelector('#candelabrum-holder');
    expect(holder).not.toBeNull();
  });
});
