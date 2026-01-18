// src/components/movie/MovieCard.tsx
'use client';

import Link from 'next/link';
import Image from 'next/image';
import type { Movie } from '@/types/movie';
import { formatTitle } from '@/lib/utils/formatters';

interface MovieCardProps {
  movie: Movie;
}

export default function MovieCard({ movie }: MovieCardProps) {
  return (
    <div className="group mb-10 relative rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 max-w-[200px]">
      <Link href={`/movie/${movie.id}`}>
        {/* Movie Poster */}
        <div className="relative aspect-[2/3] overflow-hidden bg-gray-700">
          <Image
            src={movie.poster || 'https://new1.hdhub4u.fo/wp-content/uploads/2021/05/hdhub4ulogo.png'}
            alt={formatTitle(movie.title)}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
            className="object-cover transition-transform duration-300 group-hover:scale-120"
            onError={(e) => {
              // Fallback image on error
              e.currentTarget.src = 'https://new1.hdhub4u.fo/wp-content/uploads/2021/05/hdhub4ulogo.png';
            }}
          />
          
          {/* Overlay on Hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>

        {/* Movie Info */}
        <div className="p-3 bg-[#111111] min-h-[200px]">
          <h3 className="text-m py-1 font-semibold text-white group-hover:text-gray-400 transition">
            {formatTitle(movie.title)}
          </h3>
        </div>
      </Link>
    </div>
  );
}