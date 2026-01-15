// app/api/homepage/displaymovie/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getMovieById } from '@/lib/controllers/movieidController';

export async function GET(request: NextRequest) {
  try {
    // Get ID from query parameters
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Movie ID is required' },
        { status: 400 }
      );
    }

    // Fetch movie details
    const movie = await getMovieById(id);

    if (!movie) {
      return NextResponse.json(
        { error: 'Movie not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: movie
    }, { status: 200 });

  } catch (error: any) {
    console.error('API Error:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to fetch movie details',
        message: error.message 
      },
      { status: 500 }
    );
  }
}

// Optional: POST method if you prefer sending ID in body
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { id } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'Movie ID is required' },
        { status: 400 }
      );
    }

    const movie = await getMovieById(id);

    if (!movie) {
      return NextResponse.json(
        { error: 'Movie not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: movie
    }, { status: 200 });

  } catch (error: any) {
    console.error('API Error:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to fetch movie details',
        message: error.message 
      },
      { status: 500 }
    );
  }
}