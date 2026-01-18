// lib/controllers/categoryController.ts
import { connectToDatabase } from '../mongodb';
import type { Movie, MovieResponse, PaginationInfo } from './movieController';

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

/**
 * Normalize a string for comparison - removes special characters, extra spaces, and lowercases
 */
function normalizeForComparison(str: string): string {
  return str
    .toLowerCase()
    .replace(/\+/g, '')           // Remove +
    .replace(/\[|\]/g, '')        // Remove brackets
    .replace(/'/g, '')            // Remove apostrophes
    .replace(/\s+/g, '')          // Remove all spaces
    .replace(/-/g, '')            // Remove hyphens
    .replace(/[^\w]/g, '')        // Remove remaining special chars
    .trim();
}

/**
 * Convert URL slug to possible database genre values
 * Returns array of possible matches to search for
 */
function slugToGenreVariants(slug: string): string[] {
  // Decode the slug
  const decoded = decodeURIComponent(slug);
  
  // Common variations to try
  const variants: string[] = [];
  
  // Original decoded
  variants.push(decoded);
  
  // Title Case
  const titleCase = decoded
    .split(/[-\s]+/)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
  variants.push(titleCase);
  
  // With hyphens instead of spaces
  variants.push(titleCase.replace(/\s+/g, '-'));
  
  // All lowercase
  variants.push(decoded.toLowerCase());
  
  // All uppercase
  variants.push(decoded.toUpperCase());
  
  // PascalCase (for BollyWood, HollyWood style)
  const pascalCase = decoded
    .split(/[-\s]+/)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join('');
  variants.push(pascalCase);
  
  return [...new Set(variants)]; // Remove duplicates
}

export async function getMoviesByCategory(
  category: string,
  page: number = 1,
  limit: number = 30
): Promise<MovieResponse> {
  console.log('=====================================');
  console.log('🎬 getMoviesByCategory STARTED');
  console.log('=====================================');
  console.log('📥 Input category:', category);
  console.log('📄 Page:', page);
  console.log('📊 Limit:', limit);
  
  try {
    // Validate and sanitize inputs
    const validPage = Math.max(1, Math.floor(page));
    const validLimit = Math.min(100, Math.max(1, Math.floor(limit)));
    const skip = (validPage - 1) * validLimit;

    console.log('✅ Validated - Page:', validPage, 'Limit:', validLimit, 'Skip:', skip);

    const { db } = await connectToDatabase();
    console.log('✅ Connected to database');
    
    const collection = db.collection('movies');
    console.log('✅ Got movies collection');

    // Get all unique genres from database for matching
    const allGenres: string[] = await collection.distinct('genre');
    console.log('📋 Total unique genres in DB:', allGenres.length);
    console.log('📋 All genres:', allGenres);

    // Normalize the input category
    const normalizedInput = normalizeForComparison(category);
    console.log('🔤 Input category (original):', category);
    console.log('🔤 Normalized input:', normalizedInput);
    
    // Show what each genre normalizes to (only first 10 to avoid clutter)
    console.log('🔍 Sample normalized genres in DB:');
    allGenres.slice(0, 10).forEach(g => {
      if (g) console.log(`   "${g}" → "${normalizeForComparison(g)}"`);
    });

    // Find matching genre from database
    let matchedGenre: string | null = null;
    
    // Method 1: Exact normalized match (most reliable)
    for (const genre of allGenres) {
      if (!genre) continue; // Skip null/undefined genres
      if (normalizeForComparison(genre) === normalizedInput) {
        matchedGenre = genre;
        console.log('✅ Method 1 - Exact normalized match:', matchedGenre);
        break;
      }
    }

    // Method 2: Try case-insensitive exact match on original
    if (!matchedGenre) {
      console.log('⚠️ Method 1 failed, trying Method 2: case-insensitive original match');
      const decodedCategory = decodeURIComponent(category);
      for (const genre of allGenres) {
        if (!genre) continue; // Skip null/undefined genres
        if (genre.toLowerCase() === decodedCategory.toLowerCase()) {
          matchedGenre = genre;
          console.log('✅ Method 2 - Case-insensitive match:', matchedGenre);
          break;
        }
      }
    }

    // Method 3: Try with spaces instead of hyphens
    if (!matchedGenre) {
      console.log('⚠️ Method 2 failed, trying Method 3: hyphen to space conversion');
      const withSpaces = decodeURIComponent(category).replace(/-/g, ' ');
      for (const genre of allGenres) {
        if (!genre) continue; // Skip null/undefined genres
        if (genre.toLowerCase() === withSpaces.toLowerCase()) {
          matchedGenre = genre;
          console.log('✅ Method 3 - Hyphen to space match:', matchedGenre);
          break;
        }
      }
    }

    // Method 4: Try partial/fuzzy matching
    if (!matchedGenre) {
      console.log('⚠️ Method 3 failed, trying Method 4: fuzzy matching');
      const potentialMatches = allGenres.filter(genre => {
        if (!genre) return false; // Skip null/undefined genres
        const normalizedGenre = normalizeForComparison(genre);
        return normalizedGenre.includes(normalizedInput) || 
               normalizedInput.includes(normalizedGenre);
      });

      if (potentialMatches.length > 0) {
        matchedGenre = potentialMatches.sort((a, b) => a.length - b.length)[0];
        console.log('✅ Method 4 - Fuzzy match:', matchedGenre);
        console.log('   Other matches:', potentialMatches);
      }
    }

    // Method 5: Try variant generation
    if (!matchedGenre) {
      console.log('⚠️ Method 4 failed, trying Method 5: variant generation');
      const variants = slugToGenreVariants(category);
      console.log('🔄 Generated variants:', variants);
      
      for (const variant of variants) {
        for (const genre of allGenres) {
          if (!genre) continue; // Skip null/undefined genres
          if (genre.toLowerCase() === variant.toLowerCase()) {
            matchedGenre = genre;
            console.log('✅ Method 5 - Variant match:', matchedGenre, 'from:', variant);
            break;
          }
        }
        if (matchedGenre) break;
      }
    }

    // Final fallback
    if (!matchedGenre) {
      console.log('❌ ALL METHODS FAILED - Using fallback');
      matchedGenre = category
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
      console.log('   Fallback value:', matchedGenre);
      console.log('   ⚠️ This will likely return 0 results');
    }

    // Build flexible query that matches genre case-insensitively
    const query = {
      genre: {
        $regex: new RegExp(`^${matchedGenre.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i')
      }
    };

    console.log('🔍 MongoDB Query:', JSON.stringify(query, null, 2));
    console.log('🎯 Searching for genre:', matchedGenre);
    
    // Execute count and find in parallel for better performance
    console.log('⏳ Fetching movies from database...');
    const [moviesFromDb, totalMovies] = await Promise.all([
      collection
        .find(query, { projection: movieProjection })
        .sort({ releaseDate: -1 })
        .skip(skip)
        .limit(validLimit)
        .toArray(),
      collection.countDocuments(query)
    ]);

    console.log('📊 Results:');
    console.log('   - Total movies found:', totalMovies);
    console.log('   - Movies in this page:', moviesFromDb.length);
    
    if (moviesFromDb.length > 0) {
      console.log('   - First movie:', moviesFromDb[0].title);
      console.log('   - First movie genres:', moviesFromDb[0].genre);
    } else if (totalMovies === 0) {
      console.log('⚠️  No movies found. Available genres:', allGenres.slice(0, 10), '...');
    }

    // Map documents efficiently
    const movies = moviesFromDb.map(mapMovieDocument);
    
    const totalPages = Math.ceil(totalMovies / validLimit);
    
    console.log('✅ Successfully mapped', movies.length, 'movies');
    console.log('📄 Total pages:', totalPages);
    console.log('=====================================');
    console.log('✅ getMoviesByCategory COMPLETED');
    console.log('=====================================\n');
    
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
    console.error('❌ ERROR in getMoviesByCategory:', error);
    console.log('=====================================\n');
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
}

// Get all unique categories from database
export async function getAllCategories(): Promise<string[]> {
  console.log('🏷️  getAllCategories STARTED');
  try {
    const { db } = await connectToDatabase();
    const collection = db.collection('movies');

    // Use aggregation to get all unique values from the genre array
    const pipeline = [
      { $unwind: '$genre' },
      { $group: { _id: '$genre' } },
      { $sort: { _id: 1 } }
    ];

    console.log('⏳ Running aggregation pipeline...');
    const result = await collection.aggregate(pipeline).toArray();
    const categories = result.map(item => item._id).filter(Boolean);
    
    console.log('📊 All unique categories in database:');
    console.log(categories);
    console.log('📊 Total unique categories:', categories.length);
    console.log('✅ getAllCategories COMPLETED\n');
    
    return categories;
  } catch (error) {
    console.error('❌ Error fetching categories:', error);
    return [];
  }
}