import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AppConfig, ComplexityLevel } from '../types';
import { calculateGrades } from '../utils/gradeLogic';
import { GradeCard } from './GradeCard';
import { Button } from './Button';
import { RefreshCcw, AlertCircle } from 'lucide-react';

interface CalculatorScreenProps {
  config: AppConfig;
  onReset: () => void;
}

export const CalculatorScreen: React.FC<CalculatorScreenProps> = ({ config, onReset }) => {
  const [rawScoreInput, setRawScoreInput] = useState<string>('');
  const [selectedTab, setSelectedTab] = useState(0);

  // Safe parsing logic
  const parseScore = (input: string) => {
    // Replace comma with dot
    const normalized = input.replace(',', '.');
    const parsed = parseFloat(normalized);
    return isNaN(parsed) ? 0 : parsed;
  };

  const scoreNum = parseScore(rawScoreInput);
  const isOverLimit = scoreNum > config.totalPoints;

  // Recalculate results whenever score changes
  const results = useMemo(() => {
    return calculateGrades(scoreNum, config.totalPoints, config.levels);
  }, [scoreNum, config]);

  // Reset tab to 0 if config changes
  useEffect(() => {
    setSelectedTab(0);
  }, [config.levels]);

  const percentage = Math.min(100, Math.max(0, (scoreNum / config.totalPoints) * 100));
  const activeResult = results[Math.min(selectedTab, results.length - 1)];

  // Input change handler
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value;
    
    // Replace comma with dot immediately for visual consistency if desired,
    // or keep it and handle it in parser. Let's strictly replace for cleaner state.
    val = val.replace(',', '.');

    // Allow numbers and single dot only
    if (/^\d*\.?\d*$/.test(val)) {
      setRawScoreInput(val);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="w-full max-w-xl mx-auto p-4 flex flex-col h-full items-center"
    >
      {/* Header Info */}
      <header className="w-full flex items-center justify-between mb-10 pb-4 border-b border-zinc-800">
        <div>
          <h2 className="text-lg font-bold text-white">Calcolatore Voti</h2>
          <p className="text-xs text-zinc-400">
            Totale: <span className="text-zinc-200 font-mono">{config.totalPoints} punti</span>
          </p>
        </div>
        <Button variant="secondary" onClick={onReset} className="!p-2">
          <RefreshCcw size={18} />
        </Button>
      </header>

      {/* Main Input Area */}
      <div className="flex flex-col items-center mb-10 w-full relative">
        <label className="text-xs font-bold text-zinc-500 mb-2 uppercase tracking-widest">
          Punteggio Ottenuto
        </label>
        
        <div className="relative w-full flex flex-col items-center">
          <input
            type="text"
            inputMode="decimal"
            value={rawScoreInput}
            onChange={handleInputChange}
            placeholder="0"
            className={`w-full bg-transparent text-8xl font-black text-center placeholder-zinc-800 focus:outline-none focus:scale-105 transition-transform duration-200 ${
              isOverLimit ? 'text-rose-500' : 'text-white'
            }`}
          />
          
          {/* Progress Bar under input */}
          <div className="w-48 h-1.5 bg-zinc-800 rounded-full mt-4 overflow-hidden">
            <motion.div 
              className={`h-full ${isOverLimit ? 'bg-rose-500' : 'bg-indigo-500'}`}
              initial={{ width: 0 }}
              animate={{ width: `${percentage}%` }}
              transition={{ type: "spring", stiffness: 100 }}
            />
          </div>

          {/* Over Limit Warning */}
          <AnimatePresence>
            {isOverLimit && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute -bottom-12 flex items-center gap-2 text-rose-400 text-sm font-bold bg-rose-500/10 px-3 py-1 rounded-full border border-rose-500/20"
              >
                <AlertCircle size={14} />
                Max {config.totalPoints} punti
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Level Switcher (Tabs) - Only if > 1 result */}
      {results.length > 1 && (
        <div className="w-full bg-zinc-900/60 p-1.5 rounded-2xl flex relative mb-8 backdrop-blur-sm border border-zinc-800/50">
          {results.map((res, index) => {
            const isActive = selectedTab === index;
            return (
              <button
                key={res.label}
                onClick={() => setSelectedTab(index)}
                className={`relative flex-1 py-3 text-sm font-bold rounded-xl transition-colors duration-200 z-10 ${
                  isActive ? 'text-white' : 'text-zinc-500 hover:text-zinc-300'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 bg-zinc-700/80 shadow-sm rounded-xl"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <span className="relative z-10">{res.label}</span>
              </button>
            );
          })}
        </div>
      )}

      {/* Result Card (Single Hero View) */}
      <div className="w-full perspective-1000 min-h-[450px] flex items-start justify-center">
        <AnimatePresence mode='wait'>
            {activeResult && (
              <GradeCard 
                key={activeResult.label + "-card"} 
                result={activeResult} 
                index={0} 
              />
            )}
        </AnimatePresence>
      </div>

      {/* Helper Text */}
      <div 
        className={`text-center mt-4 text-zinc-600 text-sm font-medium transition-opacity duration-300 ${
          rawScoreInput === '' ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        Digita il punteggio per calcolare il voto
      </div>
    </motion.div>
  );
};