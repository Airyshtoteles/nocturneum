'use client';

import { useState, useEffect } from 'react';

export interface PageVisibilityState {
  isVisible: boolean;
  isTabHidden: boolean;
  isSupported: boolean;
}

/**
 * Custom hook to monitor document page visibility state.
 * Gracefully degrades if Page Visibility API is unsupported.
 * Validates Requirement 1.5, 1.6
 */
export function usePageVisibility(): PageVisibilityState {
  const [state, setState] = useState<PageVisibilityState>(() => {
    if (typeof document === 'undefined') {
      return { isVisible: true, isTabHidden: false, isSupported: false };
    }
    const isSupported = typeof document.hidden !== 'undefined';
    const isTabHidden = isSupported ? document.hidden : false;
    return {
      isVisible: !isTabHidden,
      isTabHidden,
      isSupported,
    };
  });

  useEffect(() => {
    if (typeof document === 'undefined' || typeof document.hidden === 'undefined') {
      return;
    }

    const handleVisibilityChange = () => {
      const isTabHidden = document.hidden;
      setState({
        isVisible: !isTabHidden,
        isTabHidden,
        isSupported: true,
      });
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  return state;
}
