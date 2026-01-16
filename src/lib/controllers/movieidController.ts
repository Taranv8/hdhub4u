// lib/controllers/movieidController.ts
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
export interface MovieDetails {
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
  quality: string;
  heading: string,

  screenshots: string[];
  downloadLinks: Array<{
    href: string;
    value: string;
  }>;
  trailer: string;
  storyline: string;
  releaseDate: Date;
  episodeLinks?: EpisodeLink[];
}

export async function getMovieById(id: string): Promise<MovieDetails | null> {
  try {
    console.log('Received ID:', id);
    console.log('ID type:', typeof id);
    console.log('ID length:', id?.length);
    // Validate MongoDB ObjectId
    if (!ObjectId.isValid(id)) {
      throw new Error('Invalid movie ID format');
    }

    const { db } = await connectToDatabase();
    
    const movie = await db.collection('movies').findOne({
      _id: new ObjectId(id)
    });

    if (!movie) {
      return null;
    }

    // Transform MongoDB document to MovieDetails format
    return {
      _id: movie._id.toString(),
      title: movie.title || '',
      link: movie.link || '',
      image: movie.image || '',
      shortTitle: movie.shortTitle || '',
      imdbRating: movie.imdbRating || 0,
      genre: movie.genre || [],
            heading:movie.heading || '',

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
    };
  } catch (error) {
    console.error('Error fetching movie by ID:', error);
    throw error;
  }
}