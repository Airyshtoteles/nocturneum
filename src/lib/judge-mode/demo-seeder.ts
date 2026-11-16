import {
  FlashcardDeck,
  BestiaryEntry,
  StoredTimerState,
  StoredFlashcardData,
} from '@/types';
import {
  getLocalStorageItem,
  setLocalStorageItem,
  addBestiaryEntry,
  getBestiaryEntries,
} from '../storage';

export const DEMO_FLASHCARD_DECKS: FlashcardDeck[] = [
  {
    id: 'demo-deck-js',
    name: 'JavaScript Fundamentals',
    createdAt: 1700000000000,
    cards: [
      {
        id: 'js-card-1',
        front: '### Alchemical Closures\nWhat is a **closure** in JavaScript?',
        back: 'A closure is the combination of a function bundled together with references to its surrounding state (**lexical environment**).\n\n```javascript\nfunction createPhial() {\n  let essence = "vitriol";\n  return () => essence;\n}\n```',
      },
      {
        id: 'js-card-2',
        front: '### Spectral Hoisting\nHow does variable and function **hoisting** operate in the execution context?',
        back: 'Variable (`var`) and function declarations are hoisted to the top of their containing scope during compile phase.\n\n- `var` is initialized with `undefined`\n- `let` and `const` remain uninitialized in the **Temporal Dead Zone**.',
      },
      {
        id: 'js-card-3',
        front: '### The Nocturnal Event Loop\nHow does the **Event Loop** coordinate microtasks and macrotasks?',
        back: 'The call stack executes synchronous code first. When clear, all **microtasks** (Promise callbacks, `queueMicrotask`) drain completely before the next **macrotask** (`setTimeout`, I/O) executes.',
      },
      {
        id: 'js-card-4',
        front: '### Dark Promises & Async Chants\nWhat happens when an unhandled Promise rejection occurs?',
        back: 'An unhandled rejection emits `unhandledrejection` on the global object. In modern Node.js and strict environments, it terminates the process with a non-zero exit code.',
      },
      {
        id: 'js-card-5',
        front: '### Prototype Chains of the Ancients\nHow does JavaScript resolve property lookups along the prototype chain?',
        back: 'If a property is absent on an object, the runtime inspects its internal `[[Prototype]]` link (`Object.getPrototypeOf`), traversing upwards until found or reaching `null`.',
      },
    ],
  },
  {
    id: 'demo-deck-ts',
    name: 'TypeScript Types',
    createdAt: 1700000001000,
    cards: [
      {
        id: 'ts-card-1',
        front: '### Transmutative Generics\nWhat is the purpose of generic type constraints?',
        back: 'Generic constraints restrict the types that can be passed to a type parameter using the `extends` keyword:\n\n```typescript\nfunction distill<T extends AlchemicalBase>(ingredient: T): T {\n  return ingredient;\n}\n```',
      },
      {
        id: 'ts-card-2',
        front: '### Union & Intersection Sigils\nWhat is the difference between `A | B` and `A & B`?',
        back: '- `A | B` represents an entity with characteristics of **either** A or B.\n- `A & B` merges all requirements into an entity satisfying **both** contracts simultaneously.',
      },
      {
        id: 'ts-card-3',
        front: '### Mapped Grimoire Types\nHow do mapped types transform existing object schemas?',
        back: 'Mapped types iterate over keys using index signatures and the `in keyof` syntax:\n\n```typescript\ntype Sanctified<T> = {\n  readonly [P in keyof T]: T[P];\n};\n```',
      },
      {
        id: 'ts-card-4',
        front: '### Discriminated Unions\nWhat makes a discriminated union uniquely safe for exorcisms?',
        back: 'A discriminated union shares a common literal property (the discriminant) across all members, enabling TypeScript to exhaustively narrow types inside `switch` or `if` guards.',
      },
      {
        id: 'ts-card-5',
        front: '### Conditional Invocations\nExplain the `infer` keyword inside conditional types.',
        back: 'The `infer` keyword introduces a type variable within the `extends` clause of a conditional type, extracting constituent subtypes dynamically at compile time.',
      },
    ],
  },
  {
    id: 'demo-deck-gothic',
    name: 'Gothic Architecture Patterns',
    createdAt: 1700000002000,
    cards: [
      {
        id: 'gothic-card-1',
        front: '### The Alchemical Singleton\nWhen should the Cathedral keep a single sacred instance?',
        back: 'Ensure a class has only one instance while providing a global access point to it (e.g., the Master Audio Synthesizer or Central Exorcism Vault).',
      },
      {
        id: 'gothic-card-2',
        front: '### The Cathedral Facade\nHow does the Facade pattern veil occult complexity?',
        back: 'It provides a simplified, higher-level interface over a convoluted subsystem (e.g., hiding raw Web Audio API oscillator/gain graphs behind simple `rain.toggle()` invocations).',
      },
      {
        id: 'gothic-card-3',
        front: '### The Relic Observer\nHow does reactive state broadcast changes to nocturnal observers?',
        back: 'Maintains a list of dependents (`Subscribers`) that receive automated invocations when the sacred subject undergoes state transition.',
      },
      {
        id: 'gothic-card-4',
        front: '### Necromancy Strategy Pattern\nHow does the exorcism altar swap error parsing strategies?',
        back: 'Encapsulates algorithmic families (JavaScript, TypeScript, Python error matchers) inside distinct interchangeable strategy classes.',
      },
      {
        id: 'gothic-card-5',
        front: '### The Phantom Factory\nHow does an abstract factory produce thematic artifacts?',
        back: 'Provides an interface for instantiating families of related gothic UI components without specifying their concrete implementation classes.',
      },
    ],
  },
];

