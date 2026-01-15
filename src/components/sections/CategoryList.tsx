// src/components/sections/CategoryList.tsx

import Link from 'next/link';
import type { Category } from '@/types/category';

interface CategoryListProps {
  categories: Category[];
}

export default function CategoryList({ categories }: CategoryListProps) {
  if (!categories || categories.length === 0) return null;

  return (
    <section className="mb-8">
      <div className="bg-gray-800 rounded-lg p-4 shadow-lg">
        <h2 className="text-xl font-bold text-white mb-4">Browse Categories</h2>
        
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <Link
              key={category.slug}
              href={`/category/${category.slug}`}
              className="px-4 py-2 bg-gray-700 hover:bg-blue-600 text-white text-sm rounded-full transition-all duration-200 hover:scale-105"
            >
              {category.name}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}