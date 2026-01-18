// src/app/category/[categoryName]/page.tsx

import { Suspense } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import MovieGrid from '@/components/movie/MovieGrid';
import Pagination from '@/components/common/Pagination';
import { MovieGridSkeleton } from '@/components/common/Loading';
import type { Movie } from '@/types/movie';
import { notFound } from 'next/navigation';

// Force dynamic rendering
export const dynamic = 'force-dynamic';
export const revalidate = 0;

// Fetch movies by category from the API
async function getMoviesByCategory(
  categoryName: string,
  page: number | string = 1
): Promise<{ movies: Movie[]; totalPages: number; categoryDisplay: string }> {
  try {
    // Ensure page is a number
    const currentPage = Number(page);
    if (isNaN(currentPage) || currentPage < 1) {
      throw new Error('Invalid page number');
    }

    console.log('Fetching movies for category:', categoryName, 'page:', currentPage);

    const apiUrl = process.env.NEXT_PUBLIC_API_URL 
    ? `${process.env.NEXT_PUBLIC_API_URL}/api/category/${categoryName}?page=${currentPage}`
    : `http://localhost:3000/api/category/${categoryName}?page=${currentPage}`;
    
    console.log('API URL:', apiUrl);
    
    const response = await fetch(apiUrl, {
      cache: 'no-store'
    });

    console.log('API Response Status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Error Response:', errorText);
      
      if (response.status === 404) {
        return { movies: [], totalPages: 0, categoryDisplay: '' };
      }
      
      throw new Error(`API returned ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    console.log('API Response Data:', {
      success: data.success,
      movieCount: data.data?.movies?.length,
      totalPages: data.data?.pagination?.totalPages
    });

    if (!data.success || !data.data) {
      throw new Error(data.error || 'Failed to fetch movies');
    }

    // Transform API response to your Movie type
    const movies: Movie[] = data.data.movies.map((movie: any) => ({
      id: movie._id,
      slug: generateSlug(movie.title),
      title: movie.title,
      poster: movie.image,
      thumbnail: movie.image,
      year: new Date(movie.releaseDate).getFullYear().toString(),
      quality: movie.quality,
      categories: movie.genre || [],
      imdbRating: movie.imdbRating,
      director: movie.director,
      heading: movie.heading,
      shortTitle: movie.shortTitle,
      stars: movie.stars,
      language: movie.language,
      downloadLinks: movie.downloadLinks || [],
      trailer: movie.trailer,
      screenshots: movie.screenshots || [],
      storyline: movie.storyline,
      releaseDate: movie.releaseDate,
      episodeLinks: movie.episodeLinks || [],
    }));

    // Convert category slug to display name
    const categoryDisplay = decodeURIComponent(categoryName)
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');

    return {
      movies,
      totalPages: data.data.pagination.totalPages,
      categoryDisplay,
    };
  } catch (error) {
    console.error('Error fetching movies by category:', error);
    return {
      movies: [],
      totalPages: 0,
      categoryDisplay: '',
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

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: { categoryName: string };
  searchParams: { page?: string } | Promise<{ page?: string }>;
}) {
  // Unwrap params and searchParams if they're Promises
  const resolvedParams = params instanceof Promise ? await params : params;
  const resolvedSearchParams = searchParams instanceof Promise ? await searchParams : searchParams;
  
  const categoryName = resolvedParams.categoryName;
  const currentPage = parseInt(resolvedSearchParams.page?.toString() || '1', 10);

  const { movies, totalPages, categoryDisplay } = await getMoviesByCategory(
    categoryName,
    currentPage
  );

  // If no movies found and it's page 1, show not found
  if (movies.length === 0 && currentPage === 1) {
    notFound();
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 container mx-auto py-8">
        {/* Category Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-white">
            Category: {categoryDisplay}
          </h1>
          {totalPages > 0 && (
            <p className="text-gray-400 mt-2">
              Page {currentPage} of {totalPages}
            </p>
          )}
        </div>

        {/* Movies Grid */}
        <Suspense fallback={<MovieGridSkeleton />}>
          {movies.length > 0 ? (
            <MovieGrid 
              movies={movies} 
              title={`${categoryDisplay} Movies`} 
            />
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-400">
                No movies found in this category.
              </p>
            </div>
          )}
        </Suspense>

        {/* Pagination */}
        {totalPages > 0 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            basePath={`/category/${categoryName}/page`}
          />
        )}
      </main>

      <Footer />
    </div>
  );
}

// Generate metadata for SEO
export async function generateMetadata({
  params,
}: {
  params: { categoryName: string };
}) {
  const resolvedParams = params instanceof Promise ? await params : params;
  const categoryDisplay = decodeURIComponent(resolvedParams.categoryName)
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  return {
    title: `${categoryDisplay} Movies - Download HD ${categoryDisplay} Movies & TV Shows`,
    description: `Download latest ${categoryDisplay} movies and web series in HD quality. Browse our collection of ${categoryDisplay} films.`,
    keywords: `${categoryDisplay} movies, download ${categoryDisplay}, HD movies, ${categoryDisplay} web series`,
  };
}