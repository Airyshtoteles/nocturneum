'use client';

import React from 'react';

interface JudgeModeIndicatorProps {
  isActive: boolean;
  timeMultiplier?: number;
}

/**
 * Visual indicator displayed in the interface header while Judge Mode is active.
 * Validates Requirement 7.2
 */
export default function JudgeModeIndicator({
  isActive,
  timeMultiplier = 60,
}: JudgeModeIndicatorProps) {
  if (!isActive) return null;

  return (
    <aside
      role="status"
      aria-live="polite"
      aria-label="Judge demonstration mode active"
      className="w-full bg-crimson/90 border-b border-gold/40 text-gold px-4 py-2 flex items-center justify-between text-xs tracking-wide shadow-gothic-crimson z-40 transition-all duration-300"
    >
      <div className="flex items-center space-x-2">
        <span className="flex h-2.5 w-2.5 relative">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-gold opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-gold"></span>
        </span>
        <span className="font-semibold uppercase tracking-widest text-gold drop-shadow-sm">
          ⚖️ Judge Evaluation Mode Active
        </span>
        <span className="hidden sm:inline-block text-mist/90">
          — Demonstration session seeded • Timers accelerated by {timeMultiplier}x
        </span>
      </div>

      <div className="flex items-center space-x-3 text-[11px] font-mono text-mist">
        <span className="px-2 py-0.5 rounded bg-obsidian/70 border border-gold/20 text-gold">
          URL: ?mode=judge
        </span>
      </div>
    </aside>
  );
}
