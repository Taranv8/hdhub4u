// app/api/debug/categories/route.ts
import { NextResponse } from 'next/server';
import { getAllCategories } from '@/lib/controllers/categoryController';
import { connectToDatabase } from '@/lib/mongodb';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const testCategory = searchParams.get('test');

    const categories = await getAllCategories();

    let testResult = null;

    if (testCategory) {
      const { db } = await connectToDatabase();
      const collection = db.collection('movies');

      // Exact match
      const exactMatch = await collection.countDocuments({
        genre: testCategory,
      });

      // Case-insensitive partial match (comma separated or text)
      const regex = new RegExp(`\\b${testCategory}\\b`, 'i');

      const regexMatch = await collection.countDocuments({
        genre: { $regex: regex },
      });

      const sampleMovie = await collection.findOne(
        { genre: { $regex: regex } },
        { projection: { title: 1, genre: 1 } }
      );

      testResult = {
        searchedFor: testCategory,
        exactMatches: exactMatch,
        regexMatches: regexMatch,
        sampleMovie,
      };
    }

    return NextResponse.json({
      success: true,
      allCategories: categories,
      categoriesCount: categories.length,
      testResult,
      message: 'Use ?test=Bollywood to test if a specific category exists',
    });
  } catch (error) {
    console.error('Debug API Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch categories' },
      { status: 500 }
    );
  }
}
