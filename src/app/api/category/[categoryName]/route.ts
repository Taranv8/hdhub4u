// app/api/category/[categoryName]/route.ts
import { NextResponse } from 'next/server';
import { getMoviesByCategory } from '@/lib/controllers/categoryController';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ categoryName: string }> }
) {
  try {
    // Await params first
    const resolvedParams = await params;
    
    // Extract page from query parameters
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    
    console.log('=================================');
    console.log('API ROUTE - Category Request');
    console.log('=================================');
    console.log('Category:', resolvedParams.categoryName);
    console.log('Page:', page);
    
    // Validate page number
    if (page < 1 || isNaN(page)) {
      console.error('Invalid page number:', page);
      return NextResponse.json(
        { success: false, error: 'Page number must be a positive integer' },
        { status: 400 }
      );
    }

    // Get category from params
    const categoryName = resolvedParams.categoryName;
  
    if (!categoryName) {
      console.error('No category name provided');
      return NextResponse.json(
        { success: false, error: 'Category name is required' },
        { status: 400 }
      );
    }
    
    console.log('Calling getMoviesByCategory...');
    
    // Fetch movies by category using controller
    const result = await getMoviesByCategory(categoryName, page);
    
    console.log('Controller Result:', {
      success: result.success,
      movieCount: result.data?.movies?.length,
      totalPages: result.data?.pagination?.totalPages,
      error: result.error
    });
    
    if (!result.success) {
      console.error('Controller returned error:', result.error);
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 500 }
      );
    }
    
    // Check if any movies were found
    if (!result.data || result.data.movies.length === 0) {
      console.warn('No movies found for category:', categoryName);
      // Return success with empty array instead of error
      return NextResponse.json({
        success: true,
        data: {
          movies: [],
          pagination: {
            currentPage: page,
            totalPages: 0,
            totalMovies: 0,
            moviesPerPage: 30,
            hasNextPage: false,
            hasPrevPage: false
          }
        }
      });
    }
    
    console.log('✅ API Route Success - Returning', result.data.movies.length, 'movies');
    console.log('=================================\n');
    
    return NextResponse.json(result);
  } catch (error) {
    console.error('=================================');
    console.error('❌ API Route Error:', error);
    console.error('=================================\n');
    
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Internal server error',
        stack: process.env.NODE_ENV === 'development' && error instanceof Error ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}