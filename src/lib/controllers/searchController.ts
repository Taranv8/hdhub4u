// lib/controllers/searchController.ts
import { connectToDatabase } from '../mongodb';
import { Movie, PaginationInfo } from './movieController';

export interface SearchResponse {
  success: boolean;
  data?: {
    movies: Movie[];
    recommendations: Movie[];
    pagination: PaginationInfo;
    query: string;
    searchType: 'exact' | 'fuzzy' | 'partial';
  };
  error?: string;
}

// Helper function to calculate similarity score
function calculateSimilarity(str1: string, str2: string): number {
  str1 = str1.toLowerCase();
  str2 = str2.toLowerCase();
  
  // Exact match
  if (str1 === str2) return 100;
  
  // Contains match
  if (str1.includes(str2) || str2.includes(str1)) return 80;
  
  // Word match
  const words1 = str1.split(/\s+/);
  const words2 = str2.split(/\s+/);
  let matchCount = 0;
  
  words2.forEach(word => {
    if (words1.some(w => w.includes(word) || word.includes(w))) {
      matchCount++;
    }
  });
  
  return (matchCount / words2.length) * 60;
}

// Helper function to extract year from query
function extractYear(query: string): number | null {
  const yearMatch = query.match(/\b(19|20)\d{2}\b/);
  return yearMatch ? parseInt(yearMatch[0]) : null;
}

// Helper function to normalize text for better matching
function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '') // Remove special characters
    .replace(/\s+/g, ' ') // Normalize spaces
    .trim();
}

