import { BreathingState } from '../hooks/useBreathingEngine';
import SegmentedCircumferenceProgress from './SegmentedCircumferenceProgress';

interface BreathingCircleProps {
  state: BreathingState;
  themeColor?: string;
  overrideText?: string;
  sessionDuration?: number;
}

export default function BreathingCircle({ state, themeColor, overrideText, sessionDuration }: BreathingCircleProps) {
  const getPhaseColor = () => {
    // If a theme color is provided and we're running, use it
    if (themeColor && state.isRunning) {
      return themeColor;
    }
    
    // Default soft pastel colors matching reference
    switch (state.phase) {
      case 'inhale':
        return '#C8D5C8'; // soft mint/sage green
      case 'exhale':
        return '#D5C8C8'; // soft rose
      case 'holdTop':
      case 'holdBottom':
        return '#C8CED5'; // soft blue-gray
      default:
        return '#C8D5C8';
    }
  };

  const getAnimationClass = () => {
    if (!state.isRunning || state.isPaused) return '';
    
    switch (state.phase) {
      case 'inhale':
        return 'animate-breathe-in';
      case 'exhale':
        return 'animate-breathe-out';
      case 'holdTop':
        return 'animate-breathe-hold-top';
      case 'holdBottom':
        return 'animate-breathe-hold-bottom';
      default:
        return 'animate-breathe-hold-bottom';
    }
  };

  const formatTime = (seconds: number): string => {
    return Math.ceil(seconds).toString();
  };

  const getAnimationDuration = () => {
    return `${state.timeRemaining}s`;
  };

  const displayText = overrideText !== undefined 
    ? overrideText 
    : (state.isRunning ? formatTime(state.timeRemaining) : '—');

  return (
    <div className="relative flex items-center justify-center w-full max-w-md aspect-square">
      {/* Segmented progress ring */}
      {sessionDuration && sessionDuration > 0 && state.isRunning && (
        <SegmentedCircumferenceProgress
          totalDurationSeconds={sessionDuration}
          elapsedSeconds={state.totalElapsed}
          radius={180}
          strokeWidth={8}
          className="pointer-events-none"
        />
      )}
      
      {/* Main breathing circle */}
      <div
        className={`w-full h-full rounded-full flex items-center justify-center transition-all duration-700 ${getAnimationClass()}`}
        style={{
          backgroundColor: getPhaseColor(),
          animationDuration: state.isRunning && !state.isPaused ? getAnimationDuration() : '0s',
        }}
      >
        <div className="text-gray-800 text-6xl sm:text-7xl md:text-8xl font-bold">
          {displayText}
        </div>
      </div>
    </div>
  );
}
