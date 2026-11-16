'use client';

import React from 'react';
import { motion } from 'framer-motion';

export interface CandleSVGProps {
  candleHeight: number; // percentage 0 - 100
  isActive?: boolean;
  isCompleted?: boolean;
  className?: string;
}

/**
 * Layered SVG Candle component with melting animation and completion effect.
 * - Wax body scales vertically using CSS scaleY tied to candleHeight percentage.
 * - Layered dripping wax details and gothic brass holder.
 * - Dynamic flickering flame with SVG filters.
 * - Completion effect triggers an alchemical flame burst when candle burns down.
 * Validates Requirements 1.1, 1.3
 */
export default function CandleSVG({
  candleHeight,
  isActive = false,
  isCompleted = false,
  className = '',
}: CandleSVGProps) {
  const normalizedHeight = Math.min(100, Math.max(0, candleHeight));
  const scaleY = normalizedHeight / 100;
  const isExtinguished = normalizedHeight === 0 || isCompleted;

  // Candle geometry constants (viewBox 0 0 240 360)
  // Candle base stands on holder at y = 290. Full candle height = 180 (from y = 110 to 290).
  const candleBaseY = 290;
  const candleFullHeight = 170;
  // Current wax top y position:
  const currentWaxTopY = candleBaseY - candleFullHeight * scaleY;

  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      <svg
        viewBox="0 0 240 360"
        className="w-full h-auto max-h-[360px] drop-shadow-[0_4px_24px_rgba(0,0,0,0.8)]"
        xmlns="http://www.w3.org/2000/svg"
        aria-label={`Candle Timer display: ${Math.round(normalizedHeight)}% remaining`}
        role="img"
      >
        <defs>
          {/* Flame radiant glow filter */}
          <filter id="candle-flame-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="6" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Completion burst filter */}
          <filter id="completion-burst-filter" x="-100%" y="-100%" width="300%" height="300%">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.08"
              numOctaves="4"
              result="noise"
            />
            <feDisplacementMap
              in="SourceGraphic"
              in2="noise"
              scale="20"
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>

          {/* Candle wax gradient */}
          <linearGradient id="wax-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#C8B898" />
            <stop offset="35%" stopColor="#EADBCE" />
            <stop offset="70%" stopColor="#D9C9AC" />
            <stop offset="100%" stopColor="#A89474" />
          </linearGradient>

          {/* Dripping wax shadow gradient */}
          <linearGradient id="wax-drip-grad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#EADBCE" />
            <stop offset="100%" stopColor="#7A1C24" stopOpacity="0.85" />
          </linearGradient>

          {/* Flame outer gradient */}
          <radialGradient id="flame-outer-grad" cx="50%" cy="65%" r="65%">
            <stop offset="0%" stopColor="#FFF7D6" />
            <stop offset="30%" stopColor="#E6B86A" />
            <stop offset="70%" stopColor="#C95D22" />
            <stop offset="100%" stopColor="#7A1C24" stopOpacity="0.1" />
          </radialGradient>

          {/* Flame inner core gradient */}
          <radialGradient id="flame-inner-grad" cx="50%" cy="70%" r="50%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="50%" stopColor="#FFF2B2" />
            <stop offset="100%" stopColor="#E6B86A" stopOpacity="0.4" />
          </radialGradient>

          {/* Ornate holder bronze gradient */}
          <linearGradient id="holder-grad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#1B1622" />
            <stop offset="25%" stopColor="#4A3B32" />
            <stop offset="50%" stopColor="#8A6E4B" />
            <stop offset="75%" stopColor="#4A3B32" />
            <stop offset="100%" stopColor="#151219" />
          </linearGradient>
        </defs>

        {/* Ambient candle aura when burning */}
        {!isExtinguished && (
          <motion.circle
            cx="120"
            cy={currentWaxTopY - 25}
            r="70"
            fill="url(#flame-outer-grad)"
            opacity={isActive ? 0.22 : 0.12}
            animate={
              isActive
                ? {
                    scale: [1, 1.08, 0.95, 1.04, 1],
                    opacity: [0.18, 0.26, 0.19, 0.24, 0.18],
                  }
                : {}
            }
            transition={{
              repeat: Infinity,
              duration: 2.2,
              ease: 'easeInOut',
            }}
          />
        )}

        {/* =========================================================
            LAYER 1: Gothic Candelabrum Holder (Base & Cup)
            ========================================================= */}
        <g id="candelabrum-holder">
          {/* Base pedestal */}
          <ellipse cx="120" cy="330" rx="72" ry="16" fill="#0B0A0E" />
          <ellipse cx="120" cy="326" rx="68" ry="14" fill="url(#holder-grad)" stroke="#E6B86A" strokeOpacity="0.3" strokeWidth="1.5" />
          <path
            d="M 65 326 C 65 315, 80 305, 100 302 L 140 302 C 160 305, 175 315, 175 326 Z"
            fill="url(#holder-grad)"
          />

          {/* Stem & Gothic Arch Accents */}
          <rect x="112" y="295" width="16" height="12" rx="2" fill="url(#holder-grad)" stroke="#E6B86A" strokeOpacity="0.4" strokeWidth="1" />
          <ellipse cx="120" cy="295" rx="28" ry="7" fill="url(#holder-grad)" stroke="#E6B86A" strokeOpacity="0.5" strokeWidth="1.5" />

          {/* Wax catcher dish */}
          <path
            d="M 92 295 C 92 286, 148 286, 148 295 C 148 300, 92 300, 92 295 Z"
            fill="#16131D"
            stroke="#7A1C24"
            strokeWidth="1.5"
          />

          {/* Gothic filigree ribs on base */}
          <path d="M 85 326 Q 120 310 155 326" stroke="#E6B86A" strokeWidth="1" strokeOpacity="0.4" fill="none" />
          <circle cx="120" cy="316" r="3" fill="#E6B86A" opacity="0.6" />
        </g>

        {/* =========================================================
            LAYER 2: Wax Candle Body (with scaleY from bottom)
            ========================================================= */}
        <g id="wax-candle-body">
          {/* Clip path for the melting wax body so it scales from the bottom */}
          <g
            style={{
              transform: `scaleY(${scaleY})`,
              transformOrigin: `120px ${candleBaseY}px`,
              transition: 'transform 0.4s ease-out',
            }}
          >
            {/* Main cylindrical wax body (width 48, from y=120 to y=290) */}
            <rect
              x="96"
              y="120"
              width="48"
              height="170"
              rx="4"
              fill="url(#wax-gradient)"
              stroke="#7A1C24"
              strokeOpacity="0.3"
              strokeWidth="1"
            />

            {/* Subtle internal wax texture ribs */}
            <line x1="104" y1="122" x2="104" y2="288" stroke="#FFFFFF" strokeOpacity="0.18" strokeWidth="2" />
            <line x1="136" y1="122" x2="136" y2="288" stroke="#16131D" strokeOpacity="0.25" strokeWidth="3" />

            {/* Dripping wax ridges along candle sides */}
            <path
              d="M 96 150 C 93 162, 92 175, 96 185 C 95 195, 93 205, 96 215"
              fill="none"
              stroke="url(#wax-drip-grad)"
              strokeWidth="3.5"
              strokeLinecap="round"
            />
            <path
              d="M 144 140 C 147 155, 146 170, 144 180 C 147 195, 145 210, 144 225"
              fill="none"
              stroke="url(#wax-drip-grad)"
              strokeWidth="3"
              strokeLinecap="round"
            />
          </g>

          {/* Top concave wax pool at current wax top position */}
          {normalizedHeight > 0 && (
            <g style={{ transform: `translateY(${currentWaxTopY - 120}px)`, transition: 'transform 0.4s ease-out' }}>
              <ellipse
                cx="120"
                cy="120"
                rx="24"
                ry="7"
                fill="#C8B898"
                stroke="#A89474"
                strokeWidth="1.5"
              />
              <ellipse
                cx="120"
                cy="120"
                rx="20"
                ry="5"
                fill="#8E7756"
                opacity="0.6"
              />

              {/* Accumulated melted wax tear drop */}
              <circle cx="97" cy="126" r="3" fill="#EADBCE" />
              <path d="M 97 126 Q 96 138 98 142 Q 95 140 97 126" fill="#EADBCE" />
            </g>
          )}
        </g>

        {/* =========================================================
            LAYER 3: Wick & Flame
            ========================================================= */}
        {normalizedHeight > 0 && (
          <g
            id="candle-wick-and-flame"
            style={{
              transform: `translateY(${currentWaxTopY - 120}px)`,
              transition: 'transform 0.4s ease-out',
            }}
          >
            {/* The char wick */}
            <path
              d="M 120 120 Q 121 110 119 104"
              stroke="#2B2118"
              strokeWidth="2.5"
              strokeLinecap="round"
              fill="none"
            />
            {/* Wick ember tip */}
            <circle cx="119" cy="104" r="1.5" fill="#E6B86A" />

            {/* Flickering Flame */}
            {!isExtinguished && (
              <motion.g
                filter="url(#candle-flame-glow)"
                animate={
                  isActive
                    ? {
                        scaleX: [1, 0.9, 1.1, 0.95, 1],
                        scaleY: [1, 1.08, 0.94, 1.05, 1],
                        rotate: [0, -2, 2.5, -1, 0],
                      }
                    : {
                        scale: [1, 1.02, 0.98, 1],
                      }
                }
                transition={{
                  repeat: Infinity,
                  duration: isActive ? 0.9 : 2.5,
                  ease: 'easeInOut',
                }}
                style={{ transformOrigin: '120px 104px' }}
              >
                {/* Outer Flame Teardrop */}
                <path
                  d="M 120 106 C 111 106, 107 90, 116 75 C 118 70, 120 54, 120 54 C 120 54, 122 70, 124 75 C 133 90, 129 106, 120 106 Z"
                  fill="url(#flame-outer-grad)"
                />

                {/* Inner Bright Flame Core */}
                <path
                  d="M 120 104 C 114 104, 112 92, 118 82 C 119 78, 120 68, 120 68 C 120 68, 121 78, 122 82 C 128 92, 126 104, 120 104 Z"
                  fill="url(#flame-inner-grad)"
                />
              </motion.g>
            )}
          </g>
        )}

        {/* =========================================================
            LAYER 4: Completion Effect (Alchemical Flame Burst / Smoke)
            ========================================================= */}
        {isExtinguished && (
          <g id="completion-burst-effect" filter="url(#completion-burst-filter)">
            {/* Rising spectral smoke plume */}
            <motion.path
              d="M 120 285 Q 115 260 124 240 T 116 200 T 125 160"
              stroke="#94A3B8"
              strokeWidth="3.5"
              strokeLinecap="round"
              fill="none"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: [0, 0.8, 0.3, 0] }}
              transition={{ duration: 1.8, repeat: Infinity }}
            />

            {/* Alchemical golden spark ring */}
            <motion.circle
              cx="120"
              cy="288"
              r="18"
              fill="none"
              stroke="#E6B86A"
              strokeWidth="2"
              initial={{ scale: 0.2, opacity: 0 }}
              animate={{
                scale: [0.5, 1.8, 2.5],
                opacity: [1, 0.6, 0],
              }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'easeOut' }}
            />
          </g>
        )}
      </svg>
    </div>
  );
}
