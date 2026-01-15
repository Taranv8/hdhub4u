// src/app/api/search/route.ts

import { NextRequest, NextResponse } from 'next/server';
import type { Movie, ApiResponse } from '@/types/movie';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q')?.toLowerCase() || '';

    if (!query) {
      return NextResponse.json({ data: [] });
    }

    // Mock search - Replace with actual database search
    const mockResults: Movie[] = Array.from({ length: 20 }, (_, i) => ({
      id: `search-${i + 1}`,
      slug: `search-result-${i + 1}`,
      title: `${query} Movie ${i + 1} (2025) WEB-DL Hindi 1080p`,
      poster: `https://image.tmdb.org/t/p/w342/placeholder.jpg`,
      thumbnail: `https://image.tmdb.org/t/p/w342/placeholder.jpg`,
      year: '2025',
      quality: '1080p',
      categories: ['Bollywood'],
    }));

    const response: ApiResponse<Movie[]> = {
      data: mockResults,
      total: mockResults.length,
    };

    return NextResponse.json(response);
  } catch (error) {
    return NextResponse.json(
      { data: [], error: 'Search failed' },
      { status: 500 }
    );
  }
}