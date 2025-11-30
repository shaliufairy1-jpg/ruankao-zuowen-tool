export interface DimensionScore {
  name: string;
  score: number;
  fullMark: number;
  comment: string;
}

export interface SuggestionItem {
  point: string;
  quote: string;
}

export interface EvaluationResult {
  totalScore: number; // Out of 75 usually
  isPass: boolean;
  summary: string;
  dimensions: DimensionScore[];
  strengths: string[];
  weaknesses: string[];
  suggestions: SuggestionItem[];
}

export enum AnalysisStatus {
  IDLE = 'IDLE',
  ANALYZING = 'ANALYZING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR',
}