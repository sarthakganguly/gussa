import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, CloudOff, Smile, Meh, Frown, Save } from 'lucide-react';
import { useJournal } from '../hooks/useJournal';

interface JournalEntryProps {
  onClose: () => void;
}

const moods = [
  { score: 2, label: 'Heavy', icon: Frown, color: 'text-terracotta' },
  { score: 5, label: 'Neutral', icon: Meh, color: 'text-walnut/60' },
  { score: 8, label: 'Light', icon: Smile, color: 'text-sage' },
];

const activities = [
  "Exercise", "Meditation", "Deep Work", "Social", "Sleep", "Reading", "Nature"
];

export const JournalEntry = ({ onClose }: JournalEntryProps) => {
  const [step, setStep] = useState<'mood' | 'note'>('mood');
  const [selectedMood, setSelectedMood] = useState<{ score: number; label: string } | null>(null);
  const [selectedActivities, setSelectedActivities] = useState<string[]>([]);
  const [note, setNote] = useState('');
  
  const { saveEntry, isSaving } = useJournal();

  const toggleActivity = (activity: string) => {
    setSelectedActivities(prev => 
      prev.includes(activity) ? prev.filter(a => a !== activity) : [...prev, activity]
    );
  };

  const handleSave = async () => {
    if (!selectedMood) return;
    const success = await saveEntry({
      mood: selectedMood,
      activities: selectedActivities,
      note,
      tags: []
    });
    if (success) onClose();
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
        <div className="flex items-center space-x-2">
          <CloudOff size={16} className="text-sage" />
          <h2 className="font-serif text-walnut text-xl">Daily Journal</h2>
        </div>
        <div className="w-10" />
      </header>

      <AnimatePresence mode="wait">
        {step === 'mood' && (
          <motion.div 
            key="mood"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex-1 flex flex-col space-y-12"
          >
            <div className="text-center space-y-2">
              <h3 className="text-2xl font-serif text-walnut">How is your heart today?</h3>
              <p className="text-walnut/40 text-sm">Select the frequency that resonates.</p>
            </div>

            <div className="flex justify-around items-center">
              {moods.map((m) => (
                <button
                  key={m.label}
                  onClick={() => setSelectedMood({ score: m.score, label: m.label })}
                  className={`flex flex-col items-center space-y-3 p-4 rounded-2xl transition-all ${
                    selectedMood?.label === m.label ? 'bg-walnut/5 scale-110' : 'opacity-40 grayscale'
                  }`}
                >
                  <m.icon size={48} className={m.color} />
                  <span className="text-xs uppercase tracking-widest font-bold text-walnut">{m.label}</span>
                </button>
              ))}
            </div>

            <div className="space-y-4">
              <h4 className="text-[10px] uppercase tracking-widest font-bold text-walnut/40 text-center">Activities</h4>
              <div className="flex flex-wrap justify-center gap-2">
                {activities.map((a) => (
                  <button
                    key={a}
                    onClick={() => toggleActivity(a)}
                    className={`px-4 py-2 rounded-full text-xs font-medium transition-all border ${
                      selectedActivities.includes(a) 
                        ? 'bg-sage text-parchment border-sage' 
                        : 'bg-transparent text-walnut/60 border-walnut/10'
                    }`}
                  >
                    {a}
                  </button>
                ))}
              </div>
            </div>

            <button 
              disabled={!selectedMood}
              onClick={() => setStep('note')}
              className="mt-auto w-full bg-walnut text-parchment py-4 rounded-2xl font-medium shadow-lg flex items-center justify-center space-x-2 disabled:opacity-30"
            >
              <span>Next</span>
              <Check size={18} />
            </button>
          </motion.div>
        )}

        {step === 'note' && (
          <motion.div 
            key="note"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex-1 flex flex-col space-y-6"
          >
            <div className="text-center space-y-2">
              <h3 className="text-2xl font-serif text-walnut">What's on your mind?</h3>
              <p className="text-sage text-xs font-medium italic">Your thoughts are encrypted at rest.</p>
            </div>

            <textarea
              autoFocus
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Start writing..."
              className="flex-1 w-full bg-parchment-dark rounded-3xl p-6 text-walnut placeholder-walnut/20 focus:outline-none resize-none border border-walnut/5 shadow-inner"
            />

            <button 
              disabled={isSaving}
              onClick={handleSave}
              className="w-full bg-walnut text-parchment py-4 rounded-2xl font-medium shadow-lg flex items-center justify-center space-x-2"
            >
              <Save size={18} />
              <span>{isSaving ? 'Securing Entry...' : 'Finish & Lock'}</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
