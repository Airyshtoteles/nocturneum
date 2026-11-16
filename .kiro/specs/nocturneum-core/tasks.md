# Implementation Plan: Nocturneum Core

## Overview

This implementation plan breaks down the Nocturneum gothic productivity application into discrete coding tasks. The application consists of five core modules (Melting Candle Timer, Soundscape Engine, Bug Exorcism Altar, Grimoire Flashcards, Alchemist's Blueprint Modal) built with Next.js App Router, TypeScript, and Tailwind CSS. The implementation prioritizes establishing shared infrastructure first, then building each module incrementally with property-based tests for core logic and unit tests for UI components.

## Tasks

- [x] 1. Set up project infrastructure and shared components
  - [x] 1.1 Configure Tailwind CSS with gothic color palette
    - Extend `tailwind.config.js` with custom colors (obsidian, parchment, crimson, gold, mist)
    - Add custom font families (Cinzel, JetBrains Mono)
    - Configure dark mode and custom utility classes
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5, 6.6, 6.7_

  - [x] 1.2 Create global layout with gothic theme
    - Implement `src/app/layout.tsx` with theme provider and font loading
    - Add full-screen SVG feTurbulence parchment overlay component
    - Apply global gothic styling in `src/app/globals.css`
    - _Requirements: 6.8, 6.11_

  - [x] 1.3 Create shared TypeScript type definitions
    - Define types in `src/types/timer.ts`, `src/types/soundscape.ts`, `src/types/altar.ts`, `src/types/flashcards.ts`, `src/types/storage.ts`
    - Export all shared interfaces and enums
    - _Requirements: 8.4, 8.5_

  - [x] 1.4 Implement storage layer manager
    - Create `src/lib/storage/storage-manager.ts` with localStorage and IndexedDB abstractions
    - Implement JSON serialization/deserialization helpers
    - Add schema validator in `src/lib/storage/schema-validator.ts`
    - Handle quota exceeded and corrupted data errors
    - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5, 8.6, 8.7, 8.8_

  - [x] 1.5 Write property test for storage round-trip preservation
    - **Property 3: Storage Round-Trip Preservation**
    - **Validates: Requirements 1.7, 2.8, 3.10, 4.5, 8.4, 8.5, 8.9**
    - Set up fast-check library and create custom arbitraries for timer state, soundscape settings, flashcard decks, bestiary entries
    - Test that serialize → deserialize produces equivalent data structure

  - [x] 1.6 Create judge mode detector and demo seeder
    - Implement `src/lib/judge-mode/mode-detector.ts` to read URL parameter
    - Create `src/lib/judge-mode/demo-seeder.ts` with functions to populate demo flashcards and bestiary entries
    - Add judge mode indicator component for UI header
    - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5, 7.7, 7.9_

  - [x] 1.7 Write property test for demo data schema consistency
    - **Property 14: Demo Data Schema Consistency**
    - **Validates: Requirements 7.8**
    - Test that all demo data validates against same schemas as user-created content

  - [x] 1.8 Create custom hooks for shared functionality
    - Implement `src/hooks/useJudgeMode.ts` hook
    - Implement `src/hooks/useLocalStorage.ts` hook
    - Implement `src/hooks/useIndexedDB.ts` hook
    - Implement `src/hooks/usePageVisibility.ts` hook
    - _Requirements: 1.5, 7.1, 8.1, 8.3_

- [x] 2. Checkpoint - Verify infrastructure
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 3. Implement Melting Candle Timer module
  - [x] 3.1 Create timer logic and core calculations
    - Implement `src/lib/timer/timer-logic.ts` with drift compensation
    - Add functions for candle height calculation based on remaining time
    - Implement timer state persistence logic
    - Add judge mode 60x acceleration multiplier
    - _Requirements: 1.2, 1.4, 1.7, 1.8, 1.9_

  - [x] 3.2 Write property test for timer height calculation invariant
    - **Property 1: Timer Height Calculation Invariant**
    - **Validates: Requirements 1.2, 1.9**
    - Test that height = (remaining / duration) × 100 for all valid inputs

  - [x] 3.3 Write property test for judge mode time acceleration
    - **Property 2: Judge Mode Time Acceleration**
    - **Validates: Requirements 1.4, 7.6**
    - Test that time delta is multiplied by 60x in judge mode

  - [x] 3.4 Create CandleSVG component with layered graphics
    - Implement `src/components/timer/CandleSVG.tsx` with flame, wax body, dripping wax, holder
    - Add CSS scaleY transform tied to candle height percentage
    - Implement completion effect animation using SVG filters
    - _Requirements: 1.1, 1.3_

  - [x] 3.5 Implement CandleTimer main component
    - Create `src/components/timer/CandleTimer.tsx` with state management
    - Use setInterval with drift compensation for timer accuracy
    - Integrate with useLocalStorage hook for persistence
    - Connect judge mode hook for time acceleration
    - _Requirements: 1.2, 1.4, 1.7, 1.8_

  - [x] 3.6 Create TimerControls subcomponent
    - Implement `src/components/timer/TimerControls.tsx` with start/pause/reset buttons
    - Add duration selector dropdown (1-120 minutes)
    - Apply gothic button styling
    - _Requirements: 1.8_

  - [ ] 3.7 Implement GhostOverlay component
    - Create `src/components/timer/GhostOverlay.tsx` using Page Visibility API
    - Add fade-in animation when tab becomes hidden
    - Add fade-out animation (500ms) when tab becomes visible
    - _Requirements: 1.5, 1.6_

  - [ ]* 3.8 Write unit tests for timer components
    - Test timer controls trigger correct state updates
    - Test ghost overlay appears/disappears on visibility changes
    - Test completion effect triggers at zero
    - _Requirements: 1.1, 1.3, 1.5, 1.6_

- [x] 4. Checkpoint - Verify timer module
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 5. Implement Soundscape Engine module
  - [x] 5.1 Create audio synthesis engine
    - Implement `src/lib/soundscape/audio-synthesis.ts` with Web Audio API
    - Generate white noise buffer for rain effect
    - Create synthesis functions for rain (noise + lowpass filter), tick (oscillator burst), thunder (noise + AM), flip (frequency sweep)
    - Add volume-to-gain conversion functions
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.9_

  - [x] 5.2 Write property test for volume-to-gain mapping
    - **Property 4: Volume-to-Gain Mapping**
    - **Validates: Requirements 2.7**
    - Test that gain = volume / 100 for all volume values in [0, 100]

  - [x] 5.3 Write property test for sound effect idempotence
    - **Property 5: Sound Effect Idempotence**
    - **Validates: Requirements 2.10**
    - Test that enable → disable → enable restores identical audio characteristics

  - [x] 5.4 Implement SoundscapeEngine main component
    - Create `src/components/soundscape/SoundscapeEngine.tsx` with AudioContext management
    - Initialize audio context on user interaction
    - Manage audio node lifecycle (connect/disconnect from destination)
    - Implement cleanup on component unmount
    - _Requirements: 2.5, 2.6, 2.11_

  - [ ] 5.5 Create EffectToggle and VolumeSlider subcomponents
    - Implement `src/components/soundscape/EffectToggle.tsx` for enable/disable controls
    - Implement `src/components/soundscape/VolumeSlider.tsx` with exponential gain ramping
    - Persist settings to localStorage using custom hook
    - _Requirements: 2.5, 2.6, 2.7, 2.8_

  - [ ]* 5.6 Write unit tests for soundscape components
    - Test audio context creation on user interaction
    - Test volume controls update gain nodes
    - Test effect toggling connects/disconnects nodes
    - Test localStorage persistence
    - _Requirements: 2.5, 2.6, 2.7, 2.8_

- [ ] 6. Checkpoint - Verify soundscape module
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 7. Implement Bug Exorcism Altar module
  - [x] 7.1 Create error pattern database
    - Create `src/lib/altar/error-patterns.json` with 45 regex patterns
    - Include 15 JavaScript patterns (undefined property, not a function, syntax errors, etc.)
    - Include 15 TypeScript patterns (property does not exist, type mismatch, etc.)
    - Include 15 Python patterns (NameError, TypeError, IndentationError, etc.)
    - Add explanations and solution arrays for each pattern
    - _Requirements: 3.3, 3.4, 3.5_

  - [x] 7.2 Implement pattern matching engine
    - Create `src/lib/altar/pattern-matcher.ts` with sequential regex testing
    - Load patterns from JSON file at build time
    - Implement 200ms timeout wrapper for analysis
    - Return matched pattern with explanation or fallback message
    - _Requirements: 3.6, 3.7, 3.14_

  - [x] 7.3 Write property test for pattern matching determinism
    - **Property 6: Pattern Matching Determinism**
    - **Validates: Requirements 3.3, 3.4, 3.5, 3.13**
    - Test that analyzing same error multiple times produces identical results

  - [x] 7.4 Set up IndexedDB bestiary log storage
    - Create IndexedDB database with 'bestiary' object store
    - Add indexes for timestamp and matchedLanguage fields
    - Implement CRUD operations using idb-keyval wrapper
    - Add fallback to localStorage if IndexedDB unavailable
    - _Requirements: 3.10, 8.3, 8.7_

  - [x] 7.5 Write property test for bestiary log entry structure
    - **Property 7: Bestiary Log Entry Structure**
    - **Validates: Requirements 3.9**
    - Test that all entries contain required fields with correct types

  - [x] 7.6 Write property test for bestiary log sorting and limiting
    - **Property 8: Bestiary Log Sorting and Limiting**
    - **Validates: Requirements 3.11**
    - Test that retrieving N entries returns min(N, 50) sorted by timestamp descending

  - [x] 7.7 Create AlchemyCircle animation component
    - Implement `src/components/altar/AlchemyCircle.tsx` with rotating SVG graphic
    - Use Framer Motion for continuous rotation during analysis
    - _Requirements: 3.2_

  - [ ] 7.8 Implement BugExorcismAltar main component
    - Create `src/components/altar/BugExorcismAltar.tsx` with error input textarea
    - Integrate pattern matcher and display results
    - Show AlchemyCircle during analysis
    - Add Alt+E keyboard shortcut listener
    - _Requirements: 3.1, 3.2, 3.8_

  - [ ] 7.9 Create PatternResult and BestiaryLog subcomponents
    - Implement `src/components/altar/PatternResult.tsx` to display matched pattern explanation
    - Implement `src/components/altar/BestiaryLog.tsx` to display recent 50 entries
    - Add entry selection and detail display
    - _Requirements: 3.6, 3.7, 3.11, 3.12_

  - [ ]* 7.10 Write unit tests for altar components
    - Test error submission triggers pattern analysis
    - Test Alt+E focuses input area
    - Test bestiary log persists entries to IndexedDB
    - Test pattern result displays correctly
    - _Requirements: 3.1, 3.2, 3.6, 3.7, 3.8, 3.9, 3.10_

- [ ] 8. Checkpoint - Verify altar module
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 9. Implement Grimoire Flashcards module
  - [x] 9.1 Create markdown parser
    - Implement `src/lib/flashcards/markdown-parser.ts` using marked library
    - Configure parser to support bold, italic, code blocks, bullet lists
    - Add memoization to avoid re-parsing
    - _Requirements: 4.3, 4.4_

  - [x] 9.2 Write property test for markdown parsing consistency
    - **Property 9: Markdown Parsing Consistency**
    - **Validates: Requirements 4.3, 4.4**
    - Test that parsing produces consistent HTML structure for markdown syntax

  - [x] 9.3 Create Card3D flip animation component
    - Implement `src/components/flashcards/Card3D.tsx` with Framer Motion rotateY transform
    - Configure flip animation with 600ms duration and cubic-bezier easing
    - Render markdown content on both front and back faces
    - _Requirements: 4.1, 4.2, 4.13_

  - [x] 9.4 Write property test for card flip round-trip
    - **Property 11: Card Flip Round-Trip**
    - **Validates: Requirements 4.12**
    - Test that two consecutive flips return to original state

  - [x] 9.5 Implement flashcard navigation logic
    - Create navigation functions with modulo arithmetic for circular navigation
    - Add keyboard event listeners for arrow left/right and spacebar
    - Implement card position tracking
    - _Requirements: 4.9, 4.15_

  - [x] 9.6 Write property test for card navigation bounds
    - **Property 10: Card Navigation Bounds**
    - **Validates: Requirements 4.9**
    - Test that navigation always keeps index in valid range [0, N-1]

  - [ ] 9.7 Create GrimoireFlashcards main component
    - Implement `src/components/flashcards/GrimoireFlashcards.tsx` with deck state management
    - Load/save decks from localStorage
    - Handle card flip state and navigation state
    - Integrate judge mode demo seeder
    - _Requirements: 4.5, 4.10, 7.3_

  - [ ] 9.8 Create DeckSelector and CardNavigator subcomponents
    - Implement `src/components/flashcards/DeckSelector.tsx` with dropdown menu
    - Implement `src/components/flashcards/CardNavigator.tsx` with prev/next buttons
    - Add card position indicator (e.g., "3 / 10")
    - _Requirements: 4.9, 4.11_

  - [ ] 9.9 Implement deck and card editor
    - Create CRUD interface for creating/deleting decks
    - Add form for creating/editing individual cards with markdown preview
    - Validate card content before saving
    - _Requirements: 4.6, 4.7, 4.8_

  - [ ]* 9.10 Write unit tests for flashcard components
    - Test deck creation and deletion
    - Test card navigation with keyboard
    - Test flip animation triggers
    - Test localStorage persistence
    - Test demo data seeding in judge mode
    - _Requirements: 4.5, 4.6, 4.7, 4.8, 4.9, 4.10, 4.15_

- [ ] 10. Checkpoint - Verify flashcards module
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 11. Implement Alchemist's Blueprint Modal module
  - [x] 11.1 Create file discovery system
    - Implement Next.js API route or build-time script to list .kiro directory files
    - Scan .kiro/specs, .kiro/steering, .kiro/hooks directories
    - Generate static JSON manifest of all spec documents
    - _Requirements: 5.2, 5.3, 5.4_

  - [x] 11.2 Create DocumentRenderer component
    - Implement `src/components/blueprint/DocumentRenderer.tsx` using react-markdown
    - Integrate react-syntax-highlighter for code blocks
    - Add JSON pretty-printing with syntax highlighting
    - Render markdown tables with proper formatting
    - _Requirements: 5.6, 5.7, 5.8_

  - [x] 11.3 Write property test for code syntax highlighting preservation
    - **Property 12: Code Syntax Highlighting Preservation**
    - **Validates: Requirements 5.7**
    - Test that highlighting adds markup without altering code text content

  - [x] 11.4 Implement AlchemistBlueprintModal main component
    - Create `src/components/blueprint/AlchemistBlueprintModal.tsx` with modal overlay
    - Use Framer Motion for modal entrance/exit animations
    - Add backdrop blur effect
    - Implement Escape key and close button handlers
    - _Requirements: 5.1, 5.9, 5.10_

  - [ ] 11.5 Create NavigationMenu subcomponent
    - Implement `src/components/blueprint/NavigationMenu.tsx` with categorized document list
    - Group documents by category (specs, steering, hooks)
    - Highlight selected document
    - _Requirements: 5.5, 5.6_

  - [ ] 11.6 Add parchment overlay and gothic styling
    - Apply SVG feTurbulence texture overlay to modal background
    - Style with aged parchment colors and gothic borders
    - Ensure scrollable content for long documents
    - _Requirements: 5.10, 5.11, 5.12, 5.15_

  - [ ] 11.7 Implement fallback handling
    - Detect if .kiro directory exists
    - Show instructional message if no spec files found
    - _Requirements: 5.13_

  - [ ]* 11.8 Write unit tests for blueprint modal
    - Test modal opens/closes correctly
    - Test document selection updates displayed content
    - Test Escape key dismisses modal
    - Test fallback message when no specs exist
    - _Requirements: 5.1, 5.5, 5.6, 5.9, 5.13_

- [ ] 12. Checkpoint - Verify blueprint modal
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 13. Implement responsive layout and main dashboard
  - [ ] 13.1 Create main dashboard page
    - Implement `src/app/page.tsx` with grid layout for all five modules
    - Add judge mode indicator at top
    - Include Blueprint button to open modal
    - Apply responsive breakpoints for mobile/tablet/desktop
    - _Requirements: 9.1, 9.2, 9.3_

  - [ ] 13.2 Configure responsive grid system
    - Use CSS Grid with media queries at 768px and 1024px breakpoints
    - Stack components vertically on narrow viewports
    - Arrange in multi-column layout on wide viewports
    - _Requirements: 9.2, 9.3_

  - [ ] 13.3 Apply responsive scaling to components
    - Scale CandleTimer proportionally across viewport sizes
    - Adjust Grimoire flashcard dimensions for different screens
    - Set Blueprint modal width to 90% on mobile, 70% on desktop
    - _Requirements: 9.4, 9.5, 9.6, 9.7_

  - [ ] 13.4 Ensure touch target accessibility
    - Verify all interactive elements meet 44x44px minimum size
    - Test keyboard navigation through all components
    - _Requirements: 9.9, 9.10_

  - [ ]* 13.5 Write property test for color contrast invariant
    - **Property 13: Color Contrast Invariant**
    - **Validates: Requirements 6.9, 6.10, 6.12**
    - Test that all color pairs meet WCAG AA 4.5:1 contrast ratio

  - [ ]* 13.6 Write integration tests for responsive behavior
    - Test component layout at various viewport sizes
    - Test all interactive elements remain accessible
    - _Requirements: 9.1, 9.2, 9.3, 9.9_

- [ ] 14. Checkpoint - Verify responsive layout
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 15. Implement comprehensive error handling
  - [ ] 15.1 Add localStorage error handling
    - Wrap all localStorage operations in try-catch blocks
    - Handle QuotaExceededError with user warning modal
    - Detect and clear corrupted JSON data
    - Log errors to console with data preview
    - _Requirements: 8.6, 8.8_

  - [ ]* 15.2 Write property test for data validation correctness
    - **Property 15: Data Validation Correctness**
    - **Validates: Requirements 8.10**
    - Test that validator correctly classifies valid/invalid data and identifies failing fields

  - [ ] 15.3 Add AudioContext error handling
    - Detect autoplay policy blocking (suspended state)
    - Display "Click to Enable Audio" button when blocked
    - Resume AudioContext on user interaction
    - Handle audio node creation failures gracefully
    - _Requirements: 2.5_

  - [ ] 15.4 Add pattern matching error handling
    - Wrap regex compilation in try-catch blocks
    - Implement 200ms timeout for pattern analysis
    - Return fallback message on timeout or error
    - _Requirements: 3.14_

  - [ ] 15.5 Add React error boundaries
    - Create error boundary component for Framer Motion animations
    - Render static fallback UI on animation errors
    - Add error boundary for SVG components
    - _Requirements: 1.1, 4.1_

  - [ ]* 15.6 Write unit tests for error handling
    - Test corrupted localStorage recovery
    - Test audio context autoplay blocked recovery
    - Test pattern matching timeout fallback
    - Test error boundary fallback rendering
    - _Requirements: 8.6, 8.8, 2.5, 3.14_

- [ ] 16. Checkpoint - Verify error handling
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 17. Performance optimization and bundle size reduction
  - [ ] 17.1 Optimize bundle size
    - Configure Next.js with static export mode
    - Enable tree-shaking for Framer Motion
    - Lazy load Blueprint modal component
    - Use dynamic imports for heavy components
    - _Requirements: 10.10_

  - [ ] 17.2 Optimize animations and rendering
    - Use requestAnimationFrame for smooth height transitions
    - Memoize parsed markdown to avoid re-parsing
    - Lazy render off-screen flashcards
    - Properly cleanup audio nodes on unmount to prevent memory leaks
    - _Requirements: 10.7, 10.9_

  - [ ] 17.3 Configure Next.js and Tailwind optimizations
    - Add SVG webpack loader for optimized SVG imports
    - Configure Tailwind CSS purging for unused styles
    - Set up proper caching headers
    - _Requirements: 10.1, 10.10_

  - [ ]* 17.4 Write performance tests
    - Test bundle size remains under 500KB
    - Test initial page load under 2000ms
    - Test UI response times under 100ms
    - Test animation frame rates (target 60fps)
    - _Requirements: 10.1, 10.2, 10.7, 10.10_

- [ ] 18. Checkpoint - Verify performance optimizations
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 19. Set up comprehensive test infrastructure
  - [x] 19.1 Configure Vitest for unit and property tests
    - Add vitest configuration file
    - Set up test coverage reporting (target 90% for core logic)
    - Configure test environment for DOM testing
    - _Requirements: All testing requirements_

  - [x] 19.2 Configure fast-check for property-based testing
    - Install and configure fast-check library
    - Set minimum 100 iterations per property test
    - Enable shrinking for minimal failing examples
    - Add seed-based reproducibility
    - _Requirements: All property test requirements_

  - [ ] 19.3 Set up Playwright for integration tests
    - Configure Playwright for end-to-end testing
    - Add test scenarios for complete timer session, soundscape playback, error analysis flow, flashcard CRUD, judge mode activation
    - _Requirements: 10.1, 10.2, 10.3, 10.4, 10.5, 10.6_

  - [ ] 19.4 Configure accessibility testing
    - Integrate axe-core with Vitest or Playwright
    - Add automated WCAG AA contrast checks
    - Test keyboard navigation completeness
    - Verify ARIA labels on interactive elements
    - _Requirements: 6.9, 6.10, 6.12, 9.9, 9.10_

  - [ ] 19.5 Add pre-commit test hooks
    - Configure Git hooks to run unit tests and linting before commit
    - Add CI pipeline configuration for full test suite
    - _Requirements: All testing requirements_

- [ ] 20. Final integration and polish
  - [ ] 20.1 Wire all modules together in main dashboard
    - Ensure all five modules render correctly on page
    - Verify judge mode activates across all modules simultaneously
    - Test data persistence across page refreshes
    - _Requirements: 1.1-10.10_

  - [ ] 20.2 Test judge mode end-to-end
    - Navigate to ?mode=judge URL
    - Verify demo data seeds within 1000ms
    - Verify timer runs at 60x speed
    - Verify all modules work with demo data
    - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5, 7.6, 7.7, 7.9_

  - [ ] 20.3 Perform cross-browser testing
    - Test in Chrome/Edge (Chromium)
    - Test in Firefox
    - Test in Safari (macOS/iOS)
    - _Requirements: 9.1-9.10_

  - [ ] 20.4 Conduct accessibility audit
    - Test with screen readers (NVDA/JAWS/VoiceOver)
    - Verify keyboard-only navigation
    - Test high contrast mode compatibility
    - Test zoom levels up to 200%
    - _Requirements: 6.9, 6.10, 6.12, 9.9, 9.10_

  - [ ] 20.5 Create production build and verify deployment
    - Run `npm run build` to create static export
    - Verify bundle size under 500KB
    - Test deployed version with judge mode URL
    - _Requirements: 10.10, 7.1_

- [ ] 21. Final checkpoint - Complete verification
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP delivery
- Each task references specific requirements for traceability
- Property-based tests validate universal correctness properties defined in the design
- Unit tests validate specific examples and edge cases
- Integration tests validate complete user workflows
- All property tests must include comments with format: `// Feature: nocturneum-core, Property N: [Property Title]`
- The implementation uses TypeScript, Next.js App Router, Tailwind CSS, Framer Motion, and Web Audio API
- Judge mode is activated via URL parameter `?mode=judge` for hackathon demonstration
- All modules must maintain WCAG AA contrast ratio (4.5:1) despite dark gothic aesthetic
- No external audio files or video assets - all effects use Web Audio API synthesis
- Storage uses dual strategy: localStorage for simple data, IndexedDB for queryable collections

## Task Dependency Graph

```json
{
  "waves": [
    { "id": 0, "tasks": ["1.1", "1.3"] },
    { "id": 1, "tasks": ["1.2", "1.4", "1.6", "1.8"] },
    { "id": 2, "tasks": ["1.5", "1.7", "3.1", "5.1", "7.1", "9.1", "11.1"] },
    { "id": 3, "tasks": ["3.2", "3.3", "3.4", "5.2", "5.3", "7.2", "7.4", "9.3", "9.5", "11.2"] },
    { "id": 4, "tasks": ["3.5", "3.6", "5.4", "7.3", "7.5", "7.6", "7.7", "9.2", "9.4", "9.6", "11.3", "11.4"] },
    { "id": 5, "tasks": ["3.7", "5.5", "7.8", "9.7", "11.5"] },
    { "id": 6, "tasks": ["3.8", "5.6", "7.9", "9.8", "11.6", "11.7"] },
    { "id": 7, "tasks": ["7.10", "9.9", "11.8"] },
    { "id": 8, "tasks": ["9.10", "13.1", "13.2"] },
    { "id": 9, "tasks": ["13.3", "13.4", "15.1", "15.3", "15.4", "15.5"] },
    { "id": 10, "tasks": ["13.5", "13.6", "15.2", "15.6", "17.1", "17.2", "17.3"] },
    { "id": 11, "tasks": ["17.4", "19.1", "19.2"] },
    { "id": 12, "tasks": ["19.3", "19.4", "19.5"] },
    { "id": 13, "tasks": ["20.1", "20.2"] },
    { "id": 14, "tasks": ["20.3", "20.4", "20.5"] }
  ]
}
```
