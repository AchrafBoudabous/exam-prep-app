import { getCategories } from '@/lib/questionLoader';
import CategoryCard from '@/components/CategoryCard';
import HomeClient from '@/components/HomeClient';

export default function Home() {
  const categories = getCategories();
  const totalQuestions = categories.reduce((sum, cat) => sum + cat.count, 0);

  return <HomeClient categories={categories} totalQuestions={totalQuestions} />;
}