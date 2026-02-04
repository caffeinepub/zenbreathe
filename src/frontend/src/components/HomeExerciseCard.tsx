import { ReactNode, useState, KeyboardEvent } from 'react';
import { Info, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

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
}: HomeExerciseCardProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [tempDuration, setTempDuration] = useState(duration);

  const handleOpenDialog = (e: React.MouseEvent) => {
    e.stopPropagation();
    setTempDuration(duration);
    setIsDialogOpen(true);
  };

  const handleSaveDuration = () => {
    if (tempDuration > 0) {
      onDurationChange(tempDuration);
    }
    setIsDialogOpen(false);
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

  const formatDuration = (seconds: number) => {
    if (seconds === 0) return '5 min';
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    if (secs === 0) return `${minutes} min`;
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
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

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-[90vw] sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base sm:text-lg">Set Duration</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Label htmlFor="duration" className="text-xs sm:text-sm font-medium">
              Duration (seconds)
            </Label>
            <Input
              id="duration"
              type="number"
              min="30"
              max="3600"
              step="30"
              value={tempDuration}
              onChange={(e) => setTempDuration(parseInt(e.target.value) || 300)}
              className="mt-2 text-sm sm:text-base"
            />
            <p className="text-xs text-muted-foreground mt-2">
              Current: {formatDuration(tempDuration)}
            </p>
          </div>
          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button variant="outline" onClick={() => setIsDialogOpen(false)} className="text-sm">
              Cancel
            </Button>
            <Button onClick={handleSaveDuration} className="text-sm">
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
