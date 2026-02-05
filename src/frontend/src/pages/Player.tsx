import { useEffect, useState, useRef } from 'react';
import { useNavigate, useSearch } from '@tanstack/react-router';
import { ArrowLeft, User, Music, Play } from 'lucide-react';
import { BreathingPattern, getCycleLengthSeconds } from '../lib/breathingPatterns';
import { useBreathingEngine } from '../hooks/useBreathingEngine';
import { useWakeLock } from '../hooks/useWakeLock';
import { AmbientAudioController } from '../lib/ambientAudio';
import { addBreathingSession } from '../lib/localStorageStore';
import { cancelSpeech, setVoiceVolume } from '../lib/voiceGuidance';
import { validateDuration, shouldAllowAutoStop } from '../lib/playerDurationGuards';
import { 
  getAmbientMode, 
  setAmbientMode, 
  getAmbientVolume, 
  setAmbientVolume as persistAmbientVolume,
  getGuidedMeditationEnabled,
  type AmbientMode 
} from '../lib/settingsStore';
import BreathingCircle from '../components/BreathingCircle';
import VerticalVolumeControl from '../components/VerticalVolumeControl';

// Default pattern to satisfy hook requirements
const DEFAULT_PATTERN: BreathingPattern = {
  id: 'default',
  name: 'Default',
  description: 'Default',
  inhale: 4,
  holdTop: 0,
  exhale: 4,
  holdBottom: 0,
};

