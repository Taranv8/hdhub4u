// app/api/search/route.ts
// ========================================
import { NextResponse } from 'next/server';
import { searchMovies } from '@/lib/controllers/searchController';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('query')?.trim() || '';
    const page = parseInt(searchParams.get('page') || '1');
    
    // Validate inputs
    if (!query) {
      return NextResponse.json(
        { success: false, error: 'Search query is required' },
        { status: 400 }
      );
    }
    
    if (page < 1 || isNaN(page)) {
      return NextResponse.json(
        { success: false, error: 'Invalid page number' },
        { status: 400 }
      );
    }
    
    // Search movies
    const result = await searchMovies(query, page);
    
    return NextResponse.json(result, { 
      status: result.success ? 200 : 500 
    });
  } catch (error) {
    console.error('Search API Error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
