import { ReactNode } from 'react';
import { Info } from 'lucide-react';

interface ExerciseTileCardProps {
  title: string;
  description: string;
  icon: ReactNode;
  bgColor: string;
  onAction: () => void;
}

export default function ExerciseTileCard({
  title,
  description,
  icon,
  bgColor,
  onAction,
}: ExerciseTileCardProps) {
  return (
    <div
      role="button"
      tabIndex={0}
      className={`relative rounded-2xl sm:rounded-3xl p-4 sm:p-6 flex flex-col justify-between min-h-[280px] sm:min-h-[320px] ${bgColor} cursor-pointer transition-transform hover:scale-[1.02] active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2`}
      onClick={onAction}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onAction();
        }
      }}
    >
      <button 
        className="absolute top-3 right-3 sm:top-4 sm:right-4 text-foreground/60 hover:text-foreground transition-colors z-10"
        onClick={(e) => {
          e.stopPropagation();
        }}
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
    </div>
  );
}
