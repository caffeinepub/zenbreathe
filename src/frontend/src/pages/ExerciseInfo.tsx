import { useNavigate, useSearch } from '@tanstack/react-router';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { EXERCISE_INFO_CONTENT } from '../lib/exerciseInfoContent';

export default function ExerciseInfo() {
  const navigate = useNavigate();
  const search = useSearch({ strict: false }) as { exerciseId?: string };
  const exerciseId = search.exerciseId || 'equal-breathing';

  const info = EXERCISE_INFO_CONTENT[exerciseId];

  const handleBack = () => {
    if (window.history.length > 1) {
      window.history.back();
    } else {
      navigate({ to: '/' });
    }
  };

  if (!info) {
    return (
      <div className="container max-w-2xl py-4 px-4 sm:px-6">
        <div className="mb-4">
          <Button
            variant="ghost"
            onClick={handleBack}
            className="flex items-center gap-2 -ml-2"
            aria-label="Go back"
          >
            <ArrowLeft className="h-5 w-5" />
            <span className="font-medium">Back</span>
          </Button>
        </div>
        <p className="text-center text-muted-foreground">
          Exercise information not found. Please select a valid exercise.
        </p>
      </div>
    );
  }

  // Find the instructions section
  const instructionsSection = info.sections.find(
    (section) => section.title === 'Instructions'
  );

  return (
    <div className="container max-w-2xl py-4 px-4 sm:px-6">
      <div className="mb-4">
        <Button
          variant="ghost"
          onClick={handleBack}
          className="flex items-center gap-2 -ml-2"
          aria-label="Go back"
        >
          <ArrowLeft className="h-5 w-5" />
          <span className="font-medium">Back</span>
        </Button>
      </div>

      <div className="space-y-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-3">
            {info.title}
          </h1>
          <p className="text-sm sm:text-base text-foreground/80 leading-relaxed">
            {info.intro}
          </p>
        </div>

        {instructionsSection && (
          <div className="bg-card border rounded-lg p-4 space-y-3">
            <h2 className="text-base font-semibold text-foreground">
              Instructions
            </h2>
            <div className="space-y-3">
              {instructionsSection.content.map((paragraph, pIndex) => (
                <p key={pIndex} className="text-sm text-foreground/80 leading-relaxed">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
        )}

        <Accordion
          type="multiple"
          defaultValue={instructionsSection ? [] : ['section-0']}
          className="w-full space-y-2"
        >
          {info.sections.map((section, index) => (
            <AccordionItem
              key={index}
              value={`section-${index}`}
              className="border rounded-lg px-4 bg-card"
            >
              <AccordionTrigger className="text-sm font-semibold text-foreground/70 hover:text-foreground hover:no-underline py-3">
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
          ))}
        </Accordion>
      </div>
    </div>
  );
}
