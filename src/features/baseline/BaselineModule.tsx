import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ClipboardCheck, ArrowRight } from 'lucide-react';
import { BaselineWizard } from './components/BaselineWizard';
import { PHQ9, GAD7 } from './data';

interface BaselineModuleProps {
  onClose: () => void;
}

export const BaselineModule = ({ onClose }: BaselineModuleProps) => {
  const [selectedAssessment, setSelectedAssessment] = useState<'none' | 'PHQ-9' | 'GAD-7'>('none');

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-parchment z-50 flex flex-col p-6 overflow-y-auto"
    >
      <AnimatePresence>
        {selectedAssessment === 'PHQ-9' && (
          <BaselineWizard assessment={PHQ9} onClose={() => setSelectedAssessment('none')} />
        )}
        {selectedAssessment === 'GAD-7' && (
          <BaselineWizard assessment={GAD7} onClose={() => setSelectedAssessment('none')} />
        )}
      </AnimatePresence>

      <header className="flex justify-between items-center mb-12">
        <button onClick={onClose} className="p-2 text-walnut/40 hover:text-walnut transition-colors">
          <X size={24} />
        </button>
        <div className="flex items-center space-x-2">
          <ClipboardCheck size={20} className="text-sage" />
          <h2 className="font-serif text-walnut text-xl font-bold">Clinical Baseline</h2>
        </div>
        <div className="w-10" />
      </header>

      <main className="flex-1 flex flex-col space-y-8">
        <div className="space-y-2">
          <h3 className="text-2xl font-serif text-walnut">Assessment Center</h3>
          <p className="text-walnut/60 text-sm leading-relaxed">
            Standardized clinical tools to help you track your journey. These assessments are private and stay on this device.
          </p>
        </div>

        <div className="space-y-4">
          <button 
            onClick={() => setSelectedAssessment('PHQ-9')}
            className="w-full p-6 rounded-3xl bg-white border border-walnut/5 text-left shadow-sm hover:shadow-md transition-shadow group"
          >
            <div className="flex justify-between items-start mb-2">
              <h4 className="font-serif text-xl text-walnut">PHQ-9</h4>
              <ArrowRight size={20} className="text-sage group-hover:translate-x-1 transition-transform" />
            </div>
            <p className="text-xs text-walnut/40 uppercase tracking-widest font-bold mb-2">Depression Screening</p>
            <p className="text-sm text-walnut/70 leading-relaxed">
              Measure severity of depressive symptoms over the last two weeks.
            </p>
          </button>

          <button 
            onClick={() => setSelectedAssessment('GAD-7')}
            className="w-full p-6 rounded-3xl bg-white border border-walnut/5 text-left shadow-sm hover:shadow-md transition-shadow group"
          >
            <div className="flex justify-between items-start mb-2">
              <h4 className="font-serif text-xl text-walnut">GAD-7</h4>
              <ArrowRight size={20} className="text-sage group-hover:translate-x-1 transition-transform" />
            </div>
            <p className="text-xs text-walnut/40 uppercase tracking-widest font-bold mb-2">Anxiety Screening</p>
            <p className="text-sm text-walnut/70 leading-relaxed">
              Measure severity of generalized anxiety symptoms over the last two weeks.
            </p>
          </button>
        </div>

        <div className="p-6 bg-sage/5 rounded-3xl border border-sage/10 mt-auto">
          <h5 className="font-serif text-walnut text-lg mb-2 italic">A Note on Privacy</h5>
          <p className="text-xs text-walnut/60 leading-relaxed">
            Your results are encrypted and never shared. We recommend taking these assessments every 2-4 weeks to track changes in your well-being.
          </p>
        </div>
      </main>
    </motion.div>
  );
};
