// components/BookmarkButton.tsx

'use client';

import { useBookmarks } from '@/contexts/BookmarkContext';

interface BookmarkButtonProps {
  questionId: string;
  size?: 'sm' | 'md' | 'lg';
}

export default function BookmarkButton({ questionId, size = 'md' }: BookmarkButtonProps) {
  const { isBookmarked, toggleBookmark } = useBookmarks();
  const bookmarked = isBookmarked(questionId);

  const sizeClasses = {
    sm: 'p-1.5',
    md: 'p-2',
    lg: 'p-3',
  };

  const iconSize = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  return (
    <button
      onClick={() => toggleBookmark(questionId)}
      className={`${sizeClasses[size]} rounded-lg transition-all transform hover:scale-110 ${
        bookmarked
          ? 'bg-yellow-100 text-yellow-600 hover:bg-yellow-200'
          : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
      }`}
      aria-label={bookmarked ? 'Remove bookmark' : 'Add bookmark'}
      title={bookmarked ? 'Remove from bookmarks' : 'Bookmark this question'}
    >
      {bookmarked ? (
        <svg className={iconSize[size]} fill="currentColor" viewBox="0 0 20 20">
          <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
        </svg>
      ) : (
        <svg className={iconSize[size]} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
        </svg>
      )}
    </button>
  );
}