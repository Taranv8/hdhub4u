// src/types/movie.ts

// src/types/movie.ts

export interface Movie {
  id: string;
  slug: string;
  title: string;
  poster: string;
  thumbnail: string;
  featured?: boolean;
  year: string;
  quality: string;
  categories: string[];
  // Additional fields from API
  imdbRating?: number;
  director?: string;
  stars?: string;
  language?: string;
  downloadLinks?: Array<{
    href: string;
    value: string;
  }>;
  trailer?: string;
  screenshots?: string[];
  storyline?: string;
  releaseDate?: Date;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
}
  
  
  
  export interface SearchParams {
    q?: string;
    category?: string;
    year?: string;
    quality?: string;
    language?: string;
    page?: number;
  }
  
  export interface ApiResponse<T> {
    data: T;
    total?: number;
    page?: number;
    totalPages?: number;
    error?: string;
  }