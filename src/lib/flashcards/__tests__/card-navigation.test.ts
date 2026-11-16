import { describe, test, expect, vi } from 'vitest';
import {
  getNextCardIndex,
  getPrevCardIndex,
  formatCardPosition,
  handleCardKeyboardEvent,
} from '../card-navigation';

describe('Flashcard Circular Modulo Navigation', () => {
  test('getNextCardIndex navigates forward and wraps to 0 at end', () => {
    expect(getNextCardIndex(0, 5)).toBe(1);
    expect(getNextCardIndex(1, 5)).toBe(2);
    expect(getNextCardIndex(4, 5)).toBe(0); // Circular wrap
    expect(getNextCardIndex(0, 1)).toBe(0); // Single card deck
    expect(getNextCardIndex(0, 0)).toBe(0); // Empty deck
  });

  test('getPrevCardIndex navigates backward and wraps to N-1 at start', () => {
    expect(getPrevCardIndex(2, 5)).toBe(1);
    expect(getPrevCardIndex(1, 5)).toBe(0);
    expect(getPrevCardIndex(0, 5)).toBe(4); // Circular wrap backwards
    expect(getPrevCardIndex(0, 1)).toBe(0);
    expect(getPrevCardIndex(0, 0)).toBe(0);
  });

  test('formatCardPosition formats position indicator correctly', () => {
    expect(formatCardPosition(0, 10)).toBe('1 / 10');
    expect(formatCardPosition(2, 10)).toBe('3 / 10');
    expect(formatCardPosition(9, 10)).toBe('10 / 10');
    expect(formatCardPosition(0, 0)).toBe('0 / 0');
  });

  test('handleCardKeyboardEvent triggers appropriate callbacks', () => {
    const onNext = vi.fn();
    const onPrev = vi.fn();
    const onFlip = vi.fn();

    const mockEvent = (key: string, tagName = 'DIV') => {
      const target = document.createElement(tagName);
      return {
        key,
        target,
        preventDefault: vi.fn(),
      } as unknown as KeyboardEvent;
    };

    // ArrowRight -> Next
    expect(handleCardKeyboardEvent(mockEvent('ArrowRight'), { onNext, onPrev, onFlip })).toBe(true);
    expect(onNext).toHaveBeenCalledTimes(1);

    // ArrowLeft -> Prev
    expect(handleCardKeyboardEvent(mockEvent('ArrowLeft'), { onNext, onPrev, onFlip })).toBe(true);
    expect(onPrev).toHaveBeenCalledTimes(1);

    // Space -> Flip
    expect(handleCardKeyboardEvent(mockEvent(' '), { onNext, onPrev, onFlip })).toBe(true);
    expect(onFlip).toHaveBeenCalledTimes(1);

    // Other key -> Ignored
    expect(handleCardKeyboardEvent(mockEvent('Escape'), { onNext, onPrev, onFlip })).toBe(false);

    // Inside input or textarea -> Ignored
    const inputEvent = mockEvent('ArrowRight', 'INPUT');
    expect(handleCardKeyboardEvent(inputEvent, { onNext, onPrev, onFlip })).toBe(false);
    expect(onNext).toHaveBeenCalledTimes(1); // Still 1, not incremented
  });
});
