interface WeeklyMinutesBarChartProps {
  data: { date: string; minutes: number }[];
}

export default function WeeklyMinutesBarChart({ data }: WeeklyMinutesBarChartProps) {
  const maxMinutes = Math.max(...data.map(d => d.minutes), 1);

  return (
    <div className="space-y-4">
      <div className="flex items-end justify-between gap-2 h-48">
        {data.map((day, index) => {
          const heightPercent = (day.minutes / maxMinutes) * 100;
          
          return (
            <div key={index} className="flex-1 flex flex-col items-center gap-2">
              <div className="w-full flex items-end justify-center h-40">
                <div
                  className="w-full bg-primary rounded-t transition-all duration-300"
                  style={{ height: `${heightPercent}%`, minHeight: day.minutes > 0 ? '4px' : '0' }}
                />
              </div>
              <div className="text-xs text-muted-foreground text-center">{day.date}</div>
              <div className="text-sm font-medium">{day.minutes}m</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
