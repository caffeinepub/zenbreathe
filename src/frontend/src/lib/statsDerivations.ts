import { BreathingSession, BreathHoldRecord } from './sessionTypes';

export interface DailyMinutes {
  date: string;
  minutes: number;
}

export function getLast7DaysMinutes(sessions: BreathingSession[]): DailyMinutes[] {
  const today = new Date();
  const days: DailyMinutes[] = [];
  
  for (let i = 6; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    date.setHours(0, 0, 0, 0);
    
    const nextDay = new Date(date);
    nextDay.setDate(nextDay.getDate() + 1);
    
    const dayStart = date.getTime();
    const dayEnd = nextDay.getTime();
    
    const daySessions = sessions.filter(
      s => s.timestamp >= dayStart && s.timestamp < dayEnd
    );
    
    const totalMs = daySessions.reduce((sum, s) => sum + s.duration, 0);
    const minutes = Math.round(totalMs / 60000);
    
    days.push({
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      minutes,
    });
  }
  
  return days;
}

export function getBreathHoldChartData(records: BreathHoldRecord[]): { date: string; seconds: number }[] {
  return records
    .sort((a, b) => a.timestamp - b.timestamp)
    .map(r => ({
      date: new Date(r.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      seconds: Math.round(r.duration / 1000),
    }));
}

export function getLast10Sessions(sessions: BreathingSession[]): BreathingSession[] {
  return sessions
    .sort((a, b) => b.timestamp - a.timestamp)
    .slice(0, 10);
}
