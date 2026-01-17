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
    
    // Normalize and prepare search terms
    const normalizedQuery = normalizeText(query);
    const year = extractYear(query);
    
    // Split into words for flexible matching
    const queryWords = normalizedQuery.split(/\s+/).filter(w => w.length > 0);

    const { db } = await connectToDatabase();
    const collection = db.collection('movies');

    // Build flexible search filter
    const searchConditions = [];
    
    // Strategy 1: Match full query (with spaces normalized)
    const escapedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    searchConditions.push({
      $or: [
        { title: { $regex: escapedQuery, $options: 'i' } },
        { shortTitle: { $regex: escapedQuery, $options: 'i' } },
        { heading: { $regex: escapedQuery, $options: 'i' } },
      ]
    });
    
    // Strategy 2: Match normalized query (no spaces/special chars)
    if (normalizedQuery !== query.toLowerCase()) {
      const noSpaceQuery = normalizedQuery.replace(/\s+/g, '');
      searchConditions.push({
        $or: [
          { title: { $regex: noSpaceQuery, $options: 'i' } },
          { shortTitle: { $regex: noSpaceQuery, $options: 'i' } },
          { heading: { $regex: noSpaceQuery, $options: 'i' } },
        ]
      });
    }
    
    // Strategy 3: Match all words individually
    if (queryWords.length > 1) {
      const wordMatches = queryWords.map(word => ({
        $or: [
          { title: { $regex: word, $options: 'i' } },
          { shortTitle: { $regex: word, $options: 'i' } },
          { heading: { $regex: word, $options: 'i' } },
        ]
      }));
      searchConditions.push({ $and: wordMatches });
    }
    
    // Strategy 4: Match in other fields
    searchConditions.push({
      $or: [
        { genre: { $regex: escapedQuery, $options: 'i' } },
        { stars: { $regex: escapedQuery, $options: 'i' } },
        { director: { $regex: escapedQuery, $options: 'i' } },
      ]
    });

    const searchFilter: any = { $or: searchConditions };

    // Add year filter if detected
    if (year) {
      searchFilter.$and = [
        { $or: searchConditions },
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