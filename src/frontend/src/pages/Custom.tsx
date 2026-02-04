import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { BreathingPattern } from '../lib/breathingPatterns';
import CustomPatternForm from '../components/CustomPatternForm';
import { useNavigate } from '@tanstack/react-router';

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

  const handleStartExercise = () => {
    navigate({
      to: '/player',
      search: {
        pattern: JSON.stringify(customPattern),
        color: '#94A3B8', // Default hold color for custom patterns
      },
    });
  };

  return (
    <div className="container max-w-2xl py-8 px-4">
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">Custom Pattern</h2>
        <p className="text-muted-foreground">Create your own breathing rhythm</p>
      </div>

      <div className="space-y-6">
        <div className="bg-card border rounded-lg p-6">
          <CustomPatternForm pattern={customPattern} onChange={setCustomPattern} />
        </div>
        
        <Button onClick={handleStartExercise} className="w-full" size="lg">
          Start Custom Pattern
        </Button>
      </div>
    </div>
  );
}