export default function Player() {
  const navigate = useNavigate();
  const search = useSearch({ from: '/player' }) as { pattern?: string; color?: string; duration?: string };
  
  const [pattern, setPattern] = useState<BreathingPattern>(DEFAULT_PATTERN);
  const [themeColor, setThemeColor] = useState<string | undefined>(undefined);
  const [isPatternLoaded, setIsPatternLoaded] = useState(false);
  const [targetDuration, setTargetDuration] = useState<number>(0);
  const [ambientMode, setAmbientModeState] = useState<AmbientMode>('off');
  const [voiceVolume, setVoiceVolumeState] = useState(80);
  const [ambientVolume, setAmbientVolumeState] = useState(50);
  const [sessionLogged, setSessionLogged] = useState(false);
  const [guidedMeditationEnabled, setGuidedMeditationEnabled] = useState(true);
  
  const audioControllerRef = useRef<AmbientAudioController | null>(null);
  const sessionStartRef = useRef<number>(0);

  // Load persisted settings on mount
  useEffect(() => {
    setAmbientModeState(getAmbientMode());
    setAmbientVolumeState(getAmbientVolume());
    setGuidedMeditationEnabled(getGuidedMeditationEnabled());
  }, []);

  useEffect(() => {
    if (search.pattern) {
      try {
        const parsed = JSON.parse(search.pattern);
        setPattern(parsed);
        setIsPatternLoaded(true);
      } catch {
        navigate({ to: '/' });
      }
    } else {
      navigate({ to: '/' });
    }
    
    if (search.color) {
      setThemeColor(search.color);
    }
    
    if (search.duration) {
      // Parse duration as a number and validate it
      const rawDuration = Number(search.duration);
      if (!isNaN(rawDuration) && rawDuration > 0) {
        const validatedDuration = validateDuration(rawDuration);
        setTargetDuration(validatedDuration);
      } else {
        console.warn('Invalid duration provided:', search.duration);
        const validatedDuration = validateDuration(undefined);
        setTargetDuration(validatedDuration);
      }
    } else {
      // No duration provided, use safe fallback
      const validatedDuration = validateDuration(undefined);
      setTargetDuration(validatedDuration);
    }
  }, [search.pattern, search.color, search.duration, navigate]);

  useEffect(() => {
    audioControllerRef.current = new AmbientAudioController();
    return () => {
      audioControllerRef.current?.stopAll();
    };
  }, []);

  // Update voice volume in the guidance system
  useEffect(() => {
    setVoiceVolume(voiceVolume / 100);
  }, [voiceVolume]);

  // Always call hooks at the top level
  const engine = useBreathingEngine(pattern, { 
    voiceVolume,
    guidedMeditationEnabled 
  });
  useWakeLock(engine.state.isRunning && !engine.state.isPaused);

  // Compute cycle length from the active pattern
  const cycleLengthSeconds = getCycleLengthSeconds(pattern);

  // Auto-stop when target duration is reached
  useEffect(() => {
    if (
      engine.state.isRunning &&
      !engine.state.isPaused &&
      targetDuration > 0 &&
      shouldAllowAutoStop(engine.state.totalElapsed, targetDuration) &&
      !sessionLogged
    ) {
      engine.stop();
      
      // Log session exactly once
      if (sessionStartRef.current > 0) {
        const duration = Math.floor(engine.state.totalElapsed * 1000);
        addBreathingSession(pattern.name, duration);
        sessionStartRef.current = 0;
        setSessionLogged(true);
      }
    }
  }, [engine.state.isRunning, engine.state.isPaused, engine.state.totalElapsed, targetDuration, pattern.name, sessionLogged, engine]);

  // Handle ambient mode changes with guided meditation gating
  useEffect(() => {
    if (!audioControllerRef.current) return;
    
    // Gate: only play ambient if guided meditation is ON
    if (!guidedMeditationEnabled) {
      audioControllerRef.current.stopAll();
      return;
    }
    
    switch (ambientMode) {
      case 'rain':
        audioControllerRef.current.playRain();
        break;
      case 'waves':
        audioControllerRef.current.playWaves();
        break;
      case 'off':
        audioControllerRef.current.stopAll();
        break;
    }
  }, [ambientMode, guidedMeditationEnabled]);

  // Handle ambient volume changes
  useEffect(() => {
    if (audioControllerRef.current) {
      audioControllerRef.current.setVolume(ambientVolume / 100);
    }
  }, [ambientVolume]);

  const handleClose = () => {
    cancelSpeech();
    
    if (engine.state.isRunning) {
      engine.stop();
    }
    
    // Save session if it was running and not already logged
    if (sessionStartRef.current > 0 && !sessionLogged && engine.state.totalElapsed > 0) {
      const duration = Math.floor(engine.state.totalElapsed * 1000);
      addBreathingSession(pattern.name, duration);
    }
    
    audioControllerRef.current?.stopAll();
    navigate({ to: '/' });
  };

  const handleStart = () => {
    sessionStartRef.current = Date.now();
    setSessionLogged(false);
    engine.start();
  };

  const handleAmbientModeChange = (mode: AmbientMode) => {
    setAmbientModeState(mode);
    setAmbientMode(mode);
  };

  const handleAmbientVolumeChange = (volume: number) => {
    setAmbientVolumeState(volume);
    persistAmbientVolume(volume);
  };

  // Format countdown timer (mm:ss)
  const formatCountdown = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Calculate remaining time
  const remainingTime = Math.max(0, targetDuration - engine.state.totalElapsed);

  // Get phase label for display
  const getPhaseLabel = (): string => {
    if (!engine.state.isRunning) return '';
    
    switch (engine.state.phase) {
      case 'inhale':
        return 'breathe in';
      case 'exhale':
        return 'breathe out';
      case 'holdTop':
      case 'holdBottom':
        return 'hold';
      default:
        return '';
    }
  };

  // Don't render until pattern is loaded
  if (!isPatternLoaded) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-[#F5F5F0] flex flex-col">
      {/* Top - Back Arrow and Countdown Timer */}
      <div className="absolute top-6 left-6 right-6 z-10 flex items-center justify-between">
        <button
          onClick={handleClose}
          className="w-12 h-12 rounded-full bg-white/80 backdrop-blur-sm shadow-md flex items-center justify-center transition-all active:scale-95 active:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400"
          aria-label="Go back"
        >
          <ArrowLeft className="h-6 w-6 text-gray-700" />
        </button>
        
        {/* Countdown Timer */}
        {engine.state.isRunning && targetDuration > 0 && (
          <div className="absolute left-1/2 -translate-x-1/2 text-2xl font-medium text-gray-700">
            {formatCountdown(remainingTime)}
          </div>
        )}
      </div>

      {/* Main Content - 3-column flex layout with 5vw gaps */}
      <div className="flex-1 flex flex-col items-center justify-center px-4">
        <div className="flex items-center justify-center w-full max-w-7xl" style={{ gap: '5vw' }}>
          {/* Left Volume Control - Voice Guidance */}
          <div className="flex-shrink-0">
            <VerticalVolumeControl
              value={voiceVolume}
              onChange={setVoiceVolumeState}
              label="Voice guidance volume"
              icon={<User className="h-5 w-5" />}
            />
          </div>

          {/* Centered Breathing Circle - grows to fill available space */}
          <div className="flex-1 flex flex-col items-center justify-center min-w-0 gap-6">
            <BreathingCircle 
              state={engine.state} 
              themeColor={themeColor}
              sessionDuration={targetDuration}
              cycleLengthSeconds={cycleLengthSeconds}
            />
            
            {/* Phase Label */}
            {engine.state.isRunning && (
              <div className="text-xl font-medium text-gray-600">
                {getPhaseLabel()}
              </div>
            )}
          </div>

          {/* Right Volume Control - Ambient Sound */}
          <div className="flex-shrink-0">
            <VerticalVolumeControl
              value={ambientVolume}
              onChange={handleAmbientVolumeChange}
              label="Ambient sound volume"
              icon={<Music className="h-5 w-5" />}
            />
          </div>
        </div>
      </div>

      {/* Bottom - Control Button (only visible when session is not running) */}
      <div className="pb-12 px-6 flex justify-center">
        {!engine.state.isRunning && (
          <button
            onClick={handleStart}
            className="px-12 py-4 rounded-full bg-[#C8D5C8] shadow-lg flex items-center gap-3 transition-all active:scale-95 active:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400"
            aria-label="Start breathing exercise"
          >
            <Play className="h-5 w-5 text-gray-800" />
            <span className="text-lg font-medium text-gray-800">
              Start
            </span>
          </button>
        )}
      </div>
    </div>
  );
}
