// components/QuestionRenderer.tsx

'use client';

import { Question, ValidationResult } from '@/lib/types';
import MCQQuestion from './MCQQuestion';
import FillGapsQuestionComponent from './FillGapsQuestion';
import CompleteCodeQuestionComponent from './CompleteCodeQuestion';
import BookmarkButton from './BookmarkButton';
import HintButton from './HintButton';

interface QuestionRendererProps {
  question: Question;
  onAnswer: (answer: any) => void;
  disabled?: boolean;
  showFeedback?: boolean;
  validationResult?: ValidationResult;
  showHints?: boolean;
  onHintUsed?: () => void;
}

export default function QuestionRenderer({
  question,
  onAnswer,
  disabled = false,
  showFeedback = false,
  validationResult,
  showHints = true,
  onHintUsed,
}: QuestionRendererProps) {
  return (
    <div className="space-y-6">
      {/* Question Card */}
      <div className="bg-white p-8 rounded-xl shadow-md border border-gray-200">
        {/* Question Header with Bookmark */}
        <div className="flex justify-between items-start mb-6">
          <div className="flex-1">
            {question.type !== 'complete_code' && (
              <div className="pb-6 border-b border-gray-100">
                <h2 className="text-2xl font-semibold text-gray-900 leading-relaxed">
                  {question.prompt}
                </h2>
              </div>
            )}
          </div>
          <BookmarkButton questionId={question.id} size="lg" />
        </div>

        {/* Hint Button - Show only before feedback */}
        {showHints && !showFeedback && (
          <div className="mb-6">
            <HintButton
              question={question}
              disabled={showFeedback}
              onHintUsed={onHintUsed}
            />
          </div>
        )}

        {/* Render appropriate question type */}
        {(question.type === 'mcq_single' || question.type === 'mcq_multi') && (
          <MCQQuestion
            question={question as any}
            onAnswer={onAnswer}
            disabled={disabled}
            showFeedback={showFeedback}
            userAnswer={validationResult?.userAnswer}
            isCorrect={validationResult?.isCorrect}
            feedback={validationResult?.feedback}
          />
        )}

        {question.type === 'fill_gaps' && (
          <FillGapsQuestionComponent
            question={question as any}
            onAnswer={onAnswer}
            disabled={disabled}
            showFeedback={showFeedback}
            userAnswer={validationResult?.userAnswer}
            isCorrect={validationResult?.isCorrect}
            feedback={validationResult?.feedback}
          />
        )}

        {question.type === 'complete_code' && (
          <CompleteCodeQuestionComponent
            question={question as any}
            onAnswer={onAnswer}
            disabled={disabled}
            showFeedback={showFeedback}
            userAnswer={validationResult?.userAnswer}
            isCorrect={validationResult?.isCorrect}
            feedback={validationResult?.feedback}
          />
        )}
      </div>

      {/* Explanation (shown after feedback) */}
      {showFeedback && question.explanation && (
        <div className="bg-blue-50 border-l-4 border-blue-500 rounded-lg p-5 shadow-sm">
          <div className="flex items-start gap-3">
            <span className="text-2xl">💡</span>
            <div>
              <p className="font-semibold text-blue-900 mb-2">Explanation</p>
              <p className="text-blue-800 leading-relaxed">{question.explanation}</p>
            </div>
          </div>
        </div>
      )}

      {/* Feedback Summary */}
      {showFeedback && validationResult && (
        <div
          className={`p-6 rounded-xl border-2 shadow-md ${
            validationResult.isCorrect
              ? 'bg-green-50 border-green-500'
              : validationResult.isPartiallyCorrect
              ? 'bg-yellow-50 border-yellow-500'
              : 'bg-red-50 border-red-500'
          }`}
        >
          <div className="flex items-center gap-3">
            <span className="text-4xl">
              {validationResult.isCorrect
                ? '✅'
                : validationResult.isPartiallyCorrect
                ? '⚠️'
                : '❌'}
            </span>
            <div>
              <p
                className={`font-bold text-2xl ${
                  validationResult.isCorrect
                    ? 'text-green-700'
                    : validationResult.isPartiallyCorrect
                    ? 'text-yellow-700'
                    : 'text-red-700'
                }`}
              >
                {validationResult.isCorrect
                  ? 'Correct!'
                  : validationResult.isPartiallyCorrect
                  ? 'Partially Correct'
                  : 'Incorrect'}
              </p>
              <p
                className={`text-sm ${
                  validationResult.isCorrect
                    ? 'text-green-600'
                    : validationResult.isPartiallyCorrect
                    ? 'text-yellow-600'
                    : 'text-red-600'
                }`}
              >
                {validationResult.isCorrect
                  ? 'Great job! Keep it up!'
                  : validationResult.isPartiallyCorrect
                  ? 'You got some parts right. Review the explanation.'
                  : 'Review the correct answer and explanation below.'}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}