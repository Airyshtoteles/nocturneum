import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import AlchemistBlueprintModal from '../AlchemistBlueprintModal';
import { SpecDocument } from '@/types';

const mockDocs: SpecDocument[] = [
  {
    path: '.kiro/specs/test.md',
    name: 'test.md',
    category: 'specs',
    type: 'markdown',
    content: '# Test Spec Title\n\nSacred alchemy instructions.',
  },
  {
    path: '.kiro/steering/test-rules.md',
    name: 'test-rules.md',
    category: 'steering',
    type: 'markdown',
    content: '# Steering Rules\n\nNo forbidden arts.',
  },
];

describe('AlchemistBlueprintModal Component', () => {
  it('renders nothing when isOpen is false', () => {
    const { container } = render(
      <AlchemistBlueprintModal isOpen={false} onClose={vi.fn()} initialDocuments={mockDocs} />
    );
    expect(container.firstChild).toBeNull();
  });

  it('renders modal dialog and document content when isOpen is true', () => {
    render(
      <AlchemistBlueprintModal isOpen={true} onClose={vi.fn()} initialDocuments={mockDocs} />
    );

    expect(screen.getByRole('dialog', { name: /the alchemist's blueprint/i })).toBeDefined();
    expect(screen.getAllByText('test.md').length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText('test-rules.md')).toBeDefined();
    expect(screen.getByText(/Sacred alchemy instructions/i)).toBeDefined();
  });

  it('switches displayed document when clicking a different document in list', () => {
    render(
      <AlchemistBlueprintModal isOpen={true} onClose={vi.fn()} initialDocuments={mockDocs} />
    );

    fireEvent.click(screen.getByText('test-rules.md'));
    expect(screen.getByText(/No forbidden arts/i)).toBeDefined();
  });

  it('calls onClose when close button is clicked', () => {
    const handleClose = vi.fn();
    render(
      <AlchemistBlueprintModal isOpen={true} onClose={handleClose} initialDocuments={mockDocs} />
    );

    fireEvent.click(screen.getByRole('button', { name: /close blueprint modal/i }));
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when Escape key is pressed', () => {
    const handleClose = vi.fn();
    render(
      <AlchemistBlueprintModal isOpen={true} onClose={handleClose} initialDocuments={mockDocs} />
    );

    fireEvent.keyDown(window, { key: 'Escape' });
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when backdrop is clicked', () => {
    const handleClose = vi.fn();
    render(
      <AlchemistBlueprintModal isOpen={true} onClose={handleClose} initialDocuments={mockDocs} />
    );

    fireEvent.click(screen.getByTestId('blueprint-backdrop'));
    expect(handleClose).toHaveBeenCalledTimes(1);
  });
});
