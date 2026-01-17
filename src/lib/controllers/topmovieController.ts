// lib/controllers/movietopController.ts
import { connectToDatabase } from '../mongodb';
import { ObjectId } from 'mongodb';

export interface MonthlyMovie {
  _id: string;
  title: string;
  image: string;
  monthlydownload: number;
}

export interface MonthlyMoviesResponse {
  success: boolean;
  data?: MonthlyMovie[];
  error?: string;
}

export async function getTopMonthlyMovies(
  limit: number = 22
): Promise<MonthlyMoviesResponse> {
  try {
    const { db } = await connectToDatabase();
    
    // Get current month and year
    const now = new Date();
    const currentMonth = now.getMonth() + 1; // 1-12
    const currentYear = now.getFullYear();

    console.log('Fetching top monthly movies:', { limit, currentMonth, currentYear });

    // Fetch movies sorted by monthly downloads (highest first), then by _id for consistency
    const moviesFromDb = await db
      .collection('movies')
      .find({
        monthlydownload: { $exists: true, $gte: 0 }
      })
      .sort({ 
        monthlydownload: -1,
        _id: 1  // Secondary sort by _id for consistent ordering when downloads are equal
      })
      .limit(limit)
      .toArray();
    
    // Transform to simplified format
    const movies: MonthlyMovie[] = moviesFromDb.map((movie) => ({
      _id: movie._id.toString(),
      title: movie.title || '',
      image: movie.image || '',
      monthlydownload: movie.monthlydownload || 0,
    }));
    
    return {
      success: true,
      data: movies,
    };
  } catch (error) {
    console.error('Error fetching top monthly movies:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
}