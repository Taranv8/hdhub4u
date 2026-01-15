// app/api/homepage/route.ts
import { NextResponse } from 'next/server';
import { getLatestMovies } from '@/lib/controllers/movieController';

export async function GET(request: Request) {
  try {
    // Extract page from query parameters
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    
    // Validate page number
    if (page < 1 || isNaN(page)) {
      return NextResponse.json(
        { success: false, error: 'Page number must be a positive integer' },
        { status: 400 }
      );
    }
    
    // Fetch movies using controller
    const result = await getLatestMovies(page);
    
    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 500 }
      );
    }
    
    return NextResponse.json(result);
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Optional: Add support for POST if needed
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const page = parseInt(body.page) || 1;
    
    if (page < 1 || isNaN(page)) {
      return NextResponse.json(
        { success: false, error: 'Page number must be a positive integer' },
        { status: 400 }
      );
    }
    
    const result = await getLatestMovies(page);
    
    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 500 }
      );
    }
    
    return NextResponse.json(result);
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
} 