// src/lib/controllers/movieISRController.ts
// ISR-specific operations with enhanced logging and monitoring

import { connectToDatabase } from '../mongodb';
import { ObjectId } from 'mongodb';

export interface MovieISR {
  _id: string;
  title: string;
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
  episodeLinks?: Array<{
    episode: string;
    links: {
      [quality: string]: {
        [platform: string]: string;
      };
    };
  }>;
}

// Projection for ISR pages
const isrProjection = {
  _id: 1,
  title: 1,
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

// Cache for frequently accessed movies (in-memory cache)
const movieCache = new Map<string, { data: MovieISR; timestamp: number }>();
const CACHE_TTL = 86400000;; // 24 hour  in-memory cache

// Extract clean title from complex movie names for SEO
export function extractCleanTitle(title: string, shortTitle?: string): string {
  if (shortTitle && shortTitle.trim()) {
    return shortTitle.trim();
  }

  const firstBracketIndex = title.indexOf('(');
  
  if (firstBracketIndex !== -1) {
    return title.substring(0, firstBracketIndex).trim();
  }
  
  return title.trim();
}

// Get all movie IDs for ISR static generation
export async function getAllMovieIds(limit: number = 6000): Promise<string[]> {
  const startTime = Date.now();
  
  try {
    console.log(`\n${'='.repeat(60)}`);
    console.log(`🚀 ISR BUILD: getAllMovieIds called`);
    console.log(`📊 Requesting: ${limit} movie IDs`);
    console.log(`⏰ Time: ${new Date().toISOString()}`);
    console.log(`${'='.repeat(60)}\n`);
    
    const { db } = await connectToDatabase();
    const collection = db.collection('movies');

    // Get most recent movies for initial static generation
    const movies = await collection
      .find({}, { projection: { _id: 1 } })
      .sort({ releaseDate: -1 })
      .limit(limit)
      .toArray();

    const movieIds = movies.map(movie => movie._id.toString());
    
    const duration = Date.now() - startTime;
    
    console.log(`\n${'='.repeat(60)}`);
    console.log(`✅ ISR BUILD: Successfully fetched movie IDs`);
    console.log(`📊 Total IDs: ${movieIds.length}`);
    console.log(`⏱️  Duration: ${duration}ms`);
    console.log(`💾 Sample IDs: ${movieIds.slice(0, 3).join(', ')}...`);
    console.log(`${'='.repeat(60)}\n`);
    
    return movieIds;
  } catch (error) {
    const duration = Date.now() - startTime;
    
    console.error(`\n${'='.repeat(60)}`);
    console.error(`❌ ISR BUILD ERROR: Failed to fetch movie IDs`);
    console.error(`⏱️  Duration: ${duration}ms`);
    console.error(`📝 Error:`, error);
    console.error(`${'='.repeat(60)}\n`);
    
    return [];
  }
}

// Get movie by ID for ISR pages with enhanced logging
export async function getMovieForISR(
  id: string
): Promise<{ success: boolean; data?: MovieISR; error?: string; cached?: boolean }> {
  const startTime = Date.now();
  const timestamp = new Date().toISOString();
  
  try {
    // Log request details
    console.log(`\n${'─'.repeat(60)}`);
    console.log(`🔍 ISR FETCH: getMovieForISR called`);
    console.log(`📄 Movie ID: ${id}`);
    console.log(`⏰ Time: ${timestamp}`);
    
    // Validate ObjectId
    if (!ObjectId.isValid(id)) {
      console.error(`❌ VALIDATION FAILED: Invalid ObjectId format`);
      console.log(`${'─'.repeat(60)}\n`);
      
      return {
        success: false,
        error: 'Invalid movie ID format'
      };
    }

    // Check in-memory cache first
    const cached = movieCache.get(id);
    if (cached && (Date.now() - cached.timestamp) < CACHE_TTL) {
      const duration = Date.now() - startTime;
      
      console.log(`💾 CACHE HIT: Movie found in memory cache`);
      console.log(`⏱️  Duration: ${duration}ms`);
      console.log(`🎬 Title: ${extractCleanTitle(cached.data.title, cached.data.shortTitle)}`);
      console.log(`${'─'.repeat(60)}\n`);
      
      return {
        success: true,
        data: cached.data,
        cached: true
      };
    }

    // Fetch from database
    console.log(`💿 DATABASE QUERY: Fetching from MongoDB...`);
    
    const { db } = await connectToDatabase();
    const collection = db.collection('movies');

    const movie = await collection.findOne(
      { _id: new ObjectId(id) },
      { projection: isrProjection }
    );

    if (!movie) {
      const duration = Date.now() - startTime;
      
      console.log(`⚠️  NOT FOUND: Movie does not exist in database`);
      console.log(`⏱️  Duration: ${duration}ms`);
      console.log(`${'─'.repeat(60)}\n`);
      
      return {
        success: false,
        error: 'Movie not found'
      };
    }

    // Map to MovieISR type
    const movieData: MovieISR = {
      _id: movie._id.toString(),
      title: movie.title ?? '',
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
    };

    // Store in cache
    movieCache.set(id, { data: movieData, timestamp: Date.now() });
    
    // Limit cache size (keep last 100 movies)
    if (movieCache.size > 100) {
      const firstKey = movieCache.keys().next().value;
      if (firstKey) {
        movieCache.delete(firstKey);
      }
    }

    const duration = Date.now() - startTime;
    const cleanTitle = extractCleanTitle(movieData.title, movieData.shortTitle);
    
    console.log(`✅ SUCCESS: Movie fetched from database`);
    console.log(`🎬 Title: ${cleanTitle}`);
    console.log(`📅 Release: ${new Date(movieData.releaseDate).toLocaleDateString()}`);
    console.log(`🎭 Genres: ${movieData.genre.join(', ')}`);
    console.log(`⏱️  Duration: ${duration}ms`);
    console.log(`💾 Cached: Yes (for ${CACHE_TTL / 1000}s)`);
    console.log(`${'─'.repeat(60)}\n`);

    return {
      success: true,
      data: movieData,
      cached: false
    };
  } catch (error) {
    const duration = Date.now() - startTime;
    
    console.error(`\n${'─'.repeat(60)}`);
    console.error(`❌ ISR FETCH ERROR: Exception occurred`);
    console.error(`📄 Movie ID: ${id}`);
    console.error(`⏱️  Duration: ${duration}ms`);
    console.error(`📝 Error:`, error);
    console.error(`${'─'.repeat(60)}\n`);
    
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
}

// Get total count of movies (for analytics/debugging)
export async function getTotalMovieCount(): Promise<number> {
  try {
    console.log(`📊 ISR: Getting total movie count...`);
    
    const { db } = await connectToDatabase();
    const collection = db.collection('movies');
    const count = await collection.estimatedDocumentCount();
    
    console.log(`✅ ISR: Total movies in database: ${count.toLocaleString()}`);
    
    return count;
  } catch (error) {
    console.error('❌ Error getting movie count:', error);
    return 0;
  }
}

// Get movie IDs in batches (for very large databases)
export async function getMovieIdsBatch(
  page: number = 1,
  limit: number = 100
): Promise<{ success: boolean; data?: { ids: string[]; hasMore: boolean }; error?: string }> {
  try {
    const skip = (page - 1) * limit;
    
    console.log(`📦 ISR: Fetching batch ${page} (skip: ${skip}, limit: ${limit})`);
    
    const { db } = await connectToDatabase();
    const collection = db.collection('movies');

    const movies = await collection
      .find({}, { projection: { _id: 1 } })
      .sort({ releaseDate: -1 })
      .skip(skip)
      .limit(limit + 1)
      .toArray();

    const hasMore = movies.length > limit;
    const ids = movies.slice(0, limit).map(movie => movie._id.toString());

    console.log(`✅ ISR: Batch ${page} fetched - ${ids.length} IDs, hasMore: ${hasMore}`);

    return {
      success: true,
      data: {
        ids,
        hasMore
      }
    };
  } catch (error) {
    console.error('❌ Error fetching movie IDs batch:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
}

// Clear in-memory cache (useful for debugging)
export function clearMovieCache(): void {
  const size = movieCache.size;
  movieCache.clear();
  console.log(`🗑️  ISR: Cleared ${size} entries from movie cache`);
}

// Get cache statistics
export function getCacheStats() {
  return {
    size: movieCache.size,
    maxSize: 100,
    ttl: CACHE_TTL / 1000,
    entries: Array.from(movieCache.keys())
  };
}