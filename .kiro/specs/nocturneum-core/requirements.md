# Requirements Document

## Introduction

Nocturneum is a gothic-themed productivity application combining focus timers, ambient soundscapes, code debugging assistance, flashcard learning, and interactive documentation. The application targets developers participating in a hackathon, providing a complete working experience without external dependencies (no API keys, no external audio files). The visual aesthetic embraces dark gothic colors (obsidian, crimson, aged parchment, candle gold) with SVG-based animations and Web Audio API synthesis. The application must remain fully functional during judging with accelerated demo modes and pre-populated data.

## Glossary

- **Nocturneum**: The complete gothic productivity application system
- **Melting_Candle_Timer**: A visual focus timer component using layered SVG candle graphics
- **Soundscape_Engine**: A procedural audio synthesis system using Web Audio API
- **Bug_Exorcism_Altar**: A code debugging assistant with pattern matching and visual feedback
- **Grimoire_Flashcards**: A 3D flip-card learning system with markdown-based content
- **Alchemist_Blueprint_Modal**: An interactive documentation showcase for spec files and project configuration
- **Page_Visibility_API**: Browser API detecting when user switches tabs or windows
- **Judge_Mode**: A URL parameter-activated mode that accelerates timers and pre-populates demo data
- **Bestiary_Log**: A persistent record of encountered and resolved code errors
- **Alchemy_Circle**: An animated rotating SVG graphic used in the debugging interface
- **Demo_Seeder**: A system component that instantly populates the application with demonstration data

## Requirements

### Requirement 1: Melting Candle Focus Timer

**User Story:** As a developer, I want a visual focus timer with a melting candle animation, so that I can track my work sessions with an aesthetically pleasing countdown.

#### Acceptance Criteria

1. THE Melting_Candle_Timer SHALL render a layered SVG candle with visible flame, wax body, and dripping wax elements
2. WHEN a focus session starts, THE Melting_Candle_Timer SHALL animate the candle height decreasing proportionally to elapsed time
3. WHEN a focus session completes, THE Melting_Candle_Timer SHALL trigger a visual completion effect using the candle flame
4. WHERE Judge_Mode is active, THE Melting_Candle_Timer SHALL multiply timer speed by 60x
5. WHEN the Page_Visibility_API detects tab switch during an active session, THE Melting_Candle_Timer SHALL display a translucent ghost overlay warning
6. WHEN the user returns to the tab, THE Melting_Candle_Timer SHALL fade out the ghost overlay within 500ms
7. THE Melting_Candle_Timer SHALL persist session state to localStorage to survive page refreshes
8. THE Melting_Candle_Timer SHALL support configurable session durations between 1 minute and 120 minutes
9. FOR ALL timer durations, the candle height animation SHALL complete exactly when the timer reaches zero (invariant property)
10. THE Melting_Candle_Timer SHALL maintain WCAG AA contrast ratio of 4.5:1 minimum for all timer text against the background

### Requirement 2: Procedural Soundscape System

**User Story:** As a developer, I want procedurally generated ambient sounds without external audio files, so that I can focus with customizable background audio that works offline during judging.

#### Acceptance Criteria

1. THE Soundscape_Engine SHALL synthesize ambient rain sound using white noise filtering with Web Audio API
2. THE Soundscape_Engine SHALL synthesize clock tick sound using oscillator bursts with decay envelopes
3. THE Soundscape_Engine SHALL synthesize thunder crack sound using noise buffers with amplitude modulation
4. THE Soundscape_Engine SHALL synthesize card flip sound using pitched oscillators with rapid frequency sweeps
5. WHEN a user enables a sound effect, THE Soundscape_Engine SHALL start playback within 100ms
6. WHEN a user disables a sound effect, THE Soundscape_Engine SHALL fade out the sound over 200ms
7. THE Soundscape_Engine SHALL provide volume controls for each sound effect independently with range 0 to 100
8. THE Soundscape_Engine SHALL persist volume settings and enabled states to localStorage
9. THE Soundscape_Engine SHALL create all audio nodes without loading external MP3 or WAV files
10. FOR ALL sound effects, enabling then disabling then re-enabling SHALL restore the same audio characteristics (idempotence property)
11. THE Soundscape_Engine SHALL support simultaneous playback of all four sound effects without audio clipping

