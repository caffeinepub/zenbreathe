import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trophy } from 'lucide-react';
import { getBreathHoldRecords, addBreathHoldRecord } from '../lib/localStorageStore';

export default function Test() {
  const [isRunning, setIsRunning] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [allTimeRecord, setAllTimeRecord] = useState(0);
  
  const startTimeRef = useRef<number>(0);
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    const records = getBreathHoldRecords();
    if (records.length > 0) {
      const max = Math.max(...records.map(r => r.duration));
      setAllTimeRecord(max);
    }
  }, []);

  useEffect(() => {
    if (!isRunning) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    startTimeRef.current = Date.now();
    
    intervalRef.current = window.setInterval(() => {
      const now = Date.now();
      setElapsed(now - startTimeRef.current);
    }, 100);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning]);

  const handleStart = () => {
    setElapsed(0);
    setIsRunning(true);
  };

  const handleStop = () => {
    setIsRunning(false);
    
    if (elapsed > 0) {
      addBreathHoldRecord(elapsed);
      
      // Update all-time record if needed
      if (elapsed > allTimeRecord) {
        setAllTimeRecord(elapsed);
      }
    }
  };

  const formatTime = (ms: number): string => {
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="container max-w-2xl py-4 sm:py-8 px-3 sm:px-4">
      <div className="mb-6 sm:mb-8">
        <h2 className="text-xl sm:text-2xl font-semibold mb-2">Breath Hold Test</h2>
        <p className="text-sm sm:text-base text-muted-foreground">See how long you can hold your breath</p>
      </div>

      <div className="space-y-4 sm:space-y-6">
        <Card>
          <CardHeader className="pb-3 sm:pb-6">
            <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
              <Trophy className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-500" />
              All-Time Record
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-center">
              {formatTime(allTimeRecord)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3 sm:pb-6">
            <CardTitle className="text-base sm:text-lg">Current Attempt</CardTitle>
            <CardDescription className="text-xs sm:text-sm">
              {isRunning ? 'Hold your breath...' : 'Press Start when ready'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 sm:space-y-6">
            <div className="text-4xl sm:text-5xl md:text-6xl font-bold text-center py-6 sm:py-8">
              {formatTime(elapsed)}
            </div>
            
            {!isRunning ? (
              <Button onClick={handleStart} className="w-full text-sm sm:text-base" size="lg">
                Start
              </Button>
            ) : (
              <Button onClick={handleStop} className="w-full text-sm sm:text-base" size="lg" variant="destructive">
                Stop
              </Button>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
