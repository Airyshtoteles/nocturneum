'use client';

import { useSyncExternalStore, useCallback } from 'react';
import { StorageKey, StorageDataMap } from '@/types';
import {
  getLocalStorageItem,
  setLocalStorageItem,
  getDefaultStorageValue,
  isLocalStorageAvailable,
} from '@/lib/storage';

// Memory cache to preserve referential equality for useSyncExternalStore
const snapshotCache = new Map<string, { raw: string | null; parsed: unknown }>();

function getCachedItem<K extends StorageKey>(key: K): StorageDataMap[K] {
  if (!isLocalStorageAvailable()) {
    return getDefaultStorageValue(key);
  }
  const raw = window.localStorage.getItem(key);
  const cached = snapshotCache.get(key);
  if (cached && cached.raw === raw) {
    return cached.parsed as StorageDataMap[K];
  }
  const parsed = getLocalStorageItem(key);
  snapshotCache.set(key, { raw, parsed });
  return parsed;
}

function subscribe(callback: () => void) {
  if (typeof window === 'undefined') return () => {};
  window.addEventListener('storage', callback);
  window.addEventListener('nocturneum-storage', callback);
  return () => {
    window.removeEventListener('storage', callback);
    window.removeEventListener('nocturneum-storage', callback);
  };
}

/**
 * Custom hook to manage state synchronized with localStorage using React 19's useSyncExternalStore.
 * Incorporates schema validation, corrupted data fallback, and quota management.
 * Validates Requirements 8.1, 8.2, 8.4, 8.5, 8.6, 8.8
 */
export function useLocalStorage<K extends StorageKey>(
  key: K
): [StorageDataMap[K], (value: StorageDataMap[K] | ((prev: StorageDataMap[K]) => StorageDataMap[K])) => void] {
  const getSnapshot = useCallback(() => getCachedItem(key), [key]);
  const getServerSnapshot = useCallback(() => getDefaultStorageValue(key), [key]);

  const value = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const setValue = useCallback(
    (updater: StorageDataMap[K] | ((prev: StorageDataMap[K]) => StorageDataMap[K])) => {
      const current = getCachedItem(key);
      const nextValue = typeof updater === 'function' ? (updater as (prev: StorageDataMap[K]) => StorageDataMap[K])(current) : updater;
      setLocalStorageItem(key, nextValue);
    },
    [key]
  );

  return [value, setValue];
}
