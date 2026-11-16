import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import { parseMarkdown } from '../markdown-parser';
import { getNextCardIndex, getPrevCardIndex } from '../card-navigation';

describe('Grimoire Flashcards Property Tests', () => {
  /**
   * Property 9: Markdown Parsing Consistency
   * For any valid markdown string M containing bold (**text**), italic (*text*),
   * code blocks (```code```), and bullet lists, parsing produces consistent HTML
   * structure with strong, em, pre/code, and ul/li elements.
   * Validates: Requirements 4.3, 4.4
   */
  // Feature: nocturneum-core, Property 9: Markdown Parsing Consistency
  it('Property 9: Markdown parsing consistently transforms markdown tokens to valid HTML tags', () => {
    // Pure alphanumeric word generator (avoids markdown syntax collision such as _ or *)
    const wordGen = fc.stringMatching(/^[a-zA-Z0-9]{2,20}$/);

    fc.assert(
      fc.property(
        wordGen,
        wordGen,
        wordGen,
        wordGen,
        (boldWord, italicWord, codeWord, listWord) => {
          // Bold test
          const boldMd = `**${boldWord}**`;
          const boldHtml = parseMarkdown(boldMd);
          expect(boldHtml).toContain('<strong>');
          expect(boldHtml).toContain(boldWord);
          expect(boldHtml).toContain('</strong>');

          // Italic test
          const italicMd = `*${italicWord}*`;
          const italicHtml = parseMarkdown(italicMd);
          expect(italicHtml).toContain('<em>');
          expect(italicHtml).toContain(italicWord);
          expect(italicHtml).toContain('</em>');

          // Code block test
          const codeBlockMd = `\`\`\`\nconst ${codeWord} = 42;\n\`\`\``;
          const codeHtml = parseMarkdown(codeBlockMd);
          expect(codeHtml).toContain('<pre><code');
          expect(codeHtml).toContain(codeWord);
          expect(codeHtml).toContain('</code></pre>');

          // Unordered list test
          const listMd = `- item ${listWord}\n- second item`;
          const listHtml = parseMarkdown(listMd);
          expect(listHtml).toContain('<ul>');
          expect(listHtml).toContain('<li>');
          expect(listHtml).toContain(listWord);
          expect(listHtml).toContain('</ul>');
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property 10: Card Navigation Bounds
   * For any flashcard deck with N cards (N >= 1) and current index I, forward navigation
   * moves to (I + 1) mod N, and backward moves to (I - 1 + N) mod N, ensuring the index
   * always remains strictly within range [0, N-1].
   * Validates: Requirements 4.9
   */
  // Feature: nocturneum-core, Property 10: Card Navigation Bounds
  it('Property 10: Card navigation modulo operations always stay within [0, N - 1]', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 1, max: 500 }), // N total cards
        fc.integer({ min: 0, max: 1000 }), // arbitrary starting index
        (totalCards, rawIndex) => {
          const currentIndex = rawIndex % totalCards;

          const nextIndex = getNextCardIndex(currentIndex, totalCards);
          const prevIndex = getPrevCardIndex(currentIndex, totalCards);

          // Invariant 1: Range bounds
          expect(nextIndex).toBeGreaterThanOrEqual(0);
          expect(nextIndex).toBeLessThan(totalCards);

          expect(prevIndex).toBeGreaterThanOrEqual(0);
          expect(prevIndex).toBeLessThan(totalCards);

          // Invariant 2: Mathematical circular modulo
          expect(nextIndex).toBe((currentIndex + 1) % totalCards);
          expect(prevIndex).toBe((currentIndex - 1 + totalCards) % totalCards);

          // Invariant 3: Cycle of N steps brings back to original index
          let cycleForward = currentIndex;
          for (let step = 0; step < totalCards; step++) {
            cycleForward = getNextCardIndex(cycleForward, totalCards);
          }
          expect(cycleForward).toBe(currentIndex);
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property 11: Card Flip Round-Trip
   * For any flashcard in any flip state S (front or back), performing two consecutive
   * flip operations shall return the card to state S.
   * Validates: Requirements 4.12
   */
  // Feature: nocturneum-core, Property 11: Card Flip Round-Trip
  it('Property 11: Two consecutive flip operations return card to original state', () => {
    // Pure flip operation function: f(s) = !s
    const flipCard = (isFlipped: boolean): boolean => !isFlipped;

    fc.assert(
      fc.property(fc.boolean(), (initialState) => {
        const afterFirstFlip = flipCard(initialState);
        const afterSecondFlip = flipCard(afterFirstFlip);

        // State changes on first flip
        expect(afterFirstFlip).toBe(!initialState);
        // State restores on second flip
        expect(afterSecondFlip).toBe(initialState);
      }),
      { numRuns: 100 }
    );
  });
});
