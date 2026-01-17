// src/components/sections/BestMonthlyMovies.tsx
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';

interface MonthlyMovie {
  _id: string;
  title: string;
  image: string;
  monthlydownload: number;
}

interface BestMonthlyMoviesProps {
  movies: MonthlyMovie[];
  loading?: boolean;
}

// Skeleton Loading Component
function MovieCardSkeleton() {
  return (
    <div className="flex-shrink-0 relative">
      <div className="relative w-28 h-42 overflow-hidden shadow-lg bg-gray-800 animate-pulse">
        <div className="absolute inset-0 bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800 shimmer" />
      </div>
    </div>
  );
}

export default function BestMonthlyMovies({ movies, loading = false }: BestMonthlyMoviesProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Sort movies by monthlydownload (highest to lowest)
  const sortedMovies = [...movies].sort((a, b) => b.monthlydownload - a.monthlydownload);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container || sortedMovies.length === 0 || loading) return;

    const itemWidth = 116; // w-28 (112px) + gap (4px)
    const scrollInterval = 3000; // 3 seconds between slides

    const slideToNext = () => {
      setCurrentIndex((prevIndex) => {
        const nextIndex = (prevIndex + 1) % sortedMovies.length;
        
        // Calculate scroll position
        const scrollPosition = nextIndex * itemWidth;
        
        // Smooth scroll to next item
        container.scrollTo({
          left: scrollPosition,
          behavior: 'smooth'
        });

        return nextIndex;
      });
    };

    const intervalId = setInterval(slideToNext, scrollInterval);

    return () => clearInterval(intervalId);
  }, [sortedMovies.length, loading]);

  return (
    <div className="bg-black from-gray-900 via-gray-800 to-gray-900 py-2 mb-0 relative overflow-hidden -mx-4 sm:-mx-6 lg:-mx-8">
      <div className="w-full">
        <div
          ref={scrollContainerRef}
          className="flex gap-1 overflow-x-auto scrollbar-hide pb-4 scroll-smooth"
          style={{ 
            scrollbarWidth: 'none', 
            msOverflowStyle: 'none',
            scrollBehavior: 'smooth'
          }}
        >
          {loading ? (
            // Show skeleton loading
            Array.from({ length: 15 }).map((_, index) => (
              <MovieCardSkeleton key={`skeleton-${index}`} />
            ))
          ) : (
            // Show actual movies
            sortedMovies.map((movie, index) => (
              <Link
                key={movie._id}
                href={`/movie/${movie._id}`}
                className="flex-shrink-0 group relative transition-all duration-300 ease-in-out"
              >
                <div className="relative w-28 h-42 overflow-hidden shadow-lg transition-all duration-300 ease-in-out transform group-hover:scale-110 group-hover:shadow-2xl group-hover:z-10">
                  <Image
                    src={movie.image}
                    alt={movie.title}
                    fill
                    sizes="120px"
                    className="object-cover transition-transform duration-300"
                    priority={index < 5}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  {/* Title on Hover */}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <p className="text-white text-xs font-semibold line-clamp-2">
                      {movie.title}
                    </p>
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>
      </div>

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scroll-smooth {
          scroll-behavior: smooth;
        }
        
        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
        
        .shimmer {
          position: relative;
          overflow: hidden;
        }
        
        .shimmer::after {
          content: '';
          position: absolute;
          top: 0;
          right: 0;
          bottom: 0;
          left: 0;
          transform: translateX(-100%);
          background: linear-gradient(
            90deg,
            rgba(255, 255, 255, 0) 0%,
            rgba(255, 255, 255, 0.3) 50%,
            rgba(255, 255, 255, 0) 100%
          );
          animation: shimmer 1.5s infinite;
        }
      `}</style>
    </div>
  );
}