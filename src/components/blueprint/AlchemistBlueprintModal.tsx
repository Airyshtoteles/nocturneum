'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SpecDocument, DocumentCategory } from '@/types';
import DocumentRenderer from './DocumentRenderer';

export interface AlchemistBlueprintModalProps {
  /** Whether the modal dialog is displayed */
  isOpen: boolean;
  /** Handler invoked when modal is dismissed */
  onClose: () => void;
  /** Pre-loaded documents for static preview or testing */
  initialDocuments?: SpecDocument[];
  /** Optional container class name */
  className?: string;
}

/** Fallback document if API is unavailable or empty */
const FALLBACK_DOCUMENTS: SpecDocument[] = [
  {
    path: '.kiro/steering/gothic-alchemist-rules.md',
    name: 'gothic-alchemist-rules.md',
    category: 'steering',
    type: 'markdown',
    content: `# Nocturneum Steering Rules (Gothic Alchemist Theme & Architecture)

## Tech Stack Constraints
- Framework: Next.js (App Router) with TypeScript and Tailwind CSS.
- Animation: Framer Motion and pure SVG filters.
- Audio: Pure Web Audio API synthesis only.
- Storage: Local IndexedDB / localStorage.`,
  },
  {
    path: '.kiro/specs/nocturneum-core/design.md',
    name: 'design.md',
    category: 'specs',
    type: 'markdown',
    content: `# Nocturneum Core Architecture & Design
Victorian Gothic Alchemist's Study and Bug Exorcism Grimoire.
Contains complete mathematical models, state machines, and property specifications.`,
  },
];

/**
 * AlchemistBlueprintModal Component
 * Full-screen modal overlay revealing the internal Kiro specification architecture:
 * - Displays all .kiro/specs, .kiro/steering, and .kiro/hooks documents.
 * - Framer Motion smooth entrance/exit with backdrop blur (Requirement 5.9).
 * - Full keyboard accessibility: Dismiss via Escape key (Requirement 5.1).
 * - Categorized navigation sidebar and rich syntax-highlighted document rendering.
 * Validates Requirements 5.1, 5.5, 5.6, 5.9, 5.10, 5.13
 */
