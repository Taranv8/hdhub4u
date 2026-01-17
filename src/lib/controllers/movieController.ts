// lib/controllers/movieController.ts
import { connectToDatabase } from '../mongodb';
import { ObjectId } from 'mongodb';

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
  genre: string[];
  stars: string;
  director: string;
  language: string;
  heading: string;
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

// Projection to fetch only required fields
const movieProjection = {
  _id: 1,
  title: 1,
  link: 1,
  image: 1,
  heading: 1,
  shortTitle: 1,
  imdbRating: 1,
  genre: 1,
  stars: 1,
  director: 1,
  language: 1,
  quality: 1,
  screenshots: 1,
  downloadLinks: 1,
  trailer: 1,
  storyline: 1,
  releaseDate: 1,
  episodeLinks: 1,
};

// Optimized mapper function
const mapMovieDocument = (movie: any): Movie => ({
  _id: movie._id.toString(),
  title: movie.title ?? '',
  link: movie.link ?? '',
  image: movie.image ?? '',
  heading: movie.heading ?? '',
  shortTitle: movie.shortTitle ?? '',
  imdbRating: movie.imdbRating ?? 0,
  genre: movie.genre ?? [],
  stars: movie.stars ?? '',
  director: movie.director ?? '',
  language: movie.language ?? '',
  quality: movie.quality ?? '',
  screenshots: movie.screenshots ?? [],
  downloadLinks: movie.downloadLinks ?? [],
  trailer: movie.trailer ?? '',
  storyline: movie.storyline ?? '',
  releaseDate: movie.releaseDate ?? new Date(),
  episodeLinks: movie.episodeLinks ?? [],
});

// Cache for total count (updates every 5 minutes)
let cachedTotalCount: number | null = null;
let lastCountFetch: number = 0;
const COUNT_CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export async function getLatestMovies(
  page: number = 1,
  limit: number = 30
): Promise<MovieResponse> {
  try {
    // Validate and sanitize inputs
    const validPage = Math.max(1, Math.floor(page));
    const validLimit = Math.min(100, Math.max(1, Math.floor(limit)));
    const skip = (validPage - 1) * validLimit;

    const { db } = await connectToDatabase();
    const collection = db.collection('movies');

    const now = Date.now();
    const shouldRefreshCount = !cachedTotalCount || (now - lastCountFetch) > COUNT_CACHE_DURATION;

    // Optimized parallel execution with index hints
    const moviesFindPromise = collection
      .find({}, { projection: movieProjection })
      .hint({ releaseDate: -1 }) // Use the index we created
      .sort({ releaseDate: -1 })
      .skip(skip)
      .limit(validLimit)
      .toArray();

    let totalMovies: number;

    if (shouldRefreshCount) {
      // Fetch count in parallel only when cache is stale
      const [moviesFromDb, freshCount] = await Promise.all([
        moviesFindPromise,
        collection.estimatedDocumentCount() // Much faster than countDocuments()
      ]);

      cachedTotalCount = freshCount;
      lastCountFetch = now;
      totalMovies = freshCount;

      // Map documents efficiently
      const movies = moviesFromDb.map(mapMovieDocument);
      const totalPages = Math.ceil(totalMovies / validLimit);

      return {
        success: true,
        data: {
          movies,
          pagination: {
            currentPage: validPage,
            totalPages,
            totalMovies,
            moviesPerPage: validLimit,
            hasNextPage: validPage < totalPages,
            hasPrevPage: validPage > 1
          }
        }
      };
    } else {
      // Use cached count for better performance
      const moviesFromDb = await moviesFindPromise;
      totalMovies = cachedTotalCount!;

      const movies = moviesFromDb.map(mapMovieDocument);
      const totalPages = Math.ceil(totalMovies / validLimit);

      return {
        success: true,
        data: {
          movies,
          pagination: {
            currentPage: validPage,
            totalPages,
            totalMovies,
            moviesPerPage: validLimit,
            hasNextPage: validPage < totalPages,
            hasPrevPage: validPage > 1
          }
        }
      };
    }
  } catch (error) {
    console.error('Error fetching movies:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
}

// Optional: Function to get movie by ID or slug (for detail pages)
export async function getMovieByIdOrSlug(
  identifier: string
): Promise<{ success: boolean; data?: Movie; error?: string }> {
  try {
    const { db } = await connectToDatabase();
    const collection = db.collection('movies');

    let movie;

    // Check if identifier is a valid ObjectId
    if (ObjectId.isValid(identifier) && identifier.length === 24) {
      movie = await collection.findOne(
        { _id: new ObjectId(identifier) },
        { projection: movieProjection }
      );
    } else {
      // Search by slug/link
      movie = await collection.findOne(
        { link: identifier },
        { projection: movieProjection }
      );
    }

    if (!movie) {
      return {
        success: false,
        error: 'Movie not found'
      };
    }

    return {
      success: true,
      data: mapMovieDocument(movie)
    };
  } catch (error) {
    console.error('Error fetching movie:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
}

// Optional: Function to search movies
export async function searchMovies(
  query: string,
  page: number = 1,
  limit: number = 30
): Promise<MovieResponse> {
  try {
    const validPage = Math.max(1, Math.floor(page));
    const validLimit = Math.min(100, Math.max(1, Math.floor(limit)));
    const skip = (validPage - 1) * validLimit;

    const { db } = await connectToDatabase();
    const collection = db.collection('movies');

    // Use text search if you created a text index
    const searchQuery = { $text: { $search: query } };

    const [moviesFromDb, totalMovies] = await Promise.all([
      collection
        .find(searchQuery, { 
          projection: { ...movieProjection, score: { $meta: "textScore" } }
        })
        .sort({ score: { $meta: "textScore" } })
        .skip(skip)
        .limit(validLimit)
        .toArray(),
      collection.countDocuments(searchQuery)
    ]);

    const movies = moviesFromDb.map(mapMovieDocument);
    const totalPages = Math.ceil(totalMovies / validLimit);

    return {
      success: true,
      data: {
        movies,
        pagination: {
          currentPage: validPage,
          totalPages,
          totalMovies,
          moviesPerPage: validLimit,
          hasNextPage: validPage < totalPages,
          hasPrevPage: validPage > 1
        }
      }
    };
  } catch (error) {
    console.error('Error searching movies:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
}

// Optional: Function to get movies by genre
export async function getMoviesByGenre(
  genre: string,
  page: number = 1,
  limit: number = 30
): Promise<MovieResponse> {
  try {
    const validPage = Math.max(1, Math.floor(page));
    const validLimit = Math.min(100, Math.max(1, Math.floor(limit)));
    const skip = (validPage - 1) * validLimit;

    const { db } = await connectToDatabase();
    const collection = db.collection('movies');

    const genreQuery = { genre: genre };

    const [moviesFromDb, totalMovies] = await Promise.all([
      collection
        .find(genreQuery, { projection: movieProjection })
        .hint({ genre: 1 }) // Use genre index
        .sort({ releaseDate: -1 })
        .skip(skip)
        .limit(validLimit)
        .toArray(),
      collection.countDocuments(genreQuery)
    ]);

    const movies = moviesFromDb.map(mapMovieDocument);
    const totalPages = Math.ceil(totalMovies / validLimit);

    return {
      success: true,
      data: {
        movies,
        pagination: {
          currentPage: validPage,
          totalPages,
          totalMovies,
          moviesPerPage: validLimit,
          hasNextPage: validPage < totalPages,
          hasPrevPage: validPage > 1
        }
      }
    };
  } catch (error) {
    console.error('Error fetching movies by genre:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
}