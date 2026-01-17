// lib/utils/movieAdapter.ts
import type { Movie as FrontendMovie } from '@/types/movie';
import type { Movie as BackendMovie } from '@/lib/controllers/movieController';

export function adaptBackendMovieToFrontend(backendMovie: BackendMovie): FrontendMovie {
  return {
    id: backendMovie._id,
    title: backendMovie.title,
    slug: backendMovie.link || backendMovie.shortTitle.toLowerCase().replace(/\s+/g, '-'),
    poster: backendMovie.image,
    thumbnail: backendMovie.image,
    year: new Date(backendMovie.releaseDate).getFullYear().toString(),
    categories: backendMovie.genre || [],
    imdbRating: backendMovie.imdbRating,
        language: backendMovie.language,
    quality: backendMovie.quality,
    // Add any other fields your frontend Movie type needs
  };
}

export function adaptBackendMoviesToFrontend(backendMovies: BackendMovie[]): FrontendMovie[] {
  return backendMovies.map(adaptBackendMovieToFrontend);
}