'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { formatTime } from '@/lib/utils';
import api from '@/lib/api';

interface TimerProps {
  taskId: string;
}

export default function Timer({ taskId }: TimerProps) {
  const [isRunning, setIsRunning] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [entryId, setEntryId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for active timer on mount
  useEffect(() => {
    checkActiveTimer();
  }, [taskId]);

  // Timer interval
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isRunning) {
      interval = setInterval(() => {
        setSeconds(s => s + 1);
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isRunning]);

  const checkActiveTimer = async () => {
    try {
      setIsLoading(true);
      const response = await api.get('/time-entries/active');
      
      if (response.data) {
        // There's an active timer
        const activeTimer = response.data;
        
        // Check if it's for this task
        if (activeTimer.taskId === taskId) {
          setEntryId(activeTimer.id);
          setIsRunning(true);
          
          // Calculate elapsed time
          const startTime = new Date(activeTimer.startTime);
          const elapsed = Math.floor((Date.now() - startTime.getTime()) / 1000);
          setSeconds(elapsed);
          setError(null);
        } else {
          // Active timer is for a different task
          setIsRunning(false);
          setSeconds(0);
          setEntryId(null);
          setError(`You have an active timer running for another task`);
        }
      } else {
        // No active timer
        setIsRunning(false);
        setSeconds(0);
        setEntryId(null);
        setError(null);
      }
    } catch (error) {
      console.error('Failed to check active timer:', error);
      setIsRunning(false);
      setSeconds(0);
      setEntryId(null);
    } finally {
      setIsLoading(false);
    }
  };

  const startTimer = async () => {
    if (!taskId) {
      setError('Invalid task ID');
      return;
    }

    setError(null);

    try {
      const response = await api.post(`/time-entries/start/${taskId}`);
      setEntryId(response.data.id);
      setIsRunning(true);
      setSeconds(0);
    } catch (error: any) {
      console.error('Failed to start timer:', error);
      
      let errorMessage = 'Failed to start timer';
      
      if (error.response?.data?.message) {
        errorMessage = Array.isArray(error.response.data.message) 
          ? error.response.data.message.join(', ')
          : error.response.data.message;
      } else if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      }
      
      setError(errorMessage);
      
      // If there's already an active timer, refresh to get it
      if (errorMessage.toLowerCase().includes('active timer')) {
        await checkActiveTimer();
      }
    }
  };

  const stopTimer = async () => {
    setError(null);
    
    try {
      // Always fetch the current active timer before stopping
      const activeTimerResponse = await api.get('/time-entries/active');
      
      if (!activeTimerResponse.data) {
        setError('No active timer found');
        setIsRunning(false);
        setSeconds(0);
        setEntryId(null);
        return;
      }

      const activeTimerId = activeTimerResponse.data.id;
      
      // Stop the active timer
      await api.post(`/time-entries/stop/${activeTimerId}`);
      
      // Reset state
      setIsRunning(false);
      setSeconds(0);
      setEntryId(null);
      setError(null);
      
    } catch (error: any) {
      console.error('Failed to stop timer:', error);
      
      let errorMessage = 'Failed to stop timer';
      if (error.response?.data?.message) {
        errorMessage = Array.isArray(error.response.data.message) 
          ? error.response.data.message.join(', ')
          : error.response.data.message;
      } else if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      }
      
      setError(errorMessage);
      
      // Refresh the timer state
      await checkActiveTimer();
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center gap-3">
        <span className="font-mono text-lg font-semibold">00:00:00</span>
        <Button disabled size="sm">Loading...</Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-3">
        <span className="font-mono text-lg font-semibold">
          {formatTime(seconds)}
        </span>
        {isRunning ? (
          <Button onClick={stopTimer} variant="destructive" size="sm">
            Stop
          </Button>
        ) : (
          <Button onClick={startTimer} size="sm" disabled={!!error}>
            Start
          </Button>
        )}
      </div>
      
      {error && (
        <div className="text-sm text-red-600 dark:text-red-400">
          {error}
        </div>
      )}
    </div>
  );
}