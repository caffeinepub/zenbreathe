import { PRESET_PATTERNS, BreathingPattern } from '../lib/breathingPatterns';
import HomeExerciseCard from '../components/HomeExerciseCard';
import { useNavigate } from '@tanstack/react-router';
import { Minus, Square, Navigation, Pause } from 'lucide-react';
import { usePerExerciseDuration } from '../hooks/usePerExerciseDuration';

// Map pattern IDs to exerciseInfo IDs
const PATTERN_TO_EXERCISE_ID_MAP: Record<string, string> = {
  'equal': 'equal-breathing',
  'box': 'box-breathing',
  '478': '4-7-8',
};

export default function Home() {
  const navigate = useNavigate();
  const { getDuration, setDuration } = usePerExerciseDuration();

  const handleStartExercise = (pattern: BreathingPattern, color: string) => {
    const duration = getDuration(pattern.id);
    navigate({
      to: '/player',
      search: {
        pattern: JSON.stringify(pattern),
        color,
        duration: duration.toString(),
      },
    });
  };

  const handleNavigateToTest = () => {
    navigate({ to: '/test' });
  };

  const handleNavigateToInfo = (patternId: string) => {
    const exerciseId = PATTERN_TO_EXERCISE_ID_MAP[patternId] || patternId;
    navigate({
      to: '/exercise-info',
      search: { exerciseId },
    });
  };

  const tileData = [
    {
      pattern: PRESET_PATTERNS[0], // Equal Breathing
      icon: <Minus className="h-10 w-10 sm:h-12 sm:w-12" />,
      bgColor: 'bg-tile-equal',
      themeColor: 'oklch(var(--tile-equal))',
      description: 'Equal Breathing helps you to relax and focus.',
    },
    {
      pattern: PRESET_PATTERNS[1], // Box Breathing
      icon: <Square className="h-10 w-10 sm:h-12 sm:w-12" />,
      bgColor: 'bg-tile-box',
      themeColor: 'oklch(var(--tile-box))',
      description: 'Box Breathing is a powerful stress reliever.',
    },
    {
      pattern: PRESET_PATTERNS[2], // 4-7-8
      icon: <Navigation className="h-10 w-10 sm:h-12 sm:w-12" />,
      bgColor: 'bg-tile-478',
      themeColor: 'oklch(var(--tile-478))',
      description: '4-7-8 Breathing promotes better sleep.',
    },
  ];

  return (
    <div className="container max-w-2xl py-4 sm:py-6 px-3 sm:px-4">
      <div className="grid grid-cols-1 xs:grid-cols-2 gap-3 sm:gap-4">
        {tileData.map((tile) => (
          <HomeExerciseCard
            key={tile.pattern.id}
            title={tile.pattern.name}
            description={tile.description}
            icon={tile.icon}
            bgColor={tile.bgColor}
            duration={getDuration(tile.pattern.id)}
            onDurationChange={(newDuration) => setDuration(tile.pattern.id, newDuration)}
            onStart={() => handleStartExercise(tile.pattern, tile.themeColor)}
            onInfoClick={() => handleNavigateToInfo(tile.pattern.id)}
          />
        ))}
        
        <HomeExerciseCard
          title="Breath Holding Test"
          description="Test your breath-holding capacity."
          icon={<Pause className="h-10 w-10 sm:h-12 sm:w-12" />}
          bgColor="bg-tile-test"
          duration={0}
          onDurationChange={() => {}}
          onStart={handleNavigateToTest}
          onInfoClick={() => handleNavigateToInfo('breath-holding-test')}
          hideChangeDuration
        />
      </div>
    </div>
  );
}
