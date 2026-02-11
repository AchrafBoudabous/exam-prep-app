import mcqSingleData from '@/data/mcq-single.json';
import mcqMultiData from '@/data/mcq-multi.json';
import fillGapsData from '@/data/fill-gaps.json';
import completeCodeData from '@/data/complete-code.json';

import { Question, MCQSingleQuestion, MCQMultiQuestion, FillGapsQuestion, CompleteCodeQuestion, CategoryInfo, CodeScript } from './types';

export function getCodeScripts(): CodeScript[] {
  return (completeCodeData as any).scripts || [];
}

export function codeScriptToQuestion(script: CodeScript): CompleteCodeQuestion {
  const lines = script.code.split('\n');
  const validBlankableLines = script.blankableLines.filter(lineIndex => {
    const line = lines[lineIndex];
    return line && line.trim().length > 0;
  });
  
  return {
    id: script.id,
    category: script.category,
    type: 'complete_code',
    prompt: script.code, 
    correctAnswer: [], 
    explanation: script.description,
    settings: {
      caseSensitive: script.settings.caseSensitive
    },
    _scriptData: {
      blankableLines: validBlankableLines, 
      maxBlanks: script.settings.maxBlanks
    }
  } as any;
}

export function getQuestionsByCategory(category: string): Question[] {
  switch(category) {
    case 'MCQ questions (One answer)':
      return mcqSingleData.questions as MCQSingleQuestion[];
    case 'MCQ questions (Multiple answers)':
      return mcqMultiData.questions as MCQMultiQuestion[];
    case 'Fill in the Gaps':
      return fillGapsData.questions as FillGapsQuestion[];
    case 'Complete the code':
      const scripts = getCodeScripts();
      return scripts.map(script => codeScriptToQuestion(script));
    default:
      return [];
  }
}

export function getCategories(): CategoryInfo[] {
  return [
    {
      name: 'MCQ questions (One answer)',
      count: mcqSingleData.questions.length,
      type: 'mcq_single',
      description: 'Multiple choice questions with one correct answer'
    },
    {
      name: 'MCQ questions (Multiple answers)',
      count: mcqMultiData.questions.length,
      type: 'mcq_multi',
      description: 'Multiple choice questions with multiple correct answers'
    },
    {
      name: 'Fill in the Gaps',
      count: fillGapsData.questions.length,
      type: 'fill_gaps',
      description: 'Complete the missing words or phrases'
    },
    {
      name: 'Complete the code',
      count: getCodeScripts().length,
      type: 'complete_code',
      description: 'Fill in missing lines of code'
    }
  ];
}

export function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}