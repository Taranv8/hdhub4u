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
import SearchIcon from '@mui/icons-material/Search';

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
      <div className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
          <p className="text-xl">Searching...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center">
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
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Top Header with Logo and Search */}
      <div className="border-b border-gray-800">
        <div className="max-w-[1400px] mx-auto px-6 py-4">
          <div className="flex flex-col items-center gap-4 mb-4">
            {/* Logo */}
           {/* Logo */}
<Link href="/">
  <img 
    src="/images/hdhub4ulogo.png" 
    alt="HDHUB4U" 
    className="h-12 w-auto cursor-pointer"
  />
</Link>
            
            {/* Go to HomePage Button */}
            <Link 
              href="/" 
              className="px-4 py-2 bg-[#333333] hover:bg-gray-700 rounded text-sm transition-colors flex items-center gap-2"
            >
              Go to HomePage 🏠
            </Link>
          </div>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto flex gap-2">
            <input
              type="text"
              defaultValue={query}
              className="flex-1 px-4 py-3 bg-[#111111] border border-gray-700 rounded text-white placeholder-gray-500 focus:outline-none focus:border-gray-600"
              placeholder="Search..."
            />
            <button className="px-6 py-3 bg-[#333333] hover:bg-gray-700 rounded transition-colors">
              <SearchIcon/>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-6 py-6">
        {/* Results Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-semibold mb-1">
            Results for <span className="text-white">&quot;{query}&quot;</span>
          </h1>
          
          {pagination && (
            <p className="text-sm text-gray-500">
              {pagination.totalMovies} items
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
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 mb-8">
            {movies.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        )}

        {/* Pagination */}
        {pagination && pagination.totalPages > 1 && (
          <div className="mt-12 flex justify-center items-center gap-2">
            {pagination.hasPrevPage && (
              <Link
                href={`/search/${encodeURIComponent(query)}?page=${page - 1}`}
                className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded text-sm transition-colors"
              >
                ←
              </Link>
            )}
            
            <Link
              href={`/search/${encodeURIComponent(query)}?page=1`}
              className={`px-3 py-2 rounded text-sm transition-colors ${
                pagination.currentPage === 1 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-800 hover:bg-gray-700'
              }`}
            >
              1
            </Link>

            {pagination.currentPage > 3 && (
              <span className="px-2 text-gray-500">...</span>
            )}

            {Array.from({ length: pagination.totalPages }, (_, i) => i + 1)
              .filter(p => {
                if (p === 1 || p === pagination.totalPages) return false;
                return Math.abs(p - pagination.currentPage) <= 1;
              })
              .map(p => (
                <Link
                  key={p}
                  href={`/search/${encodeURIComponent(query)}?page=${p}`}
                  className={`px-3 py-2 rounded text-sm transition-colors ${
                    pagination.currentPage === p 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-800 hover:bg-gray-700'
                  }`}
                >
                  {p}
                </Link>
              ))}

            {pagination.currentPage < pagination.totalPages - 2 && (
              <span className="px-2 text-gray-500">...</span>
            )}

            {pagination.totalPages > 1 && (
              <Link
                href={`/search/${encodeURIComponent(query)}?page=${pagination.totalPages}`}
                className={`px-3 py-2 rounded text-sm transition-colors ${
                  pagination.currentPage === pagination.totalPages 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-800 hover:bg-gray-700'
                }`}
              >
                {pagination.totalPages}
              </Link>
            )}
            
            {pagination.hasNextPage && (
              <Link
                href={`/search/${encodeURIComponent(query)}?page=${page + 1}`}
                className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded text-sm transition-colors"
              >
                →
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
}