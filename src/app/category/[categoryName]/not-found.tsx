// src/app/category/[categoryName]/not-found.tsx

import Link from 'next/link';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export default function CategoryNotFound() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto py-16 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-6xl font-bold text-white mb-4">404</h1>
          <h2 className="text-3xl font-semibold text-gray-300 mb-4">
            Category Not Found
          </h2>
          <p className="text-gray-400 mb-8">
            The category you're looking for doesn't exist or has no movies yet.
          </p>
          
          <div className="flex gap-4 justify-center">
            <Link
              href="/"
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              Go Home
            </Link>
            <Link
              href="/categories"
              className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
            >
              Browse Categories
            </Link>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}