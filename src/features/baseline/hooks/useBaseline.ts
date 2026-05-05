import { useState, useCallback } from 'react';
import { getDatabase } from '../../../core/db';
import { Assessment } from '../data';
import { generateUUID } from '../../../shared/utils/uuid';

export const useBaseline = (assessment: Assessment) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [responses, setResponses] = useState<Record<string, number>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [showCrisisInfo, setShowCrisisInfo] = useState(false);

  const setResponse = useCallback((questionId: string, value: number) => {
    setResponses(prev => ({ ...prev, [questionId]: value }));
    
    // Safety check for PHQ-9 Question 9
    if (assessment.id === 'PHQ-9' && questionId === 'q9' && value > 0) {
      setShowCrisisInfo(true);
    }
  }, [assessment.id]);

  const saveAssessment = useCallback(async () => {
    setIsSaving(true);
    try {
      const db = await getDatabase();
      const totalScore = Object.values(responses).reduce((sum, val) => sum + val, 0);
      const severity = assessment.scoring(totalScore);

      await db.clinical_vault.insert({
        _id: generateUUID(),
        type: 'assessment',
        category: assessment.id,
        score: totalScore,
        severity: severity,
        data: {
          responses
        },
        timestamp: new Date().toISOString()
      });

      console.log(`[Baseline] ${assessment.id} saved securely. Score: ${totalScore} (${severity})`);
      return { totalScore, severity };
    } catch (err) {
      console.error('[Baseline] Save failed:', err);
      return null;
    } finally {
      setIsSaving(false);
    }
  }, [assessment, responses]);

  return {
    currentStep,
    setCurrentStep,
    responses,
    setResponse,
    saveAssessment,
    isSaving,
    showCrisisInfo,
    totalQuestions: assessment.questions.length
  };
};
