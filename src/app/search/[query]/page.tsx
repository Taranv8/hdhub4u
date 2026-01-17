// app/search/[query]/page.tsx
// ========================================
'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import type { Movie } from '@/types/movie';
import { PaginationInfo } from '@/lib/controllers/movieController';
import MovieCard from '@/components/movie/MovieCard';
import { adaptBackendMoviesToFrontend } from '@/lib/utils/movieAdapter';

export default function SearchPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const query = decodeURIComponent(params.query as string);
  const page = parseInt(searchParams.get('page') || '1');

  const [movies, setMovies] = useState<Movie[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSearchResults = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(
        `/api/search?query=${encodeURIComponent(query)}&page=${page}`
      );
      
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Search failed');
      }
      
      // Transform backend movies to frontend format
      const transformedMovies = adaptBackendMoviesToFrontend(data.data.movies);
      
      setMovies(transformedMovies);
      setPagination(data.data.pagination);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setMovies([]);
      setPagination(null);
    } finally {
      setLoading(false);
    }
  }, [query, page]);

  useEffect(() => {
    fetchSearchResults();
  }, [fetchSearchResults]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
          <p className="text-xl">Searching...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">⚠️</div>
          <div className="text-xl text-red-500">Error: {error}</div>
          <Link href="/" className="mt-4 inline-block text-blue-400 hover:underline">
            Go to HomePage
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/" className="inline-flex items-center text-red-600 hover:text-red-500 mb-4">
            <span className="text-2xl mr-2">🏠</span>
            <span className="text-lg">Go to HomePage</span>
          </Link>
          
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            Results for <span className="text-red-600">&quot;{query}&quot;</span>
          </h1>
          
          {pagination && (
            <p className="text-gray-400">
              {pagination.totalMovies} {pagination.totalMovies === 1 ? 'item' : 'items'} found
            </p>
          )}
        </div>

        {/* Results */}
        {movies.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🔍</div>
            <p className="text-2xl text-gray-400 mb-2">No results found for &quot;{query}&quot;</p>
            <p className="text-gray-500">Try different keywords or check the spelling</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 mb-12">
            {movies.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        )}

        {/* Pagination */}
        {pagination && pagination.totalPages > 1 && (
          <div className="mt-16 flex flex-col sm:flex-row justify-center items-center gap-4">
            {pagination.hasPrevPage && (
              <Link
                href={`/search/${encodeURIComponent(query)}?page=${page - 1}`}
                className="px-6 py-3 bg-red-600 hover:bg-red-700 rounded-lg transition-colors font-semibold w-full sm:w-auto text-center"
              >
                ← Previous
              </Link>
            )}
            
            <div className="flex items-center gap-2">
              <span className="text-gray-400">Page</span>
              <span className="px-4 py-2 bg-gray-800 rounded-lg font-bold">
                {pagination.currentPage}
              </span>
              <span className="text-gray-400">of {pagination.totalPages}</span>
            </div>
            
            {pagination.hasNextPage && (
              <Link
                href={`/search/${encodeURIComponent(query)}?page=${page + 1}`}
                className="px-6 py-3 bg-red-600 hover:bg-red-700 rounded-lg transition-colors font-semibold w-full sm:w-auto text-center"
              >
                Next →
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
}