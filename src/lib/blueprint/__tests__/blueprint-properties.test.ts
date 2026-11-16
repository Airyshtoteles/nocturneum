import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import { render } from '@testing-library/react';
import React from 'react';
import DocumentRenderer from '@/components/blueprint/DocumentRenderer';
import { SpecDocument } from '@/types';

describe("Alchemist's Blueprint Property Tests", () => {
  /**
   * Property 12: Code Syntax Highlighting Preservation
   * For any code block with language identifier L and code content C, syntax highlighting
   * shall parse C without altering the code's text content, producing only additional
   * styling markup without data loss.
   * Validates: Requirements 5.7
   */
  // Feature: nocturneum-core, Property 12: Code Syntax Highlighting Preservation
  it('Property 12: Syntax highlighting preserves the exact text content of code blocks', () => {
    // Generate valid identifier and non-empty code lines without backticks
    const validCodeTextGen = fc
      .stringMatching(/^[a-zA-Z0-9_ =+*-;(){}[\]\n]{3,60}$/)
      .filter((s) => s.trim().length > 0 && !s.includes('```'));

    const languageGen = fc.constantFrom('javascript', 'typescript', 'python', 'json');

    fc.assert(
      fc.property(languageGen, validCodeTextGen, (lang, rawCode) => {
        const cleanCode = rawCode.trim();
        const doc: SpecDocument = {
          name: 'test-code.md',
          path: '.kiro/specs/test.md',
          category: 'specs',
          type: 'markdown',
          content: `### Sacred Formula\n\n\`\`\`${lang}\n${cleanCode}\n\`\`\`\n`,
        };

        const { container } = render(React.createElement(DocumentRenderer, { document: doc }));

        // Find the code element
        const codeElement = container.querySelector('code');
        expect(codeElement).not.toBeNull();

        // The textContent of the code element (stripped of all syntax span tags)
        // must match the original raw code lines
        const renderedCodeText = codeElement?.textContent?.trim() || '';
        expect(renderedCodeText).toBe(cleanCode);
      }),
      { numRuns: 50 }
    );
  });
});
