import React from 'react';
import { describe, test, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Card3D from '../Card3D';
import { Flashcard } from '@/types';

describe('Card3D Component', () => {
  const sampleCard: Flashcard = {
    id: 'test-card-1',
    front: '### Question Title\nWhat is the sacred formula?',
    back: '### Secret Revelation\nTransmutation through vitriol and salt.',
  };

  test('renders card with accessible role and label', () => {
    render(<Card3D card={sampleCard} isFlipped={false} />);
    const button = screen.getByRole('button');
    expect(button).toBeDefined();
    expect(button.getAttribute('aria-label')).toContain('Question face');
  });

  test('renders front content and back content', () => {
    const { container } = render(<Card3D card={sampleCard} isFlipped={false} />);
    expect(container.textContent).toContain('Question Title');
    expect(container.textContent).toContain('Secret Revelation');
  });

  test('calls onFlip callback when clicked', () => {
    const onFlip = vi.fn();
    render(<Card3D card={sampleCard} isFlipped={false} onFlip={onFlip} />);
    const cardElement = screen.getByRole('button');
    fireEvent.click(cardElement);
    expect(onFlip).toHaveBeenCalledTimes(1);
  });

  test('calls onFlip callback when Space or Enter is pressed', () => {
    const onFlip = vi.fn();
    render(<Card3D card={sampleCard} isFlipped={false} onFlip={onFlip} />);
    const cardElement = screen.getByRole('button');

    fireEvent.keyDown(cardElement, { key: ' ' });
    expect(onFlip).toHaveBeenCalledTimes(1);

    fireEvent.keyDown(cardElement, { key: 'Enter' });
    expect(onFlip).toHaveBeenCalledTimes(2);
  });

  test('updates aria-label when flipped', () => {
    render(<Card3D card={sampleCard} isFlipped={true} />);
    const button = screen.getByRole('button');
    expect(button.getAttribute('aria-label')).toContain('Answer face');
  });
});
