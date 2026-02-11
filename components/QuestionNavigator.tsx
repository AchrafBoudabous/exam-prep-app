// components/QuestionNavigator.tsx

'use client';

import { useState } from 'react';

interface QuestionNavigatorProps {
  totalQuestions: number;
  currentIndex: number;
  answeredQuestions: Set<number>;
  correctQuestions: Set<number>;
  onNavigate: (index: number) => void;
}

export default function QuestionNavigator({
  totalQuestions,
  currentIndex,
  answeredQuestions,
  correctQuestions,
  onNavigate,
}: QuestionNavigatorProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-white border-2 border-gray-300 rounded-lg hover:border-blue-500 transition-colors shadow-sm"
      >
        <span className="text-gray-700 font-medium">Questions</span>
        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full font-semibold">
          {answeredQuestions.size}/{totalQuestions}
        </span>
        <svg
          className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown Panel */}
      {isOpen && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          ></div>

          {/* Panel */}
          <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-2xl border border-gray-200 z-20 max-h-96 overflow-hidden">
            {/* Header */}
            <div className="p-4 border-b border-gray-200 bg-gray-50">
              <h3 className="font-semibold text-gray-900 mb-2">Question Navigator</h3>
              <div className="flex gap-4 text-xs">
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded bg-green-500"></div>
                  <span className="text-gray-600">Correct</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded bg-red-500"></div>
                  <span className="text-gray-600">Incorrect</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded bg-gray-300"></div>
                  <span className="text-gray-600">Unanswered</span>
                </div>
              </div>
            </div>

            {/* Question Grid */}
            <div className="p-4 overflow-y-auto max-h-64">
              <div className="grid grid-cols-5 gap-2">
                {Array.from({ length: totalQuestions }, (_, i) => {
                  const isAnswered = answeredQuestions.has(i);
                  const isCorrect = correctQuestions.has(i);
                  const isCurrent = i === currentIndex;

                  return (
                    <button
                      key={i}
                      onClick={() => {
                        onNavigate(i);
                        setIsOpen(false);
                      }}
                      className={`
                        aspect-square rounded-lg font-semibold text-sm transition-all
                        ${isCurrent ? 'ring-2 ring-blue-500 ring-offset-2' : ''}
                        ${
                          isAnswered
                            ? isCorrect
                              ? 'bg-green-500 text-white hover:bg-green-600'
                              : 'bg-red-500 text-white hover:bg-red-600'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }
                      `}
                    >
                      {i + 1}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Stats Footer */}
            <div className="p-4 border-t border-gray-200 bg-gray-50">
              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                <div>
                  <div className="text-2xl font-bold text-green-600">{correctQuestions.size}</div>
                  <div className="text-gray-600">Correct</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-red-600">
                    {answeredQuestions.size - correctQuestions.size}
                  </div>
                  <div className="text-gray-600">Incorrect</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-600">
                    {totalQuestions - answeredQuestions.size}
                  </div>
                  <div className="text-gray-600">Remaining</div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}