import { useState, useEffect, useCallback } from 'react';
import { getDatabase } from '../../../core/db';
import { generateUUID } from '../../../shared/utils/uuid';

export type BreathingPhase = 'Inhale' | 'Hold' | 'Exhale' | 'Rest';

interface UseBreathingSessionProps {
  onPhaseChange?: (phase: BreathingPhase) => void;
}

export const useBreathingSession = ({ onPhaseChange }: UseBreathingSessionProps = {}) => {
  const [isActive, setIsActive] = useState(false);
  const [phase, setPhase] = useState<BreathingPhase>('Rest');
  const [lastPhase, setLastPhase] = useState<string>('Inhale');
  const [secondsRemaining, setSecondsRemaining] = useState(0);
  const [sessionStartTime, setSessionStartTime] = useState<string | null>(null);

  const startSession = useCallback(() => {
    setIsActive(true);
    setSessionStartTime(new Date().toISOString());
    setPhase('Inhale');
    setLastPhase('Inhale');
    setSecondsRemaining(4);
  }, []);

  const endSession = useCallback(async (intensityBefore: number, intensityAfter: number) => {
    setIsActive(false);
    setPhase('Rest');
    
    if (sessionStartTime) {
      const db = await getDatabase();
      const durationSeconds = Math.floor((new Date().getTime() - new Date(sessionStartTime).getTime()) / 1000);
      
      await db.sos_logs.insert({
        _id: generateUUID(),
        timestamp: sessionStartTime,
        duration_seconds: durationSeconds,
        intensity_before: intensityBefore,
        intensity_after: intensityAfter
      });
    }
    
    setSessionStartTime(null);
  }, [sessionStartTime]);

  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (isActive && secondsRemaining > 0) {
      timer = setTimeout(() => setSecondsRemaining(s => s - 1), 1000);
    } else if (isActive && secondsRemaining === 0) {
      setSecondsRemaining(4);
      setPhase(current => {
        if (current === 'Inhale') return 'Hold';
        if (current === 'Hold' && lastPhase === 'Inhale') {
          setLastPhase('Hold');
          return 'Exhale';
        }
        if (current === 'Exhale') return 'Hold';
        if (current === 'Hold' && lastPhase === 'Hold') {
          // Came from Exhale -> Hold. Next is Inhale.
          setLastPhase('Inhale');
          return 'Inhale';
        }
        return 'Inhale';
      });
    }

    return () => clearTimeout(timer);
  }, [isActive, secondsRemaining, phase, lastPhase]);

  // Handle phase change callbacks
  useEffect(() => {
    if (isActive && secondsRemaining === 4) {
      onPhaseChange?.(phase);
    }
  }, [isActive, phase, secondsRemaining, onPhaseChange]);

  return {
    isActive,
    phase,
    secondsRemaining,
    startSession,
    endSession
  };
};
