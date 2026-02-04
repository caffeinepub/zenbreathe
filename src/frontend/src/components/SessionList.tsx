import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface Session {
  timestamp: number;
  exerciseName: string;
  duration: number;
}

interface SessionListProps {
  sessions: Session[];
}

export default function SessionList({ sessions }: SessionListProps) {
  const formatDuration = (ms: number): string => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}m ${seconds}s`;
  };

  const formatDate = (timestamp: number): string => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (sessions.length === 0) {
    return (
      <p className="text-center text-sm sm:text-base text-muted-foreground py-8">
        No sessions yet. Start a breathing exercise to see your history.
      </p>
    );
  }

  return (
    <div className="overflow-x-auto -mx-3 sm:mx-0">
      <div className="inline-block min-w-full align-middle px-3 sm:px-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-xs sm:text-sm">Date</TableHead>
              <TableHead className="text-xs sm:text-sm">Exercise</TableHead>
              <TableHead className="text-right text-xs sm:text-sm">Duration</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sessions.map((session, index) => (
              <TableRow key={index}>
                <TableCell className="text-xs sm:text-sm whitespace-nowrap">{formatDate(session.timestamp)}</TableCell>
                <TableCell className="text-xs sm:text-sm">{session.exerciseName}</TableCell>
                <TableCell className="text-right text-xs sm:text-sm whitespace-nowrap">{formatDuration(session.duration)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
