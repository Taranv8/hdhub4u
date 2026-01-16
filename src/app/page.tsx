// src/app/page.tsx

import { Suspense } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import NoticeBanner from '@/components/common/NoticeBanner';
import CategoryList from '@/components/sections/CategoryList';
import MovieGrid from '@/components/movie/MovieGrid';
import Pagination from '@/components/common/Pagination';
import { MovieGridSkeleton } from '@/components/common/Loading';
import { MAIN_CATEGORIES, GENRES } from '@/lib/constants/categories';
import type { Movie, Category } from '@/types/movie';
import BestMonthlyMovies from '@/components/sections/BestMonthlyMovies';


// Fetch movies from the API
async function getLatestMovies(
  page: number | string = 1
): Promise<{ movies: Movie[]; totalPages: number }> {
  try {
    // Ensure page is a number
    const currentPage = Number(page);
    if (isNaN(currentPage) || currentPage < 1) {
      throw new Error('Invalid page number');
    }

    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
    
    console.log('Fetching movies for page:', currentPage); // debug

    const response = await fetch(`${baseUrl}/api/homepage?page=${currentPage}`, {
      next: { revalidate: 0 } // temporarily disable caching for testing
    });

    if (!response.ok) {
      throw new Error('Failed to fetch movies from API');
    }

    const data = await response.json();

    if (!data.success || !data.data) {
      throw new Error(data.error || 'Failed to fetch movies');
    }

    // Transform API response to your Movie type
    const movies: Movie[] = data.data.movies.map((movie: any) => ({
      id: movie._id,
      slug: generateSlug(movie.title),
      title: movie.title,
      poster: movie.image,
      thumbnail: movie.image,
      year: new Date(movie.releaseDate).getFullYear().toString(),
      quality: movie.quality,
      categories: movie.genre ? movie.genre.split('|').map((g: string) => g.trim()) : [],
      imdbRating: movie.imdbRating,
      director: movie.director,
      heading: movie.heading,
      shortTitle: movie.shortTitle,
      stars: movie.stars,
      language: movie.language,
      downloadLinks: movie.downloadLinks || [],
      trailer: movie.trailer,
      screenshots: movie.screenshots || [],
      storyline: movie.storyline,
      releaseDate: movie.releaseDate,
      episodeLinks: movie.episodeLinks || [],
    }));

    return {
      movies,
      totalPages: data.data.pagination.totalPages,
    };
  } catch (error) {
    console.error('Error fetching movies:', error);
    return {
      movies: [],
      totalPages: 0,
    };
  }
}
async function getTopMonthlyMovies() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
    
    const response = await fetch(`${baseUrl}/api/monthly-movies`, {
      next: { revalidate: 300 }
    });

    const data = await response.json();
    // console.log('Monthly movies data:', data); // ADD THIS LINE

    if (!data.success || !data.data) {
      throw new Error(data.error || 'Failed to fetch monthly movies');
    }

    return data.data.map((movie: any) => ({
      ...movie,
      slug: generateSlug(movie.title),
    }));
  } catch (error) {
    console.error('Error fetching monthly movies:', error);
    return [];
  }
}

// Helper function to generate slug from title
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

async function getCategories(): Promise<Category[]> {
  const allCategories = [
    ...MAIN_CATEGORIES.map(cat => ({ 
      id: cat.slug, 
      name: cat.name, 
      slug: cat.slug 
    })),
    ...GENRES.map(genre => ({ 
      id: genre.toLowerCase(), 
      name: genre, 
      slug: genre.toLowerCase() 
    })),
  ];
  
  return allCategories;
}

export default async function HomePage({
  searchParams,
}: {
  // searchParams can either be a Promise (root `/`) or an object (dynamic routes)
  searchParams: { page?: string } | Promise<{ page?: string }>;
}) {
  // unwrap the Promise if needed
  const params = searchParams instanceof Promise ? await searchParams : searchParams;
// In HomePage
const currentPage = parseInt(params.page?.toString() || '1', 10);

  const { movies, totalPages } = await getLatestMovies(currentPage);
  const categories = await getCategories();
  const monthlyMovies = await getTopMonthlyMovies();
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      {/* <NoticeBanner /> */}
      {/* Best Monthly Movies Section */}
{monthlyMovies.length > 0 && (
  <BestMonthlyMovies movies={monthlyMovies} />
)}

      <main className="flex-1 container mx-auto  py-8">
        <CategoryList  />

        {/* Latest Releases */}
        <Suspense fallback={<MovieGridSkeleton />}>
          {movies.length > 0 ? (
            <MovieGrid movies={movies} title="Latest Releases" />
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-400">
                Unable to load movies. Please try again later.
              </p>
            </div>
          )}
        </Suspense>

        {/* Pagination */}
        {totalPages > 0 && (
          <Pagination currentPage={currentPage} totalPages={totalPages} basePath="/page" />
        )}
      </main>

      <Footer />
    </div>
  );
}


// Generate metadata for SEO
export const metadata = {
  title: 'MovieHub - Download HD Movies & TV Shows',
  description: 'Download latest Bollywood, Hollywood, Hindi Dubbed movies and web series in HD quality',
  keywords: 'movies, download, HD movies, Bollywood, Hollywood, web series',
};