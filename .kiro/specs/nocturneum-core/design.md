# Design Document: Nocturneum Core

## Overview

Nocturneum is a gothic-themed productivity application built with Next.js (App Router), TypeScript, and Tailwind CSS. The system consists of five core modules that operate independently while sharing a unified visual theme and storage layer. The application prioritizes offline functionality, zero external dependencies, and hackathon demonstration capabilities through accelerated timers and instant data seeding.

### Design Philosophy

- **Zero External Dependencies**: All audio synthesis uses Web Audio API, no MP3/WAV files
- **Deterministic Behavior**: Pattern matching and fallbacks ensure predictable operation without API keys
- **Gothic Aesthetic**: Dark color palette with SVG textures and serif typography
- **Accessibility First**: WCAG AA compliance (4.5:1 contrast) maintained throughout dark theme
- **Performance**: 60fps animations, sub-200ms responses, <500KB bundle size

### Key Design Decisions

1. **Client-Side Architecture**: Full client-side rendering with Next.js App Router eliminates backend requirements for judging
2. **Dual Storage Strategy**: localStorage for simple key-value pairs (settings, flashcards), IndexedDB for queryable collections (error log)
3. **Procedural Audio**: Web Audio API synthesis provides ambient soundscapes without external files
4. **SVG Animations**: Layered SVG graphics with CSS transforms deliver smooth animations without video assets
5. **Judge Mode**: URL parameter activates 60x time acceleration and instant demo data seeding

## Architecture

### System Structure

```
┌─────────────────────────────────────────────────────────┐
│                    Next.js App Router                    │
│                  (Client-Side Rendering)                 │
└─────────────────────────────────────────────────────────┘
                          │
          ┌───────────────┼───────────────┐
          │               │               │
    ┌─────▼─────┐   ┌────▼────┐   ┌─────▼─────┐
    │  Gothic    │   │  Judge  │   │  Storage  │
    │  Theme     │   │  Mode   │   │  Layer    │
    │  Provider  │   │ Detector│   │  Manager  │
    └─────┬─────┘   └────┬────┘   └─────┬─────┘
          │               │               │
          └───────────────┼───────────────┘
                          │
    ┌─────────────────────┴─────────────────────┐
    │                                             │
┌───▼────┐ ┌────▼───┐ ┌────▼────┐ ┌────▼───┐ ┌─▼───┐
│Melting │ │Sound-  │ │Bug      │ │Grimoire│ │Blue-│
│Candle  │ │scape   │ │Exorcism │ │Flash-  │ │print│
│Timer   │ │Engine  │ │Altar    │ │cards   │ │Modal│
└────────┘ └────────┘ └─────────┘ └────────┘ └─────┘
```

### Module Dependencies

- **Gothic Theme Provider**: Provides color palette, typography, and SVG texture overlay to all modules
- **Judge Mode Detector**: Reads URL parameter and signals accelerated timing and demo seeding
- **Storage Layer Manager**: Abstracts localStorage/IndexedDB operations with schema validation
- **Core Modules**: Five independent feature modules with minimal cross-dependencies

### Technology Stack

| Layer | Technology | Justification |
|-------|-----------|---------------|
| Framework | Next.js 15 App Router | Client-side rendering, file-based routing, TypeScript support |
| Language | TypeScript 5.x | Type safety, IntelliSense, compile-time validation |
| Styling | Tailwind CSS 3.x | Utility-first styling, dark mode support, purged CSS |
| Animation | Framer Motion 11.x | Declarative animations, 3D transforms, spring physics |
| Audio | Web Audio API | Native browser API, no external files, procedural synthesis |
| Storage | localStorage + IndexedDB | Synchronous simple storage + asynchronous queryable storage |
| Fonts | Google Fonts (Cinzel, JetBrains Mono) | Gothic serif headers, monospace code blocks |

## Components and Interfaces

### 1. Melting Candle Timer

#### Component Structure

```typescript
interface CandleTimerProps {
  initialDuration: number; // minutes
  judgeMode: boolean;
  onComplete: () => void;
}

interface CandleTimerState {
  remainingTime: number; // seconds
  isActive: boolean;
  isPaused: boolean;
  isTabVisible: boolean;
  candleHeight: number; // percentage 0-100
}
```

#### Sub-Components

- **CandleSVG**: Layered SVG with flame, wax body, dripping wax, and holder
- **TimerControls**: Start, pause, reset buttons with gothic styling
- **DurationSelector**: Configurable session length (1-120 minutes)
- **GhostOverlay**: Translucent warning when user switches tabs
- **CompletionEffect**: Flame burst animation using SVG filters

#### Implementation Approach

