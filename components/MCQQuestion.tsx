// components/MCQQuestion.tsx

'use client';

import { MCQSingleQuestion, MCQMultiQuestion } from '@/lib/types';
import { useState, useEffect } from 'react';

interface MCQQuestionProps {
  question: MCQSingleQuestion | MCQMultiQuestion;
  onAnswer: (answer: number | number[]) => void;
  disabled?: boolean;
  showFeedback?: boolean;
  userAnswer?: number | number[];
  isCorrect?: boolean;
  feedback?: {
    missing?: string[];
    incorrect?: string[];
    correct?: string[];
  };
}

export default function MCQQuestion({
  question,
  onAnswer,
  disabled = false,
  showFeedback = false,
  userAnswer,
  isCorrect,
  feedback,
}: MCQQuestionProps) {
  const isMulti = question.type === 'mcq_multi';
  const [selectedSingle, setSelectedSingle] = useState<number | null>(
    typeof userAnswer === 'number' ? userAnswer : null
  );
  const [selectedMulti, setSelectedMulti] = useState<Set<number>>(
    new Set(Array.isArray(userAnswer) ? userAnswer : [])
  );

  // Reset state when question changes
  useEffect(() => {
    if (isMulti) {
      setSelectedMulti(new Set(Array.isArray(userAnswer) ? userAnswer : []));
    } else {
      setSelectedSingle(typeof userAnswer === 'number' ? userAnswer : null);
    }
  }, [question.id, userAnswer, isMulti]);

  const handleSingleChange = (index: number) => {
    if (disabled) return;
    setSelectedSingle(index);
    onAnswer(index);
  };

  const handleMultiChange = (index: number) => {
    if (disabled) return;
    const newSelected = new Set(selectedMulti);
    if (newSelected.has(index)) {
      newSelected.delete(index);
    } else {
      newSelected.add(index);
    }
    setSelectedMulti(newSelected);
    onAnswer(Array.from(newSelected));
  };

  const getOptionClass = (index: number) => {
    let baseClass = 'block p-4 border-2 rounded-lg cursor-pointer transition-all hover:border-blue-500 ';

    if (showFeedback) {
      const correctAnswers = Array.isArray(question.correctAnswer)
        ? question.correctAnswer
        : [question.correctAnswer];

      const isCorrectOption = correctAnswers.includes(index);
      const isUserSelected = isMulti
        ? selectedMulti.has(index)
        : selectedSingle === index;

      if (isCorrectOption) {
        baseClass += 'border-green-500 bg-green-50 ';
      } else if (isUserSelected && !isCorrectOption) {
        baseClass += 'border-red-500 bg-red-50 ';
      } else {
        baseClass += 'border-gray-300 bg-gray-50 ';
      }
    } else {
      const isSelected = isMulti ? selectedMulti.has(index) : selectedSingle === index;
      if (isSelected) {
        baseClass += 'border-blue-500 bg-blue-50 ';
      } else {
        baseClass += 'border-gray-300 bg-white ';
      }
    }

    return baseClass;
  };

  return (
    <div className="space-y-3">
      {/* Category Badge */}
      {question.category && (
        <div className="mb-3">
          <span className="inline-block bg-green-100 text-green-800 text-xs font-semibold px-3 py-1 rounded-full">
            {question.category}
          </span>
        </div>
      )}

      {question.options.map((option, index) => (
        <div key={index} className={getOptionClass(index)} onClick={() => isMulti ? handleMultiChange(index) : handleSingleChange(index)}>
          <div className="flex items-center gap-3">
            <input
              type={isMulti ? 'checkbox' : 'radio'}
              name={`question-${question.id}`}
              checked={isMulti ? selectedMulti.has(index) : selectedSingle === index}
              onChange={() => {}}
              disabled={disabled}
              className="w-4 h-4 shrink-0 cursor-pointer"
              style={{ margin: 0 }}
            />
            <span className="flex-1 text-gray-800 select-none">{option}</span>
          </div>
        </div>
      ))}

      {showFeedback && !isCorrect && feedback && (
        <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="font-semibold text-yellow-800 mb-2">Feedback:</p>
          {feedback.incorrect && feedback.incorrect.length > 0 && (
            <p className="text-sm text-red-700 mb-1">
              ❌ Incorrectly selected: {feedback.incorrect.join(', ')}
            </p>
          )}
          {feedback.missing && feedback.missing.length > 0 && (
            <p className="text-sm text-orange-700 mb-1">
              ⚠️ Missed correct options: {feedback.missing.join(', ')}
            </p>
          )}
          {feedback.correct && feedback.correct.length > 0 && (
            <p className="text-sm text-green-700">
              ✅ Correctly selected: {feedback.correct.join(', ')}
            </p>
          )}
        </div>
      )}
    </div>
  );
}