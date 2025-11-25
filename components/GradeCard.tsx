import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { GradeResult } from '../types';

interface GradeCardProps {
  result: GradeResult;
  index: number;
}

export const GradeCard: React.FC<GradeCardProps> = ({ result, index }) => {
  const [displayScore, setDisplayScore] = useState(0);

  // Animation loop to sync number and ring
  useEffect(() => {
    let start = displayScore;
    const end = result.score;
    
    // Jump if difference is huge (e.g. initial load)
    if (Math.abs(end - start) > 5) start = 0;

    const duration = 600; // ms
    const startTime = performance.now();
    let animationFrameId: number;

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out quart
      const ease = 1 - Math.pow(1 - progress, 4);
      
      const current = start + (end - start) * ease;
      setDisplayScore(current);

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(animate);
      }
    };
    
    animationFrameId = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationFrameId);
  }, [result.score]);

  // Determine status color based on NEW thresholds
  // < 4.5 Red
  // 4.5 - 6 Yellow
  // >= 6 Green
  const getStatusColor = (val: number) => {
    if (val >= 6) return 'emerald-500';
    if (val >= 4.5) return 'yellow-500';
    return 'rose-500';
  };

  const statusColor = getStatusColor(result.score);
  const ringColor = `stroke-${statusColor}`;
  const textColor = `text-${statusColor}`;
  const trackColor = 'stroke-zinc-800';

  // Format grade string logic
  // .00 -> Int
  // .25 -> Int+
  // .50 -> Int½
  // .75 -> (Int+1)-
  const formatGrade = (val: number) => {
    // Ensure we are working with quarters
    const rounded = Math.round(val * 4) / 4;
    const integer = Math.floor(rounded);
    const decimal = rounded - integer;

    // Font styles
    const mainNumberStyle = `text-8xl font-black ${textColor} tracking-tighter`;
    // ½ symbol styling: centered vertically relative to number, larger than before
    const fractionStyle = "text-[0.5em] align-middle inline-block ml-1 relative -top-1 font-bold"; 
    const suffixStyle = "align-top text-[0.6em] relative top-2 ml-1";

    if (decimal === 0) {
      return <span className={mainNumberStyle}>{integer}</span>;
    }
    if (decimal === 0.25) {
      return (
        <span className={mainNumberStyle}>
          {integer}<span className={suffixStyle}>+</span>
        </span>
      );
    }
    if (decimal === 0.5) {
      return (
        <span className={`${mainNumberStyle} flex items-center justify-center`}>
          {integer}<span className={fractionStyle}>½</span>
        </span>
      );
    }
    if (decimal === 0.75) {
      // Round up for the minus notation (e.g. 7.75 becomes 8-)
      return (
        <span className={mainNumberStyle}>
          {integer + 1}<span className={suffixStyle}>-</span>
        </span>
      );
    }
    
    return <span className={mainNumberStyle}>{integer}</span>;
  };

  // Calculate SVG dash
  // Note: CSS transitions are removed from the circle to ensure 1:1 sync with the JS number counter
  const radius = 100; // Large hero size
  const circumference = 2 * Math.PI * radius;
  // Map score 0-10 to 0-1 progress
  const progress = Math.min(Math.max(displayScore / 10, 0), 1); 
  const offset = circumference - progress * circumference;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: -20 }}
      transition={{ type: "spring", duration: 0.6, bounce: 0.3 }}
      className="bg-zinc-900/60 backdrop-blur-2xl border border-zinc-800/60 rounded-[3rem] p-12 flex flex-col items-center justify-center shadow-2xl relative overflow-hidden group w-full max-w-md mx-auto"
    >
      {/* Background Glow */}
      <div className={`absolute -top-20 -right-20 w-64 h-64 bg-${statusColor} opacity-10 blur-[80px] rounded-full transition-colors duration-500`} />
      <div className={`absolute -bottom-20 -left-20 w-64 h-64 bg-${statusColor} opacity-10 blur-[80px] rounded-full transition-colors duration-500`} />

      {/* Header Label */}
      <div className="text-center mb-8 relative z-10">
        <h3 className={`text-2xl font-bold text-white mb-2`}>{result.label}</h3>
        <p className="text-zinc-500 text-sm font-semibold tracking-wide bg-zinc-950/50 px-4 py-1.5 rounded-full inline-block border border-zinc-800/50">
           {result.description}
        </p>
      </div>

      {/* Main Ring & Score */}
      <div className="relative flex items-center justify-center w-72 h-72 z-10 mb-8">
         <svg className="w-full h-full transform -rotate-90 drop-shadow-2xl overflow-visible">
            {/* Track */}
            <circle
              className={trackColor}
              strokeWidth="16" 
              fill="transparent"
              r={radius}
              cx="50%"
              cy="50%"
            />
            {/* Progress - No CSS transition for instant sync */}
            <circle
              className={`${ringColor} transition-colors duration-300`}
              strokeWidth="16"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              strokeLinecap="round"
              fill="transparent"
              r={radius}
              cx="50%"
              cy="50%"
            />
         </svg>
         
         {/* Centered Grade Text */}
         <div className="absolute inset-0 flex flex-col items-center justify-center">
            {formatGrade(displayScore)}
         </div>
      </div>

      {/* Footer Label */}
      <div className="z-10">
          <span className="text-sm text-zinc-500 font-extrabold uppercase tracking-[0.2em]">Voto Finale</span>
      </div>
      
    </motion.div>
  );
};