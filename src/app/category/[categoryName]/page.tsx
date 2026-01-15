// src/app/category/[categoryName]/page.tsx

import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import MovieGrid from '@/components/movie/MovieGrid';
import Pagination from '@/components/common/Pagination';
import { MovieGridSkeleton } from '@/components/common/Loading';
import type { Movie } from '@/types/movie';

async function getCategoryMovies(
  category: string, 
  page: number = 1
): Promise<{ movies: Movie[], totalPages: number, categoryName: string }> {
  // Replace with actual API call
  const mockMovies: Movie[] = Array.from({ length: 60 }, (_, i) => ({
    id: `${category}-${i + 1}`,
    slug: `${category}-movie-${i + 1}`,
    title: `${category} Movie ${i + 1} (2025) WEB-DL 1080p`,
    poster: `https://image.tmdb.org/t/p/w342/placeholder.jpg`,
    thumbnail: `https://image.tmdb.org/t/p/w342/placeholder.jpg`,
    year: '2025',
    quality: '1080p',
    categories: [category],
  }));

  return {
    movies: mockMovies,
    totalPages: 50,
    categoryName: category.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
  };
}

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: { categoryName: string };
  searchParams: { page?: string };
}) {
  const { categoryName } = params;
  const currentPage = parseInt(searchParams.page || '1');

  try {
    const { movies, totalPages, categoryName: displayName } = await getCategoryMovies(
      categoryName,
      currentPage
    );

    return (
      <div className="min-h-screen bg-gray-900 flex flex-col">
        <Header />

        <main className="flex-1 container mx-auto px-4 py-8">
          {/* Category Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">
              {displayName}
            </h1>
            <p className="text-gray-400">
              Browse all {displayName} movies and series
            </p>
          </div>

          {/* Movies Grid */}
          <Suspense fallback={<MovieGridSkeleton />}>
            <MovieGrid movies={movies} />
          </Suspense>

          {/* Pagination */}
          <Pagination 
            currentPage={currentPage}
            totalPages={totalPages}
            basePath={`/category/${categoryName}`}
          />
        </main>

        <Footer />
      </div>
    );
  } catch (error) {
    notFound();
  }
}

// Generate metadata
export async function generateMetadata({ params }: { params: { categoryName: string } }) {
  const categoryName = params.categoryName.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  
  return {
    title: `${categoryName} Movies - MovieHub`,
    description: `Download latest ${categoryName} movies in HD quality`,
  };
}