export const DEMO_BESTIARY_ENTRIES: BestiaryEntry[] = [
  {
    id: 'demo-err-01',
    timestamp: 1700000010000,
    errorText: "TypeError: Cannot read properties of undefined (reading 'ignite')",
    detectedPattern: 'undefined-property-access',
    matchedLanguage: 'javascript',
  },
  {
    id: 'demo-err-02',
    timestamp: 1700000009000,
    errorText: 'ReferenceError: philosopherStone is not defined',
    detectedPattern: 'reference-not-defined',
    matchedLanguage: 'javascript',
  },
  {
    id: 'demo-err-03',
    timestamp: 1700000008000,
    errorText: 'TypeError: transmutate is not a function',
    detectedPattern: 'not-a-function',
    matchedLanguage: 'javascript',
  },
  {
    id: 'demo-err-04',
    timestamp: 1700000007000,
    errorText: "SyntaxError: Unexpected token '}' in ritual.js:42:15",
    detectedPattern: 'unexpected-token',
    matchedLanguage: 'javascript',
  },
  {
    id: 'demo-err-05',
    timestamp: 1700000006000,
    errorText: "Type 'string' is not assignable to type 'AlchemicalElement'",
    detectedPattern: 'type-not-assignable',
    matchedLanguage: 'typescript',
  },
  {
    id: 'demo-err-06',
    timestamp: 1700000005000,
    errorText: "Property 'elixir' does not exist on type 'Grimoire'",
    detectedPattern: 'property-does-not-exist',
    matchedLanguage: 'typescript',
  },
  {
    id: 'demo-err-07',
    timestamp: 1700000004000,
    errorText: "Argument of type 'null' is not assignable to parameter of type 'Mortar'",
    detectedPattern: 'null-not-assignable',
    matchedLanguage: 'typescript',
  },
  {
    id: 'demo-err-08',
    timestamp: 1700000003000,
    errorText: "NameError: name 'homunculus' is not defined",
    detectedPattern: 'name-not-defined',
    matchedLanguage: 'python',
  },
  {
    id: 'demo-err-09',
    timestamp: 1700000002000,
    errorText: "TypeError: brew() missing 1 required positional argument: 'essence'",
    detectedPattern: 'missing-positional-argument',
    matchedLanguage: 'python',
  },
  {
    id: 'demo-err-10',
    timestamp: 1700000001000,
    errorText: 'IndentationError: unexpected indent in spellcraft.py line 24',
    detectedPattern: 'unexpected-indent',
    matchedLanguage: 'python',
  },
];

export const DEMO_TIMER_STATE: StoredTimerState = {
  duration: 2, // 2-minute demonstration session (Requirement 7.5)
  lastActiveSession: null,
};

const DEMO_SEEDED_FLAG_KEY = 'nocturneum_demo_seeded';

/**
 * Check if demo data has already been populated
 */
export function hasDemoDataBeenSeeded(): boolean {
  if (typeof window === 'undefined') return false;
  return window.localStorage.getItem(DEMO_SEEDED_FLAG_KEY) === 'true';
}

/**
 * Mark demo data as seeded
 */
export function markDemoDataSeeded(): void {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(DEMO_SEEDED_FLAG_KEY, 'true');
}

/**
 * Seed all demonstration data for Judge Mode.
 * Must execute within 1000ms.
 * Validates Requirements 7.3, 7.4, 7.5, 7.7, 7.8, 7.9
 */
export async function seedDemoData(options?: { overwrite?: boolean }): Promise<{
  success: boolean;
  durationMs: number;
  seededFlashcards: number;
  seededBestiary: number;
}> {
  const startTime = typeof performance !== 'undefined' ? performance.now() : Date.now();

  if (hasDemoDataBeenSeeded() && !options?.overwrite) {
    return {
      success: true,
      durationMs: 0,
      seededFlashcards: 0,
      seededBestiary: 0,
    };
  }

  // 1. Seed Flashcard Decks (Requirement 7.3)
  const currentFlashcards: StoredFlashcardData = getLocalStorageItem('nocturneum_flashcards');
  const existingDeckIds = new Set(currentFlashcards.decks.map((d) => d.id));
  const newDecks = DEMO_FLASHCARD_DECKS.filter((d) => options?.overwrite || !existingDeckIds.has(d.id));
  const mergedDecks = [...currentFlashcards.decks, ...newDecks];

  setLocalStorageItem('nocturneum_flashcards', {
    decks: mergedDecks,
    lastActiveDeckId: currentFlashcards.lastActiveDeckId || DEMO_FLASHCARD_DECKS[0].id,
  });

  // 2. Seed 10 Bestiary Log entries (Requirement 7.4)
  const existingBestiary = await getBestiaryEntries(100);
  const existingIds = new Set(existingBestiary.map((e) => e.id));
  let bestiaryCount = 0;

  for (const entry of DEMO_BESTIARY_ENTRIES) {
    if (options?.overwrite || !existingIds.has(entry.id)) {
      await addBestiaryEntry(entry);
      bestiaryCount++;
    }
  }

  // 3. Configure 2-minute demonstration session for Timer (Requirement 7.5)
  setLocalStorageItem('nocturneum_timer', DEMO_TIMER_STATE);

  markDemoDataSeeded();

  const endTime = typeof performance !== 'undefined' ? performance.now() : Date.now();
  const durationMs = endTime - startTime;

  if (durationMs > 1000) {
    console.warn(`[Nocturneum Judge Mode] Demo seeding took ${durationMs.toFixed(1)}ms (exceeded 1000ms SLA).`);
  }

  return {
    success: true,
    durationMs,
    seededFlashcards: newDecks.length,
    seededBestiary: bestiaryCount,
  };
}
