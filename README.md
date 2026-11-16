# 🕯️ Nocturneum: The Gothic Alchemist's Study & Bug Exorcist

> **Kiroween 2026 Hackathon & Costume Contest Entry**  
> *"Where ancient occult alchemy meets modern developer productivity and defect exorcism."*

[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue.svg)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-16_App_Router-black.svg)](https://nextjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4_Gothic_Palette-7A1C24.svg)](https://tailwindcss.com/)
[![Web Audio API](https://img.shields.io/badge/Web_Audio-Procedural_Synthesis-E6B86A.svg)](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API)
[![Property-Based Testing](https://img.shields.io/badge/Fast--Check-15_PBT_Properties-success.svg)](https://github.com/dubzzz/fast-check)
[![WCAG AA](https://img.shields.io/badge/Accessibility-WCAG_AA_Compliant-94A3B8.svg)](https://www.w3.org/WAI/WCAG21/AA/)

---

## 🌒 Project Vision & Atmosphere

**Nocturneum** transforms the developer's workstation into a Victorian Gothic Alchemist's Study. Clad in the vestments of an alchemist-sorcerer, the developer commands ancient rituals to conquer cognitive fatigue and banish software defects into the Bestiary.

Every pixel, soundwave, and interaction adheres strictly to the **Gothic Alchemist** design system:
- **Obsidian (`#0B0A0E`)**: The void of the uncompiled abyss.
- **Aged Parchment Dark (`#16131D`)**: Leather-bound grimoires and antique workstations.
- **Altar Crimson (`#7A1C24`)**: Mystical transmutation seals and defect warnings.
- **Candle Gold (`#E6B86A`)**: Flickering candlelight, brass instruments, and focus indicators.
- **Spectral Mist (`#94A3B8`)**: Subtle arcane glow and high-contrast text.
- **Global Parchment Texture**: Continuous full-screen SVG `feTurbulence` parchment overlay.
- **Zero External Audio Assets**: 100% procedural sound synthesis using the native Web Audio API.

---

## ⚡ Judge Quickstart Guide

Nocturneum is engineered with zero external cloud dependencies and deterministic offline evaluation for the Kiroween 2026 hackathon judges.

### 1. Launch the Sanctuary
```bash
# Install dependencies
npm install

# Start local development server
npm run dev
```

### 2. Enter Judge Mode (`?mode=judge`)
Navigate in any modern browser to:
```
http://localhost:3000/?mode=judge
```
*When Judge Mode is engaged:*
1. **60× Time Acceleration**: The Melting Candle Timer accelerates so that **1 minute elapsed occurs in 1 second**. A full 25-minute Pomodoro cycle melts down in 25 seconds for rapid visual verification.
2. **One-Click Demo Seeder**: Automatically injects three comprehensive Grimoire Flashcard decks (*JavaScript Fundamentals*, *TypeScript Type Sorcery*, *Gothic Architectural Patterns*) and pre-populates recent Bug Exorcism Bestiary entries within 1000ms.
3. **Judge Mode Aura**: An alchemical badge illuminates in the header indicating active acceleration and seeder status.

### 3. Master Alchemist Keyboard Shortcuts
| Shortcut | Action | Module |
| :--- | :--- | :--- |
| <kbd>Alt</kbd> + <kbd>E</kbd> | Focus Bug Exorcism Altar incantation input | Bug Exorcism Altar |
| <kbd>Space</kbd> | Flip Tarot Card (600ms 3D `rotateY` reveal) | Grimoire Flashcards |
| <kbd>→</kbd> / <kbd>←</kbd> | Circular modulo card navigation (`(i ± 1) % N`) | Grimoire Flashcards |
| <kbd>Escape</kbd> | Close Blueprint Modal or dismiss overlays | Alchemist's Blueprint |

---

## 🏛️ Core Architecture & 5 Modules

```
                        ┌───────────────────────────────────────────────┐
                        │             Nocturneum Dashboard              │
                        │        (Next.js App Router / Tailwind)        │
                        └───────┬───────────────────────────────┬───────┘
                                │                               │
        ┌───────────────────────┼───────────────────────────────┼───────────────────────┐
        ▼                       ▼                               ▼                       ▼
┌──────────────────┐    ┌──────────────────┐    ┌──────────────────────────┐    ┌──────────────────┐
│ Melting Candle   │    │ Pure Web Audio   │    │ Bug Exorcism Altar       │    │ Grimoire Tarot   │
│ Timer (Crucible) │    │ Soundscape       │    │ (45 Patterns + Bestiary) │    │ 3D Flashcards    │
└────────┬─────────┘    └────────┬─────────┘    └────────────┬─────────────┘    └────────┬─────────┘
         │                       │                           │                           │
         │ scaleY Melt           │ Procedural Rain/Thunder   │ IndexedDB / localStorage  │ 600ms rotateY
         │ Drift-Compensated     │ Frequency sweeps / Ticks  │ 200ms Timeout Fallback    │ Modulo Navigation
         ▼                       ▼                           ▼                           ▼
┌──────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                   The Alchemist's Blueprint Modal                                 │
│             (.kiro/specs, .kiro/steering, .kiro/hooks, and 15 Fast-Check PBT Invariants)          │
└──────────────────────────────────────────────────────────────────────────────────────────────────┘
```

### 1. 🕯️ Crucible of Hours (Melting Candle Timer)
- **Layered SVG Wax Animation**: Multi-layered candle body with dripping wax drops, brass gothic candleholder, and dual-layer radiant flame flicker.
- **Physical Wax Consumption**: Continuous CSS `scaleY` transform directly coupled to the time invariant $\text{height} = \frac{\text{remaining}}{\text{duration}} \times 100$.
- **Alchemical Burst Filter**: When the flame burns down to zero, an SVG filter turbulence burst illuminates the chamber.
- **Drift Compensation**: Monotonic millisecond timestamps adjust for background browser thread throttling.

### 2. 🌧️ Alchemical Soundscape (Procedural Synthesizer)
- **Zero Audio Files**: Avoids static MP3/WAV bloat by procedurally synthesizing ambient soundwaves directly in the browser.
- **Rain Texture**: White noise buffer routed through a 1200Hz lowpass `BiquadFilterNode` and smoothed gain curve.
- **Clock Tick**: 800Hz sine wave oscillator bursts shaped with a 10ms attack and 50ms exponential decay.
- **Thunder Clap**: LFO amplitude-modulated noise with deep exponential rumble.
- **Card Flip**: Triangle wave oscillator sweeping from 400Hz down to 200Hz over 150ms.
- **Autoplay Compliance**: Suspended AudioContext dynamically awakens upon the first user interaction.

### 3. ⚡ Bug Exorcism Altar (Pattern Engine & Bestiary)
- **45 Occult Error Patterns**: Pre-compiled deterministic regular expressions (15 JavaScript, 15 TypeScript, 15 Python) diagnosing null dereferences, syntax anomalies, and type violations.
- **200ms Timeout Guarantee**: Analysis promises race against a 200ms timeout to prevent UI freezes on complex stack traces.
- **Sacred Transmutation Circle**: Framer Motion animated SVG alchemical seal (`AlchemyCircle`) with concentric rings, Solomon's triangles, and radiant crimson glow.
- **Dual-Strategy Bestiary**: IndexedDB persistence with automatic schema-validated fallback to `localStorage` when IndexedDB is blocked.

### 4. 🃏 Grimoire Flashcards (3D Tarot Study)
- **600ms 3D `rotateY` Transform**: Smooth cubic-bezier deceleration (`ease: [0.4, 0.0, 0.2, 1]`) mimicking heavy antique cardstock.
- **Dual-Sided Markdown**: Full support for bold, italic, lists, and syntax-highlighted code blocks on both front and back faces.
- **Circular Modulo Bounds**: Forward (`(i + 1) % N`) and backward (`(i - 1 + N) % N`) navigation guarantees the card index remains within $[0, N-1]$.

### 5. 📐 The Alchemist's Blueprint Modal
- **Full Spec Transparency**: In-app inspection modal displaying every document in `.kiro/specs`, `.kiro/steering`, and `.kiro/hooks`.
- **GFM Table & Syntax Highlighting**: Prism-powered code highlighting for Markdown and pretty-printed JSON configurations.
- **Full Keyboard Dismissal**: Dismissable via <kbd>Escape</kbd>, close button, or backdrop blur click.

---

## 🔮 Kiro Ecosystem Integration & Spec-Driven Development

Nocturneum was developed following rigorous Spec-Driven Development (SDD) orchestrated through the Kiro framework:

```
.kiro/
├── steering/
│   └── gothic-alchemist-rules.md   # Architectural laws: palette, fonts, pure Web Audio, WCAG AA
├── specs/
│   └── nocturneum-core/
│       ├── requirements.md         # 90+ EARS criteria spanning all 5 modules & judge mode
│       ├── design.md               # Mathematical state models, schemas, and 15 PBT properties
│       └── tasks.md                # 21 major tasks organized into dependency-ordered waves
└── hooks/
    └── pre-commit.json             # Verification gates enforcing type-check, lint, and PBT
```

### 15 Formal Property-Based Testing (PBT) Invariants
Tested with **`fast-check`** across 100+ random executions per property:

| Property | Invariant Formalism | Target File | Status |
| :--- | :--- | :--- | :---: |
| **Property 1** | $\text{height} = \frac{R}{D} \times 100$, and $R=0 \implies \text{height}=0$ | `timer-properties.test.ts` | ✅ Verified |
| **Property 2** | $\Delta t_{\text{effective}} = \Delta t \times 60 \text{ when judgeMode} = \text{true}$ | `timer-properties.test.ts` | ✅ Verified |
| **Property 3** | $\text{deserialize}(\text{serialize}(D)) \equiv D$ (Round-trip preservation) | `storage-properties.test.ts` | ✅ Verified |
| **Property 4** | $G = \frac{V}{100} \text{ for all } V \in [0, 100]$ | `soundscape-properties.test.ts` | ✅ Verified |
| **Property 5** | $\text{enable} \rightarrow \text{disable} \rightarrow \text{enable}$ restores identical node graph | `soundscape-properties.test.ts` | ✅ Verified |
| **Property 6** | $\forall E: \text{analyze}(E)_1 \equiv \text{analyze}(E)_2$ (Determinism) | `altar-properties.test.ts` | ✅ Verified |
| **Property 7** | Bestiary log entries conform strictly to required field schemas | `altar-properties.test.ts` | ✅ Verified |
| **Property 8** | $\text{getEntries}(50) \implies \min(N, 50) \text{ sorted by } t_i \ge t_{i+1}$ | `altar-properties.test.ts` | ✅ Verified |
| **Property 9** | Markdown tokens consistently map to valid semantic HTML elements | `flashcards-properties.test.ts` | ✅ Verified |
| **Property 10** | Card index $I \in [0, N-1]$ across all forward/backward modulo navigations | `flashcards-properties.test.ts` | ✅ Verified |
| **Property 11** | Two consecutive card flips return card to initial state: $f(f(S)) = S$ | `flashcards-properties.test.ts` | ✅ Verified |
| **Property 12** | Syntax highlighting preserves the raw text content without alteration | `blueprint-properties.test.ts` | ✅ Verified |
| **Property 13** | Text/background contrast ratio $\ge 4.5:1$ (WCAG AA) | Accessibility Suite | ✅ Verified |
| **Property 14** | Demo data passes identical validation schemas as user data | `judge-mode-properties.test.ts`| ✅ Verified |
| **Property 15** | Validator correctly accepts valid and rejects corrupted payloads | `storage-properties.test.ts` | ✅ Verified |

---

## 🧪 Testing & Verification

```bash
# Run all unit and property-based test suites
npm test

# Run strict TypeScript type verification
npx tsc --noEmit

# Run ESLint validation
npm run lint

# Generate production static export
npm run build
```

**Verification Status:**
- **23 Test Suites**: 100% passing (104 tests total).
- **TypeScript**: 0 errors with strict typing.
- **ESLint**: 0 errors, 0 warnings.
- **WCAG AA**: Fully compliant contrast ratios on all text and interactive elements.

---

## 📜 License & Acknowledgments

This project is released under the **MIT License**.  
Crafted with dark devotion for the **Kiroween 2026 Hackathon & Costume Contest** by **Arie Muhammad Syahrial**.
