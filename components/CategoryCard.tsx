// components/CategoryCard.tsx

import Link from 'next/link';
import { CategoryInfo } from '@/lib/types';

interface CategoryCardProps {
  category: CategoryInfo;
}

const categoryIcons: Record<string, string> = {
  'MCQ questions (One answer)': '✓',
  'MCQ questions (Multiple answers)': '☑',
  'Fill in the Gaps': '✏️',
  'Complete the code': '💻',
};

const categoryColors: Record<string, string> = {
  'MCQ questions (One answer)': 'from-green-50 to-green-100 border-green-200 hover:border-green-300',
  'MCQ questions (Multiple answers)': 'from-blue-50 to-blue-100 border-blue-200 hover:border-blue-300',
  'Fill in the Gaps': 'from-yellow-50 to-yellow-100 border-yellow-200 hover:border-yellow-300',
  'Complete the code': 'from-purple-50 to-purple-100 border-purple-200 hover:border-purple-300',
};

export default function CategoryCard({ category }: CategoryCardProps) {
  const icon = categoryIcons[category.name] || '📝';
  const colorClass = categoryColors[category.name] || 'from-gray-50 to-gray-100 border-gray-200';

  return (
    <Link
      href={`/quiz/${encodeURIComponent(category.name)}`}
      className={`block p-6 bg-gradient-to-br ${colorClass} border-2 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 transform hover:-translate-y-1 group`}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="text-4xl group-hover:scale-110 transition-transform duration-200">
          {icon}
        </div>
        <div className="bg-white px-3 py-1 rounded-full text-xs font-semibold text-gray-700 shadow-sm">
          {category.count} {category.count === 1 ? 'question' : 'questions'}
        </div>
      </div>
      <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-gray-700 transition-colors">
        {category.name}
      </h3>
      <div className="flex items-center text-sm text-gray-600">
        <span className="mr-2">→</span>
        <span className="group-hover:translate-x-1 transition-transform duration-200">
          Start practicing
        </span>
      </div>
    </Link>
  );
}