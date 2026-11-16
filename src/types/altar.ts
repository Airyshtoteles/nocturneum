export type SupportedLanguage = 'javascript' | 'typescript' | 'python';

export interface ErrorPattern {
  id: string;
  language: SupportedLanguage;
  pattern?: RegExp;
  regex?: string; // string representation for JSON storage/transfer
  explanation: string;
  solutions: string[];
  relatedDocs?: string[];
}

export interface ErrorPatternDB {
  version: number;
  patterns: {
    javascript: ErrorPattern[];
    typescript: ErrorPattern[];
    python: ErrorPattern[];
  };
}

export interface BestiaryEntry {
  id: string; // UUID v4
  timestamp: number;
  errorText: string;
  detectedPattern: string | null;
  matchedLanguage: SupportedLanguage | string | null;
}

export type BestiaryLogEntry = BestiaryEntry;

export interface AnalysisResult {
  matched: boolean;
  pattern?: ErrorPattern;
  fallbackMessage?: string;
  matchedLanguage?: SupportedLanguage | null;
}

export interface AltarState {
  inputValue: string;
  isAnalyzing: boolean;
  currentResult: AnalysisResult | null;
  bestiaryLog: BestiaryEntry[];
  selectedEntry: BestiaryEntry | null;
}

export interface BugExorcismAltarProps {
  judgeMode?: boolean;
}
