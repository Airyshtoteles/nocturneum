import {
  StorageKey,
  BestiaryEntry,
  StorageError,
} from '@/types';
import {
  DEFAULT_STORAGE_VALUES,
  getDefaultStorageValue,
  validateStorageData,
  validateBestiaryEntry,
} from './schema-validator';

// Subscribers for storage errors (e.g. quota exceeded)
type StorageErrorCallback = (error: StorageError) => void;
const errorListeners = new Set<StorageErrorCallback>();

export function onStorageError(callback: StorageErrorCallback): () => void {
  errorListeners.add(callback);
  return () => {
    errorListeners.delete(callback);
  };
}

export function emitStorageError(error: StorageError): void {
  console.warn(`[Nocturneum Storage Error] ${error.type}: ${error.message}`, error);
  errorListeners.forEach((listener) => {
    try {
      listener(error);
    } catch (e) {
      console.error('Error in storage error listener:', e);
    }
  });
}

/**
 * Serialize JavaScript objects to JSON format.
 * Validates Requirement 8.4
 */
export function serializeJSON<T>(value: T): string {
  return JSON.stringify(value);
}

/**
 * Parse JSON strings back to JavaScript objects.
 * Validates Requirement 8.5
 */
export function deserializeJSON<T>(json: string): T {
  return JSON.parse(json) as T;
}

/**
 * Check if window.localStorage is accessible
 */
export function isLocalStorageAvailable(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const testKey = '__nocturneum_storage_test__';
    window.localStorage.setItem(testKey, testKey);
    window.localStorage.removeItem(testKey);
    return true;
  } catch {
    return false;
  }
}

/**
 * Safely retrieve an item from localStorage with JSON parsing and schema validation.
 * If data is missing or corrupted, clears corrupted entry and reinitializes with defaults.
 * Validates Requirements 8.1, 8.2, 8.5, 8.6, 8.10
 */
export function getLocalStorageItem<K extends StorageKey>(key: K): (typeof DEFAULT_STORAGE_VALUES)[K] {
  if (!isLocalStorageAvailable()) {
    return getDefaultStorageValue(key);
  }

  try {
    const rawValue = window.localStorage.getItem(key);
    if (rawValue === null) {
      return getDefaultStorageValue(key);
    }

    let parsed: unknown;
    try {
      parsed = deserializeJSON(rawValue);
    } catch (parseError) {
      const preview = rawValue.slice(0, 100);
      emitStorageError({
        type: 'corrupted_data',
        message: `Corrupted JSON for key "${key}". Preview: ${preview}`,
        key,
        originalError: parseError,
      });
      // Clear corrupted key and return default
      window.localStorage.removeItem(key);
      return getDefaultStorageValue(key);
    }

    const validation = validateStorageData(key, parsed);
    if (!validation.isValid || validation.data === null) {
      emitStorageError({
        type: 'corrupted_data',
        message: `Schema validation failed for key "${key}": ${validation.errors.join('; ')}`,
        key,
      });
      // Clear invalid key and return default
      window.localStorage.removeItem(key);
      return getDefaultStorageValue(key);
    }

    return validation.data;
  } catch (err) {
    emitStorageError({
      type: 'unknown',
      message: `Unexpected error reading localStorage key "${key}"`,
      key,
      originalError: err,
    });
    return getDefaultStorageValue(key);
  }
}

/**
 * Save an item to localStorage with JSON serialization and quota error handling.
 * Validates Requirements 8.1, 8.2, 8.4, 8.8
 */
export function setLocalStorageItem<K extends StorageKey>(
  key: K,
  value: (typeof DEFAULT_STORAGE_VALUES)[K]
): boolean {
  if (!isLocalStorageAvailable()) {
    return false;
  }

  // Validate data schema prior to writing
  const validation = validateStorageData(key, value);
  if (!validation.isValid) {
    emitStorageError({
      type: 'validation_failed',
      message: `Validation failed prior to write for key "${key}": ${validation.errors.join('; ')}`,
      key,
    });
    return false;
  }

  try {
    const serialized = serializeJSON(value);
    window.localStorage.setItem(key, serialized);
    // Dispatch local event for same-window reactive hooks
    window.dispatchEvent(new CustomEvent('nocturneum-storage', { detail: { key } }));
    return true;
  } catch (error: unknown) {
    // Check if error is QuotaExceededError
    const isQuotaError =
      error instanceof DOMException &&
      (error.name === 'QuotaExceededError' ||
        error.code === 22 ||
        error.name === 'NS_ERROR_DOM_QUOTA_REACHED');

    if (isQuotaError) {
      emitStorageError({
        type: 'quota_exceeded',
        message: 'Storage space full. Please remove old flashcards or clear bestiary log.',
        key,
        originalError: error,
      });
    } else {
      emitStorageError({
        type: 'unknown',
        message: `Failed to write to localStorage for key "${key}"`,
        key,
        originalError: error,
      });
    }
    return false;
  }
}

/**
 * Remove an item from localStorage
 */
export function removeLocalStorageItem(key: StorageKey): void {
  if (!isLocalStorageAvailable()) return;
  try {
    window.localStorage.removeItem(key);
    window.dispatchEvent(new CustomEvent('nocturneum-storage', { detail: { key } }));
  } catch (err) {
    console.error(`Failed to remove key "${key}" from localStorage`, err);
  }
}

