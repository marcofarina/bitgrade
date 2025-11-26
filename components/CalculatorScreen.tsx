import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AppConfig } from '../types';
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

  const parseScore = (input: string) => {
    const normalized = input.replace(',', '.');
    const parsed = parseFloat(normalized);
    return isNaN(parsed) ? 0 : parsed;
  };

  const scoreNum = parseScore(rawScoreInput);
  const isOverLimit = scoreNum > config.totalPoints;

  const results = useMemo(() => {
    return calculateGrades(scoreNum, config.totalPoints, config.levels);
  }, [scoreNum, config]);

  useEffect(() => {
    setSelectedTab(0);
  }, [config.levels]);

  const percentage = Math.min(100, Math.max(0, (scoreNum / config.totalPoints) * 100));
  const activeResult = results[Math.min(selectedTab, results.length - 1)];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value;
    val = val.replace(',', '.');
    if (/^\d*\.?\d*$/.test(val)) {
      setRawScoreInput(val);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="w-full max-w-xl mx-auto flex flex-col h-full justify-between py-4 md:py-8"
    >
      {/* Header Info */}
      <header className="w-full flex items-center justify-between shrink-0 mb-2 md:mb-4 pb-4 border-b border-zinc-800">
        {/* Spacer for centering since Info button is absolute in App */}
        <div className="w-8 md:hidden" /> 
        
        <div className="text-center md:text-left">
          <h2 className="text-lg font-bold text-white">Calcolatore</h2>
          <p className="text-xs text-zinc-400">
            Totale: <span className="text-zinc-200 font-mono">{config.totalPoints} pts</span>
          </p>
        </div>
        
        <Button variant="secondary" onClick={onReset} className="!p-2 z-20">
          <RefreshCcw size={18} />
        </Button>
      </header>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col justify-center items-center w-full min-h-0">
        
        {/* Input Section */}
        <div className="flex flex-col items-center w-full relative mb-4 md:mb-8 shrink-0">
          <label className="text-[10px] md:text-xs font-bold text-zinc-500 mb-2 uppercase tracking-widest">
            Punteggio
          </label>
          
          <div className="relative w-full flex flex-col items-center">
            <input
              type="text"
              inputMode="decimal"
              value={rawScoreInput}
              onChange={handleInputChange}
              placeholder="0"
              className={`w-full bg-transparent text-6xl md:text-8xl font-black text-center placeholder-zinc-800 focus:outline-none transition-colors duration-200 ${
                isOverLimit ? 'text-rose-500' : 'text-white'
              }`}
            />
            
            {/* Progress Bar */}
            <div className="w-32 md:w-48 h-1.5 bg-zinc-800 rounded-full mt-2 md:mt-4 overflow-hidden">
              <motion.div 
                className={`h-full ${isOverLimit ? 'bg-rose-500' : 'bg-indigo-500'}`}
                initial={{ width: 0 }}
                animate={{ width: `${percentage}%` }}
                transition={{ type: "spring", stiffness: 100 }}
              />
            </div>

            <AnimatePresence>
              {isOverLimit && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute -bottom-8 md:-bottom-12 flex items-center gap-2 text-rose-400 text-xs md:text-sm font-bold bg-rose-500/10 px-3 py-1 rounded-full border border-rose-500/20"
                >
                  <AlertCircle size={12} />
                  Max {config.totalPoints}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Tabs - visible if > 1 level */}
        {results.length > 1 && (
          <div className="w-full bg-zinc-900/60 p-1 rounded-xl flex relative mb-4 md:mb-6 shrink-0 backdrop-blur-sm border border-zinc-800/50 max-w-sm">
            {results.map((res, index) => {
              const isActive = selectedTab === index;
              return (
                <button
                  key={res.label}
                  onClick={() => setSelectedTab(index)}
                  className={`relative flex-1 py-2 text-xs md:text-sm font-bold rounded-lg transition-colors duration-200 z-10 ${
                    isActive ? 'text-white' : 'text-zinc-500 hover:text-zinc-300'
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute inset-0 bg-zinc-700/80 shadow-sm rounded-lg"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                  <span className="relative z-10">{res.label.split(' ')[1] || res.label}</span>
                </button>
              );
            })}
          </div>
        )}

        {/* Result Card - Removed AnimatePresence for instant switching */}
        <div className="w-full flex-1 flex items-center justify-center min-h-0">
            {activeResult && (
              <GradeCard 
                result={activeResult} 
                index={0} 
              />
            )}
        </div>
      </div>

      {/* Helper Text Footer */}
      <div 
        className={`shrink-0 text-center mt-2 h-6 text-zinc-600 text-xs font-medium transition-opacity duration-300 ${
          rawScoreInput === '' ? 'opacity-100' : 'opacity-0'
        }`}
      >
        Inserisci un punteggio
      </div>
    </motion.div>
  );
};