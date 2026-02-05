import { ReactNode, useState, KeyboardEvent } from 'react';
import { Info, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { BreathingPattern } from '@/lib/breathingPatterns';
import BreathCyclesDurationDialog from './BreathCyclesDurationDialog';

interface HomeExerciseCardProps {
  title: string;
  description: string;
  icon: ReactNode;
  bgColor: string;
  duration: number;
  onDurationChange: (duration: number) => void;
  onStart: () => void;
  onInfoClick?: () => void;
  hideChangeDuration?: boolean;
  pattern?: BreathingPattern;
}

export default function HomeExerciseCard({
  title,
  description,
  icon,
  bgColor,
  duration,
  onDurationChange,
  onStart,
  onInfoClick,
  hideChangeDuration = false,
  pattern,
}: HomeExerciseCardProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleOpenDialog = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsDialogOpen(true);
  };

  const handleSaveDuration = (durationSeconds: number) => {
    onDurationChange(durationSeconds);
  };

  const handleCardClick = () => {
    onStart();
  };

  const handleCardKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onStart();
    }
  };

  const handleInfoClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onInfoClick) {
      onInfoClick();
    }
  };

  return (
    <>
      <div
        role="button"
        tabIndex={0}
        onClick={handleCardClick}
        onKeyDown={handleCardKeyDown}
        className={`relative rounded-2xl sm:rounded-3xl p-4 sm:p-6 flex flex-col justify-between min-h-[280px] sm:min-h-[320px] ${bgColor} transition-transform hover:scale-[1.02] active:scale-[0.98] cursor-pointer focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2`}
      >
        <button 
          className="absolute top-3 right-3 sm:top-4 sm:right-4 text-foreground/60 hover:text-foreground transition-colors z-10"
          onClick={handleInfoClick}
          aria-label="Info"
        >
          <Info className="h-4 w-4 sm:h-5 sm:w-5" />
        </button>

        <div className="flex flex-col">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-white/40 flex items-center justify-center text-foreground/70 mb-3 sm:mb-4">
            <div className="scale-[0.65] sm:scale-75">
              {icon}
            </div>
          </div>

          <div className="space-y-1.5 sm:space-y-2 flex-1">
            <h3 className="text-lg sm:text-xl md:text-2xl font-semibold text-foreground leading-tight">
              {title}
            </h3>
            <p className="text-xs sm:text-sm text-foreground/70 leading-snug">
              {description}
            </p>
          </div>
        </div>

        {!hideChangeDuration && (
          <div className="mt-3 sm:mt-4">
            <Button
              variant="outline"
              size="sm"
              className="w-full bg-white/60 hover:bg-white/80 border-foreground/20 flex items-center justify-center gap-1.5 sm:gap-2 text-xs sm:text-sm h-8 sm:h-9"
              onClick={handleOpenDialog}
            >
              <Clock className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              <span>Change Duration</span>
            </Button>
          </div>
        )}
      </div>

      {pattern && (
        <BreathCyclesDurationDialog
          open={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          pattern={pattern}
          onSave={handleSaveDuration}
        />
      )}
    </>
  );
}
