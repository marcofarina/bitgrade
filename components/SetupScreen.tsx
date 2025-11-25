import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ComplexityLevel, AppConfig } from '../types';
import { Button } from './Button';
import { Settings2, Layers, Hash } from 'lucide-react';

interface SetupScreenProps {
  onComplete: (config: Omit<AppConfig, 'isConfigured'>) => void;
}

export const SetupScreen: React.FC<SetupScreenProps> = ({ onComplete }) => {
  const [points, setPoints] = useState<number>(30);
  const [level, setLevel] = useState<ComplexityLevel>(ComplexityLevel.TRIPLE);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onComplete({ totalPoints: points, levels: level });
  };

  const levelOptions = [
    { 
      val: ComplexityLevel.SINGLE, 
      title: '1 Livello', 
      desc: 'Mappatura lineare standard (0-10).' 
    },
    { 
      val: ComplexityLevel.DUAL, 
      title: '2 Livelli', 
      desc: 'Base (max 8) e Avanzato (max 10).' 
    },
    { 
      val: ComplexityLevel.TRIPLE, 
      title: '3 Livelli', 
      desc: 'Base (7.5), Intermedio (8.5), Avanzato (10).' 
    },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="w-full max-w-lg mx-auto p-4"
    >
      <div className="text-center mb-10">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-indigo-500/10 text-indigo-400 mb-4">
          <Settings2 size={32} />
        </div>
        <h1 className="text-3xl font-bold text-white mb-2">Configurazione Verifica</h1>
        <p className="text-zinc-400">Imposta i parametri iniziali per il calcolo.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Total Points Input */}
        <div className="space-y-3">
          <label className="flex items-center gap-2 text-sm font-medium text-zinc-300">
            <Hash size={16} />
            Punteggio Totale
          </label>
          <div className="relative group">
            <input
              type="number"
              min="1"
              value={points}
              onChange={(e) => setPoints(Number(e.target.value))}
              className="w-full bg-zinc-900 border-2 border-zinc-800 rounded-xl px-4 py-4 text-2xl font-bold text-white focus:outline-none focus:border-indigo-500 transition-colors text-center"
            />
            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-600 text-sm font-semibold pointer-events-none">
              PUNTI
            </div>
          </div>
        </div>

        {/* Level Selection */}
        <div className="space-y-3">
          <label className="flex items-center gap-2 text-sm font-medium text-zinc-300">
            <Layers size={16} />
            Livelli di Complessità
          </label>
          <div className="grid grid-cols-1 gap-3">
            {levelOptions.map((opt) => (
              <div
                key={opt.val}
                onClick={() => setLevel(opt.val)}
                className={`cursor-pointer relative p-4 rounded-xl border-2 transition-all duration-200 flex flex-col items-start ${
                  level === opt.val
                    ? 'bg-indigo-900/20 border-indigo-500'
                    : 'bg-zinc-900 border-zinc-800 hover:border-zinc-700'
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <span className={`font-bold ${level === opt.val ? 'text-indigo-400' : 'text-zinc-200'}`}>
                    {opt.title}
                  </span>
                  {level === opt.val && (
                    <div className="w-4 h-4 rounded-full bg-indigo-500 shadow-lg shadow-indigo-500/50" />
                  )}
                </div>
                <p className="text-xs text-zinc-500 mt-1">{opt.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <Button type="submit" fullWidth className="mt-6">
          Inizia Calcolo
        </Button>
      </form>
    </motion.div>
  );
};
