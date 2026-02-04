export interface BreathHoldRecord {
  timestamp: number;
  duration: number; // in milliseconds
}

export interface BreathingSession {
  timestamp: number;
  exerciseName: string;
  duration: number; // in milliseconds
}
