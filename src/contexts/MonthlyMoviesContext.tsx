// src/contexts/MonthlyMoviesContext.tsx
'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface MonthlyMovie {
  _id: string;
  title: string;
  image: string;
  monthlydownload: number;
}

interface MonthlyMoviesContextType {
  movies: MonthlyMovie[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

const MonthlyMoviesContext = createContext<MonthlyMoviesContextType | undefined>(undefined);

// In-memory cache with timestamp
let memoryCache: {
  data: MonthlyMovie[] | null;
  timestamp: number | null;
  promise: Promise<MonthlyMovie[]> | null;
} = {
  data: null,
  timestamp: null,
  promise: null,
};

const CACHE_DURATION = 30 * 60 * 1000; // 30 minutes in milliseconds
const MEMORY_KEY = 'monthly_movies_cache';

export function MonthlyMoviesProvider({ children }: { children: ReactNode }) {
  const [movies, setMovies] = useState<MonthlyMovie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMonthlyMovies = async (): Promise<MonthlyMovie[]> => {
    // If there's already a fetch in progress, return that promise
    if (memoryCache.promise) {
      console.log('🔄 Using in-flight request');
      return memoryCache.promise;
    }

    // Check memory cache first
    if (memoryCache.data && memoryCache.timestamp) {
      const age = Date.now() - memoryCache.timestamp;
      if (age < CACHE_DURATION) {
        console.log('✅ Using memory cache (age:', Math.round(age / 1000), 'seconds)');
        return memoryCache.data;
      }
    }

    // Create new fetch promise
    const fetchPromise = (async () => {
      try {
        console.log('🌐 Fetching fresh data from API');
        
        const response = await fetch('/api/monthly-movies', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        if (!data.success || !data.data) {
          throw new Error(data.error || 'Failed to fetch monthly movies');
        }

        const moviesData = data.data as MonthlyMovie[];

        // Update memory cache
        memoryCache.data = moviesData;
        memoryCache.timestamp = Date.now();
        memoryCache.promise = null;

        // Store in memory object with timestamp
        if (typeof window !== 'undefined') {
          try {
            const cacheObject = {
              data: moviesData,
              timestamp: Date.now(),
            };
            // Store in a global variable instead of localStorage
            (window as any)[MEMORY_KEY] = cacheObject;
          } catch (e) {
            console.warn('Failed to cache data:', e);
          }
        }

        return moviesData;
      } catch (err) {
        memoryCache.promise = null;
        throw err;
      }
    })();

    // Store the promise
    memoryCache.promise = fetchPromise;
    return fetchPromise;
  };

  const loadMovies = async () => {
    try {
      setLoading(true);
      setError(null);

      // Check window memory first
      if (typeof window !== 'undefined' && (window as any)[MEMORY_KEY]) {
        const cached = (window as any)[MEMORY_KEY];
        const age = Date.now() - cached.timestamp;
        
        if (age < CACHE_DURATION) {
          console.log('✅ Using window memory cache');
          setMovies(cached.data);
          setLoading(false);
          return;
        }
      }

      const moviesData = await fetchMonthlyMovies();
      setMovies(moviesData);
    } catch (err) {
      console.error('Error loading monthly movies:', err);
      setError(err instanceof Error ? err.message : 'Failed to load movies');
      setMovies([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMovies();
  }, []);

  const refetch = async () => {
    // Clear cache and refetch
    memoryCache.data = null;
    memoryCache.timestamp = null;
    memoryCache.promise = null;
    if (typeof window !== 'undefined') {
      delete (window as any)[MEMORY_KEY];
    }
    await loadMovies();
  };

  return (
    <MonthlyMoviesContext.Provider value={{ movies, loading, error, refetch }}>
      {children}
    </MonthlyMoviesContext.Provider>
  );
}

export function useMonthlyMovies() {
  const context = useContext(MonthlyMoviesContext);
  if (context === undefined) {
    throw new Error('useMonthlyMovies must be used within a MonthlyMoviesProvider');
  }
  return context;
}