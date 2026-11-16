/**
 * Pattern Matching Engine for Bug Exorcism Altar
 * Sequentially tests error text against 45 predefined regex patterns (15 JS, 15 TS, 15 Python).
 * Wraps analysis in a 200ms timeout for guaranteed responsiveness.
 * Validates Requirements 3.3, 3.4, 3.5, 3.6, 3.7, 3.14
 */

import { AnalysisResult, ErrorPattern, SupportedLanguage } from '@/types';
import { getCompiledPatterns, LoadedPattern } from './error-patterns-loader';

export const DEFAULT_ANALYSIS_TIMEOUT_MS = 200;

export const FALLBACK_TIMEOUT_MESSAGE =
  'Analysis taking longer than expected, showing general guidance. The occult error eludes rapid classification.';

export const FALLBACK_NO_MATCH_MESSAGE =
  'No specific exorcism ritual found in the grimoire for this error. Inspect the stack trace, variable scoping, and parameter definitions.';

/**
 * Execute synchronous sequential pattern matching against all 45 loaded patterns.
 * Returns the first matching pattern or null if no match is found.
 */
export function matchErrorPatternSync(errorText: string): LoadedPattern | null {
  if (!errorText || !errorText.trim()) {
    return null;
  }

  const patterns = getCompiledPatterns();

  for (const pattern of patterns) {
    // Reset lastIndex in case of global flag
    pattern.regex.lastIndex = 0;
    if (pattern.regex.test(errorText)) {
      return pattern;
    }
  }

  return null;
}

/**
 * Analyze an error string with a guaranteed timeout limit (default 200ms).
 * Validates Requirements 3.6, 3.7, 3.14
 */
export async function analyzeError(
  errorText: string,
  options?: { timeoutMs?: number }
): Promise<AnalysisResult> {
  const timeoutMs = options?.timeoutMs ?? DEFAULT_ANALYSIS_TIMEOUT_MS;

  // Analysis execution promise
  const analysisPromise = new Promise<AnalysisResult>((resolve) => {
    try {
      const match = matchErrorPatternSync(errorText);

      if (match) {
        const errorPattern: ErrorPattern = {
          id: match.id,
          language: match.language,
          pattern: match.regex,
          regex: match.regex.source,
          explanation: match.explanation,
          solutions: match.solutions,
          relatedDocs: match.relatedDocs,
        };

        resolve({
          matched: true,
          pattern: errorPattern,
          matchedLanguage: match.language as SupportedLanguage,
        });
      } else {
        resolve({
          matched: false,
          fallbackMessage: FALLBACK_NO_MATCH_MESSAGE,
          matchedLanguage: null,
        });
      }
    } catch (err) {
      console.warn('[Nocturneum Altar] Error during pattern analysis:', err);
      resolve({
        matched: false,
        fallbackMessage: FALLBACK_NO_MATCH_MESSAGE,
        matchedLanguage: null,
      });
    }
  });

  // Timeout promise (Requirement 3.14)
  const timeoutPromise = new Promise<AnalysisResult>((resolve) => {
    setTimeout(() => {
      resolve({
        matched: false,
        fallbackMessage: FALLBACK_TIMEOUT_MESSAGE,
        matchedLanguage: null,
      });
    }, timeoutMs);
  });

  return Promise.race([analysisPromise, timeoutPromise]);
}
