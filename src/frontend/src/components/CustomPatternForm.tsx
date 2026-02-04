import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { BreathingPattern } from '../lib/breathingPatterns';

interface CustomPatternFormProps {
  pattern: BreathingPattern;
  onChange: (pattern: BreathingPattern) => void;
}

export default function CustomPatternForm({ pattern, onChange }: CustomPatternFormProps) {
  const handleChange = (field: keyof BreathingPattern, value: number) => {
    onChange({
      ...pattern,
      [field]: Math.max(0, value),
    });
  };

  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label htmlFor="inhale">Inhale (s)</Label>
        <Input
          id="inhale"
          type="number"
          step="0.5"
          min="0"
          value={pattern.inhale}
          onChange={(e) => handleChange('inhale', parseFloat(e.target.value) || 0)}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="holdTop">Hold (Top) (s)</Label>
        <Input
          id="holdTop"
          type="number"
          step="0.5"
          min="0"
          value={pattern.holdTop}
          onChange={(e) => handleChange('holdTop', parseFloat(e.target.value) || 0)}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="exhale">Exhale (s)</Label>
        <Input
          id="exhale"
          type="number"
          step="0.5"
          min="0"
          value={pattern.exhale}
          onChange={(e) => handleChange('exhale', parseFloat(e.target.value) || 0)}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="holdBottom">Hold (Bottom) (s)</Label>
        <Input
          id="holdBottom"
          type="number"
          step="0.5"
          min="0"
          value={pattern.holdBottom}
          onChange={(e) => handleChange('holdBottom', parseFloat(e.target.value) || 0)}
        />
      </div>
    </div>
  );
}
