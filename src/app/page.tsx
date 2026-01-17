// src/app/page.tsx

import { Suspense } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import NoticeBanner from '@/components/common/NoticeBanner';
import MovieGrid from '@/components/movie/MovieGrid';
import Pagination from '@/components/common/Pagination';
import { MovieGridSkeleton } from '@/components/common/Loading';
import { getLatestMovies } from '@/lib/controllers/movieController';
import type { Movie } from '@/types/movie';

// Remove force-dynamic and allow Next.js to optimize
export const revalidate = 60; // Revalidate every 60 seconds (ISR)

// Helper function to generate slug from title
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

export default async function HomePage({
  searchParams,
}: {
  searchParams: { page?: string } | Promise<{ page?: string }>;
}) {
  // Unwrap the Promise if needed
  const params = searchParams instanceof Promise ? await searchParams : searchParams;
  const currentPage = parseInt(params.page?.toString() || '1', 10);

  // Fetch directly from controller (no API route overhead)
  const result = await getLatestMovies(currentPage, 30);
  
  // Transform to your Movie type
  const movies: Movie[] = result.success && result.data 
    ? result.data.movies.map((movie: any) => ({
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
      }))
    : [];

  const totalPages = result.success && result.data ? result.data.pagination.totalPages : 0;
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      {/* <NoticeBanner /> */}
    
      <main className="flex-1 container mx-auto py-8">
        {/* Latest Releases */}
        <Suspense fallback={<MovieGridSkeleton />}>
          {movies.length > 0 ? (
            <MovieGrid movies={movies} title="Latest Releases" />
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-400">
                Unable to load movies. Please try again later.
              </p>
            </div>
          )}
        </Suspense>

        {/* Pagination */}
        {totalPages > 0 && (
          <Pagination currentPage={currentPage} totalPages={totalPages} basePath="/page" />
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