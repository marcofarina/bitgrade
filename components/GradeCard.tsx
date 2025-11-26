import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { GradeResult } from '../types';

interface GradeCardProps {
  result: GradeResult;
  index: number;
}

export const GradeCard: React.FC<GradeCardProps> = ({ result, index }) => {
  const [displayScore, setDisplayScore] = useState(0);

  useEffect(() => {
    let start = displayScore;
    const end = result.score;
    
    // Immediate jump if starting from 0 (first load) to avoid long count up
    if (Math.abs(end - start) > 5 && start === 0) start = end - 2;

    const duration = 400; // Faster animation
    const startTime = performance.now();
    let animationFrameId: number;

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3); // Cubic ease out
      
      const current = start + (end - start) * ease;
      setDisplayScore(current);

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(animate);
      }
    };
    
    animationFrameId = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationFrameId);
  }, [result.score]);

  const getStatusColor = (val: number) => {
    if (val >= 6) return 'emerald-500';
    if (val >= 4.5) return 'yellow-500';
    return 'rose-500';
  };

  const statusColor = getStatusColor(result.score);
  const ringColor = `stroke-${statusColor}`;
  const textColor = `text-${statusColor}`;
  const trackColor = 'stroke-zinc-800';

  const formatGrade = (val: number) => {
    const rounded = Math.round(val * 4) / 4;
    const integer = Math.floor(rounded);
    const decimal = rounded - integer;

    // Responsive font sizes
    const mainNumberStyle = `text-6xl md:text-8xl font-black ${textColor} tracking-tighter transition-colors duration-300`;
    const fractionStyle = "text-[0.5em] align-middle inline-block ml-1 relative -top-1 font-bold"; 
    const suffixStyle = "align-top text-[0.6em] relative top-2 ml-1";

    if (decimal === 0) {
      return <span className={mainNumberStyle}>{integer}</span>;
    }
    if (decimal === 0.25) {
      return <span className={mainNumberStyle}>{integer}<span className={suffixStyle}>+</span></span>;
    }
    if (decimal === 0.5) {
      return <span className={`${mainNumberStyle} flex items-center justify-center`}>{integer}<span className={fractionStyle}>½</span></span>;
    }
    if (decimal === 0.75) {
      return <span className={mainNumberStyle}>{integer + 1}<span className={suffixStyle}>-</span></span>;
    }
    return <span className={mainNumberStyle}>{integer}</span>;
  };

  const radius = 100;
  const circumference = 2 * Math.PI * radius;
  const progress = Math.min(Math.max(displayScore / 10, 0), 1); 
  const offset = circumference - progress * circumference;

  return (
    <motion.div
      layout // Helps with smooth resizing
      className="bg-zinc-900/60 backdrop-blur-2xl border border-zinc-800/60 rounded-[2rem] md:rounded-[3rem] p-6 md:p-12 flex flex-col items-center justify-center shadow-2xl relative overflow-hidden w-full max-w-[320px] md:max-w-md mx-auto aspect-square md:aspect-auto"
    >
      {/* Background Glow */}
      <div className={`absolute -top-20 -right-20 w-48 h-48 md:w-64 md:h-64 bg-${statusColor} opacity-10 blur-[60px] md:blur-[80px] rounded-full transition-colors duration-300`} />
      <div className={`absolute -bottom-20 -left-20 w-48 h-48 md:w-64 md:h-64 bg-${statusColor} opacity-10 blur-[60px] md:blur-[80px] rounded-full transition-colors duration-300`} />

      {/* Header Label */}
      <div className="text-center mb-4 md:mb-8 relative z-10 shrink-0">
        <h3 className={`text-xl md:text-2xl font-bold text-white mb-1 md:mb-2`}>{result.label}</h3>
        <p className="text-zinc-500 text-[10px] md:text-sm font-semibold tracking-wide bg-zinc-950/50 px-3 py-1 rounded-full inline-block border border-zinc-800/50">
           {result.description}
        </p>
      </div>

      {/* Main Ring & Score */}
      <div className="relative flex items-center justify-center w-48 h-48 md:w-72 md:h-72 z-10 mb-4 md:mb-8 shrink-0">
         <svg className="w-full h-full transform -rotate-90 drop-shadow-2xl overflow-visible" viewBox="0 0 240 240">
            {/* Track */}
            <circle
              className={trackColor}
              strokeWidth="16" 
              fill="transparent"
              r={radius}
              cx="120"
              cy="120"
            />
            {/* Progress */}
            <circle
              className={`${ringColor} transition-colors duration-300`}
              strokeWidth="16"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              strokeLinecap="round"
              fill="transparent"
              r={radius}
              cx="120"
              cy="120"
            />
         </svg>
         
         {/* Centered Grade Text */}
         <div className="absolute inset-0 flex flex-col items-center justify-center">
            {formatGrade(displayScore)}
         </div>
      </div>

      {/* Footer Label */}
      <div className="z-10 shrink-0">
          <span className="text-[10px] md:text-sm text-zinc-500 font-extrabold uppercase tracking-[0.2em]">Voto Finale</span>
      </div>
      
    </motion.div>
  );
};