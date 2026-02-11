// components/ReviewCard.tsx

'use client';

import { Question, ValidationResult } from '@/lib/types';

interface ReviewCardProps {
  question: Question;
  result: ValidationResult;
}

export default function ReviewCard({ question, result }: ReviewCardProps) {
  const renderCorrectAnswer = () => {
    if (question.type === 'fill_gaps' || question.type === 'complete_code') {
      const answers = (question as any).correctAnswer;
      
      // Safety check for undefined answers
      if (!answers || !Array.isArray(answers) || answers.length === 0) {
        return <p className="text-gray-600 italic">No correct answers available</p>;
      }
      
      return (
        <ul className="list-disc list-inside text-green-700 font-mono text-sm">
          {answers.map((answer: string, idx: number) => (
            <li key={idx} className="mb-1">
              Gap {idx + 1}: <span className="font-semibold">{answer}</span>
            </li>
          ))}
        </ul>
      );
    }

    if (question.type === 'mcq_single') {
      const mcqQuestion = question as any;
      const correctIndex = mcqQuestion.correctAnswer;
      return (
        <p className="text-green-700 font-semibold">
          {mcqQuestion.options[correctIndex]}
        </p>
      );
    }

    if (question.type === 'mcq_multi') {
      const mcqQuestion = question as any;
      const correctIndices = mcqQuestion.correctAnswer;
      return (
        <ul className="list-disc list-inside text-green-700">
          {correctIndices.map((idx: number) => (
            <li key={idx} className="font-semibold">
              {mcqQuestion.options[idx]}
            </li>
          ))}
        </ul>
      );
    }

    return null;
  };

  const renderUserAnswer = () => {
    if (!result.userAnswer) {
      return <p className="text-gray-500 italic">No answer provided</p>;
    }

    if (question.type === 'fill_gaps' || question.type === 'complete_code') {
      const answers = result.userAnswer as string[];
      
      if (!answers || !Array.isArray(answers) || answers.length === 0) {
        return <p className="text-gray-500 italic">No answer provided</p>;
      }
      
      return (
        <ul className="list-disc list-inside text-red-700 font-mono text-sm">
          {answers.map((answer: string, idx: number) => (
            <li key={idx} className="mb-1">
              Gap {idx + 1}: <span className="font-semibold">{answer || '(empty)'}</span>
            </li>
          ))}
        </ul>
      );
    }

    if (question.type === 'mcq_single') {
      const mcqQuestion = question as any;
      const userIndex = result.userAnswer as number;
      return (
        <p className="text-red-700 font-semibold">
          {mcqQuestion.options[userIndex]}
        </p>
      );
    }

    if (question.type === 'mcq_multi') {
      const mcqQuestion = question as any;
      const userIndices = result.userAnswer as number[];
      
      if (!userIndices || userIndices.length === 0) {
        return <p className="text-gray-500 italic">No selections made</p>;
      }
      
      return (
        <ul className="list-disc list-inside text-red-700">
          {userIndices.map((idx: number) => (
            <li key={idx} className="font-semibold">
              {mcqQuestion.options[idx]}
            </li>
          ))}
        </ul>
      );
    }

    return null;
  };

  return (
    <div className="bg-white rounded-lg shadow-md border-2 border-red-200 p-6">
      {/* Question Header */}
      <div className="mb-4">
        <span className="inline-block bg-red-100 text-red-800 text-xs font-semibold px-3 py-1 rounded-full mb-2">
          {question.category}
        </span>
        <h3 className="text-lg font-semibold text-gray-900">
          {question.type !== 'complete_code' && question.prompt}
          {question.type === 'complete_code' && 'Complete the code'}
        </h3>
      </div>

      {/* Your Answer */}
      <div className="mb-4 p-4 bg-red-50 rounded-lg">
        <p className="text-sm font-semibold text-red-900 mb-2">❌ Your Answer:</p>
        {renderUserAnswer()}
      </div>

      {/* Correct Answer */}
      <div className="mb-4 p-4 bg-green-50 rounded-lg">
        <p className="text-sm font-semibold text-green-900 mb-2">✅ Correct Answer:</p>
        {renderCorrectAnswer()}
      </div>

      {/* Explanation */}
      {question.explanation && (
        <div className="p-4 bg-blue-50 rounded-lg border-l-4 border-blue-500">
          <p className="text-sm font-semibold text-blue-900 mb-2">💡 Explanation:</p>
          <p className="text-sm text-blue-800">{question.explanation}</p>
        </div>
      )}

      {/* Feedback Details */}
      {result.feedback && (
        <div className="mt-4">
          {result.feedback.incorrect && result.feedback.incorrect.length > 0 && (
            <div className="text-sm text-red-700">
              <p className="font-semibold mb-1">Issues:</p>
              <ul className="list-disc list-inside">
                {result.feedback.incorrect.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </div>
          )}
          
          {result.feedback.missing && result.feedback.missing.length > 0 && (
            <div className="text-sm text-orange-700 mt-2">
              <p className="font-semibold mb-1">Missing selections:</p>
              <ul className="list-disc list-inside">
                {result.feedback.missing.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}