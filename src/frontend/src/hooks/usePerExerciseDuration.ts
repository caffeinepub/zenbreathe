import { useState, useEffect } from 'react';
import { getPerExerciseDurations, setPerExerciseDuration as savePerExerciseDuration } from '../lib/localStorageStore';

const DEFAULT_DURATION = 300; // 5 minutes in seconds

export function usePerExerciseDuration() {
  const [durations, setDurations] = useState<Record<string, number>>({});

  useEffect(() => {
    const stored = getPerExerciseDurations();
    setDurations(stored);
  }, []);

  const getDuration = (exerciseId: string): number => {
    return durations[exerciseId] || DEFAULT_DURATION;
  };

  const setDuration = (exerciseId: string, duration: number) => {
    const newDurations = { ...durations, [exerciseId]: duration };
    setDurations(newDurations);
    savePerExerciseDuration(exerciseId, duration);
  };

  return { getDuration, setDuration };
}
