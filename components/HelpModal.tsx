import React from 'react';
import { motion } from 'framer-motion';
import { X, CheckCircle2, TrendingUp, Layers } from 'lucide-react';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HelpModal: React.FC<HelpModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop with blur */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm cursor-pointer"
      />

      {/* Modal Content */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ type: "spring", duration: 0.5 }}
        className="relative w-full max-w-lg bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-zinc-800 bg-zinc-900/50">
          <h2 className="text-xl font-bold text-white">Come funziona</h2>
          <button 
            onClick={onClose}
            className="p-2 rounded-full hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 overflow-y-auto space-y-8 custom-scrollbar">
          
          {/* General Logic */}
          <section className="space-y-3">
            <h3 className="flex items-center gap-2 text-indigo-400 font-semibold text-sm uppercase tracking-wider">
              <CheckCircle2 size={16} />
              Logica di Base
            </h3>
            <p className="text-zinc-300 leading-relaxed text-sm">
              Il sistema calcola il voto in decimi basandosi sul punteggio totale.
              La <strong>sufficienza (voto 6)</strong> si ottiene sempre raggiungendo il <strong>60%</strong> dei punti totali.
            </p>
          </section>

          {/* Remapping Logic */}
          <section className="space-y-3">
            <h3 className="flex items-center gap-2 text-indigo-400 font-semibold text-sm uppercase tracking-wider">
              <TrendingUp size={16} />
              Rimappatura Voti
            </h3>
            <p className="text-zinc-300 leading-relaxed text-sm">
              Per i punteggi superiori alla sufficienza, i voti vengono "spalmati" (rimappati) tra il 6 e il voto massimo previsto per quello specifico livello. Il voto minimo assegnabile è sempre 2.
            </p>
          </section>

          {/* Levels Breakdown */}
          <section className="space-y-3">
            <h3 className="flex items-center gap-2 text-indigo-400 font-semibold text-sm uppercase tracking-wider">
              <Layers size={16} />
              Livelli di Verifica
            </h3>
            <div className="grid gap-3">
              <div className="bg-zinc-800/50 p-4 rounded-xl border border-zinc-800">
                <span className="text-white font-bold block mb-1">1 Livello</span>
                <p className="text-xs text-zinc-400">Voto unico da 0 a 10. Nessuna rimappatura complessa.</p>
              </div>
              
              <div className="bg-zinc-800/50 p-4 rounded-xl border border-zinc-800">
                <span className="text-white font-bold block mb-1">2 Livelli</span>
                <ul className="text-xs text-zinc-400 space-y-1 list-disc list-inside">
                  <li><span className="text-blue-400 font-semibold">Base:</span> Voto massimo 8</li>
                  <li><span className="text-purple-400 font-semibold">Avanzato:</span> Voto massimo 10</li>
                </ul>
              </div>

              <div className="bg-zinc-800/50 p-4 rounded-xl border border-zinc-800">
                <span className="text-white font-bold block mb-1">3 Livelli</span>
                <ul className="text-xs text-zinc-400 space-y-1 list-disc list-inside">
                  <li><span className="text-blue-400 font-semibold">Base:</span> Voto massimo 7.5</li>
                  <li><span className="text-yellow-400 font-semibold">Intermedio:</span> Voto massimo 8.5</li>
                  <li><span className="text-purple-400 font-semibold">Avanzato:</span> Voto massimo 10</li>
                </ul>
              </div>
            </div>
          </section>
        </div>
        
        {/* Footer */}
        <div className="p-6 pt-0">
          <button 
            onClick={onClose}
            className="w-full py-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-semibold transition-colors"
          >
            Ho capito
          </button>
        </div>
      </motion.div>
    </div>
  );
};