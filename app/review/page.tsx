'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Question, ValidationResult } from '@/lib/types';
import ReviewCard from '@/components/ReviewCard';

interface ReviewItem {
  question: Question;
  result: ValidationResult;
}

export default function ReviewPage() {
  const router = useRouter();
  const [reviewItems, setReviewItems] = useState<ReviewItem[]>([]);

  useEffect(() => {
    const data = sessionStorage.getItem('reviewData');
    if (data) {
      setReviewItems(JSON.parse(data));
    } else {
      router.push('/');
    }
  }, [router]);

  if (reviewItems.length === 0) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Loading review...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {}
        <div className="mb-8">
          <button
            onClick={() => router.push('/')}
            className="text-blue-600 hover:text-blue-800 mb-4"
          >
            ← Back to Categories
          </button>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Review Incorrect Answers
          </h1>
          <p className="text-gray-600">
            {reviewItems.length} {reviewItems.length === 1 ? 'question' : 'questions'} to review
          </p>
        </div>

        {}
        <div className="space-y-6">
          {reviewItems.map((item) => (
            <ReviewCard
              key={item.question.id}
              question={item.question}
              result={item.result}
            />
          ))}
        </div>

        {}
        <div className="mt-8 text-center">
          <button
            onClick={() => router.push('/')}
            className="px-8 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Back to Categories
          </button>
        </div>
      </div>
    </main>
  );
}