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

/**
 * Compute the total cycle length for a breathing pattern.
 * Includes all phases: inhale + holdTop + exhale + holdBottom.
 * Returns a safe non-zero fallback (8 seconds) if the computed value is invalid or zero.
 */
export function getCycleLengthSeconds(pattern: BreathingPattern): number {
  const cycleLength = pattern.inhale + pattern.holdTop + pattern.exhale + pattern.holdBottom;
  
  // Validate and return safe fallback if invalid
  if (!cycleLength || cycleLength <= 0 || !isFinite(cycleLength)) {
    console.warn('Invalid cycle length computed, using fallback of 8 seconds', pattern);
    return 8;
  }
  
  return cycleLength;
}
