import { Slider } from '@/components/ui/slider';

interface VerticalVolumeControlProps {
  value: number;
  onChange: (value: number) => void;
  label: string;
  icon?: React.ReactNode;
}

export default function VerticalVolumeControl({
  value,
  onChange,
  label,
  icon,
}: VerticalVolumeControlProps) {
  const handleValueChange = (values: number[]) => {
    onChange(values[0]);
  };

  return (
    <div className="flex flex-col items-center">
      <div className="bg-white rounded-3xl px-4 py-8 shadow-lg flex flex-col items-center transition-shadow hover:shadow-xl">
        <div className="h-48 flex items-center mb-4">
          <Slider
            value={[value]}
            onValueChange={handleValueChange}
            min={0}
            max={100}
            step={1}
            orientation="vertical"
            className="h-full"
            aria-label={label}
          />
        </div>
        <div className="text-gray-600 mt-2">
          {icon}
        </div>
      </div>
    </div>
  );
}
