/**
 * Bestiary Log Storage Manager (IndexedDB with LocalStorage Fallback)
 * Object store: 'bestiary' with indexes on 'timestamp' and 'matchedLanguage'.
 * Fully integrated fallback for environments where IndexedDB is unavailable or blocked.
 * Validates Requirements 3.10, 8.3, 8.7
 */

import { BestiaryEntry } from '@/types';
import {
  addBestiaryEntry,
  getBestiaryEntries,
  searchBestiaryEntries,
  deleteBestiaryEntry,
  clearBestiary,
  isIndexedDBAvailable,
} from '@/lib/storage/storage-manager';

export const BESTIARY_STORE_NAME = 'bestiary';
export const BESTIARY_DB_NAME = 'nocturneum_db';

/**
 * Add or update an entry in the Bestiary log.
 * Validates Requirement 3.10
 */
export async function saveBestiaryEntry(entry: BestiaryEntry): Promise<void> {
  return addBestiaryEntry(entry);
}

/**
 * Retrieve the most recent entries, sorted descending by timestamp.
 * Defaults to 50 entries per Requirement 3.11.
 * Validates Requirements 3.11, 8.3
 */
export async function loadBestiaryEntries(limit: number = 50): Promise<BestiaryEntry[]> {
  return getBestiaryEntries(limit);
}

/**
 * Search Bestiary entries by query string (matches errorText, language, or pattern).
 * Validates Requirement 8.3
 */
export async function searchBestiary(query: string): Promise<BestiaryEntry[]> {
  return searchBestiaryEntries(query);
}

/**
 * Delete a specific entry by its UUID.
 */
export async function removeBestiaryEntry(id: string): Promise<void> {
  return deleteBestiaryEntry(id);
}

/**
 * Clear all Bestiary entries.
 */
export async function purgeBestiary(): Promise<void> {
  return clearBestiary();
}

/**
 * Check if the current environment is running with native IndexedDB or fallback mode.
 * Validates Requirement 8.7
 */
export function checkBestiaryStorageMode(): { isIndexedDB: boolean; fallbackActive: boolean } {
  const isAvailable = isIndexedDBAvailable();
  return {
    isIndexedDB: isAvailable,
    fallbackActive: !isAvailable,
  };
}
