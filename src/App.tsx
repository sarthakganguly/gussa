import { useState, useEffect } from 'react';
import { useDatabase } from './shared/hooks/useDatabase';
import { HUD } from './features/hud/HUD';
import { motion, AnimatePresence } from 'framer-motion';

function App() {
  const { db, error, loading } = useDatabase();
  const [showHUD, setShowHUD] = useState(false);

  // Transition to HUD after a short delay once DB is loaded
  useEffect(() => {
    if (db && !loading) {
      const timer = setTimeout(() => setShowHUD(true), 1200);
      return () => clearTimeout(timer);
    }
  }, [db, loading]);

  return (
    <AnimatePresence mode="wait">
      {!showHUD ? (
        <motion.div 
          key="mounting"
          exit={{ opacity: 0, scale: 0.95 }}
          className="min-h-screen flex flex-col items-center justify-center p-6 text-center bg-parchment"
        >
          <header className="mb-8">
            <h1 className="text-5xl font-serif text-walnut mb-2">Sovereign Vault</h1>
            <p className="text-sage font-medium tracking-wide uppercase text-sm">Mental Health Sanctuary</p>
          </header>
          
          <main className="max-w-md w-full bg-parchment-dark rounded-2xl p-8 shadow-sm border border-walnut/5">
            <div className="space-y-6">
              <div className="p-4 bg-sage/10 rounded-lg">
                <h2 className="text-walnut font-serif text-xl mb-1">Local Sovereignty</h2>
                <p className="text-walnut/70 text-sm">Your data never leaves this device. No cloud, no tracking, just you.</p>
              </div>

              <div className="text-xs font-mono py-2 px-3 bg-walnut/5 rounded border border-walnut/10 inline-block">
                {loading ? (
                  <span className="text-sage animate-pulse">Initializing Secure Vault...</span>
                ) : error ? (
                  <span className="text-terracotta">Vault Error: {error.message}</span>
                ) : (
                  <span className="text-sage">Vault Securely Mounted</span>
                )}
              </div>
              
              <div className="flex justify-center space-x-4">
                <span className={`w-2 h-2 rounded-full ${db ? 'bg-sage' : 'bg-terracotta'}`}></span>
                <span className="w-2 h-2 rounded-full bg-sage/40"></span>
                <span className="w-2 h-2 rounded-full bg-walnut/20"></span>
              </div>
            </div>
          </main>
          
          <footer className="mt-12 text-walnut/40 text-xs">
            &copy; {new Date().getFullYear()} Gussa. Strictly Offline.
          </footer>
        </motion.div>
      ) : (
        <motion.div 
          key="hud"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <HUD />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default App
