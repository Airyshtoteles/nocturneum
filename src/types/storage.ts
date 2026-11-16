import { StoredTimerState } from './timer';
import { StoredSoundscapeSettings } from './soundscape';
import { StoredFlashcardData } from './flashcards';
import { BestiaryEntry } from './altar';

export type StorageKey =
  | 'nocturneum_timer'
  | 'nocturneum_soundscape'
  | 'nocturneum_flashcards'
  | 'nocturneum_bestiary';

export interface StorageDataMap {
  nocturneum_timer: StoredTimerState;
  nocturneum_soundscape: StoredSoundscapeSettings;
  nocturneum_flashcards: StoredFlashcardData;
  nocturneum_bestiary: BestiaryEntry[];
}

export interface StorageValidationResult<T> {
  isValid: boolean;
  data: T | null;
  errors: string[];
}

export type StorageErrorKind =
  | 'quota_exceeded'
  | 'corrupted_data'
  | 'indexeddb_unavailable'
  | 'validation_failed'
  | 'unknown';

export interface StorageError {
  type: StorageErrorKind;
  message: string;
  key?: string;
  originalError?: unknown;
}

export interface JudgeModeState {
  isActive: boolean;
  timeMultiplier: number;
  demoDataSeeded: boolean;
}
