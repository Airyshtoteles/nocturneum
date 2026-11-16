import {
  StoredTimerState,
  StoredSoundscapeSettings,
  StoredFlashcardData,
  BestiaryEntry,
  StorageKey,
  StorageValidationResult,
} from '@/types';

/**
 * Default fallback values for each storage key
 */
export const DEFAULT_STORAGE_VALUES: {
  nocturneum_timer: StoredTimerState;
  nocturneum_soundscape: StoredSoundscapeSettings;
  nocturneum_flashcards: StoredFlashcardData;
  nocturneum_bestiary: BestiaryEntry[];
} = {
  nocturneum_timer: {
    duration: 25, // default 25 minutes
    lastActiveSession: null,
  },
  nocturneum_soundscape: {
    rain: { enabled: false, volume: 50 },
    tick: { enabled: false, volume: 40 },
    thunder: { enabled: false, volume: 30 },
    flip: { enabled: true, volume: 50 },
  },
  nocturneum_flashcards: {
    decks: [],
    lastActiveDeckId: null,
  },
  nocturneum_bestiary: [],
};

export function getDefaultStorageValue<K extends StorageKey>(key: K): (typeof DEFAULT_STORAGE_VALUES)[K] {
  return JSON.parse(JSON.stringify(DEFAULT_STORAGE_VALUES[key]));
}

/**
 * Validates StoredTimerState
 */
export function validateTimerState(data: unknown): StorageValidationResult<StoredTimerState> {
  const errors: string[] = [];
  if (!data || typeof data !== 'object') {
    return { isValid: false, data: null, errors: ['Data must be an object'] };
  }

  const obj = data as Record<string, unknown>;

  if (typeof obj.duration !== 'number' || obj.duration < 1 || obj.duration > 120 || isNaN(obj.duration)) {
    errors.push('duration must be a number between 1 and 120');
  }

  if (obj.lastActiveSession !== null) {
    if (typeof obj.lastActiveSession !== 'object' || obj.lastActiveSession === null) {
      errors.push('lastActiveSession must be an object or null');
    } else {
      const session = obj.lastActiveSession as Record<string, unknown>;
      if (typeof session.startTime !== 'number' || isNaN(session.startTime)) {
        errors.push('lastActiveSession.startTime must be a valid number');
      }
      if (typeof session.duration !== 'number' || session.duration <= 0 || isNaN(session.duration)) {
        errors.push('lastActiveSession.duration must be a positive number');
      }
      if (typeof session.elapsed !== 'number' || session.elapsed < 0 || isNaN(session.elapsed)) {
        errors.push('lastActiveSession.elapsed must be a non-negative number');
      }
    }
  }

  if (errors.length > 0) {
    return { isValid: false, data: null, errors };
  }

  return {
    isValid: true,
    data: {
      duration: obj.duration as number,
      lastActiveSession: obj.lastActiveSession as StoredTimerState['lastActiveSession'],
    },
    errors: [],
  };
}

/**
 * Validates StoredSoundscapeSettings
 */
export function validateSoundscapeSettings(data: unknown): StorageValidationResult<StoredSoundscapeSettings> {
  const errors: string[] = [];
  if (!data || typeof data !== 'object') {
    return { isValid: false, data: null, errors: ['Data must be an object'] };
  }

  const obj = data as Record<string, unknown>;
  const effects = ['rain', 'tick', 'thunder', 'flip'] as const;

  for (const effect of effects) {
    const eff = obj[effect];
    if (!eff || typeof eff !== 'object') {
      errors.push(`Missing or invalid effect configuration for: ${effect}`);
      continue;
    }
    const effectObj = eff as Record<string, unknown>;
    if (typeof effectObj.enabled !== 'boolean') {
      errors.push(`Effect ${effect}.enabled must be a boolean`);
    }
    if (typeof effectObj.volume !== 'number' || effectObj.volume < 0 || effectObj.volume > 100 || isNaN(effectObj.volume)) {
      errors.push(`Effect ${effect}.volume must be a number between 0 and 100`);
    }
  }

  if (errors.length > 0) {
    return { isValid: false, data: null, errors };
  }

  return {
    isValid: true,
    data: obj as unknown as StoredSoundscapeSettings,
    errors: [],
  };
}

/**
 * Validates Flashcard data
 */
