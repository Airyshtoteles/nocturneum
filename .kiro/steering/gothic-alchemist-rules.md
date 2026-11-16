# Nocturneum Steering Rules (Gothic Alchemist Theme & Architecture)

## Tech Stack Constraints
- Framework: Next.js (App Router) with TypeScript and Tailwind CSS.
- Animation: Framer Motion and pure SVG filters (avoid external heavy video/image assets).
- Audio: Pure Web Audio API synthesis only (no external MP3/WAV files).
- Storage: Local IndexedDB / localStorage with instant JSON seed support.

## Visual & Costume Contest Guidelines
- Background Palette: Deep Obsidian (#0B0A0E), Aged Parchment Dark (#16131D), Altar Crimson (#7A1C24), Candle Gold (#E6B86A), Spectral Mist (#94A3B8).
- Typography: Use serif fonts (Cinzel or Playfair Display) for headers and monospace (JetBrains Mono) for error stack traces and code.
- Global Texture: Apply a single full-screen SVG feTurbulence overlay with pointer-events-none to simulate antique parchment.
- Accessibility: Maintain WCAG AA contrast ratio (minimum 4.5:1) for all readable text despite the dark gothic aesthetic.

## Functional Safeguards
- Every AI-powered feature MUST have a deterministic local regex/mock fallback so the app works with zero API keys during judging.
- Support URL parameter ?mode=judge to accelerate timers by 60x and pre-populate demo data automatically.