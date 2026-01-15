// src/app/api/movies/route.ts

import { NextRequest, NextResponse } from 'next/server';
import type { Movie, ApiResponse } from '@/types/movie';

// Mock database - Replace with your actual database queries
const mockMovies: Movie[] = Array.from({ length: 100 }, (_, i) => ({
  id: `movie-${i + 1}`,
  slug: `movie-title-${i + 1}`,
  title: `Movie Title ${i + 1} (2025) WEB-DL Hindi 1080p`,
  poster: `https://image.tmdb.org/t/p/w342/placeholder.jpg`,
  thumbnail: `https://image.tmdb.org/t/p/w342/placeholder.jpg`,
  year: '2025',
  quality: ['4K', '1080p', '720p', '480p'][Math.floor(Math.random() * 4)],
  categories: ['Bollywood', 'Drama', 'Action'],
  featured: Math.random() > 0.7,
  trending: Math.random() > 0.8,
}));

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '60');
    const category = searchParams.get('category');
    const featured = searchParams.get('featured') === 'true';

    let filteredMovies = [...mockMovies];

    // Filter by category
    if (category) {
      filteredMovies = filteredMovies.filter(movie => 
        movie.categories.some(cat => 
          cat.toLowerCase().includes(category.toLowerCase())
        )
      );
    }

    // Filter by featured
    if (featured) {
      filteredMovies = filteredMovies.filter(movie => movie.featured);
    }

    // Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedMovies = filteredMovies.slice(startIndex, endIndex);

    const response: ApiResponse<Movie[]> = {
      data: paginatedMovies,
      total: filteredMovies.length,
      page,
      totalPages: Math.ceil(filteredMovies.length / limit),
    };

    return NextResponse.json(response);
  } catch (error) {
    return NextResponse.json(
      { data: [], error: 'Failed to fetch movies' },
      { status: 500 }
    );
  }
}