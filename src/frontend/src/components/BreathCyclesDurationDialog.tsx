import { useState, useEffect } from 'react';
import { Minus, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { BreathingPattern, getCycleLengthSeconds } from '@/lib/breathingPatterns';

interface BreathCyclesDurationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  pattern: BreathingPattern;
  onSave: (durationSeconds: number) => void;
}

export default function BreathCyclesDurationDialog({
  open,
  onOpenChange,
  pattern,
  onSave,
}: BreathCyclesDurationDialogProps) {
  const [selectedCycles, setSelectedCycles] = useState(4);

  // Reset to 4 cycles whenever dialog opens
  useEffect(() => {
    if (open) {
      setSelectedCycles(4);
    }
  }, [open]);

  const cycleLengthSeconds = getCycleLengthSeconds(pattern);
  const totalDurationSeconds = selectedCycles * cycleLengthSeconds;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}:${Math.floor((seconds % 1) * 100).toString().padStart(2, '0')}`;
  };

  const handleIncrement = () => {
    setSelectedCycles((prev) => prev + 1);
  };

  const handleDecrement = () => {
    setSelectedCycles((prev) => Math.max(1, prev - 1));
  };

  const handlePresetClick = (cycles: number) => {
    setSelectedCycles(cycles);
  };

  const handleSave = () => {
    onSave(totalDurationSeconds);
    onOpenChange(false);
  };

  const handleCancel = () => {
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[90vw] sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-base sm:text-lg text-center">
            Breath Cycles & Duration
          </DialogTitle>
        </DialogHeader>

        <div className="py-6 sm:py-8">
          {/* Center circle with cycle count and time */}
          <div className="flex items-center justify-center gap-4 sm:gap-6 mb-6 sm:mb-8">
            {/* Minus button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={handleDecrement}
              className="h-10 w-10 sm:h-12 sm:w-12 rounded-full hover:bg-muted"
              aria-label="Decrease cycles"
            >
              <Minus className="h-5 w-5 sm:h-6 sm:w-6" />
            </Button>

            {/* Center readout circle */}
            <div className="relative w-40 h-40 sm:w-48 sm:h-48 rounded-full border-2 border-muted flex flex-col items-center justify-center">
              <div className="text-2xl sm:text-3xl font-semibold text-foreground">
                {selectedCycles} Cycle{selectedCycles !== 1 ? 's' : ''}
              </div>
              <div className="text-base sm:text-lg text-muted-foreground mt-1">
                {formatTime(totalDurationSeconds)}
              </div>
              {/* Small indicator dot at top */}
              <div className="absolute top-2 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-primary" />
            </div>

            {/* Plus button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={handleIncrement}
              className="h-10 w-10 sm:h-12 sm:w-12 rounded-full hover:bg-muted"
              aria-label="Increase cycles"
            >
              <Plus className="h-5 w-5 sm:h-6 sm:w-6" />
            </Button>
          </div>

          {/* Preset buttons */}
          <div className="flex items-center justify-center gap-2 sm:gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePresetClick(2)}
              className={`text-xs sm:text-sm px-3 sm:px-4 ${
                selectedCycles === 2 ? 'bg-muted' : ''
              }`}
            >
              2 Cycles
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePresetClick(6)}
              className={`text-xs sm:text-sm px-3 sm:px-4 ${
                selectedCycles === 6 ? 'bg-muted' : ''
              }`}
            >
              6 Cycles
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePresetClick(10)}
              className={`text-xs sm:text-sm px-3 sm:px-4 ${
                selectedCycles === 10 ? 'bg-muted' : ''
              }`}
            >
              10 Cycles
            </Button>
          </div>
        </div>

        <DialogFooter className="flex-row justify-between sm:justify-between gap-2">
          <Button
            variant="ghost"
            onClick={handleCancel}
            className="text-sm font-semibold text-primary hover:text-primary/80"
          >
            CANCEL
          </Button>
          <Button
            variant="ghost"
            onClick={handleSave}
            className="text-sm font-semibold text-primary hover:text-primary/80"
          >
            SAVE
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
