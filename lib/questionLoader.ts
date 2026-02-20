import { Question, MCQSingleQuestion, MCQMultiQuestion, FillGapsQuestion, CompleteCodeQuestion, CategoryInfo, CodeScript } from './types';
import mcqSingleDataRaw from '@/data/mcq-single.json';
import mcqMultiDataRaw from '@/data/mcq-multi.json';
import fillGapsDataRaw from '@/data/fill-gaps.json';
import codeScriptsDataRaw from '@/data/complete-code.json';

const mcqSingleData = mcqSingleDataRaw as { questions: MCQSingleQuestion[] };
const mcqMultiData = mcqMultiDataRaw as { questions: MCQMultiQuestion[] };
const fillGapsData = fillGapsDataRaw as { questions: FillGapsQuestion[] };
const codeScriptsData = codeScriptsDataRaw as { scripts: CodeScript[] };

export function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function shuffleMCQOptions(question: MCQSingleQuestion | MCQMultiQuestion): MCQSingleQuestion | MCQMultiQuestion {
  const originalOptions = [...question.options];
  
  const combined = originalOptions.map((option, index) => ({ option, originalIndex: index }));
  const shuffled = shuffleArray(combined);
  
  const shuffledOptions = shuffled.map(item => item.option);
  const indexMap = new Map(shuffled.map((item, newIndex) => [item.originalIndex, newIndex]));
  
  if (question.type === 'mcq_single') {
    return {
      ...question,
      options: shuffledOptions,
      correctAnswer: indexMap.get(question.correctAnswer) ?? question.correctAnswer,
    };
  } else {
    return {
      ...question,
      options: shuffledOptions,
      correctAnswer: question.correctAnswer.map(oldIndex => indexMap.get(oldIndex) ?? oldIndex),
    };
  }
}

export function getMCQSingleQuestions(): MCQSingleQuestion[] {
  return mcqSingleData.questions.map(q => shuffleMCQOptions(q) as MCQSingleQuestion);
}

export function getMCQMultiQuestions(): MCQMultiQuestion[] {
  return mcqMultiData.questions.map(q => shuffleMCQOptions(q) as MCQMultiQuestion);
}

export function getFillGapsQuestions(): FillGapsQuestion[] {
  return fillGapsData.questions;
}

export function getCodeScripts(): CodeScript[] {
  return codeScriptsData.scripts;
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
      maxBlanks: script.settings.maxBlanks,
      randomize: script.randomize ?? true  // Add this line - default to true if not specified
    }
  } as CompleteCodeQuestion;
}

export function getCompleteCodeQuestions(): CompleteCodeQuestion[] {
  const scripts = getCodeScripts();
  return scripts.map(script => codeScriptToQuestion(script));
}

export function getAllQuestions(): Question[] {
  return [
    ...getMCQSingleQuestions(),
    ...getMCQMultiQuestions(),
    ...getFillGapsQuestions(),
    ...getCompleteCodeQuestions(),
  ];
}

export function getQuestionsByCategory(category: string): Question[] {
  switch (category) {
    case 'MCQ questions (One answer)':
      return getMCQSingleQuestions();
    case 'MCQ questions (Multiple answers)':
      return getMCQMultiQuestions();
    case 'Fill in the Gaps':
      return getFillGapsQuestions();
    case 'Complete the code':
      return getCompleteCodeQuestions();
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
    },
    {
      name: 'MCQ questions (Multiple answers)',
      count: mcqMultiData.questions.length,
      type: 'mcq_multi',
    },
    {
      name: 'Fill in the Gaps',
      count: fillGapsData.questions.length,
      type: 'fill_gaps',
    },
    {
      name: 'Complete the code',
      count: getCodeScripts().length,
      type: 'complete_code',
    },
  ];
}