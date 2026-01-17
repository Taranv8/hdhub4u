// lib/controllers/searchController.ts
import { connectToDatabase } from '../mongodb';
import { Movie, PaginationInfo } from './movieController';

export interface SearchResponse {
  success: boolean;
  data?: {
    movies: Movie[];
    pagination: PaginationInfo;
    query: string;
  };
  error?: string;
}

// Projection for search results
const searchProjection = {
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
  releaseDate: 1,
};



// Normalize text
const normalizeText = (text: string): string => 
  text.toLowerCase().replace(/[^a-z0-9\s]/g, '').replace(/\s+/g, ' ').trim();

// Extract year from query
const extractYear = (query: string): number | null => {
  const match = query.match(/\b(19|20)\d{2}\b/);
  return match ? parseInt(match[0]) : null;
};

// Optimized movie mapper
const mapMovie = (movie: any): Movie => ({
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

export async function searchMovies(
  query: string,
  page: number = 1,
  limit: number = 30
): Promise<SearchResponse> {
  try {
    // Validate inputs
    const validPage = Math.max(1, Math.floor(page));
    const validLimit = Math.min(50, Math.max(1, Math.floor(limit)));
    const skip = (validPage - 1) * validLimit;
    
    // Escape special regex characters
    const escapedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const normalizedQuery = normalizeText(query);
    const year = extractYear(query);

    const { db } = await connectToDatabase();
    const collection = db.collection('movies');

    // Build optimized search filter
    const searchFilter: any = {
      $or: [
        { title: { $regex: escapedQuery, $options: 'i' } },
        { shortTitle: { $regex: escapedQuery, $options: 'i' } },
        { heading: { $regex: escapedQuery, $options: 'i' } },
        { genre: { $regex: escapedQuery, $options: 'i' } },
        { stars: { $regex: escapedQuery, $options: 'i' } },
        { director: { $regex: escapedQuery, $options: 'i' } },
      ]
    };

    // Add year filter if detected
    if (year) {
      searchFilter.$and = [
        { $or: searchFilter.$or },
        {
          releaseDate: {
            $gte: new Date(year, 0, 1),
            $lte: new Date(year, 11, 31, 23, 59, 59)
          }
        }
      ];
      delete searchFilter.$or;
    }

    // Execute search and count in parallel
    const [movies, totalMovies] = await Promise.all([
      collection
        .find(searchFilter, { projection: searchProjection })
        .sort({ imdbRating: -1, releaseDate: -1 })
        .skip(skip)
        .limit(validLimit)
        .toArray(),
      collection.countDocuments(searchFilter)
    ]);

    // Map results
    const mappedMovies = movies.map(mapMovie);
    const totalPages = Math.ceil(totalMovies / validLimit);

    return {
      success: true,
      data: {
        movies: mappedMovies,
        query,
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