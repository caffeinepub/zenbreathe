import { STORAGE_KEYS } from './storageKeys';
import { BreathHoldRecord, BreathingSession } from './sessionTypes';

export function getBreathHoldRecords(): BreathHoldRecord[] {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.BREATH_HOLD_RECORDS);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function addBreathHoldRecord(duration: number): void {
  try {
    const records = getBreathHoldRecords();
    records.push({
      timestamp: Date.now(),
      duration,
    });
    localStorage.setItem(STORAGE_KEYS.BREATH_HOLD_RECORDS, JSON.stringify(records));
  } catch {
    // Silent fail
  }
}

export function getBreathingSessions(): BreathingSession[] {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.BREATHING_SESSIONS);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function addBreathingSession(exerciseName: string, duration: number): void {
  try {
    const sessions = getBreathingSessions();
    sessions.push({
      timestamp: Date.now(),
      exerciseName,
      duration,
    });
    localStorage.setItem(STORAGE_KEYS.BREATHING_SESSIONS, JSON.stringify(sessions));
  } catch {
    // Silent fail
  }
}

export function getPerExerciseDurations(): Record<string, number> {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.PER_EXERCISE_DURATIONS);
    return data ? JSON.parse(data) : {};
  } catch {
    return {};
  }
}

export function setPerExerciseDuration(exerciseId: string, duration: number): void {
  try {
    const durations = getPerExerciseDurations();
    durations[exerciseId] = duration;
    localStorage.setItem(STORAGE_KEYS.PER_EXERCISE_DURATIONS, JSON.stringify(durations));
  } catch {
    // Silent fail
  }
}
