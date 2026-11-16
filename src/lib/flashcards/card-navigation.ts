/**
 * Flashcard Navigation Logic
 * Implements circular modulo navigation and keyboard event listeners for Grimoire Flashcards.
 * Validates Requirements 4.9, 4.15
 */

/**
 * Navigate to next card using circular modulo arithmetic.
 * For any deck with N cards and current index I:
 *   next = (I + 1) % N
 * Validates Requirement 4.9
 */
export function getNextCardIndex(currentIndex: number, totalCards: number): number {
  if (totalCards <= 0) return 0;
  return (currentIndex + 1) % totalCards;
}

/**
 * Navigate to previous card using circular modulo arithmetic.
 * For any deck with N cards and current index I:
 *   prev = (I - 1 + N) % N
 * Validates Requirement 4.9
 */
export function getPrevCardIndex(currentIndex: number, totalCards: number): number {
  if (totalCards <= 0) return 0;
  return (currentIndex - 1 + totalCards) % totalCards;
}

/**
 * Format position indicator string (e.g. "3 / 10").
 * Validates Requirement 4.11
 */
export function formatCardPosition(currentIndex: number, totalCards: number): string {
  if (totalCards <= 0) return '0 / 0';
  const clampedIndex = Math.min(Math.max(0, currentIndex), totalCards - 1);
  return `${clampedIndex + 1} / ${totalCards}`;
}

export interface NavigationCallbacks {
  onNext?: () => void;
  onPrev?: () => void;
  onFlip?: () => void;
}

/**
 * Handle keyboard navigation events (ArrowLeft, ArrowRight, Spacebar).
 * Validates Requirement 4.15
 */
export function handleCardKeyboardEvent(
  event: KeyboardEvent | React.KeyboardEvent,
  callbacks: NavigationCallbacks
): boolean {
  // Ignore keyboard shortcuts if the user is typing in an input or textarea
  const target = event.target as HTMLElement | null;
  if (
    target &&
    (target.tagName === 'INPUT' ||
      target.tagName === 'TEXTAREA' ||
      target.isContentEditable)
  ) {
    return false;
  }

  switch (event.key) {
    case 'ArrowRight':
      event.preventDefault();
      callbacks.onNext?.();
      return true;

    case 'ArrowLeft':
      event.preventDefault();
      callbacks.onPrev?.();
      return true;

    case ' ':
      event.preventDefault();
      callbacks.onFlip?.();
      return true;

    default:
      return false;
  }
}
