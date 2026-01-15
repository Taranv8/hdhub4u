// src/app/page.tsx

import { Suspense } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import NoticeBanner from '@/components/common/NoticeBanner';
import CategoryList from '@/components/sections/CategoryList';
import MovieGrid from '@/components/movie/MovieGrid';
import Pagination from '@/components/common/Pagination';
import { MovieGridSkeleton } from '@/components/common/Loading';
import { MAIN_CATEGORIES, GENRES } from '@/lib/constants/categories';
import type { Movie, Category } from '@/types/movie';

// Fetch movies from the API
async function getLatestMovies(page: number = 1): Promise<{ movies: Movie[], totalPages: number }> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
    const response = await fetch(`${baseUrl}/api/homepage?page=${page}`, {
      next: { revalidate: 60 } // Revalidate every 60 seconds
    });

    if (!response.ok) {
      throw new Error('Failed to fetch movies');
    }

    const data = await response.json();

    if (!data.success || !data.data) {
      throw new Error(data.error || 'Failed to fetch movies');
    }

    // Transform API response to match your Movie type
    const movies: Movie[] = data.data.movies.map((movie: any) => ({
      id: movie._id,
      slug: generateSlug(movie.title),
      title: movie.title,
      poster: movie.image,
      thumbnail: movie.image,
      year: new Date(movie.releaseDate).getFullYear().toString(),
      quality: movie.quality,
      categories: movie.genre.split('|').map((g: string) => g.trim()),
      imdbRating: movie.imdbRating,
      director: movie.director,
      stars: movie.stars,
      language: movie.language,
      downloadLinks: movie.downloadLinks,
      trailer: movie.trailer,
      screenshots: movie.screenshots,
      storyline: movie.storyline,
      releaseDate: movie.releaseDate,
    }));

    return {
      movies,
      totalPages: data.data.pagination.totalPages,
    };
  } catch (error) {
    console.error('Error fetching movies:', error);
    // Return empty data on error
    return {
      movies: [],
      totalPages: 0,
    };
  }
}

// Helper function to generate slug from title
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

async function getCategories(): Promise<Category[]> {
  const allCategories = [
    ...MAIN_CATEGORIES.map(cat => ({ 
      id: cat.slug, 
      name: cat.name, 
      slug: cat.slug 
    })),
    ...GENRES.map(genre => ({ 
      id: genre.toLowerCase(), 
      name: genre, 
      slug: genre.toLowerCase() 
    })),
  ];
  
  return allCategories;
}

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const params = await searchParams;
  const currentPage = parseInt(params.page || '1');
  const { movies, totalPages } = await getLatestMovies(currentPage);
  const categories = await getCategories();

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <NoticeBanner />

      <main className="flex-1 container mx-auto px-4 py-8">
        {/* Categories Section */}
        <CategoryList categories={categories} />

        {/* Latest Releases */}
        <Suspense fallback={<MovieGridSkeleton />}>
          {movies.length > 0 ? (
            <MovieGrid 
              movies={movies} 
              title="Latest Releases" 
            />
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-400">Unable to load movies. Please try again later.</p>
            </div>
          )}
        </Suspense>

        {/* Pagination */}
        {totalPages > 0 && (
          <Pagination 
            currentPage={currentPage}
            totalPages={totalPages}
            basePath=""
          />
        )}
      </main>

      <Footer />
    </div>
  );
}

// Generate metadata for SEO
export const metadata = {
  title: 'MovieHub - Download HD Movies & TV Shows',
  description: 'Download latest Bollywood, Hollywood, Hindi Dubbed movies and web series in HD quality',
  keywords: 'movies, download, HD movies, Bollywood, Hollywood, web series',
};