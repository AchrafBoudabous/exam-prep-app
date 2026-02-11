// components/HomeClient.tsx

'use client';

import { CategoryInfo } from '@/lib/types';
import CategoryCard from '@/components/CategoryCard';
import { useBookmarks } from '@/contexts/BookmarkContext';
import Link from 'next/link';

interface HomeClientProps {
  categories: CategoryInfo[];
  totalQuestions: number;
}

export default function HomeClient({ categories, totalQuestions }: HomeClientProps) {
  const { getBookmarkCount } = useBookmarks();
  const bookmarkCount = getBookmarkCount();

  return (
    <main className="min-h-screen">
      <div className="container mx-auto px-4 py-12 max-w-6xl">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="inline-block mb-4">
            <span className="text-6xl">📚</span>
          </div>
          <h1 className="text-5xl font-bold text-gray-900 mb-4 tracking-tight">
            Hadoop Exam Prep
          </h1>
          <p className="text-xl text-gray-700 max-w-2xl mx-auto mb-2">
            Master your skills with interactive practice questions
          </p>
          <div className="flex items-center justify-center gap-6 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <span className="text-2xl">✓</span>
              <span>{totalQuestions} Questions</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">⚡</span>
              <span>Instant Feedback</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">🎯</span>
              <span>Track Progress</span>
            </div>
          </div>
        </div>

        {/* Bookmarked Questions Link */}
        {bookmarkCount > 0 && (
          <div className="mb-6">
            <Link
              href="/bookmarked"
              className="block p-4 bg-yellow-50 border-2 border-yellow-200 rounded-xl hover:bg-yellow-100 transition-all"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">⭐</span>
                  <div>
                    <h3 className="font-semibold text-yellow-900">
                      Bookmarked Questions
                    </h3>
                    <p className="text-sm text-yellow-700">
                      Review your {bookmarkCount} saved {bookmarkCount === 1 ? 'question' : 'questions'}
                    </p>
                  </div>
                </div>
                <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </Link>
          </div>
        )}

        {/* Categories Grid */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Choose Your Category
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {categories.map((category) => (
              <CategoryCard key={category.name} category={category} />
            ))}
          </div>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 text-center">
            <div className="text-4xl mb-3">📖</div>
            <h3 className="font-semibold text-gray-900 mb-2">Practice Mode</h3>
            <p className="text-sm text-gray-600">
              Get instant feedback after each question to learn as you go
            </p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 text-center">
            <div className="text-4xl mb-3">📝</div>
            <h3 className="font-semibold text-gray-900 mb-2">Exam Mode</h3>
            <p className="text-sm text-gray-600">
              Test yourself with all questions before seeing results
            </p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 text-center">
            <div className="text-4xl mb-3">⭐</div>
            <h3 className="font-semibold text-gray-900 mb-2">Bookmark</h3>
            <p className="text-sm text-gray-600">
              Save difficult questions and review them later
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-12 text-sm text-gray-500">
          <p>Good luck with your exam preparation! 🚀</p>
        </div>
      </div>
    </main>
  );
}