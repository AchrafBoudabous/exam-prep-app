// components/HintButton.tsx

'use client';

import { useState } from 'react';
import { Question } from '@/lib/types';

interface HintButtonProps {
  question: Question;
  disabled?: boolean;
  onHintUsed?: () => void;
}

export default function HintButton({ question, disabled, onHintUsed }: HintButtonProps) {
  const [showHint, setShowHint] = useState(false);
  const [hintUsed, setHintUsed] = useState(false);

  const handleShowHint = () => {
    if (!hintUsed && onHintUsed) {
      onHintUsed();
      setHintUsed(true);
    }
    setShowHint(!showHint);
  };

  const getHint = () => {
    if (question.type === 'mcq_single' || question.type === 'mcq_multi') {
      const mcqQuestion = question as any;
      const correctAnswer = question.type === 'mcq_single' 
        ? mcqQuestion.correctAnswer 
        : mcqQuestion.correctAnswer[0];
      
      const correctOption = mcqQuestion.options[correctAnswer];
      const firstWord = correctOption.split(' ')[0];
      return `The correct answer starts with: "${firstWord}..."`;
    }
    
    if (question.type === 'fill_gaps' || question.type === 'complete_code') {
      const gapQuestion = question as any;
      const firstAnswer = gapQuestion.correctAnswer[0];
      const firstWord = firstAnswer.split(' ')[0];
      return `The first gap starts with: "${firstWord}..."`;
    }
    
    return 'Review the explanation for guidance.';
  };

  return (
    <div className="space-y-2">
      <button
        onClick={handleShowHint}
        disabled={disabled}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
          showHint
            ? 'bg-yellow-100 text-yellow-700'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
        } disabled:opacity-50 disabled:cursor-not-allowed`}
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
        {showHint ? 'Hide Hint' : 'Show Hint'}
        {hintUsed && !showHint && <span className="text-xs">(Used)</span>}
      </button>

      {showHint && (
        <div className="p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded-lg">
          <div className="flex items-start gap-3">
            <span className="text-2xl">💡</span>
            <div>
              <p className="font-semibold text-yellow-800 mb-1">Hint</p>
              <p className="text-yellow-700 text-sm">
                {getHint()}
              </p>
              {!disabled && (
                <p className="text-xs text-yellow-600 mt-2 italic">
                  Note: Using hints may affect your score tracking
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}