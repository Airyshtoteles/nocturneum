/**
 * Judge Mode Detector
 * Inspects URL parameters to activate hackathon judge mode.
 * Validates Requirement 7.1, 7.6
 */

export const JUDGE_PARAM_KEY = 'mode';
export const JUDGE_PARAM_VALUE = 'judge';
export const JUDGE_TIME_MULTIPLIER = 60;

/**
 * Check if the provided search parameters or query string activate judge mode.
 */
export function isJudgeModeFromSearch(search: string | URLSearchParams): boolean {
  try {
    const params = typeof search === 'string' ? new URLSearchParams(search) : search;
    const mode = params.get(JUDGE_PARAM_KEY);
    if (!mode) return false;

    if (mode === JUDGE_PARAM_VALUE) {
      return true;
    }

    // Whitelist check: if invalid mode parameter provided, log warning and return false
    console.warn(`[Nocturneum Judge Mode] Unrecognized mode parameter: "${mode}". Expected "${JUDGE_PARAM_VALUE}".`);
    return false;
  } catch {
    return false;
  }
}

/**
 * Check if Judge Mode is active in the current browser window location.
 */
export function isJudgeModeActive(): boolean {
  if (typeof window === 'undefined') return false;
  return isJudgeModeFromSearch(window.location.search);
}

/**
 * Get the time multiplier for the current judge mode state.
 * Returns 60 when judge mode is active, 1 otherwise.
 * Validates Requirement 7.6
 */
export function getJudgeTimeMultiplier(isActive: boolean): number {
  return isActive ? JUDGE_TIME_MULTIPLIER : 1;
}
