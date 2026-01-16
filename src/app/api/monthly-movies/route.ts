// app/api/monthly-movies/route.ts
import { NextResponse } from 'next/server';
import { getTopMonthlyMovies } from '@/lib/controllers/topmovieController';

export async function GET(request: Request) {
  try {
    // Extract limit from query parameters (optional)
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '22');
    
    // Validate limit
    if (limit < 1 || limit > 100 || isNaN(limit)) {
      return NextResponse.json(
        { success: false, error: 'Limit must be between 1 and 100' },
        { status: 400 }
      );
    }
    
    // Fetch top monthly movies
    const result = await getTopMonthlyMovies(limit);
    
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

// Set cache control headers for better performance
export const revalidate = 300; // Revalidate every 5 minutes