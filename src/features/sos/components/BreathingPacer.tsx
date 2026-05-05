import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronRight, Wind } from 'lucide-react';
import { useBreathingSession, BreathingPhase } from '../hooks/useBreathingSession';

interface BreathingPacerProps {
  onClose: () => void;
}

export const BreathingPacer = ({ onClose }: BreathingPacerProps) => {
  const [step, setStep] = useState<'initial' | 'breathing' | 'final'>('initial');
  const [intensityBefore, setIntensityBefore] = useState(5);
  const [intensityAfter, setIntensityAfter] = useState(5);
  
  const { isActive, phase, secondsRemaining, startSession, endSession } = useBreathingSession();

  const handleStart = () => {
    setStep('breathing');
    startSession();
  };

  const handleFinish = () => {
    endSession(intensityBefore, intensityAfter);
    onClose();
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
        <h2 className="font-serif text-walnut text-xl">SOS Breathing</h2>
        <div className="w-10" /> {/* Spacer */}
      </header>

      <AnimatePresence mode="wait">
        {step === 'initial' && (
          <motion.div 
            key="initial"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex-1 flex flex-col justify-center space-y-12"
          >
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-terracotta/10 rounded-full flex items-center justify-center mx-auto">
                <Wind size={32} className="text-terracotta" />
              </div>
              <h3 className="text-2xl font-serif text-walnut px-8">
                How intense is your anxiety right now?
              </h3>
            </div>

            <div className="space-y-6 px-4">
              <input 
                type="range" 
                min="1" 
                max="10" 
                value={intensityBefore}
                onChange={(e) => setIntensityBefore(parseInt(e.target.value))}
                className="w-full h-2 bg-walnut/10 rounded-lg appearance-none cursor-pointer accent-terracotta"
              />
              <div className="flex justify-between text-[10px] uppercase tracking-widest text-walnut/40 font-bold">
                <span>Calm (1)</span>
                <span className="text-terracotta text-lg font-serif">{intensityBefore}</span>
                <span>Extreme (10)</span>
              </div>
            </div>

            <button 
              onClick={handleStart}
              className="w-full bg-walnut text-parchment py-4 rounded-2xl font-medium shadow-lg flex items-center justify-center space-x-2"
            >
              <span>Begin Box Breathing</span>
              <ChevronRight size={18} />
            </button>
          </motion.div>
        )}

        {step === 'breathing' && (
          <motion.div 
            key="breathing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex-1 flex flex-col items-center justify-center space-y-16"
          >
            {/* The Breathing Circle */}
            <div className="relative flex items-center justify-center">
              <motion.div 
                animate={{ 
                  scale: phase === 'Inhale' ? 1.5 : phase === 'Exhale' ? 1 : phase === 'Hold' ? (phase === 'Inhale' ? 1.5 : 1) : 1,
                }}
                transition={{ duration: 4, ease: "linear" }}
                className={`w-48 h-48 rounded-full border-4 border-sage shadow-[0_0_40px_rgba(138,154,91,0.2)] ${
                  phase === 'Hold' ? 'bg-sage/10' : 'bg-transparent'
                }`}
              />
              
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <motion.span 
                  key={phase}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-walnut font-serif text-3xl mb-2"
                >
                  {phase}
                </motion.span>
                <span className="text-sage font-mono text-xl font-bold">
                  {secondsRemaining}
                </span>
              </div>
            </div>

            <div className="text-center space-y-4">
              <p className="text-walnut/60 text-sm max-w-[240px] leading-relaxed">
                {phase === 'Inhale' && "Gently fill your lungs..."}
                {phase === 'Hold' && "Maintain the stillness..."}
                {phase === 'Exhale' && "Let the tension go..."}
              </p>
              
              <button 
                onClick={() => setStep('final')}
                className="text-walnut/30 text-xs uppercase tracking-widest font-bold border-b border-walnut/10 pb-1"
              >
                End Session
              </button>
            </div>
          </motion.div>
        )}

        {step === 'final' && (
          <motion.div 
            key="final"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex-1 flex flex-col justify-center space-y-12"
          >
            <div className="text-center space-y-4">
              <h3 className="text-2xl font-serif text-walnut px-8">
                How do you feel now?
              </h3>
              <p className="text-sage text-sm italic">"The breath is the bridge."</p>
            </div>

            <div className="space-y-6 px-4">
              <input 
                type="range" 
                min="1" 
                max="10" 
                value={intensityAfter}
                onChange={(e) => setIntensityAfter(parseInt(e.target.value))}
                className="w-full h-2 bg-walnut/10 rounded-lg appearance-none cursor-pointer accent-sage"
              />
              <div className="flex justify-between text-[10px] uppercase tracking-widest text-walnut/40 font-bold">
                <span>Calm (1)</span>
                <span className="text-sage text-lg font-serif">{intensityAfter}</span>
                <span>Extreme (10)</span>
              </div>
            </div>

            <button 
              onClick={handleFinish}
              className="w-full bg-walnut text-parchment py-4 rounded-2xl font-medium shadow-lg"
            >
              Save & Return to Sanctuary
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
