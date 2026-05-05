import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronRight, ChevronLeft, AlertCircle, CheckCircle2, PhoneCall } from 'lucide-react';
import { useBaseline } from '../hooks/useBaseline';
import { Assessment, options as scoringOptions } from '../data';

interface BaselineWizardProps {
  assessment: Assessment;
  onClose: () => void;
}

export const BaselineWizard = ({ assessment, onClose }: BaselineWizardProps) => {
  const {
    currentStep,
    setCurrentStep,
    responses,
    setResponse,
    saveAssessment,
    isSaving,
    showCrisisInfo,
    totalQuestions
  } = useBaseline(assessment);

  const [result, setResult] = useState<{ score: number; severity: string } | null>(null);

  const currentQuestion = assessment.questions[currentStep];
  const isLastStep = currentStep === totalQuestions - 1;
  const canProceed = responses[currentQuestion.id] !== undefined;

  const handleNext = async () => {
    if (isLastStep) {
      const saved = await saveAssessment();
      if (saved) setResult(saved);
    } else {
      setCurrentStep(s => s + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) setCurrentStep(s => s - 1);
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-parchment z-50 flex flex-col p-6"
    >
      <header className="flex justify-between items-center mb-8">
        <button onClick={onClose} className="p-2 text-walnut/40 hover:text-walnut transition-colors">
          <X size={24} />
        </button>
        <div className="text-center flex-1">
          <h2 className="font-serif text-walnut text-lg">{assessment.id}</h2>
          {!result && (
            <div className="flex justify-center space-x-1 mt-1">
              {Array.from({ length: totalQuestions }).map((_, i) => (
                <div 
                  key={i} 
                  className={`h-1 rounded-full transition-all duration-300 ${
                    i === currentStep ? 'w-4 bg-sage' : 'w-1 bg-walnut/10'
                  }`}
                />
              ))}
            </div>
          )}
        </div>
        <div className="w-10" />
      </header>

      <AnimatePresence mode="wait">
        {result ? (
          <motion.div 
            key="result"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex-1 flex flex-col justify-center items-center text-center space-y-8"
          >
            <div className="w-20 h-20 bg-sage/10 rounded-full flex items-center justify-center">
              <CheckCircle2 size={40} className="text-sage" />
            </div>
            <div className="space-y-2">
              <h3 className="text-3xl font-serif text-walnut">Assessment Complete</h3>
              <p className="text-walnut/60">Your baseline has been securely logged.</p>
            </div>
            
            <div className="bg-parch-dark p-8 rounded-3xl border border-walnut/5 shadow-sm w-full max-w-xs">
              <div className="text-5xl font-serif text-walnut mb-2">{result.score}</div>
              <div className="text-xs uppercase tracking-widest font-bold text-sage mb-4">Total Score</div>
              <div className="h-px bg-walnut/10 w-12 mx-auto mb-4" />
              <div className="text-xl font-serif text-walnut">{result.severity}</div>
              <div className="text-[10px] uppercase tracking-widest font-bold text-walnut/40">Severity Level</div>
            </div>

            <button 
              onClick={onClose}
              className="w-full max-w-xs bg-walnut text-parchment py-4 rounded-2xl font-medium"
            >
              Return to Sanctuary
            </button>
          </motion.div>
        ) : (
          <motion.div 
            key={currentQuestion.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="flex-1 flex flex-col"
          >
            <div className="flex-1 flex flex-col justify-center space-y-12">
              <div className="space-y-4">
                <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-sage">Question {currentStep + 1} of {totalQuestions}</span>
                <h3 className="text-2xl font-serif text-walnut leading-snug">
                  {currentQuestion.text}?
                </h3>
              </div>

              <div className="space-y-3">
                {scoringOptions.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => setResponse(currentQuestion.id, opt.value)}
                    className={`w-full p-5 rounded-2xl text-left transition-all border ${
                      responses[currentQuestion.id] === opt.value
                        ? 'bg-walnut text-parchment border-walnut shadow-md'
                        : 'bg-white/50 text-walnut border-walnut/5 hover:border-walnut/20'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{opt.label}</span>
                      {responses[currentQuestion.id] === opt.value && <CheckCircle2 size={18} />}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {showCrisisInfo && assessment.id === 'PHQ-9' && currentStep === 8 && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 p-4 bg-terracotta/10 rounded-2xl border border-terracotta/20 flex items-start space-x-3"
              >
                <AlertCircle className="text-terracotta shrink-0 mt-0.5" size={20} />
                <div className="space-y-2">
                  <p className="text-xs text-walnut leading-relaxed">
                    If you are feeling overwhelmed or having thoughts of self-harm, please know that support is available right now.
                  </p>
                  <a 
                    href="tel:988" 
                    className="flex items-center space-x-2 text-terracotta font-bold text-sm"
                  >
                    <PhoneCall size={14} />
                    <span>Call or Text 988 (Crisis Lifeline)</span>
                  </a>
                </div>
              </motion.div>
            )}

            <div className="flex space-x-4 pt-6">
              <button 
                onClick={handleBack}
                disabled={currentStep === 0}
                className="p-4 rounded-2xl bg-walnut/5 text-walnut disabled:opacity-0 transition-opacity"
              >
                <ChevronLeft size={24} />
              </button>
              <button 
                disabled={!canProceed || isSaving}
                onClick={handleNext}
                className="flex-1 bg-walnut text-parchment py-4 rounded-2xl font-medium shadow-lg flex items-center justify-center space-x-2 disabled:opacity-30 transition-opacity"
              >
                <span>{isLastStep ? (isSaving ? 'Saving...' : 'Complete Assessment') : 'Continue'}</span>
                {!isLastStep && <ChevronRight size={18} />}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
