interface BreathHoldLineChartProps {
  data: { date: string; seconds: number }[];
}

export default function BreathHoldLineChart({ data }: BreathHoldLineChartProps) {
  if (data.length === 0) {
    return (
      <div className="text-center text-muted-foreground py-8">
        No breath hold records yet
      </div>
    );
  }

  const maxSeconds = Math.max(...data.map(d => d.seconds), 1);
  const minSeconds = Math.min(...data.map(d => d.seconds), 0);
  const range = maxSeconds - minSeconds || 1;

  const points = data.map((point, index) => {
    const x = (index / (data.length - 1 || 1)) * 100;
    const y = 100 - ((point.seconds - minSeconds) / range) * 100;
    return { x, y, ...point };
  });

  const pathData = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');

  return (
    <div className="space-y-4">
      <svg viewBox="0 0 100 100" className="w-full h-48" preserveAspectRatio="none">
        <path
          d={pathData}
          fill="none"
          stroke="oklch(var(--primary))"
          strokeWidth="2"
          vectorEffect="non-scaling-stroke"
        />
        {points.map((point, index) => (
          <circle
            key={index}
            cx={point.x}
            cy={point.y}
            r="2"
            fill="oklch(var(--primary))"
            vectorEffect="non-scaling-stroke"
          />
        ))}
      </svg>
      
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>{data[0]?.date}</span>
        <span>{data[data.length - 1]?.date}</span>
      </div>
    </div>
  );
}
