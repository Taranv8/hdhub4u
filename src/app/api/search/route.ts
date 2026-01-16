// app/api/search/route.ts
import { NextResponse } from 'next/server';
import { searchMovies } from '@/lib/controllers/searchController';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('query') || '';
    const page = parseInt(searchParams.get('page') || '1');
    
    // Validate inputs
    if (!query || query.trim() === '') {
      return NextResponse.json(
        { success: false, error: 'Search query is required' },
        { status: 400 }
      );
    }
    
    if (page < 1 || isNaN(page)) {
      return NextResponse.json(
        { success: false, error: 'Page number must be a positive integer' },
        { status: 400 }
      );
    }
    
    // Search movies using controller
    const result = await searchMovies(query.trim(), page);
    
    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 500 }
      );
    }
    
    return NextResponse.json(result);
  } catch (error) {
    console.error('Search API Error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const query = body.query || '';
    const page = parseInt(body.page) || 1;
    
    if (!query || query.trim() === '') {
      return NextResponse.json(
        { success: false, error: 'Search query is required' },
        { status: 400 }
      );
    }
    
    if (page < 1 || isNaN(page)) {
      return NextResponse.json(
        { success: false, error: 'Page number must be a positive integer' },
        { status: 400 }
      );
    }
    
    const result = await searchMovies(query.trim(), page);
    
    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 500 }
      );
    }
    
    return NextResponse.json(result);
  } catch (error) {
    console.error('Search API Error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}