export function validateFlashcardData(data: unknown): StorageValidationResult<StoredFlashcardData> {
  const errors: string[] = [];
  if (!data || typeof data !== 'object') {
    return { isValid: false, data: null, errors: ['Data must be an object'] };
  }

  const obj = data as Record<string, unknown>;

  if (!Array.isArray(obj.decks)) {
    errors.push('decks must be an array');
  } else {
    for (let i = 0; i < obj.decks.length; i++) {
      const deck = obj.decks[i];
      if (!deck || typeof deck !== 'object') {
        errors.push(`Deck at index ${i} must be an object`);
        continue;
      }
      if (typeof deck.id !== 'string' || deck.id.trim() === '') {
        errors.push(`Deck at index ${i} must have a non-empty string id`);
      }
      if (typeof deck.name !== 'string') {
        errors.push(`Deck at index ${i} must have a name string`);
      }
      if (typeof deck.createdAt !== 'number' || isNaN(deck.createdAt)) {
        errors.push(`Deck at index ${i} must have a numeric createdAt timestamp`);
      }
      if (!Array.isArray(deck.cards)) {
        errors.push(`Deck at index ${i} must have a cards array`);
      } else {
        for (let j = 0; j < deck.cards.length; j++) {
          const card = deck.cards[j];
          if (!card || typeof card !== 'object') {
            errors.push(`Card at index ${j} in deck ${i} must be an object`);
            continue;
          }
          if (typeof card.id !== 'string' || card.id.trim() === '') {
            errors.push(`Card at index ${j} in deck ${i} must have a non-empty string id`);
          }
          if (typeof card.front !== 'string') {
            errors.push(`Card at index ${j} in deck ${i} must have a front string`);
          }
          if (typeof card.back !== 'string') {
            errors.push(`Card at index ${j} in deck ${i} must have a back string`);
          }
        }
      }
    }
  }

  if (obj.lastActiveDeckId !== null && typeof obj.lastActiveDeckId !== 'string') {
    errors.push('lastActiveDeckId must be a string or null');
  }

  if (errors.length > 0) {
    return { isValid: false, data: null, errors };
  }

  return {
    isValid: true,
    data: obj as unknown as StoredFlashcardData,
    errors: [],
  };
}

/**
 * Validates a single BestiaryEntry
 */
export function validateBestiaryEntry(entry: unknown): StorageValidationResult<BestiaryEntry> {
  const errors: string[] = [];
  if (!entry || typeof entry !== 'object') {
    return { isValid: false, data: null, errors: ['Entry must be an object'] };
  }

  const obj = entry as Record<string, unknown>;
  if (typeof obj.id !== 'string' || obj.id.trim() === '') {
    errors.push('id must be a non-empty string');
  }
  if (typeof obj.timestamp !== 'number' || obj.timestamp <= 0 || isNaN(obj.timestamp)) {
    errors.push('timestamp must be a positive number');
  }
  if (typeof obj.errorText !== 'string') {
    errors.push('errorText must be a string');
  }
  if (obj.detectedPattern !== null && typeof obj.detectedPattern !== 'string') {
    errors.push('detectedPattern must be a string or null');
  }
  if (obj.matchedLanguage !== null && typeof obj.matchedLanguage !== 'string') {
    errors.push('matchedLanguage must be a string or null');
  }

  if (errors.length > 0) {
    return { isValid: false, data: null, errors };
  }

  return {
    isValid: true,
    data: {
      id: obj.id as string,
      timestamp: obj.timestamp as number,
      errorText: obj.errorText as string,
      detectedPattern: (obj.detectedPattern as string) ?? null,
      matchedLanguage: (obj.matchedLanguage as string) ?? null,
    },
    errors: [],
  };
}

/**
 * Validates an array of Bestiary entries
 */
export function validateBestiaryLog(data: unknown): StorageValidationResult<BestiaryEntry[]> {
  const errors: string[] = [];
  if (!Array.isArray(data)) {
    return { isValid: false, data: null, errors: ['Bestiary data must be an array'] };
  }

  const validEntries: BestiaryEntry[] = [];
  for (let i = 0; i < data.length; i++) {
    const res = validateBestiaryEntry(data[i]);
    if (!res.isValid || !res.data) {
      errors.push(`Entry at index ${i} is invalid: ${res.errors.join(', ')}`);
    } else {
      validEntries.push(res.data);
    }
  }

  if (errors.length > 0) {
    return { isValid: false, data: null, errors };
  }

  return { isValid: true, data: validEntries, errors: [] };
}

/**
 * Generic validator router based on storage key
 */
export function validateStorageData<K extends StorageKey>(
  key: K,
  data: unknown
): StorageValidationResult<(typeof DEFAULT_STORAGE_VALUES)[K]> {
  switch (key) {
    case 'nocturneum_timer':
      return validateTimerState(data) as unknown as StorageValidationResult<(typeof DEFAULT_STORAGE_VALUES)[K]>;
    case 'nocturneum_soundscape':
      return validateSoundscapeSettings(data) as unknown as StorageValidationResult<(typeof DEFAULT_STORAGE_VALUES)[K]>;
    case 'nocturneum_flashcards':
      return validateFlashcardData(data) as unknown as StorageValidationResult<(typeof DEFAULT_STORAGE_VALUES)[K]>;
    case 'nocturneum_bestiary':
      return validateBestiaryLog(data) as unknown as StorageValidationResult<(typeof DEFAULT_STORAGE_VALUES)[K]>;
    default:
      return { isValid: false, data: null, errors: [`Unknown storage key: ${key}`] };
  }
}
