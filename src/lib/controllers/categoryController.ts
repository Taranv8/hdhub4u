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

// Category mapping for URL slugs to database values
const categoryMappings: { [key: string]: string } = {
    'bollywood': 'BollyWood',
    'hollywood': 'HollyWood',
    'hindi-dubbed': 'Hindi Dubbed',
    'south-hindi': 'South Hindi',
    'web-series': 'Web Series',
    '18': '18+',
    '18-adult': '18+ [Adult]',
    'sci-fi': 'Sci-Fi',
    'action': 'Action',
    'animation': 'Animation',
    'animated': 'Animated',
    'comedy': 'Comedy',
    'crime': 'Crime',
    'drama': 'Drama',
    'family': 'Family',
    'fantasy': 'Fantasy',
    'horror': 'Horror',
    'mystery': 'Mystery',
    'romance': 'Romance',
    'thriller': 'Thriller',
    'war': 'War',
    'western': 'Western',
    'biography': 'Biography',
    '300mb-movies': '300mb Movies',
    'awards': 'Awards',
    'gujarati': 'Gujarati',
    'hd-movies': 'HD Movies',
    'hq-dubs': 'HQ DUBs',
    'south-voiceover-dubs': 'South VoiceOver Dubs',
    'southhindidubs-voiceover': 'SouthHindiDubs [VoiceOver]',
    'movielogy-collection': 'MovieLogy Collection',
    'punjabi': 'Punjabi',
    'talk': 'Talk',
    'talks': 'TALKS',
    'trailers': 'TRAILERs',
    'wwe': 'WWE',
    'tv-shows': 'TV Shows',
    'anime': 'Anime',
    'documentaries': 'Documentaries',
  };

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

    // Decode category from URL
    const decodedCategory = decodeURIComponent(category).toLowerCase();
    console.log('🔤 Decoded category (lowercase):', decodedCategory);

    const { db } = await connectToDatabase();
    console.log('✅ Connected to database');
    
    const collection = db.collection('movies');
    console.log('✅ Got movies collection');

    // Get the exact category name from mapping or convert slug to proper case
    let categoryValue: string;
    
    if (categoryMappings[decodedCategory]) {
      categoryValue = categoryMappings[decodedCategory];
      console.log('✅ Found in mappings:', decodedCategory, '→', categoryValue);
    } else {
      // Convert slug to title case as fallback
      categoryValue = decodedCategory
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
      console.log('⚠️  NOT in mappings, converted to Title Case:', categoryValue);
    }

    // Query for movies where genre array contains the category
    const query = {
      genre: categoryValue  // MongoDB automatically searches in arrays
    };

    console.log('🔍 MongoDB Query:', JSON.stringify(query, null, 2));
    
    // Test query - let's also check what we actually have
    const sampleMovie = await collection.findOne({ genre: { $exists: true } });
    console.log('📋 Sample movie from DB:');
    console.log('   - Title:', sampleMovie?.title);
    console.log('   - Genres:', sampleMovie?.genre);

    // Let's also test if the exact query finds anything
    const testCount = await collection.countDocuments(query);
    console.log('🧪 Test count for query:', testCount);

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