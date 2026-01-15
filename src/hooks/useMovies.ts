// src/hooks/useMovies.ts

import { useState, useEffect } from 'react';
import type { Movie } from '@/types/movie';

interface UseMoviesOptions {
  category?: string;
  featured?: boolean;
  limit?: number;
}

export function useMovies(options: UseMoviesOptions = {}) {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchMovies() {
      try {
        setLoading(true);
        const params = new URLSearchParams();
        if (options.category) params.set('category', options.category);
        if (options.featured) params.set('featured', 'true');
        if (options.limit) params.set('limit', options.limit.toString());

        const response = await fetch(`/api/movies?${params}`);
        if (!response.ok) throw new Error('Failed to fetch movies');
        
        const data = await response.json();
        setMovies(data.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    }

    fetchMovies();
  }, [options.category, options.featured, options.limit]);

  return { movies, loading, error };
}
