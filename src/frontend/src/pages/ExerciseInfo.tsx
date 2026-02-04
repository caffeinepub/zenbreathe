import { useNavigate, useSearch } from '@tanstack/react-router';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { EXERCISE_INFO_CONTENT } from '../lib/exerciseInfoContent';
import { PRESET_PATTERNS } from '../lib/breathingPatterns';
import { usePerExerciseDuration } from '../hooks/usePerExerciseDuration';

// Map exerciseId to pattern and theme color
const EXERCISE_TO_PATTERN_MAP: Record<string, { patternId: string; color: string }> = {
  'equal-breathing': { patternId: 'equal', color: 'oklch(var(--tile-equal))' },
  'box-breathing': { patternId: 'box', color: 'oklch(var(--tile-box))' },
  '4-7-8': { patternId: '478', color: 'oklch(var(--tile-478))' },
};

export default function ExerciseInfo() {
  const navigate = useNavigate();
  const search = useSearch({ strict: false }) as { exerciseId?: string };
  const exerciseId = search.exerciseId || 'equal-breathing';
  const { getDuration } = usePerExerciseDuration();

  const info = EXERCISE_INFO_CONTENT[exerciseId];

  const handleClose = () => {
    if (window.history.length > 1) {
      window.history.back();
    } else {
      navigate({ to: '/' });
    }
  };

  const handleBeginExercise = () => {
    const mapping = EXERCISE_TO_PATTERN_MAP[exerciseId];
    if (!mapping) return;

    const pattern = PRESET_PATTERNS.find((p) => p.id === mapping.patternId);
    if (!pattern) return;

    const duration = getDuration(pattern.id);
    navigate({
      to: '/player',
      search: {
        pattern: JSON.stringify(pattern),
        color: mapping.color,
        duration: duration.toString(),
      },
    });
  };

  if (!info) {
    return (
      <div className="container max-w-2xl py-4 px-4 sm:px-6">
        <div className="mb-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleClose}
            className="-ml-2"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>
        <p className="text-center text-muted-foreground">
          Exercise information not found. Please select a valid exercise.
        </p>
      </div>
    );
  }

  const isPlayableExercise = exerciseId in EXERCISE_TO_PATTERN_MAP;

  return (
    <div className="container max-w-2xl py-4 px-4 sm:px-6 pb-24">
      <div className="mb-6">
        <Button
          variant="ghost"
          size="icon"
          onClick={handleClose}
          className="-ml-2"
          aria-label="Close"
        >
          <X className="h-5 w-5" />
        </Button>
      </div>

      <div className="space-y-6">
        <div className="text-center space-y-3">
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
            {info.title}
          </h1>
          <p className="text-sm sm:text-base text-foreground/70 leading-relaxed">
            {info.intro}
          </p>
        </div>

        <div className="border-t border-border" />

        <Accordion
          type="multiple"
          defaultValue={[]}
          className="w-full space-y-0"
        >
          {info.sections.map((section, index) => (
            <div key={index}>
              <AccordionItem
                value={`section-${index}`}
                className="border-0"
              >
                <AccordionTrigger className="text-xs font-semibold text-foreground/60 uppercase tracking-wide hover:text-foreground hover:no-underline py-4">
                  {section.title}
                </AccordionTrigger>
                <AccordionContent className="text-sm text-foreground/80 pb-4">
                  <div className="space-y-3">
                    {section.content.map((paragraph, pIndex) => (
                      <p key={pIndex} className="leading-relaxed">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
              {index < info.sections.length - 1 && (
                <div className="border-t border-border" />
              )}
            </div>
          ))}
        </Accordion>

        {isPlayableExercise && (
          <>
            <div className="border-t border-border" />
            <div className="pt-4">
              <Button
                onClick={handleBeginExercise}
                className="w-full py-6 text-base font-semibold"
                size="lg"
              >
                BEGIN EXERCISE
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
