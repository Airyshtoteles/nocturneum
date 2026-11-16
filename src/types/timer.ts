export interface CandleTimerProps {
  initialDuration?: number; // minutes
  judgeMode?: boolean;
  onComplete?: () => void;
}

export interface CandleTimerState {
  remainingTime: number; // seconds
  isActive: boolean;
  isPaused: boolean;
  isTabVisible: boolean;
  candleHeight: number; // percentage 0-100
}

export interface StoredTimerSession {
  startTime: number; // timestamp
  duration: number; // seconds
  elapsed: number; // seconds
}

export interface StoredTimerState {
  duration: number; // user's preferred session length in minutes
  lastActiveSession: StoredTimerSession | null;
}

export interface TimerConfig {
  preferredDuration: number; // minutes, 1-120
  activeSession: StoredTimerSession | null;
}
