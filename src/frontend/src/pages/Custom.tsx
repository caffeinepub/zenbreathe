import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { BreathingPattern, getCycleLengthSeconds } from '../lib/breathingPatterns';
import CustomPatternForm from '../components/CustomPatternForm';
import { useNavigate } from '@tanstack/react-router';
import { Minus, Plus } from 'lucide-react';

export default function Custom() {
  const navigate = useNavigate();
  const [customPattern, setCustomPattern] = useState<BreathingPattern>({
    id: 'custom',
    name: 'Custom Pattern',
    description: 'Custom',
    inhale: 4,
    holdTop: 4,
    exhale: 4,
    holdBottom: 4,
  });
  const [numberOfCycles, setNumberOfCycles] = useState(4);

  const handleStartExercise = () => {
    const cycleLengthSeconds = getCycleLengthSeconds(customPattern);
    const durationSeconds = numberOfCycles * cycleLengthSeconds;

    navigate({
      to: '/player',
      search: {
        pattern: JSON.stringify(customPattern),
        color: '#94A3B8', // Default hold color for custom patterns
        duration: durationSeconds,
      },
    });
  };

  const handleIncrement = () => {
    setNumberOfCycles((prev) => prev + 1);
  };

  const handleDecrement = () => {
    setNumberOfCycles((prev) => Math.max(1, prev - 1));
  };

  return (
    <div className="container max-w-2xl py-8 px-4">
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">Custom Pattern</h2>
        <p className="text-muted-foreground">Create your own breathing rhythm</p>
      </div>

      <div className="space-y-6">
        <div className="bg-card border rounded-lg p-6 space-y-6">
          <CustomPatternForm pattern={customPattern} onChange={setCustomPattern} />
          
          <div className="pt-4 border-t">
            <label className="block text-sm font-medium mb-3">Number of Cycles</label>
            <div className="flex items-center justify-center gap-4">
              <Button
                variant="outline"
                size="icon"
                onClick={handleDecrement}
                disabled={numberOfCycles <= 1}
                aria-label="Decrease cycles"
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="text-2xl font-semibold w-16 text-center">{numberOfCycles}</span>
              <Button
                variant="outline"
                size="icon"
                onClick={handleIncrement}
                aria-label="Increase cycles"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
        
        <Button onClick={handleStartExercise} className="w-full" size="lg">
          Start Custom Pattern
        </Button>
      </div>
    </div>
  );
}
