import { useState, useEffect, useRef, useCallback } from 'react';
import { BreathingPattern } from '../lib/breathingPatterns';
import { speak, setVoiceVolume, speakQueued, cancelSpeech } from '../lib/voiceGuidance';
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
  const spokenCountdownNumbers = useRef<Set<number>>(new Set());
  const isInitialCountdown = useRef<boolean>(false);

  // Update voice volume when it changes
  useEffect(() => {
    if (options?.voiceVolume !== undefined) {
      setVoiceVolume(options.voiceVolume / 100);
    }
  }, [options?.voiceVolume]);

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

  const getPhaseLabel = useCallback((phase: Phase): string => {
    switch (phase) {
      case 'inhale': return 'Inhale';
      case 'holdTop': return 'Hold';
      case 'exhale': return 'Exhale';
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

    // Mark that we're no longer in initial countdown
    isInitialCountdown.current = false;

    // Announce phase
    speak(getPhaseLabel(newPhase));
    
    // Haptic feedback
    vibrate(50);
    
    phaseStartRef.current = Date.now();
    
    setState(prev => ({
      ...prev,
      phase: newPhase,
      timeRemaining: duration,
    }));
  }, [getPhaseDuration, getNextPhase, getPhaseLabel, vibrate]);

  const start = useCallback(() => {
    startTimeRef.current = Date.now();
    phaseStartRef.current = Date.now();
    totalPausedDurationRef.current = 0;
    spokenCountdownNumbers.current = new Set();
    isInitialCountdown.current = true;
    
    setState({
      phase: 'inhale',
      timeRemaining: pattern.inhale,
      isRunning: true,
      isPaused: false,
      totalElapsed: 0,
    });

    // No initial announcement - countdown will handle it
    vibrate(50);
  }, [pattern.inhale, vibrate]);

  const pause = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    
    // Cancel any ongoing speech
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
    
    // Cancel any ongoing speech
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

      // Handle initial countdown speech (4 3 2 1)
      if (isInitialCountdown.current && state.phase === 'inhale') {
        const countdownNumber = Math.ceil(timeRemaining);
        if (countdownNumber >= 1 && countdownNumber <= 4 && !spokenCountdownNumbers.current.has(countdownNumber)) {
          spokenCountdownNumbers.current.add(countdownNumber);
          speakQueued(countdownNumber.toString());
        }
      }

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
