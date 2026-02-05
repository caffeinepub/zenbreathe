import { useState, useEffect, useRef, useCallback } from 'react';
import { BreathingPattern } from '../lib/breathingPatterns';
import { speak, cancelSpeech } from '../lib/voiceGuidance';
import { useHaptics } from './useHaptics';

export type Phase = 'inhale' | 'holdTop' | 'exhale' | 'holdBottom';

export interface BreathingState {
  phase: Phase;
  timeRemaining: number;
  isRunning: boolean;
  isPaused: boolean;
  totalElapsed: number; // in seconds
}

export interface BreathingEngineOptions {
  voiceVolume?: number;
  guidedMeditationEnabled?: boolean;
}

export function useBreathingEngine(pattern: BreathingPattern, options?: BreathingEngineOptions) {
  const [state, setState] = useState<BreathingState>({
    phase: 'inhale',
    timeRemaining: pattern.inhale,
    isRunning: false,
    isPaused: false,
    totalElapsed: 0,
  });

  const { vibrate } = useHaptics();
  const intervalRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(0);
  const phaseStartRef = useRef<number>(0);
  const pausedTimeRef = useRef<number>(0);
  const totalPausedDurationRef = useRef<number>(0);

  const getNextPhase = useCallback((currentPhase: Phase): Phase => {
    const sequence: Phase[] = ['inhale', 'holdTop', 'exhale', 'holdBottom'];
    const currentIndex = sequence.indexOf(currentPhase);
    return sequence[(currentIndex + 1) % sequence.length];
  }, []);

  const getPhaseDuration = useCallback((phase: Phase): number => {
    switch (phase) {
      case 'inhale': return pattern.inhale;
      case 'holdTop': return pattern.holdTop;
      case 'exhale': return pattern.exhale;
      case 'holdBottom': return pattern.holdBottom;
    }
  }, [pattern]);

  const getPhaseGuidance = useCallback((phase: Phase): string => {
    switch (phase) {
      case 'inhale': return 'Breathe in';
      case 'holdTop': return 'Hold';
      case 'exhale': return 'Breathe out';
      case 'holdBottom': return 'Hold';
    }
  }, []);

  const transitionToPhase = useCallback((newPhase: Phase) => {
    const duration = getPhaseDuration(newPhase);
    
    // Skip phases with 0 duration
    if (duration === 0) {
      const nextPhase = getNextPhase(newPhase);
      transitionToPhase(nextPhase);
      return;
    }

    // Announce phase with guidance prompt only if guided meditation is enabled
    const guidedEnabled = options?.guidedMeditationEnabled ?? true;
    if (guidedEnabled) {
      const normalizedVolume = (options?.voiceVolume ?? 80) / 100;
      // Only speak if volume is above 0
      if (normalizedVolume > 0) {
        speak(getPhaseGuidance(newPhase));
      }
    }
    
    // Haptic feedback (always active regardless of voice guidance)
    vibrate(50);
    
    phaseStartRef.current = Date.now();
    
    setState(prev => ({
      ...prev,
      phase: newPhase,
      timeRemaining: duration,
    }));
  }, [getPhaseDuration, getNextPhase, getPhaseGuidance, vibrate, options?.guidedMeditationEnabled, options?.voiceVolume]);

  const start = useCallback(() => {
    startTimeRef.current = Date.now();
    phaseStartRef.current = Date.now();
    totalPausedDurationRef.current = 0;
    
    setState({
      phase: 'inhale',
      timeRemaining: pattern.inhale,
      isRunning: true,
      isPaused: false,
      totalElapsed: 0,
    });

    // Announce initial phase only if guided meditation is enabled
    const guidedEnabled = options?.guidedMeditationEnabled ?? true;
    if (guidedEnabled) {
      const normalizedVolume = (options?.voiceVolume ?? 80) / 100;
      // Only speak if volume is above 0
      if (normalizedVolume > 0) {
        speak(getPhaseGuidance('inhale'));
      }
    }
    vibrate(50);
  }, [pattern.inhale, vibrate, getPhaseGuidance, options?.guidedMeditationEnabled, options?.voiceVolume]);

  const pause = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    
    // Cancel any ongoing speech on pause
    cancelSpeech();
    
    pausedTimeRef.current = Date.now();
    
    setState(prev => ({
      ...prev,
      isPaused: true,
    }));
  }, []);

  const resume = useCallback(() => {
    if (pausedTimeRef.current > 0) {
      const pauseDuration = Date.now() - pausedTimeRef.current;
      totalPausedDurationRef.current += pauseDuration;
      pausedTimeRef.current = 0;
    }
    
    phaseStartRef.current = Date.now();
    
    setState(prev => ({
      ...prev,
      isPaused: false,
    }));
  }, []);

  const stop = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    
    // Cancel any ongoing speech on stop
    cancelSpeech();
    
    setState(prev => ({
      ...prev,
      isRunning: false,
      isPaused: false,
    }));
  }, []);

  useEffect(() => {
    if (!state.isRunning || state.isPaused) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    intervalRef.current = window.setInterval(() => {
      const now = Date.now();
      const totalElapsedMs = now - startTimeRef.current - totalPausedDurationRef.current;
      const totalElapsedSeconds = totalElapsedMs / 1000; // Convert to seconds
      const phaseElapsed = (now - phaseStartRef.current) / 1000;
      const phaseDuration = getPhaseDuration(state.phase);
      const timeRemaining = Math.max(0, phaseDuration - phaseElapsed);

      if (timeRemaining <= 0) {
        // Transition to next phase
        const nextPhase = getNextPhase(state.phase);
        transitionToPhase(nextPhase);
      } else {
        setState(prev => ({
          ...prev,
          timeRemaining,
          totalElapsed: totalElapsedSeconds,
        }));
      }
    }, 100);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [state.isRunning, state.isPaused, state.phase, getPhaseDuration, getNextPhase, transitionToPhase]);

  return {
    state,
    start,
    pause,
    resume,
    stop,
  };
}
