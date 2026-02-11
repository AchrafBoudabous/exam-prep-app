export interface Question {
  id: string;
  category: string;
  type: 'mcq_single' | 'mcq_multi' | 'fill_gaps' | 'complete_code';
  prompt: string;
  explanation: string;
  settings?: {
    shuffleOptions?: boolean;
    caseSensitive?: boolean;
  };
}

export interface MCQSingleQuestion extends Question {
  type: 'mcq_single';
  options: string[];
  correctAnswer: number;
}

export interface MCQMultiQuestion extends Question {
  type: 'mcq_multi';
  options: string[];
  correctAnswer: number[];
}

export interface FillGapsQuestion extends Question {
  type: 'fill_gaps';
  correctAnswer: string[];
  acceptedAnswers?: string[][];
}

export interface CompleteCodeQuestion extends Question {
  type: 'complete_code';
  correctAnswer: string[];
  acceptedAnswers?: string[][];
}

export interface CodeScript {
  id: string;
  category: string;
  title: string;
  description: string;
  code: string;
  blankableLines: number[]; 
  settings: {
    caseSensitive: boolean;
    maxBlanks: number;
  };
}

export interface ValidationResult {
  isCorrect: boolean;
  isPartiallyCorrect?: boolean;
  userAnswer?: any;
  correctAnswer?: any;
  feedback?: {
    correct?: string[];
    incorrect?: string[];
    missing?: string[];
    
  };
}

export interface CategoryInfo {
  name: string;
  count: number;
  type: 'mcq_single' | 'mcq_multi' | 'fill_gaps' | 'complete_code';
  description?: string;
}