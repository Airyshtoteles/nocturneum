'use client';

import React from 'react';
import { motion } from 'framer-motion';

export interface AlchemyCircleProps {
  /** Whether the alchemical circle is actively transmuting/analyzing */
  isAnalyzing: boolean;
  /** Diameter or size in pixels (default: 200) */
  size?: number;
  /** Optional container class name */
  className?: string;
}

/**
 * AlchemyCircle Component
 * Procedural SVG Alchemical Transmutation Circle rendered with Framer Motion.
 * Features:
 * - Nested concentric rings with sacred geometry (triangles, hexagrams, runes).
 * - Continuous smooth 360° rotation when analyzing errors (Requirement 3.2).
 * - Multi-layered Altar Crimson and Candle Gold glow filters.
 * - Subtle pulsating idle aura when awaiting an incantation.
 * Validates Requirements 3.2, 6.1
 */
export default function AlchemyCircle({
  isAnalyzing,
  size = 200,
  className = '',
}: AlchemyCircleProps) {
  return (
    <div
      className={`relative flex items-center justify-center ${className}`}
      style={{ width: size, height: size }}
      role="img"
      aria-label={isAnalyzing ? 'Transmutation circle spinning during error exorcism' : 'Dormant transmutation circle'}
    >
      {/* Outer Glow Halo */}
      <div
        className={`absolute inset-0 rounded-full transition-opacity duration-700 pointer-events-none ${
          isAnalyzing
            ? 'opacity-80 shadow-[0_0_50px_rgba(122,28,36,0.8),0_0_80px_rgba(230,184,106,0.3)] animate-pulse'
            : 'opacity-20 shadow-[0_0_20px_rgba(230,184,106,0.2)]'
        }`}
      />

      {/* Primary Animated SVG Circle */}
      <motion.svg
        viewBox="0 0 300 300"
        className="w-full h-full overflow-visible"
        animate={{
          rotate: isAnalyzing ? 360 : 0,
        }}
        transition={
          isAnalyzing
            ? {
                repeat: Infinity,
                duration: 4,
                ease: 'linear',
              }
            : {
                duration: 1.2,
                ease: 'easeOut',
              }
        }
      >
        <defs>
          {/* Alchemical Crimson-Gold Gradient */}
          <linearGradient id="alchemy-crimson-gold" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#E6B86A" />
            <stop offset="50%" stopColor="#C93B47" />
            <stop offset="100%" stopColor="#7A1C24" />
          </linearGradient>

          {/* Radial Rune Glow */}
          <radialGradient id="circle-center-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#E6B86A" stopOpacity={isAnalyzing ? '0.4' : '0.1'} />
            <stop offset="70%" stopColor="#7A1C24" stopOpacity={isAnalyzing ? '0.2' : '0.05'} />
            <stop offset="100%" stopColor="#0B0A0E" stopOpacity="0" />
          </radialGradient>

          {/* Blur filter for magical energy glow */}
          <filter id="alchemy-blur" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Ambient Center Glow */}
        <circle cx="150" cy="150" r="140" fill="url(#circle-center-glow)" />

        {/* Concentric Outer Rings */}
        <circle
          cx="150"
          cy="150"
          r="142"
          fill="none"
          stroke="url(#alchemy-crimson-gold)"
          strokeWidth="1.5"
          strokeDasharray="4 4"
        />
        <circle
          cx="150"
          cy="150"
          r="135"
          fill="none"
          stroke="#E6B86A"
          strokeWidth="2"
          filter="url(#alchemy-blur)"
        />
        <circle
          cx="150"
          cy="150"
          r="125"
          fill="none"
          stroke="#7A1C24"
          strokeWidth="1.5"
        />

        {/* Outer Ring Inscribed Runes / Markers */}
        {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg) => (
          <g key={deg} transform={`rotate(${deg} 150 150)`}>
            <circle cx="150" cy="20" r="3" fill="#E6B86A" />
            <line x1="150" y1="23" x2="150" y2="30" stroke="#E6B86A" strokeWidth="1" />
          </g>
        ))}

        {/* Inscribed Sacred Triangles (Forming Solomon's Hexagram Seal) */}
        {/* Triangle 1 (Pointing Up) */}
        <polygon
          points="150,45 235,195 65,195"
          fill="none"
          stroke="#E6B86A"
          strokeWidth="1.5"
          strokeOpacity="0.85"
        />
        {/* Triangle 2 (Pointing Down) */}
        <polygon
          points="150,255 235,105 65,105"
          fill="none"
          stroke="#C93B47"
          strokeWidth="1.5"
          strokeOpacity="0.85"
        />

        {/* Concentric Middle Ring */}
        <circle
          cx="150"
          cy="150"
          r="68"
          fill="none"
          stroke="#E6B86A"
          strokeWidth="1.2"
          strokeDasharray="8 4"
        />

        {/* Inner Diamond / Square */}
        <rect
          x="105"
          y="105"
          width="90"
          height="90"
          fill="none"
          stroke="#7A1C24"
          strokeWidth="1.2"
          transform="rotate(45 150 150)"
        />

        {/* Inner Mystic Core */}
        <circle
          cx="150"
          cy="150"
          r="32"
          fill="none"
          stroke="#E6B86A"
          strokeWidth="1.5"
        />
        <circle
          cx="150"
          cy="150"
          r="16"
          fill={isAnalyzing ? '#C93B47' : '#7A1C24'}
          fillOpacity={isAnalyzing ? '0.6' : '0.3'}
          stroke="#E6B86A"
          strokeWidth="1.5"
          filter="url(#alchemy-blur)"
        />

        {/* Center Occult Alchemical Point */}
        <circle cx="150" cy="150" r="4" fill="#E6B86A" />
      </motion.svg>
    </div>
  );
}