1. **Timer Logic**: Use `setInterval` with drift compensation for accuracy
2. **Judge Mode Acceleration**: Multiply time delta by 60x when judge mode active
3. **Tab Visibility**: Page Visibility API listener toggles ghost overlay
4. **Candle Animation**: CSS `scaleY` transform tied to `remainingTime / totalTime`
5. **Persistence**: Save state to localStorage on every tick, restore on mount
6. **Performance**: Use `requestAnimationFrame` for smooth height transitions

#### Storage Schema

```typescript
interface StoredTimerState {
  duration: number; // user's preferred session length
  lastActiveSession: {
    startTime: number; // timestamp
    duration: number;
    elapsed: number;
  } | null;
}
```

### 2. Soundscape Engine

#### Component Structure

```typescript
interface SoundscapeEngineProps {
  judgeMode: boolean;
}

interface SoundEffect {
  id: 'rain' | 'tick' | 'thunder' | 'flip';
  enabled: boolean;
  volume: number; // 0-100
  audioNodes: {
    source: AudioNode;
    gain: GainNode;
    filter?: BiquadFilterNode;
  };
}

interface SoundscapeState {
  audioContext: AudioContext;
  effects: Map<string, SoundEffect>;
}
```

#### Audio Synthesis Strategies

Based on research from procedural audio generation patterns ([dev.to article](https://dev.to/hexshift/how-to-generate-procedural-audio-textures-in-the-browser-no-samples-needed-332l)), each sound uses specific Web Audio nodes:

1. **Rain**: White noise buffer → BiquadFilter (lowpass ~1200Hz) → GainNode
2. **Clock Tick**: OscillatorNode (sine 800Hz) → short envelope (10ms attack, 50ms decay) → GainNode
3. **Thunder**: Noise buffer → amplitude modulation (LFO) → exponential decay envelope → GainNode
4. **Card Flip**: OscillatorNode (triangle) → frequency sweep (400Hz → 200Hz over 150ms) → GainNode

#### Implementation Approach

1. **Audio Context Initialization**: Create on user interaction to comply with autoplay policies
2. **Noise Buffer Generation**: Pre-generate white noise buffer (2 seconds, 44100 sample rate)
3. **Effect Toggling**: Connect/disconnect nodes from destination rather than start/stop
4. **Volume Control**: Adjust GainNode.gain.value with exponential ramp for smooth transitions
5. **Persistence**: Store enabled states and volumes in localStorage
6. **Cleanup**: Properly disconnect and dispose audio nodes on unmount

#### Storage Schema

```typescript
interface StoredSoundscapeSettings {
  rain: { enabled: boolean; volume: number };
  tick: { enabled: boolean; volume: number };
  thunder: { enabled: boolean; volume: number };
  flip: { enabled: boolean; volume: number };
}
```

### 3. Bug Exorcism Altar

#### Component Structure

```typescript
interface BugExorcismAltarProps {
  judgeMode: boolean;
}

interface ErrorPattern {
  id: string;
  language: 'javascript' | 'typescript' | 'python';
  pattern: RegExp;
  explanation: string;
  solutions: string[];
  relatedDocs: string[];
}

interface BestiaryEntry {
  id: string; // UUID
  timestamp: number;
  errorText: string;
  detectedPattern: string | null;
  matchedLanguage: string | null;
}

interface AltarState {
  inputValue: string;
  isAnalyzing: boolean;
  currentResult: AnalysisResult | null;
  bestiaryLog: BestiaryEntry[];
  selectedEntry: BestiaryEntry | null;
}

interface AnalysisResult {
  matched: boolean;
  pattern?: ErrorPattern;
  fallbackMessage?: string;
}
```

#### Pattern Matching Engine

The engine maintains 45 predefined regex patterns (15 per language):

**JavaScript Patterns (examples)**:
- `Cannot read property '(\w+)' of undefined`
- `(\w+) is not a function`
- `Unexpected token (\S+)`
- `SyntaxError: Unexpected end of input`
- `ReferenceError: (\w+) is not defined`

**TypeScript Patterns (examples)**:
- `Property '(\w+)' does not exist on type '(\w+)'`
- `Type '(\w+)' is not assignable to type '(\w+)'`
- `Cannot find name '(\w+)'`
- `Argument of type '(\w+)' is not assignable to parameter`
- `Object is possibly 'null'`

**Python Patterns (examples)**:
- `NameError: name '(\w+)' is not defined`
- `TypeError: (\w+)\(\) missing \d+ required positional argument`
- `IndentationError: unexpected indent`
- `KeyError: '(\w+)'`
- `AttributeError: '(\w+)' object has no attribute '(\w+)'`

#### Implementation Approach

1. **Pattern Registry**: Store patterns in separate JSON file imported at build time
2. **Analysis Pipeline**: Test input against all patterns sequentially, return first match
3. **Alchemy Circle Animation**: SVG rotation using Framer Motion during analysis
4. **Keyboard Shortcut**: Global `Alt+E` listener to focus input
5. **Bestiary Persistence**: Write to IndexedDB after each analysis using idb-keyval wrapper
6. **Performance**: Set 200ms timeout for pattern matching to guarantee responsiveness

#### Storage Schema

```typescript
// IndexedDB store: 'bestiary'
interface BestiaryLogEntry {
  id: string;
  timestamp: number;
  errorText: string; // up to 10000 chars
  detectedPattern: string | null;
  matchedLanguage: string | null;
}
```

### 4. Grimoire Flashcards

#### Component Structure

```typescript
interface GrimoireFlashcardsProps {
  judgeMode: boolean;
}

interface Flashcard {
  id: string; // UUID
  front: string; // markdown
  back: string; // markdown
}

interface FlashcardDeck {
  id: string; // UUID
  name: string;
  cards: Flashcard[];
  createdAt: number;
}

interface FlashcardState {
  decks: FlashcardDeck[];
  activeDeckId: string | null;
  currentCardIndex: number;
  isFlipped: boolean;
  isEditing: boolean;
}
```

#### Sub-Components

- **DeckSelector**: Dropdown to choose active deck
- **Card3D**: Framer Motion component with `rotateY` transform for flip animation
- **MarkdownRenderer**: Parses and renders markdown (bold, italic, code, lists)
- **CardNavigator**: Previous/next buttons + keyboard arrow support
- **CardPositionIndicator**: Shows "3 / 10" format
- **DeckEditor**: CRUD interface for decks and cards

#### 3D Flip Animation

Based on Framer Motion best practices ([dev.to article](https://dev.to/graciesharma/how-to-create-a-flipping-card-animation-using-framer-motion-5djh)):

```typescript
const flipVariants = {
  front: { rotateY: 0 },
  back: { rotateY: 180 }
};

const flipTransition = {
  duration: 0.6,
  ease: [0.4, 0.0, 0.2, 1] // cubic-bezier for smooth deceleration
};
```

#### Implementation Approach

1. **Markdown Parsing**: Use `marked` library for markdown-to-HTML conversion
2. **Flip State Management**: Track `isFlipped` boolean, toggle on click
3. **Keyboard Navigation**: Arrow left/right for previous/next, space for flip
4. **Demo Seeding**: Inject three decks with programming concepts when judge mode activates
5. **Persistence**: Serialize all decks to localStorage as JSON array
6. **Performance**: Lazy render off-screen cards to reduce DOM nodes

#### Storage Schema

```typescript
interface StoredFlashcardData {
  decks: FlashcardDeck[];
  lastActiveDeckId: string | null;
}

// Demo seed data (judge mode):
const demoDeck1 = {
  name: "JavaScript Fundamentals",
  cards: [/* 5 cards with closure, hoisting, async concepts */]
};
const demoDeck2 = {
  name: "TypeScript Types",
  cards: [/* 5 cards with generics, union, interfaces */]
};
const demoDeck3 = {
  name: "Gothic Architecture Patterns",
  cards: [/* 5 cards with design patterns themed gothically */]
};
```

### 5. Alchemist's Blueprint Modal

#### Component Structure

```typescript
interface AlchemistBlueprintModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface SpecDocument {
  path: string;
  name: string;
  category: 'specs' | 'steering' | 'hooks';
  content: string; // markdown or JSON
  type: 'markdown' | 'json';
}

interface BlueprintState {
  documents: SpecDocument[];
  selectedDocId: string | null;
  isLoading: boolean;
  error: string | null;
}
```

#### Sub-Components

- **NavigationMenu**: Sidebar with categorized document list
- **DocumentRenderer**: Renders markdown or syntax-highlighted JSON
- **ParchmentOverlay**: Full-screen SVG feTurbulence texture
- **CloseButton**: X button and Escape key handler

#### Implementation Approach

1. **File Discovery**: Use Next.js API route to list files in `.kiro/` directories at build time
2. **Static Generation**: Pre-load all spec files during build, embed as JSON in bundle
3. **Markdown Rendering**: Use `react-markdown` with syntax highlighting via `react-syntax-highlighter`
4. **JSON Formatting**: Pretty-print JSON with 2-space indentation and syntax colors
5. **Modal Management**: Framer Motion overlay with backdrop blur
6. **Fallback Handling**: If `.kiro` directory doesn't exist, show instructional message

#### Storage Schema

No persistent storage needed (read-only display of static files).

## Data Models

### Timer Configuration

```typescript
interface TimerConfig {
  preferredDuration: number; // minutes, 1-120
  activeSession: {
    startTime: number; // Unix timestamp
    duration: number; // seconds
    elapsed: number; // seconds
  } | null;
}
```

### Soundscape Settings

```typescript
interface SoundscapeSettings {
  effects: {
    rain: { enabled: boolean; volume: number };
    tick: { enabled: boolean; volume: number };
    thunder: { enabled: boolean; volume: number };
    flip: { enabled: boolean; volume: number };
  };
}
```

### Error Pattern Database

```typescript
interface ErrorPatternDB {
  version: number;
  patterns: {
    javascript: ErrorPattern[];
    typescript: ErrorPattern[];
    python: ErrorPattern[];
  };
}

interface ErrorPattern {
  id: string;
  regex: string; // stored as string, compiled to RegExp at runtime
  explanation: string;
  solutions: string[];
  relatedDocs: string[];
}
```

### Flashcard Storage

```typescript
interface FlashcardStorage {
  version: number;
  decks: Array<{
    id: string;
    name: string;
    createdAt: number;
    cards: Array<{
      id: string;
      front: string; // markdown
      back: string; // markdown
    }>;
  }>;
  lastActiveDeckId: string | null;
}
```

### Bestiary Log (IndexedDB)

```typescript
// Object store: 'bestiary'
// Key path: 'id'
// Indexes: ['timestamp', 'matchedLanguage']

interface BestiaryLogEntry {
  id: string; // UUID v4
  timestamp: number; // Unix timestamp
  errorText: string; // max 10000 chars
  detectedPattern: string | null; // pattern ID
  matchedLanguage: 'javascript' | 'typescript' | 'python' | null;
}
```

### Judge Mode State

```typescript
interface JudgeModeState {
  isActive: boolean;
  timeMultiplier: number; // 60 when active
  demoDataSeeded: boolean;
}
```

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

**Assessment**: Nocturneum is primarily a UI-heavy application with significant portions involving rendering, animations, and user interactions. However, several core logic areas are suitable for property-based testing:
- Timer calculation logic (pure functions)
- Storage serialization/deserialization
- Pattern matching engine
- Markdown parsing round-trips
- Audio synthesis parameter calculations

Other areas are NOT suitable for PBT:
- UI rendering and animations (use snapshot tests)
- SVG visual effects (use visual regression)
- Modal interactions (use example-based tests)

### Property 1: Timer Height Calculation Invariant

*For any* timer configuration with total duration D and remaining time R, the candle height percentage shall equal (R / D) × 100, and when R reaches 0, the height shall be exactly 0.

**Validates: Requirements 1.2, 1.9**

### Property 2: Judge Mode Time Acceleration

*For any* time delta value Δt in normal mode, when judge mode is active, the effective time elapsed shall equal Δt × 60.

**Validates: Requirements 1.4, 7.6**

### Property 3: Storage Round-Trip Preservation

*For any* valid application data structure (timer state, soundscape settings, flashcard decks, or bestiary log entries), serializing to JSON then deserializing shall produce an equivalent data structure with identical semantic content.

**Validates: Requirements 1.7, 2.8, 3.10, 4.5, 8.4, 8.5, 8.9**

### Property 4: Volume-to-Gain Mapping

*For any* volume value V in range [0, 100], converting to gain G shall satisfy: G = V / 100, and the resulting audio output amplitude shall be proportional to G.

**Validates: Requirements 2.7**

### Property 5: Sound Effect Idempotence

*For any* sound effect configuration, performing enable → disable → enable operations shall restore the identical audio node graph and playback characteristics as the initial enabled state.

**Validates: Requirements 2.10**

### Property 6: Pattern Matching Determinism

*For any* error text input E, analyzing E multiple times shall always produce the same pattern match result (same pattern ID and language, or same null result if no match).

**Validates: Requirements 3.3, 3.4, 3.5, 3.13**

### Property 7: Bestiary Log Entry Structure

*For any* error analysis operation, the resulting bestiary log entry shall contain exactly the required fields: id (non-empty string), timestamp (positive number), errorText (string), detectedPattern (string or null), and matchedLanguage (valid language code or null).

**Validates: Requirements 3.9**

### Property 8: Bestiary Log Sorting and Limiting

*For any* collection of bestiary entries with size N, retrieving the most recent 50 entries shall return min(N, 50) entries sorted by timestamp in descending order, where each entry's timestamp is greater than or equal to the next entry's timestamp.

**Validates: Requirements 3.11**

### Property 9: Markdown Parsing Consistency

*For any* valid markdown string M, parsing M to HTML shall produce consistent output structure, where bold syntax (**text**) produces `<strong>` tags, italic syntax (*text*) produces `<em>` tags, code blocks (```code```) produce `<pre><code>` tags, and bullet lists produce `<ul><li>` tags.

**Validates: Requirements 4.3, 4.4**

### Property 10: Card Navigation Bounds

*For any* flashcard deck with N cards and current index I, navigating forward shall move to (I + 1) mod N, and navigating backward shall move to (I - 1 + N) mod N, ensuring the index always remains in range [0, N-1].

**Validates: Requirements 4.9**

### Property 11: Card Flip Round-Trip

*For any* flashcard in any flip state S (front or back), performing two consecutive flip operations shall return the card to state S.

**Validates: Requirements 4.12**

### Property 12: Code Syntax Highlighting Preservation

*For any* code block with language identifier L and code content C, syntax highlighting shall parse C without altering the code's text content, producing only additional HTML markup for styling.

**Validates: Requirements 5.7**

### Property 13: Color Contrast Invariant

*For any* color pair (foreground F, background B) used in the interface, the contrast ratio calculated as (L_max + 0.05) / (L_min + 0.05) where L is relative luminance, shall be greater than or equal to 4.5.

**Validates: Requirements 6.9, 6.10, 6.12**

### Property 14: Demo Data Schema Consistency

*For any* demo data structure generated in judge mode, validating it against the same schema used for user-created content shall return true with zero validation errors.

**Validates: Requirements 7.8**

### Property 15: Data Validation Correctness

*For any* loaded data D and schema S, validation shall correctly classify D as valid if and only if D conforms to all constraints defined in S, and shall identify the specific fields failing validation when D is invalid.

**Validates: Requirements 8.10**

<function_calls>
<invoke name="prework">
<parameter name="featureName">nocturneum-core


## Error Handling

### Storage Errors

**localStorage Quota Exceeded**:
- **Detection**: Catch `QuotaExceededError` during `localStorage.setItem()`
- **Recovery**: Display user-friendly warning modal with storage usage details
- **Fallback**: Offer to clear old flashcard decks or bestiary entries
- **User Notification**: "Storage space full. Please remove old flashcards or clear bestiary log."

**Corrupted localStorage Data**:
- **Detection**: JSON parse errors or schema validation failures during load
- **Recovery**: Clear corrupted key, reinitialize with default values
- **Logging**: Console warning with corrupted data preview (first 100 chars)
- **User Notification**: Silent recovery, initialize fresh state

**IndexedDB Unavailable**:
- **Detection**: Feature detection check for `window.indexedDB`
- **Fallback**: Use localStorage for bestiary log (limited to 50 most recent entries)
- **User Notification**: "Advanced storage unavailable, using limited history mode"

### Audio Context Errors

**Autoplay Policy Blocked**:
- **Detection**: AudioContext state === 'suspended' after creation
- **Recovery**: Display "Click to Enable Audio" button
- **Action**: Resume AudioContext on user interaction
- **User Notification**: Visual indicator showing audio is muted

**Audio Node Creation Failure**:
- **Detection**: Try-catch around createOscillator/createGain/createBiquadFilter
- **Recovery**: Disable affected sound effect, log error
- **Fallback**: Continue with remaining functional sound effects
- **User Notification**: Show warning badge on failed sound effect toggle

### Pattern Matching Errors

**Regex Compilation Error**:
- **Detection**: Try-catch around `new RegExp()` for loaded patterns
- **Recovery**: Skip invalid pattern, log warning
- **Fallback**: Continue with remaining valid patterns
- **Impact**: Reduced error detection coverage

**Analysis Timeout**:
- **Detection**: `setTimeout` wrapper around pattern matching (200ms limit)
- **Recovery**: Return fallback message after timeout
- **User Notification**: "Analysis taking longer than expected, showing general guidance"

### Animation Errors

**Framer Motion Runtime Error**:
- **Detection**: React error boundary around animated components
- **Recovery**: Render static fallback UI without animations
- **Logging**: Report error to console
- **User Notification**: Silent degradation, functionality preserved

**SVG Rendering Failure**:
- **Detection**: Check for SVGElement support, validate SVG structure
- **Recovery**: Display text-based timer as fallback
- **User Notification**: "Visual effects unavailable, using simplified display"

### Network Errors

**Font Loading Failure**:
- **Detection**: `document.fonts.ready` promise rejection
- **Fallback**: CSS font stack falls back to system fonts
- **Impact**: Degraded visual aesthetic, full functionality preserved
- **User Notification**: None (silent degradation)

### Validation Errors

**Invalid Timer Duration**:
- **Detection**: Check duration in range [1, 120] minutes
- **Recovery**: Clamp value to nearest valid boundary
- **User Feedback**: Input field shows corrected value with red border flash

**Invalid Flashcard Markdown**:
- **Detection**: Markdown parser throws exception
- **Recovery**: Display raw markdown text without formatting
- **User Notification**: "Card content could not be formatted, showing plain text"

**Invalid Volume Value**:
- **Detection**: Check volume in range [0, 100]
- **Recovery**: Clamp value to valid range
- **User Feedback**: Slider snaps to nearest valid value

### Page Visibility Errors

**Visibility API Unsupported**:
- **Detection**: Check for `document.hidden` property
- **Fallback**: Disable ghost overlay feature
- **Impact**: Timer continues running without warning when tab hidden
- **User Notification**: None (feature gracefully disabled)

### Judge Mode Errors

**Demo Seeding Timeout**:
- **Detection**: Track seeding duration, fail if exceeds 1000ms
- **Recovery**: Partial seeding with successfully created items
- **User Notification**: "Demo data partially loaded"

**Invalid Judge Mode Parameter**:
- **Detection**: Check URL param `mode` value against whitelist
- **Recovery**: Treat as normal mode if invalid value
- **Logging**: Console warning for invalid parameter value

## Testing Strategy

### Dual Testing Approach

Nocturneum requires both **property-based testing** for core logic and **example-based testing** for UI interactions and integrations.

### Property-Based Testing (PBT)

**Library**: `fast-check` (JavaScript/TypeScript property-based testing library)

**Configuration**:
- Minimum 100 iterations per property test
- Seed-based reproducibility for failed test cases
- Shrinking enabled to find minimal failing examples

**Tag Format**: Each property test must include a comment:
```typescript
// Feature: nocturneum-core, Property 1: Timer Height Calculation Invariant
```

**Test Files Structure**:
```
src/
  lib/
    timer/
      __tests__/
        timer-properties.test.ts
    soundscape/
      __tests__/
        soundscape-properties.test.ts
    altar/
      __tests__/
        altar-properties.test.ts
    flashcards/
      __tests__/
        flashcards-properties.test.ts
    storage/
      __tests__/
        storage-properties.test.ts
```

**Property Test Examples**:

```typescript
// Feature: nocturneum-core, Property 1: Timer Height Calculation Invariant
test('candle height proportional to remaining time', () => {
  fc.assert(
    fc.property(
      fc.integer({ min: 60, max: 7200 }), // duration in seconds
      fc.integer({ min: 0, max: 7200 }), // elapsed in seconds
      (duration, elapsed) => {
        const remaining = Math.max(0, duration - elapsed);
        const height = calculateCandleHeight(remaining, duration);
        
        if (remaining === 0) {
          expect(height).toBe(0);
        } else {
          expect(height).toBeCloseTo((remaining / duration) * 100, 2);
        }
      }
    ),
    { numRuns: 100 }
  );
});

// Feature: nocturneum-core, Property 3: Storage Round-Trip Preservation
test('timer state serialization round-trip', () => {
  fc.assert(
    fc.property(
      timerStateArbitrary, // custom generator
      (state) => {
        const serialized = JSON.stringify(state);
        const deserialized = JSON.parse(serialized);
        expect(deserialized).toEqual(state);
      }
    ),
    { numRuns: 100 }
  );
});
```

### Unit Testing

**Library**: Vitest (fast, Vite-native test runner)

**Coverage Targets**:
- Core logic functions: 90% coverage
- Component logic: 80% coverage
- UI rendering: 70% coverage (supplemented by visual tests)

**Test Categories**:

1. **Component Rendering**:
   - Verify components mount without errors
   - Check correct props are passed to children
   - Validate conditional rendering logic

2. **Event Handlers**:
   - Button clicks trigger correct state updates
   - Keyboard shortcuts invoke correct actions
   - Form submissions validate input

3. **Edge Cases**:
   - Empty flashcard decks
   - Zero-length timer sessions
   - Bestiary log with no entries
   - Missing fonts or audio context

4. **Integration Points**:
   - localStorage read/write operations
   - IndexedDB transactions
   - AudioContext initialization
   - Page Visibility API events

### Integration Testing

**Library**: Playwright (end-to-end testing)

**Test Scenarios**:

1. **Complete Timer Session**:
   - Start timer with custom duration
   - Verify candle animation plays
   - Wait for completion
   - Verify completion effect triggers

2. **Soundscape Playback**:
   - Enable all four sound effects
   - Adjust volume controls
   - Verify audio nodes created
   - Disable effects and verify cleanup

3. **Error Analysis Flow**:
   - Submit JavaScript error
   - Verify pattern match
   - Check bestiary log entry created
   - Reload page and verify persistence

4. **Flashcard CRUD**:
   - Create new deck
   - Add multiple cards
   - Navigate through cards
   - Flip cards and verify animation
   - Delete deck and verify removal

5. **Judge Mode Activation**:
   - Navigate to `?mode=judge`
   - Verify demo data seeded within 1000ms
   - Verify timer runs at 60x speed
   - Verify judge mode indicator displayed

### Visual Regression Testing

**Library**: Percy or Chromatic

**Snapshots**:
- Candle timer at various completion percentages (0%, 25%, 50%, 75%, 100%)
- Each sound effect control in enabled/disabled states
- Bug altar with matched pattern result
- Bug altar with fallback message
- Flashcard in front and back states
- Blueprint modal with navigation menu
- Ghost overlay warning
- All components in judge mode

### Accessibility Testing

**Library**: axe-core via jest-axe or Playwright axe integration

**Checks**:
- Color contrast ratios (WCAG AA 4.5:1)
- Keyboard navigation completeness
- ARIA labels on interactive elements
- Focus indicators visible
- Skip links for screen readers

### Performance Testing

**Tools**: Lighthouse CI, Chrome DevTools Performance

**Metrics**:
- Bundle size < 500KB (gzipped)
- First Contentful Paint < 1.5s
- Time to Interactive < 2.5s
- Cumulative Layout Shift < 0.1
- Animation frame rate ≥ 30fps (target 60fps)

**Load Testing**:
- 1000 flashcards in storage
- 500 bestiary log entries
- All sound effects playing simultaneously
- Multiple timer sessions in history

### Testing Workflow

1. **Pre-commit**: Run unit tests and linting
2. **Pull Request**: Run full test suite (unit + property + integration)
3. **Main Branch**: Run visual regression and performance tests
4. **Pre-release**: Run manual exploratory testing in judge mode

### Test Data Generators

**Custom Arbitraries for fast-check**:

```typescript
// Timer state generator
const timerStateArbitrary = fc.record({
  duration: fc.integer({ min: 60, max: 7200 }),
  remainingTime: fc.integer({ min: 0, max: 7200 }),
  isActive: fc.boolean(),
  isPaused: fc.boolean(),
});

// Soundscape settings generator
const soundscapeSettingsArbitrary = fc.record({
  rain: fc.record({ enabled: fc.boolean(), volume: fc.integer({ min: 0, max: 100 }) }),
  tick: fc.record({ enabled: fc.boolean(), volume: fc.integer({ min: 0, max: 100 }) }),
  thunder: fc.record({ enabled: fc.boolean(), volume: fc.integer({ min: 0, max: 100 }) }),
  flip: fc.record({ enabled: fc.boolean(), volume: fc.integer({ min: 0, max: 100 }) }),
});

// Flashcard generator
const flashcardArbitrary = fc.record({
  id: fc.uuid(),
  front: fc.string({ minLength: 1, maxLength: 500 }),
  back: fc.string({ minLength: 1, maxLength: 500 }),
});

// Bestiary entry generator
const bestiaryEntryArbitrary = fc.record({
  id: fc.uuid(),
  timestamp: fc.integer({ min: 1600000000000, max: 2000000000000 }),
  errorText: fc.string({ minLength: 10, maxLength: 10000 }),
  detectedPattern: fc.option(fc.string()),
  matchedLanguage: fc.option(fc.constantFrom('javascript', 'typescript', 'python')),
});
```

### Manual Testing Checklist

**Judge Mode Verification**:
- [ ] Timer runs 60x faster (1 minute appears to complete in 1 second)
- [ ] Demo flashcards appear (3 decks, 15 total cards)
- [ ] Bestiary has 10 sample entries
- [ ] Judge mode indicator visible in UI
- [ ] All functionality works identically to normal mode

**Cross-Browser Testing**:
- [ ] Chrome/Edge (Chromium)
- [ ] Firefox
- [ ] Safari (macOS/iOS)

**Accessibility Audit**:
- [ ] Screen reader navigation (NVDA/JAWS/VoiceOver)
- [ ] Keyboard-only navigation
- [ ] High contrast mode compatibility
- [ ] Zoom levels up to 200%

---

## Implementation Notes

### File Structure

```
nocturneum/
├── src/
│   ├── app/
│   │   ├── layout.tsx                 # Root layout with gothic theme provider
│   │   ├── page.tsx                    # Main dashboard with all modules
│   │   └── globals.css                 # Tailwind + custom gothic styles
│   ├── components/
│   │   ├── timer/
│   │   │   ├── CandleTimer.tsx
│   │   │   ├── CandleSVG.tsx
│   │   │   ├── TimerControls.tsx
│   │   │   └── GhostOverlay.tsx
│   │   ├── soundscape/
│   │   │   ├── SoundscapeEngine.tsx
│   │   │   ├── EffectToggle.tsx
│   │   │   └── VolumeSlider.tsx
│   │   ├── altar/
│   │   │   ├── BugExorcismAltar.tsx
│   │   │   ├── AlchemyCircle.tsx
│   │   │   ├── PatternResult.tsx
│   │   │   └── BestiaryLog.tsx
│   │   ├── flashcards/
│   │   │   ├── GrimoireFlashcards.tsx
│   │   │   ├── Card3D.tsx
│   │   │   ├── DeckSelector.tsx
│   │   │   └── CardNavigator.tsx
│   │   ├── blueprint/
│   │   │   ├── AlchemistBlueprintModal.tsx
│   │   │   ├── NavigationMenu.tsx
│   │   │   └── DocumentRenderer.tsx
│   │   └── shared/
│   │       ├── ParchmentOverlay.tsx
│   │       └── GothicButton.tsx
│   ├── lib/
│   │   ├── timer/
│   │   │   ├── timer-logic.ts
│   │   │   └── __tests__/
│   │   ├── soundscape/
│   │   │   ├── audio-synthesis.ts
│   │   │   └── __tests__/
│   │   ├── altar/
│   │   │   ├── pattern-matcher.ts
│   │   │   ├── error-patterns.json
│   │   │   └── __tests__/
│   │   ├── flashcards/
│   │   │   ├── markdown-parser.ts
│   │   │   └── __tests__/
│   │   ├── storage/
│   │   │   ├── storage-manager.ts
│   │   │   ├── schema-validator.ts
│   │   │   └── __tests__/
│   │   └── judge-mode/
│   │       ├── demo-seeder.ts
│   │       └── mode-detector.ts
│   ├── hooks/
│   │   ├── useJudgeMode.ts
│   │   ├── useLocalStorage.ts
│   │   ├── useIndexedDB.ts
│   │   └── usePageVisibility.ts
│   └── types/
│       ├── timer.ts
│       ├── soundscape.ts
│       ├── altar.ts
│       ├── flashcards.ts
│       └── storage.ts
├── public/
│   ├── fonts/
│   │   ├── cinzel/
│   │   └── jetbrains-mono/
│   └── assets/
├── .kiro/
│   ├── specs/
│   │   └── nocturneum-core/
│   │       ├── requirements.md
│   │       └── design.md
│   └── steering/
│       └── gothic-alchemist-rules.md
└── package.json
```

### Key Dependencies

```json
{
  "dependencies": {
    "next": "^15.0.0",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "framer-motion": "^11.0.0",
    "marked": "^12.0.0",
    "react-syntax-highlighter": "^15.5.0",
    "idb-keyval": "^6.2.0"
  },
  "devDependencies": {
    "typescript": "^5.3.0",
    "tailwindcss": "^3.4.0",
    "vitest": "^1.2.0",
    "fast-check": "^3.15.0",
    "@playwright/test": "^1.41.0",
    "@axe-core/playwright": "^4.8.0",
    "eslint": "^8.56.0",
    "prettier": "^3.2.0"
  }
}
```

### Build Configuration

**next.config.ts**:
```typescript
const config = {
  output: 'export', // Static export for client-only rendering
  images: {
    unoptimized: true, // Required for static export
  },
  webpack: (config) => {
    // Optimize SVG imports
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    });
    return config;
  },
};
```

**tailwind.config.js**:
```javascript
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        obsidian: '#0B0A0E',
        parchment: '#16131D',
        crimson: '#7A1C24',
        gold: '#E6B86A',
        mist: '#94A3B8',
      },
      fontFamily: {
        serif: ['Cinzel', 'serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
    },
  },
};
```

### Performance Optimizations

1. **Code Splitting**: Lazy load Blueprint Modal (only loads when opened)
2. **Audio Context**: Delay creation until first user interaction
3. **IndexedDB**: Use idb-keyval for simplified async/await API
4. **Markdown**: Memoize parsed markdown to avoid re-parsing
5. **SVG**: Use CSS transforms instead of recalculating paths
6. **Bundle Size**: Tree-shake unused Framer Motion features

### Deployment

**Target**: Static hosting (Vercel, Netlify, GitHub Pages)

**Build Command**: `npm run build`

**Output**: `out/` directory with static HTML, CSS, JS

**Judge Mode URL**: `https://nocturneum.vercel.app/?mode=judge`

---

## Summary

This design document specifies a gothic-themed productivity application with five independent modules sharing a unified visual theme and storage layer. The architecture prioritizes offline functionality through Web Audio API synthesis and client-side pattern matching, while maintaining WCAG AA accessibility standards throughout a dark aesthetic. Property-based testing validates core logic invariants, while example-based and integration tests cover UI interactions and persistence. Judge mode enables rapid demonstration through 60x time acceleration and instant data seeding, making the application ideal for hackathon evaluation.