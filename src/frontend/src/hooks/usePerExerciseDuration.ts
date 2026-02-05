import { useState } from 'react';
import { getPerExerciseDurations, setPerExerciseDuration as savePerExerciseDuration } from '../lib/localStorageStore';

const DEFAULT_DURATION = 300; // 5 minutes in seconds

export function usePerExerciseDuration() {
  // Initialize state synchronously from localStorage using lazy initializer
  const [durations, setDurations] = useState<Record<string, number>>(() => {
    return getPerExerciseDurations();
  });

  const getDuration = (exerciseId: string): number => {
    // Use nullish coalescing to avoid issues with falsy values
    return durations[exerciseId] ?? DEFAULT_DURATION;
  };

  const setDuration = (exerciseId: string, duration: number) => {
    const newDurations = { ...durations, [exerciseId]: duration };
    setDurations(newDurations);
    savePerExerciseDuration(exerciseId, duration);
  };

  return { getDuration, setDuration };
}
