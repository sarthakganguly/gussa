import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Wind, BookOpen, MessageCircleHeart, ShieldCheck, ClipboardCheck } from 'lucide-react';
import { Greeting } from './components/Greeting';
import { HudButton } from './components/HudButton';
import { BreathingPacer } from '../sos/components/BreathingPacer';
import { JournalEntry } from '../journal/components/JournalEntry';
import { BaselineModule } from '../baseline/BaselineModule';

export const HUD = () => {
  const [activeFeature, setActiveFeature] = useState<'none' | 'sos' | 'journal' | 'ai' | 'baseline'>('none');

  return (
    <div className="min-h-screen bg-parchment flex flex-col p-6 max-w-lg mx-auto w-full">
      <AnimatePresence>
        {activeFeature === 'sos' && (
          <BreathingPacer onClose={() => setActiveFeature('none')} />
        )}
        {activeFeature === 'journal' && (
          <JournalEntry onClose={() => setActiveFeature('none')} />
        )}
        {activeFeature === 'baseline' && (
          <BaselineModule onClose={() => setActiveFeature('none')} />
        )}
      </AnimatePresence>

      <header className="flex justify-between items-center mb-12 pt-4">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-full bg-walnut flex items-center justify-center">
            <ShieldCheck size={18} className="text-parchment" />
          </div>
          <span className="font-serif text-walnut font-bold text-lg tracking-tight">Sovereign</span>
        </div>
        
        <div className="flex flex-col items-end">
          <span className="text-[10px] text-walnut/40 uppercase tracking-widest font-bold">Streak</span>
          <div className="flex items-center space-x-1">
            <span className="text-walnut font-serif text-xl">0</span>
            <span className="text-terracotta text-sm">🔥</span>
          </div>
        </div>
      </header>

      <main className="flex-1 flex flex-col justify-center">
        <Greeting />

        <div className="space-y-4">
          <HudButton 
            icon={Wind}
            label="SOS Breathing"
            description="Immediate grounding for acute anxiety"
            variant="accent"
            onClick={() => setActiveFeature('sos')}
            delay={0.1}
          />
          
          <HudButton 
            icon={BookOpen}
            label="Daily Journal"
            description="Mood check-in & reflective writing"
            variant="secondary"
            onClick={() => setActiveFeature('journal')}
            delay={0.2}
          />

          <HudButton 
            icon={ClipboardCheck}
            label="Clinical Baseline"
            description="PHQ-9 and GAD-7 assessments"
            variant="secondary"
            onClick={() => setActiveFeature('baseline')}
            delay={0.3}
          />
          
          <HudButton 
            icon={MessageCircleHeart}
            label="AI CBT Coach"
            description="Reframe thoughts with local intelligence"
            variant="primary"
            onClick={() => setActiveFeature('ai')}
            delay={0.4}
          />
        </div>
      </main>

      <footer className="mt-12 text-center">
        <motion.div 
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="inline-block p-1 rounded-full bg-sage/10 mb-4"
        >
          <div className="px-4 py-1 rounded-full bg-sage/20 text-[10px] text-walnut/60 uppercase tracking-widest font-bold">
            Encrypted & Offline
          </div>
        </motion.div>
        <p className="text-[10px] text-walnut/30 uppercase tracking-[0.3em]">
          Gussa v0.1.0
        </p>
      </footer>
    </div>
  );
};
