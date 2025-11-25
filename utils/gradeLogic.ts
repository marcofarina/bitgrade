import { ComplexityLevel, GradeResult } from '../types';

/**
 * Calculates the final grade based on raw score, total points, and difficulty logic.
 * Enforces a minimum grade of 2.
 */
export const calculateGrades = (
  rawScore: number,
  totalPoints: number,
  levelType: ComplexityLevel
): GradeResult[] => {
  // Prevent division by zero
  if (totalPoints <= 0) return [];
  
  // Clamp raw score between 0 and totalPoints for internal calculation safety
  // (Though the UI might allow typing more to show error, we clamp here for logic)
  const validScore = Math.max(0, Math.min(rawScore, totalPoints));

  // Base calculation: Raw score converted to 0-10 scale
  // P_10 = P / (Total / 10) => P * 10 / Total
  const p10 = (validScore / totalPoints) * 10;

  const results: GradeResult[] = [];

  // Helper to ensure min grade is 2
  const finalize = (val: number) => Math.max(2, val);

  // Helper for remapping above 6
  // Formula: 6 + (P_10 - 6) * slope
  const remap = (val10: number, maxTarget: number) => {
    if (val10 < 6) return val10;
    // Slope = (MaxTarget - 6) / (10 - 6)
    const slope = (maxTarget - 6) / 4;
    return 6 + (val10 - 6) * slope;
  };

  // Round to nearest 0.25
  const roundToQuarter = (val: number) => {
    return Math.round(val * 4) / 4;
  };

  if (levelType === ComplexityLevel.SINGLE) {
    results.push({
      label: 'Voto Unico',
      score: roundToQuarter(finalize(p10)),
      maxScore: 10,
      color: 'text-zinc-200', // Default, will be overridden by component logic
      description: 'Mappatura standard'
    });
  } else if (levelType === ComplexityLevel.DUAL) {
    // Level 2 logic
    results.push({
      label: 'Livello Base',
      score: roundToQuarter(finalize(remap(p10, 8))),
      maxScore: 8,
      color: 'text-blue-400',
      description: 'Max 8.0'
    });
    results.push({
      label: 'Livello Avanzato',
      score: roundToQuarter(finalize(p10)),
      maxScore: 10,
      color: 'text-purple-400',
      description: 'Max 10.0'
    });
  } else if (levelType === ComplexityLevel.TRIPLE) {
    // Level 3 logic
    results.push({
      label: 'Livello Base',
      score: roundToQuarter(finalize(remap(p10, 7.5))),
      maxScore: 7.5,
      color: 'text-blue-400',
      description: 'Max 7.5'
    });
    results.push({
      label: 'Livello Intermedio',
      score: roundToQuarter(finalize(remap(p10, 8.5))),
      maxScore: 8.5,
      color: 'text-yellow-400',
      description: 'Max 8.5'
    });
    results.push({
      label: 'Livello Avanzato',
      score: roundToQuarter(finalize(p10)),
      maxScore: 10,
      color: 'text-purple-400',
      description: 'Max 10.0'
    });
  }

  return results;
};