'use client';

import { useState, useEffect, useCallback, useSyncExternalStore } from 'react';
import { isJudgeModeActive, getJudgeTimeMultiplier } from '@/lib/judge-mode/mode-detector';
import { seedDemoData, hasDemoDataBeenSeeded } from '@/lib/judge-mode/demo-seeder';

function subscribeToHistory(callback: () => void) {
  if (typeof window === 'undefined') return () => {};
  window.addEventListener('popstate', callback);
  return () => window.removeEventListener('popstate', callback);
}

function getJudgeModeSnapshot(): boolean {
  return isJudgeModeActive();
}

function getJudgeModeServerSnapshot(): boolean {
  return false;
}

export interface UseJudgeModeResult {
  isJudgeMode: boolean;
  timeMultiplier: number;
  isSeeding: boolean;
  isSeeded: boolean;
  seedNow: (overwrite?: boolean) => Promise<void>;
}

/**
 * Hook to detect and manage Judge Mode.
 * Reads ?mode=judge parameter, triggers demo seeding, and supplies 60x time multiplier.
 * Validates Requirements 7.1, 7.2, 7.3, 7.4, 7.5, 7.6, 7.7, 7.9
 */
export function useJudgeMode(): UseJudgeModeResult {
  const isJudgeMode = useSyncExternalStore(
    subscribeToHistory,
    getJudgeModeSnapshot,
    getJudgeModeServerSnapshot
  );

  const [isSeeding, setIsSeeding] = useState<boolean>(false);
  const [isSeeded, setIsSeeded] = useState<boolean>(() => hasDemoDataBeenSeeded());

  const performSeed = useCallback(async (overwrite = false) => {
    setIsSeeding(true);
    try {
      await seedDemoData({ overwrite });
      setIsSeeded(true);
    } catch (err) {
      console.error('[Nocturneum Judge Mode] Failed to seed demo data:', err);
    } finally {
      setIsSeeding(false);
    }
  }, []);

  useEffect(() => {
    let mounted = true;

    if (isJudgeMode && !hasDemoDataBeenSeeded()) {
      const timer = setTimeout(() => {
        if (!mounted) return;
        setIsSeeding(true);
        seedDemoData()
          .then(() => {
            if (mounted) setIsSeeded(true);
          })
          .catch((err) => {
            console.error('[Nocturneum Judge Mode] Auto-seed failed:', err);
          })
          .finally(() => {
            if (mounted) setIsSeeding(false);
          });
      }, 0);

      return () => {
        mounted = false;
        clearTimeout(timer);
      };
    }
  }, [isJudgeMode]);

  return {
    isJudgeMode,
    timeMultiplier: getJudgeTimeMultiplier(isJudgeMode),
    isSeeding,
    isSeeded,
    seedNow: performSeed,
  };
}
