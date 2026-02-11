'use client';

import { createContext, useContext, useEffect, useState } from 'react';

interface BookmarkContextType {
  bookmarks: Set<string>;
  toggleBookmark: (questionId: string) => void;
  isBookmarked: (questionId: string) => boolean;
  getBookmarkCount: () => number;
}

const BookmarkContext = createContext<BookmarkContextType | undefined>(undefined);

export function BookmarkProvider({ children }: { children: React.ReactNode }) {
  const [bookmarks, setBookmarks] = useState<Set<string>>(new Set());
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const savedBookmarks = localStorage.getItem('bookmarked_questions');
    if (savedBookmarks) {
      setBookmarks(new Set(JSON.parse(savedBookmarks)));
    }
  }, []);

  useEffect(() => {
    if (mounted) {
      localStorage.setItem('bookmarked_questions', JSON.stringify(Array.from(bookmarks)));
    }
  }, [bookmarks, mounted]);

  const toggleBookmark = (questionId: string) => {
    setBookmarks(prev => {
      const newBookmarks = new Set(prev);
      if (newBookmarks.has(questionId)) {
        newBookmarks.delete(questionId);
      } else {
        newBookmarks.add(questionId);
      }
      return newBookmarks;
    });
  };

  const isBookmarked = (questionId: string) => {
    return bookmarks.has(questionId);
  };

  const getBookmarkCount = () => {
    return bookmarks.size;
  };

  return (
    <BookmarkContext.Provider value={{ bookmarks, toggleBookmark, isBookmarked, getBookmarkCount }}>
      {children}
    </BookmarkContext.Provider>
  );
}

export function useBookmarks() {
  const context = useContext(BookmarkContext);
  if (context === undefined) {
    throw new Error('useBookmarks must be used within a BookmarkProvider');
  }
  return context;
}