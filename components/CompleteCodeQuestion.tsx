// components/CompleteCodeQuestion.tsx

'use client';

import { CompleteCodeQuestion } from '@/lib/types';
import { useState, useEffect } from 'react';

interface CompleteCodeQuestionProps {
  question: CompleteCodeQuestion;
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

export default function CompleteCodeQuestionComponent({
  question,
  onAnswer,
  disabled = false,
  showFeedback = false,
  userAnswer,
  isCorrect,
  feedback,
}: CompleteCodeQuestionProps) {
  const [randomizedQuestion, setRandomizedQuestion] = useState<any>(null);
  const [answers, setAnswers] = useState<string[]>([]);

  // Randomize blanks on mount (client-side only)
  useEffect(() => {
    const scriptData = (question as any)._scriptData;
    
    if (scriptData) {
      // This is a code script that needs randomization
      const lines = question.prompt.split('\n');
      const maxBlanks = Math.min(scriptData.maxBlanks, scriptData.blankableLines.length);
      
      // Randomly select lines to blank out
      const shuffled = [...scriptData.blankableLines].sort(() => Math.random() - 0.5);
      const selectedLines = shuffled.slice(0, maxBlanks).sort((a, b) => a - b);
      
      // Extract the correct answers for selected lines
      const correctAnswers: string[] = [];
      selectedLines.forEach(lineIndex => {
        correctAnswers.push(lines[lineIndex].trim());
      });
      
      // Build the prompt with gaps
      let promptLines = [...lines];
      selectedLines.forEach(lineIndex => {
        promptLines[lineIndex] = '___';
      });
      
      setRandomizedQuestion({
        ...question,
        prompt: promptLines.join('\n'),
        correctAnswer: correctAnswers
      });
      
      setAnswers(userAnswer || Array(correctAnswers.length).fill(''));
    } else {
      // Already has blanks (fill-gaps style)
      setRandomizedQuestion(question);
      setAnswers(userAnswer || Array(question.correctAnswer.length).fill(''));
    }
  }, [question.id]);

  const handleChange = (index: number, value: string) => {
    if (disabled) return;
    const newAnswers = [...answers];
    newAnswers[index] = value;
    setAnswers(newAnswers);
    onAnswer(newAnswers);
  };

  // Wait for randomization to complete
  if (!randomizedQuestion) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-gray-500">Loading question...</div>
      </div>
    );
  }

  // Parse prompt to find placeholders
  const lines = randomizedQuestion.prompt.split('\n');
  let placeholderIndex = 0;

  return (
    <div className="space-y-4">
      {/* Category Badge */}
      {randomizedQuestion.category && (
        <div className="mb-3">
          <span className="inline-block bg-purple-100 text-purple-800 text-xs font-semibold px-3 py-1 rounded-full">
            {randomizedQuestion.category}
          </span>
        </div>
      )}

      {/* Description */}
      {randomizedQuestion.explanation && (
        <div className="mb-4 p-4 bg-blue-50 border-l-4 border-blue-500 text-blue-900 rounded-lg">
          <p className="text-sm font-medium">{randomizedQuestion.explanation}</p>
        </div>
      )}

      {/* Code Display with Inline Inputs */}
      <div className="bg-gray-900 text-gray-100 p-4 rounded-lg font-mono text-sm overflow-x-auto">
        <pre className="whitespace-pre">
          {lines.map((line: string, lineIndex: number) => {
            if (line.trim() === '___') {
              const currentIndex = placeholderIndex++;
              const userAns = showFeedback ? (userAnswer?.[currentIndex] || '') : (answers[currentIndex] || '');
              const correctAns = randomizedQuestion.correctAnswer[currentIndex];
              const isCorrectLine = showFeedback && randomizedQuestion.settings?.caseSensitive
                ? userAns.trim() === correctAns?.trim()
                : showFeedback && userAns.trim().toLowerCase() === correctAns?.trim().toLowerCase();

              return (
                <div key={lineIndex} className="my-1">
                  {!showFeedback ? (
                    <input
                      type="text"
                      value={answers[currentIndex] || ''}
                      onChange={(e) => handleChange(currentIndex, e.target.value)}
                      disabled={disabled}
                      className="w-full px-3 py-2 border-2 rounded font-mono text-sm border-gray-500 bg-gray-800 text-white focus:outline-none focus:border-blue-400"
                      placeholder={`Gap ${currentIndex + 1}...`}
                    />
                  ) : (
                    <div
                      className={`py-2 px-3 rounded ${
                        isCorrectLine ? 'bg-green-900 border-2 border-green-500' : 'bg-red-900 border-2 border-red-500'
                      }`}
                    >
                      {userAns || '(empty)'}
                    </div>
                  )}
                </div>
              );
            }
            return <div key={lineIndex}>{line}</div>;
          })}
        </pre>
      </div>

      {/* Detailed Feedback Section */}
      {showFeedback && randomizedQuestion.correctAnswer && (
        <div className="mt-6 space-y-4">
          <div className="space-y-3">
            <p className="font-semibold text-gray-900">Answer Review:</p>
            {randomizedQuestion.correctAnswer.map((correctAns: string, idx: number) => {
              const userAns = userAnswer?.[idx] || '';
              const isCorrectAns = randomizedQuestion.settings?.caseSensitive
                ? userAns.trim() === correctAns.trim()
                : userAns.trim().toLowerCase() === correctAns.trim().toLowerCase();

              return (
                <div
                  key={idx}
                  className={`p-4 rounded-lg border-2 ${
                    isCorrectAns
                      ? 'bg-green-50 border-green-500'
                      : 'bg-red-50 border-red-500'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`text-lg font-bold ${isCorrectAns ? 'text-green-600' : 'text-red-600'}`}>
                      {isCorrectAns ? '✓' : '✗'}
                    </span>
                    <span className="text-sm font-semibold text-gray-700">Gap {idx + 1}</span>
                  </div>

                  {!isCorrectAns && (
                    <>
                      <div className="mb-2">
                        <p className="text-xs text-gray-600 mb-1">Your answer:</p>
                        <code className="block text-sm font-mono text-red-900 bg-red-100 px-3 py-2 rounded break-all">
                          {userAns || '(empty)'}
                        </code>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600 mb-1">Correct answer:</p>
                        <code className="block text-sm font-mono text-green-900 bg-green-100 px-3 py-2 rounded break-all">
                          {correctAns}
                        </code>
                      </div>
                    </>
                  )}

                  {isCorrectAns && (
                    <div>
                      <p className="text-xs text-gray-600 mb-1">Your answer:</p>
                      <code className="block text-sm font-mono text-green-900 bg-green-100 px-3 py-2 rounded break-all">
                        {userAns}
                      </code>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}