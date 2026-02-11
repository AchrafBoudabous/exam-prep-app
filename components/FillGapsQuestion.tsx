// components/FillGapsQuestion.tsx

'use client';

import { FillGapsQuestion } from '@/lib/types';
import { useState, useEffect } from 'react';

interface FillGapsQuestionProps {
  question: FillGapsQuestion;
  onAnswer: (answers: string[]) => void;
  disabled?: boolean;
  showFeedback?: boolean;
  userAnswer?: string[];
  isCorrect?: boolean;
  feedback?: {
    correct?: string[];
    incorrect?: string[];
  };
}

export default function FillGapsQuestionComponent({
  question,
  onAnswer,
  disabled = false,
  showFeedback = false,
  userAnswer,
  isCorrect,
  feedback,
}: FillGapsQuestionProps) {
  const gapCount = question.correctAnswer.length;
  const [answers, setAnswers] = useState<string[]>(
    userAnswer || Array(gapCount).fill('')
  );

  // Reset state when question changes
  useEffect(() => {
    setAnswers(userAnswer || Array(gapCount).fill(''));
  }, [question.id, userAnswer, gapCount]);

  const handleChange = (index: number, value: string) => {
    if (disabled) return;
    const newAnswers = [...answers];
    newAnswers[index] = value;
    setAnswers(newAnswers);
    onAnswer(newAnswers);
  };

  // Parse prompt to find gaps (marked as ___ or {{gap}})
  const parts = question.prompt.split(/(___|{{gap}})/g);
  let gapIndex = 0;

  return (
    <div className="space-y-4">
      {/* Category Badge */}
      {question.category && (
        <div className="mb-3">
          <span className="inline-block bg-blue-100 text-blue-800 text-xs font-semibold px-3 py-1 rounded-full">
            {question.category}
          </span>
        </div>
      )}

      <div className="text-lg leading-relaxed">
        {parts.map((part, index) => {
          if (part === '___' || part === '{{gap}}') {
            const currentGapIndex = gapIndex++;
            const isCorrectGap =
              showFeedback &&
              userAnswer &&
              question.correctAnswer[currentGapIndex] &&
              (question.settings?.caseSensitive
                ? userAnswer[currentGapIndex]?.trim() ===
                  question.correctAnswer[currentGapIndex].trim()
                : userAnswer[currentGapIndex]?.trim().toLowerCase() ===
                  question.correctAnswer[currentGapIndex].trim().toLowerCase());

            return (
              <input
                key={index}
                type="text"
                value={answers[currentGapIndex] || ''}
                onChange={(e) => handleChange(currentGapIndex, e.target.value)}
                disabled={disabled}
                className={`inline-block mx-1 px-3 py-1 border-2 rounded text-gray-900 ${
                  showFeedback
                    ? isCorrectGap
                      ? 'border-green-500 bg-green-50'
                      : 'border-red-500 bg-red-50'
                    : 'border-gray-300 bg-white'
                } focus:outline-none focus:border-blue-500 min-w-30`}
                placeholder={`Gap ${currentGapIndex + 1}`}
              />
            );
          }
          return <span key={index}>{part}</span>;
        })}
      </div>

      {showFeedback && !isCorrect && (
        <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="font-semibold text-yellow-800 mb-2">Correct Answers:</p>
          {question.correctAnswer.map((answer, idx) => (
            <p key={idx} className="text-sm text-gray-700">
              Gap {idx + 1}: <span className="font-mono font-semibold">{answer}</span>
            </p>
          ))}
          {feedback?.incorrect && feedback.incorrect.length > 0 && (
            <div className="mt-2">
              <p className="text-sm text-red-700 font-semibold">Your incorrect answers:</p>
              {feedback.incorrect.map((err, idx) => (
                <p key={idx} className="text-sm text-red-600">
                  {err}
                </p>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}