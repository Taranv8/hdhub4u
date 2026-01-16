// app/api/downloadincrement/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { incrementDownloadCount } from '@/lib/controllers/downloadIncrementController';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { movieId } = body;

    if (!movieId) {
      return NextResponse.json(
        { success: false, error: 'Movie ID is required' },
        { status: 400 }
      );
    }

    const result = await incrementDownloadCount(movieId);

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 400 }
      );
    }

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error('Error in download increment API:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error occurred' 
      },
      { status: 500 }
    );
  }
}