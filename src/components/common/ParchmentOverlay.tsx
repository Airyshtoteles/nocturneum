'use client';

import React from 'react';

/**
 * Full-screen SVG feTurbulence parchment overlay.
 * Simulates an antique parchment texture across the viewport.
 * Pointer-events-none ensures zero interference with user interactions.
 * Validates Requirement 6.8 & 5.11.
 */
export default function ParchmentOverlay() {
  return (
    <div
      className="fixed inset-0 pointer-events-none z-50 overflow-hidden mix-blend-overlay opacity-30 select-none"
      aria-hidden="true"
    >
      <svg
        className="w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
        width="100%"
        height="100%"
      >
        <filter id="parchment-noise" x="0%" y="0%" width="100%" height="100%">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.04"
            numOctaves="5"
            result="noise"
          />
          <feColorMatrix
            type="matrix"
            values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 0.5 0"
          />
        </filter>
        <rect
          width="100%"
          height="100%"
          filter="url(#parchment-noise)"
          fill="#E6B86A"
        />
      </svg>
    </div>
  );
}
