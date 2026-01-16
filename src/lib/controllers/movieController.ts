// lib/controllers/movieController.ts
import { connectToDatabase } from '../mongodb';
import { ObjectId } from 'mongodb'; // Add this import

export interface EpisodeLink {
  episode: string;
  links: {
    [quality: string]: {
      [platform: string]: string;
    };
  };
}
export interface Movie {
  _id: string;
  title: string;
  link: string;
  image: string;
  shortTitle: string;
  imdbRating: number;
  genre: string;
  stars: string;
  director: string;
  language: string;
  heading: string,
  quality: string;
  screenshots: string[];
  downloadLinks: Array<{
    href: string;
    value: string;
  }>;
  trailer: string;
  storyline: string;
  releaseDate: Date;
  episodeLinks?: EpisodeLink[];
  alltimedownload?: number;
  monthlydownload?: number;
  lastResetMonth?: number;
  lastResetYear?: number;
  lastDownloadDate?: Date;
}

export interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalMovies: number;
  moviesPerPage: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface MovieResponse {
  success: boolean;
  data?: {
    movies: Movie[];
    pagination: PaginationInfo;
  };
  error?: string;
}

export async function getLatestMovies(
  page: number = 1,
  limit: number = 50
): Promise<MovieResponse> {
  try {
    const { db } = await connectToDatabase();
    
    // Calculate skip value for pagination
    const skip = (page - 1) * limit;
    console.log('Fetching movies:', { page, skip, limit });

    // Fetch movies sorted by release date (newest first)
    const moviesFromDb = await db
      .collection('movies')
      .find({})
      .sort({ releaseDate: -1 })
      .skip(skip)
      .limit(limit)
      .toArray();
    
    // Transform MongoDB documents to Movie format (convert ObjectId to string)
    const movies: Movie[] = moviesFromDb.map((movie) => ({
      _id: movie._id.toString(), // Convert ObjectId to string
      title: movie.title || '',
      link: movie.link || '',
      image: movie.image || '',
      heading:movie.heading || '',
      shortTitle: movie.shortTitle || '',
      imdbRating: movie.imdbRating || 0,
      genre: movie.genre || '',
      stars: movie.stars || '',
      director: movie.director || '',
      language: movie.language || '',
      quality: movie.quality || '',
      screenshots: movie.screenshots || [],
      downloadLinks: movie.downloadLinks || [],
      trailer: movie.trailer || '',
      storyline: movie.storyline || '',
      releaseDate: movie.releaseDate || new Date(),
      episodeLinks: movie.episodeLinks || [], 
      
    }));
    
    // Get total count for pagination info
    const totalMovies = await db.collection('movies').countDocuments({});
    const totalPages = Math.ceil(totalMovies / limit);
    
    return {
      success: true,
      data: {
        movies,
        pagination: {
          currentPage: page,
          totalPages,
          totalMovies,
          moviesPerPage: limit,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1
        }
      }
    };
  } catch (error) {
    console.error('Error fetching movies:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
}