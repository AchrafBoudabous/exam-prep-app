import { Question, ValidationResult, MCQMultiQuestion, FillGapsQuestion, CompleteCodeQuestion } from './types';

export function validateAnswer(question: Question, userAnswer: any): ValidationResult {
  switch (question.type) {
    case 'mcq_single':
      return validateMCQSingle(question, userAnswer);
    case 'mcq_multi':
      return validateMCQMulti(question as MCQMultiQuestion, userAnswer);
    case 'fill_gaps':
      return validateFillGaps(question as FillGapsQuestion, userAnswer);
    case 'complete_code':
      return validateCompleteCode(question as CompleteCodeQuestion, userAnswer);
    default:
      return {
        isCorrect: false,
        userAnswer,
        correctAnswer: null,
      };
  }
}

function validateMCQSingle(question: Question, userAnswer: number): ValidationResult {
  const mcqQuestion = question as any;
  
  if (userAnswer === null || userAnswer === undefined) {
    return {
      isCorrect: false,
      userAnswer: null,
      correctAnswer: mcqQuestion.correctAnswer,
    };
  }

  const isCorrect = userAnswer === mcqQuestion.correctAnswer;
  return {
    isCorrect,
    userAnswer,
    correctAnswer: mcqQuestion.correctAnswer,
  };
}

function validateMCQMulti(question: MCQMultiQuestion, userAnswer: number[]): ValidationResult {
  const correctSet = new Set(question.correctAnswer);
  const userSet = new Set(userAnswer || []);

  if (!userAnswer || userAnswer.length === 0) {
    return {
      isCorrect: false,
      isPartiallyCorrect: false,
      userAnswer: [],
      correctAnswer: question.correctAnswer,
      feedback: {
        missing: question.correctAnswer.map(idx => question.options[idx]),
        incorrect: [],
        correct: [],
      },
    };
  }

  const isCorrect = 
    correctSet.size === userSet.size &&
    [...correctSet].every(val => userSet.has(val));

  const missing = [...correctSet].filter(val => !userSet.has(val));
  const incorrect = [...userSet].filter(val => !correctSet.has(val));
  const correct = [...userSet].filter(val => correctSet.has(val));

  const isPartiallyCorrect = correct.length > 0 && !isCorrect;

  return {
    isCorrect,
    isPartiallyCorrect,
    userAnswer,
    correctAnswer: question.correctAnswer,
    feedback: {
      missing: missing.map(idx => question.options[idx]),
      incorrect: incorrect.map(idx => question.options[idx]),
      correct: correct.map(idx => question.options[idx]),
    },
  };
}

function validateFillGaps(question: FillGapsQuestion, userAnswer: string[]): ValidationResult {
  const caseSensitive = question.settings?.caseSensitive ?? false;
  const correctAnswers = question.correctAnswer;
  const acceptedAnswers = question.acceptedAnswers || correctAnswers.map(ans => [ans]);

  if (!userAnswer || userAnswer.length === 0) {
    return {
      isCorrect: false,
      isPartiallyCorrect: false,
      userAnswer: [],
      correctAnswer: correctAnswers,
      feedback: {
        correct: [],
        incorrect: correctAnswers.map((ans, idx) => `Gap ${idx + 1}: (empty) (expected: "${ans}")`),
      },
    };
  }

  const results = userAnswer.map((answer, idx) => {
    if (!answer || answer.trim() === '') return false;
    
    const accepted = acceptedAnswers[idx] || [correctAnswers[idx]];
    const normalizedAnswer = caseSensitive ? answer.trim() : answer.trim().toLowerCase();
    
    return accepted.some(acc => {
      if (!acc) return false;
      const normalizedAccepted = caseSensitive ? acc.trim() : acc.trim().toLowerCase();
      return normalizedAnswer === normalizedAccepted;
    });
  });

  const isCorrect = results.every(r => r);
  const isPartiallyCorrect = results.some(r => r) && !isCorrect;

  return {
    isCorrect,
    isPartiallyCorrect,
    userAnswer,
    correctAnswer: correctAnswers,
    feedback: {
      correct: results.map((r, idx) => r ? userAnswer[idx] : null).filter(Boolean) as string[],
      incorrect: results.map((r, idx) => !r ? `Gap ${idx + 1}: "${userAnswer[idx] || '(empty)'}" (expected: "${correctAnswers[idx]}")` : null).filter(Boolean) as string[],
    },
  };
}

function validateCompleteCode(
  question: CompleteCodeQuestion,
  userAnswers: string[]
): ValidationResult {
  if (!userAnswers || userAnswers.length === 0) {
    return {
      isCorrect: false,
      userAnswer: userAnswers,
      correctAnswer: question.correctAnswer,
      feedback: { incorrect: ['Please provide answers for all gaps'] }
    };
  }

  const caseSensitive = question.settings?.caseSensitive ?? true;
  const correctCount = userAnswers.filter((answer, index) => {
    if (!answer || answer.trim() === '') return false;
    
    const correctAnswer = question.correctAnswer[index];
    if (!correctAnswer) return false;
    
    const normalizedAnswer = caseSensitive ? answer.trim() : answer.trim().toLowerCase();
    const normalizedCorrect = caseSensitive ? correctAnswer.trim() : correctAnswer.trim().toLowerCase();

    if (normalizedAnswer === normalizedCorrect) return true;

    if (question.acceptedAnswers && question.acceptedAnswers[index]) {
      const accepted = question.acceptedAnswers[index];
      
      return accepted.some(acc => {
        if (!acc) return false;
        const normalizedAccepted = caseSensitive ? acc.trim() : acc.trim().toLowerCase();
        return normalizedAnswer === normalizedAccepted;
      });
    }

    return false;
  }).length;

  const isCorrect = correctCount === question.correctAnswer.length;
  const incorrectAnswers: string[] = [];

  userAnswers.forEach((answer, index) => {
    if (!answer || answer.trim() === '') {
      incorrectAnswers.push(`Gap ${index + 1}: Empty answer`);
      return;
    }

    const correctAnswer = question.correctAnswer[index];
    if (!correctAnswer) return;
    
    const normalizedAnswer = caseSensitive ? answer.trim() : answer.trim().toLowerCase();
    const normalizedCorrect = caseSensitive ? correctAnswer.trim() : correctAnswer.trim().toLowerCase();

    if (normalizedAnswer !== normalizedCorrect) {
      let isAccepted = false;
      if (question.acceptedAnswers && question.acceptedAnswers[index]) {
        const accepted = question.acceptedAnswers[index];
        isAccepted = accepted.some(acc => {
          if (!acc) return false;
          const normalizedAccepted = caseSensitive ? acc.trim() : acc.trim().toLowerCase();
          return normalizedAnswer === normalizedAccepted;
        });
      }

      if (!isAccepted) {
        incorrectAnswers.push(`Gap ${index + 1}: "${answer}" (expected: "${correctAnswer}")`);
      }
    }
  });

  return {
    isCorrect,
    userAnswer: userAnswers,
    correctAnswer: question.correctAnswer,
    feedback: {
      incorrect: incorrectAnswers
    }
  };
}