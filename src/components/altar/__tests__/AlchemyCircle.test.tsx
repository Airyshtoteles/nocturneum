import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import AlchemyCircle from '../AlchemyCircle';

describe('AlchemyCircle Component', () => {
  it('renders idle circle with appropriate role and label', () => {
    render(<AlchemyCircle isAnalyzing={false} size={180} />);

    const circle = screen.getByRole('img', { name: /dormant transmutation circle/i });
    expect(circle).toBeDefined();
    expect(circle.style.width).toBe('180px');
  });

  it('renders active circle during analysis with spinning label', () => {
    render(<AlchemyCircle isAnalyzing={true} />);

    const circle = screen.getByRole('img', { name: /transmutation circle spinning/i });
    expect(circle).toBeDefined();
  });
});
