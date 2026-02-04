import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { getBreathingSessions, getBreathHoldRecords } from '../lib/localStorageStore';
import { getLast7DaysMinutes, getBreathHoldChartData, getLast10Sessions } from '../lib/statsDerivations';
import WeeklyMinutesBarChart from '../components/charts/WeeklyMinutesBarChart';
import BreathHoldLineChart from '../components/charts/BreathHoldLineChart';

export default function Stats() {
  const [weeklyData, setWeeklyData] = useState<{ date: string; minutes: number }[]>([]);
  const [breathHoldData, setBreathHoldData] = useState<{ date: string; seconds: number }[]>([]);
  const [recentSessions, setRecentSessions] = useState<any[]>([]);

  useEffect(() => {
    const sessions = getBreathingSessions();
    const records = getBreathHoldRecords();
    
    setWeeklyData(getLast7DaysMinutes(sessions));
    setBreathHoldData(getBreathHoldChartData(records));
    setRecentSessions(getLast10Sessions(sessions));
  }, []);

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

  return (
    <div className="container max-w-4xl py-8 px-4">
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">Your Stats</h2>
        <p className="text-muted-foreground">Track your breathing practice progress</p>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Daily Breathing Minutes</CardTitle>
            <CardDescription>Last 7 days</CardDescription>
          </CardHeader>
          <CardContent>
            <WeeklyMinutesBarChart data={weeklyData} />
          </CardContent>
        </Card>

        {breathHoldData.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Breath Hold Duration</CardTitle>
              <CardDescription>Progress over time</CardDescription>
            </CardHeader>
            <CardContent>
              <BreathHoldLineChart data={breathHoldData} />
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Recent Sessions</CardTitle>
            <CardDescription>Last 10 breathing sessions</CardDescription>
          </CardHeader>
          <CardContent>
            {recentSessions.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                No sessions yet. Start a breathing exercise to see your history.
              </p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Exercise</TableHead>
                    <TableHead className="text-right">Duration</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentSessions.map((session, index) => (
                    <TableRow key={index}>
                      <TableCell className="text-sm">{formatDate(session.timestamp)}</TableCell>
                      <TableCell>{session.exerciseName}</TableCell>
                      <TableCell className="text-right">{formatDuration(session.duration)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
