/**
 * Error Pattern Loader
 * Loads patterns from the JSON file at build time and compiles regexes.
 * Validates Requirements 3.3, 3.4, 3.5
 */

import type { SupportedLanguage } from '@/types';
import patternsData from './error-patterns.json';

export interface LoadedPattern {
  id: string;
  language: SupportedLanguage;
  regex: RegExp;
  explanation: string;
  solutions: string[];
  relatedDocs: string[];
}

let compiledPatterns: LoadedPattern[] | null = null;

/**
 * Compile all regex strings from JSON into RegExp objects.
 * Caches the result for subsequent calls.
 */
export function getCompiledPatterns(): LoadedPattern[] {
  if (compiledPatterns) return compiledPatterns;

  const result: LoadedPattern[] = [];
  const languages: SupportedLanguage[] = ['javascript', 'typescript', 'python'];

  for (const lang of languages) {
    const langPatterns = patternsData.patterns[lang];
    for (const p of langPatterns) {
      try {
        const regex = new RegExp(p.regex, 'i');
        result.push({
          id: p.id,
          language: lang,
          regex,
          explanation: p.explanation,
          solutions: p.solutions,
          relatedDocs: p.relatedDocs || [],
        });
      } catch (err) {
        console.warn(`[Nocturneum Altar] Failed to compile regex for pattern ${p.id}:`, err);
      }
    }
  }

  compiledPatterns = result;
  return result;
}

/**
 * Get pattern count per language.
 */
export function getPatternCounts(): Record<SupportedLanguage, number> {
  const patterns = getCompiledPatterns();
  return {
    javascript: patterns.filter((p) => p.language === 'javascript').length,
    typescript: patterns.filter((p) => p.language === 'typescript').length,
    python: patterns.filter((p) => p.language === 'python').length,
  };
}
