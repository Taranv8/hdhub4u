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
      
      // Validate page number
      if (page < 1 || isNaN(page)) {
        return NextResponse.json(
          { success: false, error: 'Page number must be a positive integer' },
          { status: 400 }
        );
      }
  
      // Get category from params
      const categoryName = resolvedParams.categoryName;
    
    if (!categoryName) {
      return NextResponse.json(
        { success: false, error: 'Category name is required' },
        { status: 400 }
      );
    }
    
    // Fetch movies by category using controller
    const result = await getMoviesByCategory(categoryName, page);
    
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