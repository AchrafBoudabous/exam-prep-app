'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { getCategories } from '@/lib/questionLoader';
import { useBookmarks } from '@/contexts/BookmarkContext';
import { Question } from '@/lib/types';

export default function BookmarkedPage() {
  const router = useRouter();
  const { bookmarks } = useBookmarks();
  const [bookmarkedQuestions, setBookmarkedQuestions] = useState<Question[]>([]);

  useEffect(() => {
    const categories = getCategories();
    const allQuestions: Question[] = [];
    
    categories.forEach(cat => {
      try {
        const questions = require(`@/data/${cat.type === 'mcq_single' ? 'mcq-single' : 
          cat.type === 'mcq_multi' ? 'mcq-multi' :
          cat.type === 'fill_gaps' ? 'fill-gaps' : 'complete-code'}.json`).questions;
        
        if (questions) {
          allQuestions.push(...questions);
        }
      } catch (e) {
      }
    });

    const bookmarked = allQuestions.filter(q => bookmarks.has(q.id));
    setBookmarkedQuestions(bookmarked);
  }, [bookmarks]);

  if (bookmarkedQuestions.length === 0) {
    return (
      <main className="min-h-screen">
        <div className="container mx-auto px-4 py-12 max-w-4xl">
          <button
            onClick={() => router.push('/')}
            className="text-blue-600 hover:text-blue-800 mb-8"
          >
            ← Back to Home
          </button>

          <div className="text-center bg-white rounded-xl p-12 shadow-lg border border-gray-200">
            <span className="text-6xl mb-4 block">📖</span>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              No Bookmarked Questions
            </h1>
            <p className="text-gray-600 mb-6">
              Start practicing and bookmark questions you want to review later!
            </p>
            <button
              onClick={() => router.push('/')}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Browse Categories
            </button>
          </div>
        </div>
      </main>
    );
  }

  const groupedQuestions: Record<string, Question[]> = {};
  bookmarkedQuestions.forEach(q => {
    if (!groupedQuestions[q.category]) {
      groupedQuestions[q.category] = [];
    }
    groupedQuestions[q.category].push(q);
  });

  return (
    <main className="min-h-screen">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="mb-8">
          <button
            onClick={() => router.push('/')}
            className="text-blue-600 hover:text-blue-800 mb-2"
          >
            ← Back to Home
          </button>
          <h1 className="text-3xl font-bold text-gray-900">
            Bookmarked Questions
          </h1>
          <p className="text-gray-600">
            {bookmarkedQuestions.length} saved {bookmarkedQuestions.length === 1 ? 'question' : 'questions'}
          </p>
        </div>

        <div className="space-y-6">
          {Object.entries(groupedQuestions).map(([category, questions]) => (
            <div key={category} className="bg-white rounded-xl p-6 shadow-md border border-gray-200">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                {category}
              </h2>
              <div className="space-y-3">
                {questions.map((q, idx) => (
                  <div key={q.id} className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-900 line-clamp-2">
                      {idx + 1}. {q.prompt.substring(0, 100)}...
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500 mb-4">
            Practice these questions in their respective categories
          </p>
          <button
            onClick={() => router.push('/')}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Browse All Categories
          </button>
        </div>
      </div>
    </main>
  );
}