### Requirement 3: Bug Exorcism Altar

**User Story:** As a developer, I want an intelligent code error debugger with gothic theming and local pattern matching, so that I can get debugging help without requiring external API keys.

#### Acceptance Criteria

1. THE Bug_Exorcism_Altar SHALL provide a text input area accepting code snippets and error messages
2. WHEN a user submits an error, THE Bug_Exorcism_Altar SHALL display a rotating Alchemy_Circle animation during analysis
3. THE Bug_Exorcism_Altar SHALL match input against 15 predefined regex patterns covering common JavaScript errors
4. THE Bug_Exorcism_Altar SHALL match input against 15 predefined regex patterns covering common TypeScript errors
5. THE Bug_Exorcism_Altar SHALL match input against 15 predefined regex patterns covering common Python errors
6. WHEN an error pattern matches, THE Bug_Exorcism_Altar SHALL display a structured explanation with solution suggestions
7. IF no pattern matches, THEN THE Bug_Exorcism_Altar SHALL display a fallback message with general debugging guidance
8. THE Bug_Exorcism_Altar SHALL respond to Alt+E keyboard shortcut by focusing the error input area
9. THE Bug_Exorcism_Altar SHALL log all analyzed errors to the Bestiary_Log with timestamp and detected pattern
10. THE Bug_Exorcism_Altar SHALL persist the Bestiary_Log to IndexedDB for permanent storage across sessions
11. THE Bug_Exorcism_Altar SHALL display the most recent 50 Bestiary_Log entries in chronological order
12. WHEN a Bestiary_Log entry is selected, THE Bug_Exorcism_Altar SHALL display the original error and solution
13. FOR ALL valid error inputs, analyzing the same error twice SHALL produce identical pattern matches (deterministic property)
14. THE Bug_Exorcism_Altar SHALL complete pattern matching analysis within 200ms for inputs up to 10,000 characters
15. THE Bug_Exorcism_Altar SHALL maintain WCAG AA contrast ratio for all explanation text against the altar background

### Requirement 4: Grimoire Tarot Flashcards

**User Story:** As a developer, I want beautiful 3D flip-card flashcards with markdown support and demo data, so that I can learn concepts with an engaging gothic interface.

#### Acceptance Criteria

1. THE Grimoire_Flashcards SHALL render individual cards with 3D CSS flip animation using Framer Motion
2. WHEN a user clicks a flashcard, THE Grimoire_Flashcards SHALL rotate the card 180 degrees to reveal the back
3. THE Grimoire_Flashcards SHALL parse markdown content for both front and back card faces
4. THE Grimoire_Flashcards SHALL support bold, italic, code blocks, and bullet lists in markdown rendering
5. THE Grimoire_Flashcards SHALL store flashcard decks in localStorage using JSON format
6. THE Grimoire_Flashcards SHALL allow users to create new flashcard decks with custom names
7. THE Grimoire_Flashcards SHALL allow users to add individual cards to a deck with front and back markdown
8. THE Grimoire_Flashcards SHALL allow users to delete flashcard decks and individual cards
9. THE Grimoire_Flashcards SHALL provide navigation controls to move between cards in sequence
10. WHEN Demo_Seeder activates, THE Grimoire_Flashcards SHALL populate three example decks with 15 total cards
11. THE Grimoire_Flashcards SHALL display card position indicator showing current card and total count
12. FOR ALL flashcards, flipping front-to-back then back-to-front SHALL return to the original front face (round-trip property)
13. THE Grimoire_Flashcards SHALL complete flip animation within 600ms
14. THE Grimoire_Flashcards SHALL maintain WCAG AA contrast ratio for markdown text on both card faces
15. THE Grimoire_Flashcards SHALL support keyboard navigation using left and right arrow keys

### Requirement 5: Alchemist's Blueprint Modal

