// src/app/search/page.tsx

'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import MovieGrid from '@/components/movie/MovieGrid';
import Loading from '@/components/common/Loading';
import { useSearch } from '@/hooks/useSearch';
import { Search as SearchIcon } from 'lucide-react';

export default function SearchPage() {
  const { query, setQuery, results, loading, debouncedQuery } = useSearch();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && debouncedQuery) {
      fetchResults();
    }
  }, [debouncedQuery, mounted]);

  const fetchResults = async () => {
    try {
      const response = await fetch(`/api/search?q=${encodeURIComponent(debouncedQuery)}`);
      const data = await response.json();
      // Results are handled by the useSearch hook
    } catch (error) {
      console.error('Search error:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col">
      <Header />

      <main className="flex-1 container mx-auto px-4 py-8">
        {/* Search Bar */}
        <div className="mb-8">
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search movies, series..."
                className="w-full px-4 py-3 pl-12 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                autoFocus
              />
              <SearchIcon 
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" 
                size={20} 
              />
            </div>
          </div>
        </div>

        {/* Search Results */}
        {loading ? (
          <Loading />
        ) : query && results.length > 0 ? (
          <>
            <h2 className="text-2xl font-bold text-white mb-6">
              Search Results for "{query}"
            </h2>
            <MovieGrid movies={results} />
          </>
        ) : query && results.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">No results found for "{query}"</p>
            <p className="text-gray-500 text-sm mt-2">Try different keywords</p>
          </div>
        ) : (
          <div className="text-center py-12">
            <SearchIcon className="mx-auto text-gray-600 mb-4" size={64} />
            <p className="text-gray-400 text-lg">Start typing to search movies...</p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}