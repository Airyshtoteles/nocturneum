import React from 'react';
import { describe, test, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import DocumentRenderer from '../DocumentRenderer';
import { SpecDocument } from '@/types';

describe('DocumentRenderer Component', () => {
  test('renders empty state when document is null', () => {
    render(<DocumentRenderer document={null} />);
    expect(screen.getByText('No Document Selected')).toBeDefined();
    expect(screen.getByText(/Select an architectural specification/i)).toBeDefined();
  });

  test('renders markdown document with headings and paragraphs', () => {
    const doc: SpecDocument = {
      path: 'steering/rules.md',
      name: 'rules.md',
      category: 'steering',
      type: 'markdown',
      content: '# Gothic Alchemist Rules\n\nThis is a sacred productivity sanctuary.',
    };

    render(<DocumentRenderer document={doc} />);
    expect(screen.getByText('Gothic Alchemist Rules')).toBeDefined();
    expect(screen.getByText('This is a sacred productivity sanctuary.')).toBeDefined();
    expect(screen.getByText('Category: steering')).toBeDefined();
  });

  test('renders JSON document with pretty printing and syntax highlighting', () => {
    const doc: SpecDocument = {
      path: 'hooks/config.json',
      name: 'config.json',
      category: 'hooks',
      type: 'json',
      content: '{"alchemicalMode":true,"multiplier":60}',
    };

    const { container } = render(<DocumentRenderer document={doc} />);
    expect(screen.getByText('config.json')).toBeDefined();
    expect(screen.getByText('JSON Hook / Config')).toBeDefined();
    expect(container.textContent).toContain('alchemicalMode');
    expect(container.textContent).toContain('multiplier');
  });

  test('renders markdown tables with proper structure', () => {
    const doc: SpecDocument = {
      path: 'specs/table.md',
      name: 'table.md',
      category: 'specs',
      type: 'markdown',
      content: '| Ingredient | Quantity |\n|---|---|\n| Vitriol | 5 drops |\n| Salt | 1 pinch |',
    };

    const { container } = render(<DocumentRenderer document={doc} />);
    const table = container.querySelector('table');
    expect(table).not.toBeNull();
    expect(container.textContent).toContain('Ingredient');
    expect(container.textContent).toContain('Vitriol');
    expect(container.textContent).toContain('5 drops');
  });
});