/* ==========================================================================
   IndexedDB Bestiary Log Storage with LocalStorage Fallback (Req 8.3, 8.7)
   ========================================================================== */

const DB_NAME = 'nocturneum_db';
const DB_VERSION = 1;
const STORE_NAME = 'bestiary';

/**
 * Checks whether IndexedDB is available and functional in current runtime.
 */
export function isIndexedDBAvailable(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    return 'indexedDB' in window && window.indexedDB !== null;
  } catch {
    return false;
  }
}

/**
 * Open or initialize the Nocturneum IndexedDB instance
 */
function openDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (!isIndexedDBAvailable()) {
      return reject(new Error('IndexedDB is not available'));
    }

    const request = window.indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, { keyPath: 'id' });
        store.createIndex('timestamp', 'timestamp', { unique: false });
        store.createIndex('matchedLanguage', 'matchedLanguage', { unique: false });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

/**
 * Fallback Bestiary implementation using localStorage (Requirement 8.7).
 * Capped to the most recent 50 entries.
 */
const FALLBACK_KEY = 'nocturneum_bestiary' as const;

function getFallbackBestiary(): BestiaryEntry[] {
  return getLocalStorageItem('nocturneum_bestiary') || [];
}

function saveFallbackBestiary(entries: BestiaryEntry[]): void {
  // Sort descending by timestamp and limit to 50
  const sorted = [...entries].sort((a, b) => b.timestamp - a.timestamp).slice(0, 50);
  setLocalStorageItem(FALLBACK_KEY, sorted);
}

/**
 * Add a Bestiary log entry.
 * Attempts IndexedDB first; if unavailable or failing, falls back to localStorage.
 * Validates Requirements 3.9, 3.10, 8.3, 8.7
 */
export async function addBestiaryEntry(entry: BestiaryEntry): Promise<void> {
  const validation = validateBestiaryEntry(entry);
  if (!validation.isValid || !validation.data) {
    throw new Error(`Invalid Bestiary entry: ${validation.errors.join('; ')}`);
  }

  const validEntry = validation.data;

  if (!isIndexedDBAvailable()) {
    const list = getFallbackBestiary();
    // Replace if exists, or append
    const updated = [validEntry, ...list.filter((item) => item.id !== validEntry.id)];
    saveFallbackBestiary(updated);
    return;
  }

  try {
    const db = await openDatabase();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const req = store.put(validEntry);

      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  } catch (error) {
    emitStorageError({
      type: 'indexeddb_unavailable',
      message: 'IndexedDB write failed. Falling back to localStorage.',
      originalError: error,
    });
    // Fallback to localStorage
    const list = getFallbackBestiary();
    const updated = [validEntry, ...list.filter((item) => item.id !== validEntry.id)];
    saveFallbackBestiary(updated);
  }
}

/**
 * Retrieve Bestiary log entries sorted by timestamp descending, limited to `limit` entries (default 50).
 * Validates Requirements 3.11, 8.3, 8.7
 */
export async function getBestiaryEntries(limit: number = 50): Promise<BestiaryEntry[]> {
  if (!isIndexedDBAvailable()) {
    const list = getFallbackBestiary();
    return list.slice(0, limit);
  }

  try {
    const db = await openDatabase();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const index = store.index('timestamp');
      // Open cursor descending (prev)
      const req = index.openCursor(null, 'prev');
      const results: BestiaryEntry[] = [];

      req.onsuccess = (event) => {
        const cursor = (event.target as IDBRequest<IDBCursorWithValue>).result;
        if (cursor && results.length < limit) {
          results.push(cursor.value as BestiaryEntry);
          cursor.continue();
        } else {
          resolve(results);
        }
      };

      req.onerror = () => reject(req.error);
    });
  } catch (error) {
    emitStorageError({
      type: 'indexeddb_unavailable',
      message: 'IndexedDB read failed. Falling back to localStorage.',
      originalError: error,
    });
    const list = getFallbackBestiary();
    return list.slice(0, limit);
  }
}

/**
 * Search bestiary entries by error text or matched language
 */
export async function searchBestiaryEntries(query: string): Promise<BestiaryEntry[]> {
  const allEntries = await getBestiaryEntries(100);
  if (!query.trim()) return allEntries;
  const q = query.toLowerCase();
  return allEntries.filter(
    (e) =>
      e.errorText.toLowerCase().includes(q) ||
      (e.matchedLanguage && e.matchedLanguage.toLowerCase().includes(q)) ||
      (e.detectedPattern && e.detectedPattern.toLowerCase().includes(q))
  );
}

/**
 * Delete a specific entry by ID
 */
export async function deleteBestiaryEntry(id: string): Promise<void> {
  if (!isIndexedDBAvailable()) {
    const list = getFallbackBestiary();
    saveFallbackBestiary(list.filter((e) => e.id !== id));
    return;
  }

  try {
    const db = await openDatabase();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const req = store.delete(id);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  } catch {
    const list = getFallbackBestiary();
    saveFallbackBestiary(list.filter((e) => e.id !== id));
  }
}

/**
 * Clear all Bestiary entries
 */
export async function clearBestiary(): Promise<void> {
  if (!isIndexedDBAvailable()) {
    saveFallbackBestiary([]);
    return;
  }

  try {
    const db = await openDatabase();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const req = store.clear();
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  } catch {
    saveFallbackBestiary([]);
  }
}
