export enum ComplexityLevel {
  SINGLE = 1,
  DUAL = 2,
  TRIPLE = 3,
}

export interface AppConfig {
  totalPoints: number;
  levels: ComplexityLevel;
  isConfigured: boolean;
}

export interface GradeResult {
  label: string;
  score: number;
  maxScore: number;
  color: string;
  description?: string;
}