export async function searchMovies(
  query: string,
  page: number = 1,
  limit: number = 50
): Promise<SearchResponse> {
  try {
    const { db } = await connectToDatabase();
    const skip = (page - 1) * limit;
    
    // Normalize query
    const normalizedQuery = normalizeText(query);
    const queryWords = normalizedQuery.split(' ');
    const year = extractYear(query);
    
    console.log('Advanced search:', { query, normalizedQuery, queryWords, year });

    // Build comprehensive search filter with multiple strategies
    const searchFilters = [];
    
    // Strategy 1: Exact phrase match (highest priority)
    searchFilters.push({
      $or: [
        { title: { $regex: `^${query}`, $options: 'i' } },
        { shortTitle: { $regex: `^${query}`, $options: 'i' } },
        { heading: { $regex: `^${query}`, $options: 'i' } }
      ]
    });
    
    // Strategy 2: Contains phrase (medium priority)
    searchFilters.push({
      $or: [
        { title: { $regex: query, $options: 'i' } },
        { shortTitle: { $regex: query, $options: 'i' } },
        { heading: { $regex: query, $options: 'i' } },
        { genre: { $regex: query, $options: 'i' } },
        { stars: { $regex: query, $options: 'i' } },
        { director: { $regex: query, $options: 'i' } },
        { language: { $regex: query, $options: 'i' } }
      ]
    });
    
    // Strategy 3: Individual word match (lower priority)
    const wordMatches = queryWords.map(word => ({
      $or: [
        { title: { $regex: word, $options: 'i' } },
        { shortTitle: { $regex: word, $options: 'i' } },
        { heading: { $regex: word, $options: 'i' } },
        { genre: { $regex: word, $options: 'i' } },
        { stars: { $regex: word, $options: 'i' } }
      ]
    }));
    
    // Strategy 4: Year-based search if year detected
    if (year) {
      const yearStart = new Date(year, 0, 1);
      const yearEnd = new Date(year, 11, 31);
      searchFilters.push({
        releaseDate: {
          $gte: yearStart,
          $lte: yearEnd
        }
      });
    }
    
    // Combine all strategies
    const combinedFilter = {
      $or: [
        ...searchFilters,
        { $and: wordMatches }
      ]
    };

    // Fetch all matching movies (without pagination initially for scoring)
    const allMatchingMovies = await db
      .collection('movies')
      .find(combinedFilter)
      .toArray();

    // Score and sort movies by relevance
    const scoredMovies = allMatchingMovies.map((movie) => {
      let score = 0;
      
      // Calculate relevance scores
      score += calculateSimilarity(movie.title || '', query);
      score += calculateSimilarity(movie.shortTitle || '', query) * 0.8;
      score += calculateSimilarity(movie.heading || '', query) * 0.6;
      
      // Boost for genre, language matches
      if (movie.genre?.toLowerCase().includes(normalizedQuery)) score += 20;
      if (movie.language?.toLowerCase().includes(normalizedQuery)) score += 15;
      
      // Boost for star/director matches
      queryWords.forEach(word => {
        if (movie.stars?.toLowerCase().includes(word)) score += 10;
        if (movie.director?.toLowerCase().includes(word)) score += 10;
      });
      
      // Boost for IMDB rating (quality signal)
      if (movie.imdbRating) score += movie.imdbRating * 2;
      
      // Recent movies get slight boost
      const movieYear = new Date(movie.releaseDate).getFullYear();
      if (movieYear >= 2020) score += 5;
      
      return {
        movie,
        score
      };
    });

    // Sort by score
    scoredMovies.sort((a, b) => b.score - a.score);

    // Get paginated results
    const paginatedResults = scoredMovies.slice(skip, skip + limit);
    
    // Transform to Movie format
    const movies: Movie[] = paginatedResults.map(({ movie }) => ({
      _id: movie._id.toString(),
      title: movie.title || '',
      link: movie.link || '',
      image: movie.image || '',
      heading: movie.heading || '',
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

    // Get recommendations based on the search context
    const recommendations = await getRecommendations(db, query, movies, normalizedQuery);

    // Determine search type
    let searchType: 'exact' | 'fuzzy' | 'partial' = 'partial';
    if (movies.length > 0 && scoredMovies[0].score >= 80) {
      searchType = 'exact';
    } else if (movies.length > 0 && scoredMovies[0].score >= 50) {
      searchType = 'fuzzy';
    }

    const totalMovies = scoredMovies.length;
    const totalPages = Math.ceil(totalMovies / limit);
    
    return {
      success: true,
      data: {
        movies,
        recommendations,
        query,
        searchType,
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
    console.error('Error searching movies:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
}

// Get smart recommendations based on search context
async function getRecommendations(
  db: any,
  originalQuery: string,
  searchResults: Movie[],
  normalizedQuery: string
): Promise<Movie[]> {
  try {
    // If we have good search results, base recommendations on them
    if (searchResults.length > 0) {
      const topResult = searchResults[0];
      
      // Get movies with similar genre, language, or stars
      const recommendationFilter = {
        _id: { $nin: searchResults.map(m => m._id) }, // Exclude current results
        $or: [
          { genre: { $regex: topResult.genre, $options: 'i' } },
          { language: topResult.language },
          { stars: { $regex: topResult.stars.split(',')[0]?.trim() || '', $options: 'i' } },
          { director: topResult.director }
        ]
      };
      
      const recommendations = await db
        .collection('movies')
        .find(recommendationFilter)
        .sort({ imdbRating: -1 })
        .limit(4)
        .toArray();
      
      return recommendations.map((movie: any) => ({
        _id: movie._id.toString(),
        title: movie.title || '',
        link: movie.link || '',
        image: movie.image || '',
        heading: movie.heading || '',
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
    }
    
    // If no results, suggest popular movies from detected genre/language
    const queryWords = normalizedQuery.split(' ');
    const genreKeywords = ['action', 'comedy', 'drama', 'horror', 'thriller', 'romance', 'sci-fi', 'adventure'];
    const detectedGenre = genreKeywords.find(g => queryWords.includes(g));
    
    const fallbackFilter: any = {};
    if (detectedGenre) {
      fallbackFilter.genre = { $regex: detectedGenre, $options: 'i' };
    }
    
    const fallbackRecommendations = await db
      .collection('movies')
      .find(fallbackFilter)
      .sort({ imdbRating: -1, releaseDate: -1 })
      .limit(4)
      .toArray();
    
    return fallbackRecommendations.map((movie: any) => ({
      _id: movie._id.toString(),
      title: movie.title || '',
      link: movie.link || '',
      image: movie.image || '',
      heading: movie.heading || '',
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
  } catch (error) {
    console.error('Error getting recommendations:', error);
    return [];
  }
}