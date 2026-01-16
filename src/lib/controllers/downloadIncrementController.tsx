// lib/controllers/downloadIncrementController.ts
import { connectToDatabase } from '../mongodb';
import { ObjectId } from 'mongodb';

export async function incrementDownloadCount(movieId: string) {
  try {
    const { db } = await connectToDatabase();
    
    // Validate ObjectId
    if (!ObjectId.isValid(movieId)) {
      return {
        success: false,
        error: 'Invalid movie ID'
      };
    }

    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();

    // Get the movie
    const movie = await db.collection('movies').findOne({
      _id: new ObjectId(movieId)
    });

    if (!movie) {
      return {
        success: false,
        error: 'Movie not found'
      };
    }

    // Check if we need to reset monthly downloads
    let monthlydownload = movie.monthlydownload || 0;
    const lastResetMonth = movie.lastResetMonth;
    const lastResetYear = movie.lastResetYear;

    // Reset if it's a new month
    if (lastResetMonth !== currentMonth || lastResetYear !== currentYear) {
      monthlydownload = 0;
    }

    // Increment both counters
    const result = await db.collection('movies').updateOne(
      { _id: new ObjectId(movieId) },
      {
        $set: {
          alltimedownload: (movie.alltimedownload || 0) + 1,
          monthlydownload: monthlydownload + 1,
          lastResetMonth: currentMonth,
          lastResetYear: currentYear,
          lastDownloadDate: currentDate
        }
      }
    );

    if (result.modifiedCount === 0) {
      return {
        success: false,
        error: 'Failed to update download count'
      };
    }

    return {
      success: true,
      data: {
        alltimedownload: (movie.alltimedownload || 0) + 1,
        monthlydownload: monthlydownload + 1
      }
    };
  } catch (error) {
    console.error('Error incrementing download count:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
}