**User Story:** As a hackathon judge, I want an interactive documentation viewer showing the project's specs and configuration, so that I can understand the project architecture and workflow practices.

#### Acceptance Criteria

1. THE Alchemist_Blueprint_Modal SHALL display when activated by a dedicated UI button labeled "Blueprint"
2. THE Alchemist_Blueprint_Modal SHALL render all markdown files from the .kiro/specs directory
3. THE Alchemist_Blueprint_Modal SHALL render all markdown files from the .kiro/steering directory
4. THE Alchemist_Blueprint_Modal SHALL render all JSON hook files from the .kiro/hooks directory
5. THE Alchemist_Blueprint_Modal SHALL provide a navigation menu listing all discovered specification documents
6. WHEN a user selects a document from the navigation menu, THE Alchemist_Blueprint_Modal SHALL display the full rendered content
7. THE Alchemist_Blueprint_Modal SHALL parse and syntax-highlight code blocks within markdown documents
8. THE Alchemist_Blueprint_Modal SHALL render markdown tables with proper formatting and borders
9. THE Alchemist_Blueprint_Modal SHALL support dismissal via Escape key or close button
10. THE Alchemist_Blueprint_Modal SHALL apply the gothic visual theme with aged parchment background
11. THE Alchemist_Blueprint_Modal SHALL overlay a full-screen SVG feTurbulence texture for parchment effect
12. THE Alchemist_Blueprint_Modal SHALL maintain readable scroll behavior for documents exceeding viewport height
13. IF no .kiro directory exists, THEN THE Alchemist_Blueprint_Modal SHALL display a fallback message explaining the feature
14. THE Alchemist_Blueprint_Modal SHALL load and parse all specification files within 500ms
15. THE Alchemist_Blueprint_Modal SHALL maintain WCAG AA contrast ratio for all document text

### Requirement 6: Global Visual Theme

**User Story:** As a user, I want a cohesive gothic visual aesthetic across all interface elements, so that the application delivers an immersive thematic experience.

#### Acceptance Criteria

