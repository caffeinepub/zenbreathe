import { useEffect, useState, useRef } from 'react';
import { useNavigate, useSearch } from '@tanstack/react-router';
import { ArrowLeft, User, Music, Play, Pause } from 'lucide-react';
import { BreathingPattern } from '../lib/breathingPatterns';
import { useBreathingEngine } from '../hooks/useBreathingEngine';
import { useWakeLock } from '../hooks/useWakeLock';
import { AmbientAudioController } from '../lib/ambientAudio';
import { addBreathingSession } from '../lib/localStorageStore';
import { cancelSpeech, setVoiceVolume } from '../lib/voiceGuidance';
import { validateDuration, shouldAllowAutoStop } from '../lib/playerDurationGuards';
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

type AmbientMode = 'off' | 'rain' | 'waves';

export default function Player() {
  const navigate = useNavigate();
  const search = useSearch({ from: '/player' }) as { pattern?: string; color?: string; duration?: string };
  
  const [pattern, setPattern] = useState<BreathingPattern>(DEFAULT_PATTERN);
  const [themeColor, setThemeColor] = useState<string | undefined>(undefined);
  const [isPatternLoaded, setIsPatternLoaded] = useState(false);
  const [targetDuration, setTargetDuration] = useState<number>(0);
  const [ambientMode, setAmbientMode] = useState<AmbientMode>('off');
  const [voiceVolume, setVoiceVolumeState] = useState(80);
  const [ambientVolume, setAmbientVolume] = useState(50);
  const [sessionLogged, setSessionLogged] = useState(false);
  
  const audioControllerRef = useRef<AmbientAudioController | null>(null);
  const sessionStartRef = useRef<number>(0);

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
      const rawDuration = parseInt(search.duration);
      const validatedDuration = validateDuration(rawDuration);
      setTargetDuration(validatedDuration);
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
  const engine = useBreathingEngine(pattern, { voiceVolume });
  useWakeLock(engine.state.isRunning && !engine.state.isPaused);

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

  // Handle ambient mode changes
  useEffect(() => {
    if (!audioControllerRef.current) return;
    
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
  }, [ambientMode]);

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

  const handlePause = () => {
    engine.pause();
  };

  const handleResume = () => {
    engine.resume();
  };

  // Don't render until pattern is loaded
  if (!isPatternLoaded) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-[#F5F5F0] flex flex-col">
      {/* Top - Back Arrow Only */}
      <div className="absolute top-6 left-6 z-10">
        <button
          onClick={handleClose}
          className="w-12 h-12 rounded-full bg-white/80 backdrop-blur-sm shadow-md flex items-center justify-center transition-all active:scale-95 active:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400"
          aria-label="Go back"
        >
          <ArrowLeft className="h-6 w-6 text-gray-700" />
        </button>
      </div>

      {/* Main Content - 3-column flex layout with 5vw gaps */}
      <div className="flex-1 flex items-center justify-center px-4">
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
          <div className="flex-1 flex items-center justify-center min-w-0">
            <BreathingCircle 
              state={engine.state} 
              themeColor={themeColor}
            />
          </div>

          {/* Right Volume Control - Ambient Sound */}
          <div className="flex-shrink-0">
            <VerticalVolumeControl
              value={ambientVolume}
              onChange={setAmbientVolume}
              label="Ambient sound volume"
              icon={<Music className="h-5 w-5" />}
            />
          </div>
        </div>
      </div>

      {/* Bottom - Control Buttons */}
      <div className="pb-12 px-6 flex justify-center">
        {!engine.state.isRunning ? (
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
        ) : engine.state.isPaused ? (
          <button
            onClick={handleResume}
            className="px-12 py-4 rounded-full bg-[#C8D5C8] shadow-lg flex items-center gap-3 transition-all active:scale-95 active:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400"
            aria-label="Resume breathing exercise"
          >
            <Play className="h-5 w-5 text-gray-800" />
            <span className="text-lg font-medium text-gray-800">
              Resume
            </span>
          </button>
        ) : (
          <button
            onClick={handlePause}
            className="px-12 py-4 rounded-full bg-[#C8D5C8] shadow-lg flex items-center gap-3 transition-all active:scale-95 active:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400"
            aria-label="Pause breathing exercise"
          >
            <Pause className="h-5 w-5 text-gray-800" />
            <span className="text-lg font-medium text-gray-800">
              Pause
            </span>
          </button>
        )}
      </div>
    </div>
  );
}
