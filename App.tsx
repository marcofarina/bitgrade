import React, { useState } from 'react';
import { SetupScreen } from './components/SetupScreen';
import { CalculatorScreen } from './components/CalculatorScreen';
import { HelpModal } from './components/HelpModal';
import { AppConfig, ComplexityLevel } from './types';
import { AnimatePresence, motion } from 'framer-motion';
import { Info } from 'lucide-react';

const App: React.FC = () => {
  const [config, setConfig] = useState<AppConfig>({
    totalPoints: 30,
    levels: ComplexityLevel.TRIPLE,
    isConfigured: false,
  });

  const [isHelpOpen, setIsHelpOpen] = useState(false);

  const handleSetupComplete = (newConfig: Omit<AppConfig, 'isConfigured'>) => {
    setConfig({
      ...newConfig,
      isConfigured: true,
    });
  };

  const handleReset = () => {
    setConfig((prev) => ({ ...prev, isConfigured: false }));
  };

  return (
    <div className="min-h-screen bg-black text-zinc-100 selection:bg-indigo-500/30 font-sans">
       {/* Ambient Background Glow */}
       <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
          <div className="absolute -top-20 -left-20 w-96 h-96 bg-indigo-600/20 rounded-full blur-[100px]" />
          <div className="absolute top-40 right-0 w-72 h-72 bg-purple-600/10 rounded-full blur-[80px]" />
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-blue-600/10 rounded-full blur-[120px]" />
       </div>

       {/* Help Button (Fixed) */}
       <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsHelpOpen(true)}
        className="fixed top-4 right-4 z-40 p-3 bg-zinc-900/80 backdrop-blur-md border border-zinc-700 rounded-full text-zinc-400 hover:text-white hover:border-zinc-500 transition-colors shadow-lg"
        aria-label="Informazioni"
       >
         <Info size={24} />
       </motion.button>

      <div className="relative z-10 container mx-auto px-4 py-8 min-h-screen flex flex-col justify-center">
        <AnimatePresence mode="wait">
          {!config.isConfigured ? (
            <SetupScreen key="setup" onComplete={handleSetupComplete} />
          ) : (
            <CalculatorScreen key="calculator" config={config} onReset={handleReset} />
          )}
        </AnimatePresence>
      </div>

      {/* Help Modal Overlay */}
      <AnimatePresence>
        {isHelpOpen && (
          <HelpModal isOpen={isHelpOpen} onClose={() => setIsHelpOpen(false)} />
        )}
      </AnimatePresence>
    </div>
  );
};

export default App;