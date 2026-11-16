'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Flashcard } from '@/types';
import { parseMarkdown } from '@/lib/flashcards/markdown-parser';

export interface Card3DProps {
  card: Flashcard;
  isFlipped: boolean;
  onFlip?: () => void;
  className?: string;
}

// 600ms flip animation with cubic-bezier deceleration per Requirement 4.13
const flipVariants = {
  front: { rotateY: 0 },
  back: { rotateY: 180 },
};

const flipTransition = {
  duration: 0.6,
  ease: [0.4, 0.0, 0.2, 1] as const, // cubic-bezier for smooth gothic deceleration
};

/**
 * 3D Flashcard component with smooth 600ms rotateY flip animation.
 * Features dual-sided markdown rendering and antique gothic parchment aesthetics.
 * Validates Requirements 4.1, 4.2, 4.13
 */
export default function Card3D({
  card,
  isFlipped,
  onFlip,
  className = '',
}: Card3DProps) {
  const frontHtml = parseMarkdown(card.front);
  const backHtml = parseMarkdown(card.back);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      onFlip?.();
    }
  };

  return (
    <div
      className={`relative w-full max-w-xl h-80 cursor-pointer select-none [perspective:1200px] ${className}`}
      onClick={onFlip}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
      aria-label={`Flashcard: ${isFlipped ? 'Answer face' : 'Question face'}. Press Space to flip.`}
    >
      <motion.div
        className="w-full h-full relative [transform-style:preserve-3d]"
        animate={isFlipped ? 'back' : 'front'}
        variants={flipVariants}
        transition={flipTransition}
      >
        {/* =========================================================
            FRONT FACE (Question / Incantation)
            ========================================================= */}
        <div
          className="absolute inset-0 w-full h-full rounded-xl bg-parchment border border-gold/30 p-6 flex flex-col justify-between shadow-gothic-glow [backface-visibility:hidden] overflow-hidden"
          style={{ transform: 'rotateY(0deg)' }}
        >
          {/* Gothic corner filigree marks */}
          <div className="absolute top-2 left-2 text-gold/40 text-xs font-serif select-none">✦</div>
          <div className="absolute top-2 right-2 text-gold/40 text-xs font-serif select-none">✦</div>
          <div className="absolute bottom-2 left-2 text-gold/40 text-xs font-serif select-none">✦</div>
          <div className="absolute bottom-2 right-2 text-gold/40 text-xs font-serif select-none">✦</div>

          {/* Header indicator */}
          <div className="flex items-center justify-between border-b border-gold/20 pb-2 text-xs font-mono uppercase tracking-widest text-mist/80">
            <span>Grimoire Inscription</span>
            <span className="text-gold/70 text-[10px]">Click or [Space] to flip</span>
          </div>

          {/* Markdown Content */}
          <div
            className="prose prose-invert max-w-none text-gold font-serif overflow-y-auto my-auto pr-1"
            dangerouslySetInnerHTML={{ __html: frontHtml }}
          />

          {/* Footer */}
          <div className="text-[11px] text-right font-mono text-mist/60 italic">
            Front Face
          </div>
        </div>

        {/* =========================================================
            BACK FACE (Answer / Secret Formula)
            ========================================================= */}
        <div
          className="absolute inset-0 w-full h-full rounded-xl bg-[#1a1424] border border-crimson/50 p-6 flex flex-col justify-between shadow-gothic-crimson [backface-visibility:hidden] overflow-hidden"
          style={{ transform: 'rotateY(180deg)' }}
        >
          {/* Gothic corner filigree marks */}
          <div className="absolute top-2 left-2 text-crimson/60 text-xs font-serif select-none">☩</div>
          <div className="absolute top-2 right-2 text-crimson/60 text-xs font-serif select-none">☩</div>
          <div className="absolute bottom-2 left-2 text-crimson/60 text-xs font-serif select-none">☩</div>
          <div className="absolute bottom-2 right-2 text-crimson/60 text-xs font-serif select-none">☩</div>

          {/* Header indicator */}
          <div className="flex items-center justify-between border-b border-crimson/30 pb-2 text-xs font-mono uppercase tracking-widest text-mist/80">
            <span className="text-crimson font-semibold">Alchemical Revelation</span>
            <span className="text-gold/70 text-[10px]">Click or [Space] to flip</span>
          </div>

          {/* Markdown Content */}
          <div
            className="prose prose-invert max-w-none text-[#F4E8D4] font-serif overflow-y-auto my-auto pr-1"
            dangerouslySetInnerHTML={{ __html: backHtml }}
          />

          {/* Footer */}
          <div className="text-[11px] text-right font-mono text-crimson/80 italic">
            Back Face (Revealed)
          </div>
        </div>
      </motion.div>
    </div>
  );
}