export default function AlchemistBlueprintModal({
  isOpen,
  onClose,
  initialDocuments,
  className = '',
}: AlchemistBlueprintModalProps) {
  const [documents, setDocuments] = useState<SpecDocument[]>(initialDocuments || []);
  const [selectedDocPath, setSelectedDocPath] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<DocumentCategory | 'all'>('all');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Available documents prioritizing initialDocuments if provided
  const activeDocuments = (initialDocuments && initialDocuments.length > 0) ? initialDocuments : documents;

  // Fetch documents from API when modal opens and no initialDocuments provided
  useEffect(() => {
    if (!isOpen || (initialDocuments && initialDocuments.length > 0)) {
      return;
    }

    let isMounted = true;
    setTimeout(() => {
      if (isMounted) setIsLoading(true);
    }, 0);

    fetch('/api/blueprint')
      .then((res) => res.json())
      .then((data) => {
        if (!isMounted) return;
        const docs: SpecDocument[] = (data && data.documents && data.documents.length > 0)
          ? data.documents
          : FALLBACK_DOCUMENTS;
        setDocuments(docs);
        if (docs.length > 0 && !selectedDocPath) {
          setSelectedDocPath(docs[0].path);
        }
      })
      .catch((err) => {
        console.warn('[Nocturneum Blueprint] Error loading specs:', err);
        if (isMounted) {
          setDocuments(FALLBACK_DOCUMENTS);
          setSelectedDocPath(FALLBACK_DOCUMENTS[0].path);
        }
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [isOpen, initialDocuments, selectedDocPath]);

  // Handle Escape key listener (Requirement 5.1)
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    },
    [onClose]
  );

  useEffect(() => {
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, handleKeyDown]);

  const filteredDocs = activeDocuments.filter((doc) => {
    if (activeCategory === 'all') return true;
    return doc.category === activeCategory;
  });

  const selectedDoc = activeDocuments.find((d) => d.path === selectedDocPath) || activeDocuments[0] || null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          className={`fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-hidden ${className}`}
          role="dialog"
          aria-modal="true"
          aria-labelledby="blueprint-modal-title"
        >
          {/* Backdrop Blur Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={onClose}
            className="absolute inset-0 bg-obsidian/85 backdrop-blur-md"
            data-testid="blueprint-backdrop"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            className="relative w-full max-w-5xl h-[88vh] flex flex-col rounded-2xl bg-gradient-to-b from-parchment-dark to-obsidian border-2 border-gold/40 shadow-[0_0_50px_rgba(0,0,0,0.9),0_0_30px_rgba(230,184,106,0.2)] overflow-hidden"
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gold/30 bg-obsidian/80">
              <div className="flex items-center gap-3">
                <span className="text-2xl text-gold">📐</span>
                <div>
                  <h2
                    id="blueprint-modal-title"
                    className="font-cinzel text-lg sm:text-xl font-bold tracking-widest text-gold drop-shadow-[0_2px_8px_rgba(230,184,106,0.3)]"
                  >
                    The Alchemist&apos;s Blueprint
                  </h2>
                  <p className="text-xs font-serif text-mist/75 italic">
                    Architectural Codex, Sacred Steering Rules, and Spec Invariants
                  </p>
                </div>
              </div>

              {/* Close Button */}
              <button
                onClick={onClose}
                aria-label="Close Blueprint Modal"
                className="w-9 h-9 flex items-center justify-center rounded-lg border border-gold/30 text-gold hover:text-crimson-light hover:border-crimson hover:bg-crimson/10 transition-colors duration-200"
              >
                ✕
              </button>
            </div>

            {/* Modal Body: Navigation Sidebar + Document Viewer */}
            <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
              {/* Sidebar Document List */}
              <div className="w-full md:w-64 border-b md:border-b-0 md:border-r border-gold/20 bg-obsidian/50 flex flex-col">
                {/* Category Filter Tabs */}
                <div className="flex items-center gap-1 p-2 border-b border-gold/15 text-[11px] font-cinzel">
                  {(['all', 'specs', 'steering', 'hooks'] as const).map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setActiveCategory(cat)}
                      className={`flex-1 py-1 px-1.5 rounded uppercase tracking-wider transition-colors text-center ${
                        activeCategory === cat
                          ? 'bg-gold/20 text-gold font-bold border border-gold/40'
                          : 'text-mist/60 hover:text-mist'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                {/* Documents List */}
                <div className="flex-1 overflow-y-auto p-2 space-y-1">
                  {isLoading ? (
                    <div className="p-4 text-center text-xs text-mist/60 font-serif">
                      Consulting grimoire archives...
                    </div>
                  ) : filteredDocs.length === 0 ? (
                    <div className="p-4 text-center text-xs text-mist/60 font-serif">
                      No documents found in category.
                    </div>
                  ) : (
                    filteredDocs.map((doc) => {
                      const isSelected = doc.path === selectedDocPath;
                      return (
                        <button
                          key={doc.path}
                          onClick={() => setSelectedDocPath(doc.path)}
                          className={`w-full text-left px-3 py-2 rounded-lg text-xs font-mono transition-all flex items-center justify-between ${
                            isSelected
                              ? 'bg-gold/20 text-gold font-semibold border border-gold/50 shadow-[0_0_10px_rgba(230,184,106,0.15)]'
                              : 'text-mist/80 hover:bg-parchment-dark/60 hover:text-gold'
                          }`}
                        >
                          <span className="truncate pr-2">{doc.name}</span>
                          <span className="text-[10px] uppercase font-cinzel px-1 py-0.2 rounded bg-obsidian border border-gold/20 text-gold/70">
                            {doc.category}
                          </span>
                        </button>
                      );
                    })
                  )}
                </div>
              </div>

              {/* Main Document Viewer Panel */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-parchment-dark/30">
                <DocumentRenderer document={selectedDoc} />
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-2.5 border-t border-gold/20 bg-obsidian/90 flex items-center justify-between text-xs font-mono text-mist/70">
              <span className="flex items-center gap-1.5">
                <kbd className="px-1.5 py-0.5 rounded bg-parchment-dark border border-gold/30 text-[10px] text-gold">
                  ESC
                </kbd>{' '}
                to dismiss
              </span>
              <span className="text-[11px] text-gold/80 italic font-serif">
                {documents.length} Grimoire Inscriptions Indexed
              </span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
