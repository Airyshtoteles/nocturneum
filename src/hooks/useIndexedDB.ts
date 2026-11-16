'use client';

import { useState, useEffect, useCallback } from 'react';
import { BestiaryEntry } from '@/types';
import {
  getBestiaryEntries,
  addBestiaryEntry,
  deleteBestiaryEntry,
  clearBestiary,
  isIndexedDBAvailable,
} from '@/lib/storage';

export interface UseIndexedDBResult {
  entries: BestiaryEntry[];
  isLoading: boolean;
  error: string | null;
  isFallback: boolean;
  addEntry: (entry: BestiaryEntry) => Promise<void>;
  deleteEntry: (id: string) => Promise<void>;
  clearAll: () => Promise<void>;
  refresh: () => Promise<void>;
}

/**
 * Custom hook to interface with Bestiary Log storage.
 * Automatically utilizes IndexedDB when supported, or falls back to localStorage.
 * Validates Requirements 3.9, 3.10, 3.11, 8.3, 8.7
 */
export function useIndexedDB(limit: number = 50): UseIndexedDBResult {
  const [entries, setEntries] = useState<BestiaryEntry[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const isFallback = typeof window !== 'undefined' && !isIndexedDBAvailable();

  const refresh = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const items = await getBestiaryEntries(limit);
      setEntries(items);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load bestiary entries');
    } finally {
      setIsLoading(false);
    }
  }, [limit]);

  useEffect(() => {
    let mounted = true;

    getBestiaryEntries(limit)
      .then((items) => {
        if (mounted) {
          setEntries(items);
          setIsLoading(false);
        }
      })
      .catch((err) => {
        if (mounted) {
          setError(err instanceof Error ? err.message : 'Failed to load bestiary entries');
          setIsLoading(false);
        }
      });

    return () => {
      mounted = false;
    };
  }, [limit]);

  const add = useCallback(
    async (entry: BestiaryEntry) => {
      try {
        await addBestiaryEntry(entry);
        await refresh();
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to add entry');
        throw err;
      }
    },
    [refresh]
  );

  const remove = useCallback(
    async (id: string) => {
      try {
        await deleteBestiaryEntry(id);
        await refresh();
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to delete entry');
        throw err;
      }
    },
    [refresh]
  );

  const clear = useCallback(async () => {
    try {
      await clearBestiary();
      setEntries([]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to clear bestiary');
      throw err;
    }
  }, []);

  return {
    entries,
    isLoading,
    error,
    isFallback,
    addEntry: add,
    deleteEntry: remove,
    clearAll: clear,
    refresh,
  };
}
