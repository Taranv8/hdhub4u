// src/app/page/[pageNumber]/page.tsx
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

// Fetch movies from the API
async function getLatestMovies(
  page: number | string = 1
): Promise<{ movies: Movie[]; totalPages: number }> {
  try {
    const currentPage = Number(page);
    if (isNaN(currentPage) || currentPage < 1) {
      throw new Error('Invalid page number');
    }

    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
    
    console.log('Fetching movies for page:', currentPage);

    const response = await fetch(`${baseUrl}/api/homepage?page=${currentPage}`, {
      next: { revalidate: 0 }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch movies from API');
    }

    const data = await response.json();

    if (!data.success || !data.data) {
      throw new Error(data.error || 'Failed to fetch movies');
    }

    const movies: Movie[] = data.data.movies.map((movie: any) => ({
      id: movie._id,
      slug: generateSlug(movie.title),
      title: movie.title,
      poster: movie.image,
      thumbnail: movie.image,
      year: new Date(movie.releaseDate).getFullYear().toString(),
      quality: movie.quality,
      categories: movie.genre || [],
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

interface PageProps {
  params: Promise<{ pageNumber: string }> | { pageNumber: string };
}

export default async function PageNumberPage({ params }: PageProps) {
  const resolvedParams = params instanceof Promise ? await params : params;
  const currentPage = parseInt(resolvedParams.pageNumber || '1', 10);

  console.log('Current page from params:', currentPage); // Debug log

  const { movies, totalPages } = await getLatestMovies(currentPage);
  const categories = await getCategories();

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <NoticeBanner />

      <main className="flex-1 container mx-auto px-4 py-8">
        <CategoryList />

        <Suspense fallback={<MovieGridSkeleton />}>
          {movies.length > 0 ? (
            <MovieGrid movies={movies} title={`Latest Releases - Page ${currentPage}`} />
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-400">
                Unable to load movies. Please try again later.
              </p>
            </div>
          )}
        </Suspense>

        {totalPages > 0 && (
          <Pagination currentPage={currentPage} totalPages={totalPages} basePath="/page" />
        )}
      </main>

      <Footer />
    </div>
  );
}

// Generate metadata for SEO
export async function generateMetadata({ params }: PageProps) {
  const resolvedParams = params instanceof Promise ? await params : params;
  const pageNumber = resolvedParams.pageNumber || '1';
  
  return {
    title: `MovieHub - Page ${pageNumber} | Download HD Movies & TV Shows`,
    description: `Browse latest Bollywood, Hollywood, Hindi Dubbed movies and web series - Page ${pageNumber}`,
    keywords: 'movies, download, HD movies, Bollywood, Hollywood, web series',
  };
}