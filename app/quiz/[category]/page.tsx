'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { getQuestionsByCategory, shuffleArray } from '@/lib/questionLoader';
import { Question, ValidationResult } from '@/lib/types';
import { validateAnswer } from '@/lib/validation';
import QuestionRenderer from '@/components/QuestionRenderer';
import ProgressBar from '@/components/ProgressBar';
import QuestionNavigator from '@/components/QuestionNavigator';

export default function QuizPage() {
  const params = useParams();
  const router = useRouter();
  const category = decodeURIComponent(params.category as string);

  const [mode, setMode] = useState<'practice' | 'exam' | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Map<string, any>>(new Map());
  const [results, setResults] = useState<Map<string, ValidationResult>>(new Map());
  const [score, setScore] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [currentAnswer, setCurrentAnswer] = useState<any>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [currentValidation, setCurrentValidation] = useState<ValidationResult | null>(null);
  const [shuffleEnabled, setShuffleEnabled] = useState(false);

  const [answeredQuestions, setAnsweredQuestions] = useState<Set<number>>(new Set());
  const [correctQuestions, setCorrectQuestions] = useState<Set<number>>(new Set());

  useEffect(() => {
    const loadedQuestions = getQuestionsByCategory(category);
    if (loadedQuestions.length === 0) {
      router.push('/');
      return;
    }
    setQuestions(loadedQuestions);
  }, [category, router]);

  const startQuiz = (selectedMode: 'practice' | 'exam', shuffle: boolean) => {
    setMode(selectedMode);
    setShuffleEnabled(shuffle);
    if (shuffle) {
      setQuestions(shuffleArray(questions));
    }
  };

  const handleAnswer = (answer: any) => {
    setCurrentAnswer(answer);
  };

  const handleNavigate = (index: number) => {
    if (currentAnswer !== null && currentAnswer !== undefined && !showFeedback) {
      const question = questions[currentIndex];
      const validation = validateAnswer(question, currentAnswer);
      
      const newAnswers = new Map(answers);
      newAnswers.set(question.id, currentAnswer);
      setAnswers(newAnswers);

      const newResults = new Map(results);
      newResults.set(question.id, validation);
      setResults(newResults);

      setAnsweredQuestions(prev => new Set(prev).add(currentIndex));
      if (validation.isCorrect) {
        setCorrectQuestions(prev => new Set(prev).add(currentIndex));
        if (!results.has(question.id)) {
          setScore(score + 1);
        }
      }
    }

    setCurrentIndex(index);
    const targetQuestion = questions[index];
    setCurrentAnswer(answers.get(targetQuestion.id) || null);
    setCurrentValidation(null);
    setShowFeedback(false);
  };

  const handleNext = () => {
  const question = questions[currentIndex];
  
  // ALWAYS save the current answer first (both practice and exam mode)
  if (currentAnswer !== null && currentAnswer !== undefined) {
    const validation = validateAnswer(question, currentAnswer);
    
    const newAnswers = new Map(answers);
    newAnswers.set(question.id, currentAnswer);
    setAnswers(newAnswers);

    const newResults = new Map(results);
    newResults.set(question.id, validation);
    setResults(newResults);

    // Update tracking sets
    setAnsweredQuestions(prev => new Set(prev).add(currentIndex));
    if (validation.isCorrect) {
      setCorrectQuestions(prev => new Set(prev).add(currentIndex));
      if (!results.has(question.id)) {
        setScore(score + 1);
      }
    }

    // Show feedback in practice mode
    if (mode === 'practice') {
      setCurrentValidation(validation);
      setShowFeedback(true);
      return; // Don't move to next question yet
    }
  }

  // Move to next question or finish
  if (currentIndex < questions.length - 1) {
    setCurrentIndex(currentIndex + 1);
    setCurrentAnswer(null);
    setCurrentValidation(null);
    setShowFeedback(false);
  } else {
    // Quiz finished - recalculate ALL results including the last answer we just saved
    if (mode === 'exam') {
      let finalScore = 0;
      const finalResults = new Map<string, ValidationResult>();

      // Create updated answers map with the current answer
      const allAnswers = new Map(answers);
      if (currentAnswer !== null && currentAnswer !== undefined) {
        allAnswers.set(question.id, currentAnswer);
      }

      questions.forEach((q) => {
        const answer = allAnswers.get(q.id);
        const validation = validateAnswer(q, answer);
        finalResults.set(q.id, validation);
        if (validation.isCorrect) {
          finalScore++;
        }
      });

      setResults(finalResults);
      setScore(finalScore);
    }
    setShowResults(true);
  }
};

  const handleContinue = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setCurrentAnswer(null);
      setCurrentValidation(null);
      setShowFeedback(false);
    } else {
      setShowResults(true);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      const prevQuestion = questions[currentIndex - 1];
      setCurrentAnswer(answers.get(prevQuestion.id) || null);
      setCurrentValidation(null);
      setShowFeedback(false);
    }
  };

  const resetQuiz = () => {
    setMode(null);
    setCurrentIndex(0);
    setAnswers(new Map());
    setResults(new Map());
    setScore(0);
    setShowResults(false);
    setCurrentAnswer(null);
    setCurrentValidation(null);
    setShowFeedback(false);
    setAnsweredQuestions(new Set());
    setCorrectQuestions(new Set());
  };

  const goToReview = () => {
    const incorrectQuestions = questions.filter(q => {
      const result = results.get(q.id);
      return result && !result.isCorrect;
    });

    const reviewData = incorrectQuestions.map(q => ({
      question: q,
      result: results.get(q.id)!,
    }));

    sessionStorage.setItem('reviewData', JSON.stringify(reviewData));
    router.push('/review');
  };

  if (!mode) {
    return (
      <main className="min-h-screen">
        <div className="container mx-auto px-4 py-8 max-w-2xl">
          <button
            onClick={() => router.push('/')}
            className="mb-6 text-blue-600 hover:text-blue-800 flex items-center"
          >
            ← Back to Categories
          </button>

          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{category}</h1>
            <p className="text-gray-600">{questions.length} questions available</p>
          </div>

          <div className="space-y-4">
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
              <h2 className="text-xl font-bold text-gray-900 mb-2">Practice Mode</h2>
              <p className="text-gray-600 mb-4">
                Get instant feedback after each question. Perfect for learning!
              </p>
              <button
                onClick={() => startQuiz('practice', shuffleEnabled)}
                className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                Start Practice Mode
              </button>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
              <h2 className="text-xl font-bold text-gray-900 mb-2">Exam Mode</h2>
              <p className="text-gray-600 mb-4">
                Answer all questions first, then see your results. Test your knowledge!
              </p>
              <button
                onClick={() => startQuiz('exam', shuffleEnabled)}
                className="w-full bg-green-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-green-700 transition-colors"
              >
                Start Exam Mode
              </button>
            </div>

            <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200">
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={shuffleEnabled}
                  onChange={(e) => setShuffleEnabled(e.target.checked)}
                  className="w-5 h-5 text-blue-600 mr-3"
                />
                <span className="text-gray-700">Shuffle questions</span>
              </label>
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (showResults) {
    const percentage = Math.round((score / questions.length) * 100);
    const incorrectCount = questions.length - score;

    return (
      <main className="min-h-screen">
        <div className="container mx-auto px-4 py-8 max-w-2xl">
          <div className="bg-white rounded-lg shadow-lg p-8 text-center border border-gray-200">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Quiz Complete! 🎉
            </h1>

            <div className="mb-8">
              <div className="text-6xl font-bold text-blue-600 mb-2">
                {percentage}%
              </div>
              <p className="text-xl text-gray-700">
                {score} out of {questions.length} correct
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <p className="text-sm text-gray-600 mb-1">Correct</p>
                <p className="text-3xl font-bold text-green-600">{score}</p>
              </div>
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-sm text-gray-600 mb-1">Incorrect</p>
                <p className="text-3xl font-bold text-red-600">{incorrectCount}</p>
              </div>
            </div>

            <div className="space-y-3">
              {incorrectCount > 0 && (
                <button
                  onClick={goToReview}
                  className="w-full bg-orange-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-orange-700 transition-colors"
                >
                  Review Incorrect Answers ({incorrectCount})
                </button>
              )}
              <button
                onClick={resetQuiz}
                className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                Try Again
              </button>
              <button
                onClick={() => router.push('/')}
                className="w-full bg-gray-200 text-gray-700 py-3 px-6 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
              >
                Back to Categories
              </button>
            </div>
          </div>
        </div>
      </main>
    );
  }

  const currentQuestion = questions[currentIndex];
  const isAnswered = currentAnswer !== null && currentAnswer !== undefined;
  const canProceed = isAnswered || showFeedback;

  return (
    <main className="min-h-screen">
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        {}
        <div className="mb-6 flex justify-between items-start">
          <div>
            <button
              onClick={() => router.push('/')}
              className="text-blue-600 hover:text-blue-800 mb-2 block"
            >
              ← Exit Quiz
            </button>
            <h1 className="text-2xl font-bold text-gray-900">{category}</h1>
            <p className="text-sm text-gray-600">
              {mode === 'practice' ? '📖 Practice Mode' : '📝 Exam Mode'}
            </p>
          </div>
          
          {}
          {mode === 'practice' && (
            <QuestionNavigator
              totalQuestions={questions.length}
              currentIndex={currentIndex}
              answeredQuestions={answeredQuestions}
              correctQuestions={correctQuestions}
              onNavigate={handleNavigate}
            />
          )}
        </div>

        {}
        <ProgressBar
          current={currentIndex + 1}
          total={questions.length}
          score={mode === 'practice' ? score : undefined}
        />

        {}
        <QuestionRenderer
          question={currentQuestion}
          onAnswer={handleAnswer}
          disabled={showFeedback}
          showFeedback={showFeedback}
          validationResult={currentValidation || undefined}
        />

        {}
        <div className="flex gap-3 mt-6">
          <button
            onClick={handlePrevious}
            disabled={currentIndex === 0}
            className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Previous
          </button>
          
          {showFeedback ? (
            <button
              onClick={handleContinue}
              className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              {currentIndex === questions.length - 1 ? 'Finish' : 'Continue'}
            </button>
          ) : (
            <button
              onClick={handleNext}
              disabled={!canProceed}
              className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {currentIndex === questions.length - 1 ? 'Finish' : 'Next'}
            </button>
          )}
        </div>

        {}
        {!isAnswered && !showFeedback && (
          <p className="text-center text-sm text-gray-500 mt-4">
            {mode === 'practice'
              ? 'Select your answer and click Next to see feedback'
              : 'Select your answer and click Next to continue'}
          </p>
        )}
      </div>
    </main>
  );
}