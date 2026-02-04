export interface BreathingPattern {
  id: string;
  name: string;
  description: string;
  inhale: number;
  holdTop: number;
  exhale: number;
  holdBottom: number;
}

export const PRESET_PATTERNS: BreathingPattern[] = [
  {
    id: 'equal',
    name: 'Equal Breathing',
    description: '4-4',
    inhale: 4,
    holdTop: 0,
    exhale: 4,
    holdBottom: 0,
  },
  {
    id: 'box',
    name: 'Box Breathing',
    description: '4-4-4-4',
    inhale: 4,
    holdTop: 4,
    exhale: 4,
    holdBottom: 4,
  },
  {
    id: '478',
    name: '4-7-8 Deep Sleep',
    description: '4-7-8',
    inhale: 4,
    holdTop: 7,
    exhale: 8,
    holdBottom: 0,
  },
];
