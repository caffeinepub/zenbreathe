interface SegmentedCircumferenceProgressProps {
  totalDurationSeconds: number;
  elapsedSeconds: number;
  radius: number;
  strokeWidth: number;
  className?: string;
}

export default function SegmentedCircumferenceProgress({
  totalDurationSeconds,
  elapsedSeconds,
  radius,
  strokeWidth,
  className = '',
}: SegmentedCircumferenceProgressProps) {
  const totalSegments = Math.ceil(totalDurationSeconds / 8);
  const filledSegments = Math.min(Math.floor(elapsedSeconds / 8), totalSegments);
  
  const circumference = 2 * Math.PI * radius;
  const segmentLength = circumference / totalSegments;
  const gapLength = segmentLength * 0.05; // 5% gap between segments
  const dashLength = segmentLength - gapLength;
  
  const center = radius + strokeWidth;
  const viewBoxSize = (radius + strokeWidth) * 2;
  
  return (
    <svg
      width="100%"
      height="100%"
      viewBox={`0 0 ${viewBoxSize} ${viewBoxSize}`}
      className={className}
      style={{ position: 'absolute', top: 0, left: 0 }}
    >
      {/* Background segments (unfilled) */}
      <circle
        cx={center}
        cy={center}
        r={radius}
        fill="none"
        stroke="rgba(0, 0, 0, 0.1)"
        strokeWidth={strokeWidth}
        strokeDasharray={`${dashLength} ${gapLength}`}
        strokeLinecap="butt"
        transform={`rotate(-90 ${center} ${center})`}
      />
      
      {/* Filled segments */}
      {filledSegments > 0 && (
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke="rgba(0, 0, 0, 0.3)"
          strokeWidth={strokeWidth}
          strokeDasharray={`${dashLength} ${gapLength}`}
          strokeDashoffset={circumference - (filledSegments * segmentLength)}
          strokeLinecap="butt"
          transform={`rotate(-90 ${center} ${center})`}
        />
      )}
    </svg>
  );
}