1. THE Nocturneum SHALL use Deep Obsidian (#0B0A0E) as the primary background color
2. THE Nocturneum SHALL use Aged Parchment Dark (#16131D) for secondary surface backgrounds
3. THE Nocturneum SHALL use Altar Crimson (#7A1C24) for accent elements and interactive highlights
4. THE Nocturneum SHALL use Candle Gold (#E6B86A) for primary text and emphasized content
5. THE Nocturneum SHALL use Spectral Mist (#94A3B8) for secondary text and subtle UI elements
6. THE Nocturneum SHALL load Cinzel or Playfair Display serif font for all heading elements
7. THE Nocturneum SHALL load JetBrains Mono monospace font for code blocks and error traces
8. THE Nocturneum SHALL apply a full-screen SVG feTurbulence overlay with pointer-events-none for parchment texture
9. THE Nocturneum SHALL maintain WCAG AA contrast ratio of 4.5:1 minimum for all body text
10. THE Nocturneum SHALL maintain WCAG AA contrast ratio of 4.5:1 minimum for all interactive elements
11. THE Nocturneum SHALL use Framer Motion for all animated transitions between component states
12. FOR ALL color combinations in the interface, contrast ratio SHALL meet or exceed 4.5:1 (accessibility invariant)

### Requirement 7: Judge Mode Integration

**User Story:** As a hackathon judge, I want a special demonstration mode activated by URL parameter, so that I can quickly evaluate the application with accelerated timers and pre-populated content.

#### Acceptance Criteria

1. WHEN the URL contains query parameter ?mode=judge, THE Nocturneum SHALL activate Judge_Mode
2. WHILE Judge_Mode is active, THE Nocturneum SHALL display a visual indicator in the interface header
3. WHEN Judge_Mode activates, THE Demo_Seeder SHALL automatically populate flashcard decks with example content
4. WHEN Judge_Mode activates, THE Demo_Seeder SHALL populate the Bestiary_Log with 10 example error entries
5. WHEN Judge_Mode activates, THE Demo_Seeder SHALL configure the Melting_Candle_Timer with a 2-minute demonstration session
6. WHILE Judge_Mode is active, THE Melting_Candle_Timer SHALL run 60 times faster than normal speed
7. THE Demo_Seeder SHALL complete all data population within 1000ms of Judge_Mode activation
8. FOR ALL demo data seeded, the data format SHALL match the format of user-created content (consistency property)
9. WHEN Judge_Mode deactivates by removing the URL parameter, THE Nocturneum SHALL preserve any demo data already created

### Requirement 8: Persistent Storage Architecture

**User Story:** As a user, I want my data to persist across browser sessions without external databases, so that I can close and reopen the application without losing my work.

#### Acceptance Criteria

1. THE Nocturneum SHALL use localStorage for storing timer preferences and soundscape settings
2. THE Nocturneum SHALL use localStorage for storing flashcard deck data in JSON format
3. THE Nocturneum SHALL use IndexedDB for storing the Bestiary_Log with full search capability
4. WHEN data is saved to localStorage, THE Nocturneum SHALL serialize JavaScript objects to JSON format
5. WHEN data is loaded from localStorage, THE Nocturneum SHALL parse JSON strings back to JavaScript objects
6. IF localStorage data is corrupted, THEN THE Nocturneum SHALL clear corrupted data and reinitialize with defaults
7. IF IndexedDB is unavailable, THEN THE Nocturneum SHALL fall back to localStorage for Bestiary_Log storage
8. THE Nocturneum SHALL handle localStorage quota exceeded errors by displaying a user warning
9. FOR ALL user data, saving then loading SHALL restore equivalent application state (round-trip property)
10. THE Nocturneum SHALL validate all loaded data against expected schemas before applying to application state

### Requirement 9: Responsive Layout

**User Story:** As a user, I want the application to work on different screen sizes, so that I can use it on desktop monitors, laptops, and tablets.

#### Acceptance Criteria

1. THE Nocturneum SHALL support viewport widths from 768px to 3840px
2. WHEN viewport width is below 1024px, THE Nocturneum SHALL stack components vertically
3. WHEN viewport width is 1024px or above, THE Nocturneum SHALL arrange components in a multi-column grid
4. THE Melting_Candle_Timer SHALL scale proportionally to maintain aspect ratio at all viewport sizes
5. THE Grimoire_Flashcards SHALL adjust card dimensions to fit within viewport constraints
6. THE Alchemist_Blueprint_Modal SHALL occupy 90% of viewport width on screens below 1024px
7. THE Alchemist_Blueprint_Modal SHALL occupy 70% of viewport width on screens 1024px and above
8. THE Nocturneum SHALL use CSS media queries for all responsive breakpoint definitions
9. FOR ALL viewport sizes within supported range, all interactive elements SHALL remain accessible (usability invariant)
10. THE Nocturneum SHALL maintain WCAG AA touch target size of 44x44 pixels minimum for interactive elements

### Requirement 10: Performance Requirements

**User Story:** As a user, I want the application to load and respond quickly, so that I can start working without delays.

#### Acceptance Criteria

1. THE Nocturneum SHALL complete initial page load and render within 2000ms on standard broadband connections
2. THE Nocturneum SHALL respond to user interactions within 100ms for UI feedback
3. THE Soundscape_Engine SHALL start audio playback within 100ms of user activation
4. THE Bug_Exorcism_Altar SHALL complete pattern matching within 200ms for typical error inputs
5. THE Grimoire_Flashcards SHALL complete flip animation within 600ms
6. THE Alchemist_Blueprint_Modal SHALL load and parse documentation files within 500ms
7. THE Nocturneum SHALL maintain 60 frames per second for all SVG animations when idle
8. THE Nocturneum SHALL maintain 30 frames per second minimum for all animations during heavy interaction
9. WHEN multiple timers and animations run simultaneously, THE Nocturneum SHALL prevent memory leaks by cleaning up unused resources
10. THE Nocturneum SHALL limit total bundle size to 500KB before compression for optimal load performance
