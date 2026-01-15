// src/app/movie/[id]/page.tsx

import { notFound } from 'next/navigation';
import Image from 'next/image';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { formatTitle } from '@/lib/utils/formatters';
import { Download, Calendar, Film, Languages, Star, User, Play } from 'lucide-react';
import { getMovieById } from '@/lib/controllers/movieidController';

async function getMovieDetails(id: string) {
  try {
    console.log('=== Getting movie details for ID:', id);
    const movie = await getMovieById(id);
    
    if (!movie) {
      console.log('Movie not found for ID:', id);
      return null;
    }

    console.log('Movie found:', movie.title);
    return movie;
  } catch (error) {
    console.error('Error fetching movie:', error);
    return null;
  }
}

export default async function MovieDetailPage({
  params,
}: {
  params: Promise<{ id: string }>; // Changed to Promise
}) {
  // Await the params
  const resolvedParams = await params;
  console.log('=== Page params received:', resolvedParams);
  
  const movie = await getMovieDetails(resolvedParams.id);

  if (!movie) {
    notFound();
  }

  // Extract year from releaseDate
  const releaseYear = movie.releaseDate
    ? new Date(movie.releaseDate).getFullYear()
    : null;

  // Parse genre into array
  const genres = movie.genre ? movie.genre.split('|').map(g => g.trim()) : [];

  // Parse stars into array
  const starsList = movie.stars ? movie.stars.split(',').map(s => s.trim()) : [];

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col">
      <Header />

      <main className="flex-1 container mx-auto px-4 py-8">
        {/* Movie Header */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {/* Poster */}
          <div className="md:col-span-1">
            <div className="relative aspect-[2/3] rounded-lg overflow-hidden shadow-2xl">
              <Image
                src={movie.image || 'https://new1.hdhub4u.fo/wp-content/uploads/2021/05/hdhub4ulogo.png'}
                alt={formatTitle(movie.title)}
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>

          {/* Details */}
          <div className="md:col-span-2 space-y-6">
            <h1 className="text-3xl md:text-4xl font-bold text-white">
              {formatTitle(movie.title)}
            </h1>

            {/* Meta Info */}
            <div className="flex flex-wrap gap-4 text-gray-300">
              {releaseYear && (
                <div className="flex items-center gap-2">
                  <Calendar size={18} />
                  <span>{releaseYear}</span>
                </div>
              )}
              {movie.quality && (
                <div className="flex items-center gap-2">
                  <Film size={18} />
                  <span>{movie.quality}</span>
                </div>
              )}
              {movie.language && (
                <div className="flex items-center gap-2">
                  <Languages size={18} />
                  <span>{movie.language}</span>
                </div>
              )}
              {movie.imdbRating && (
                <div className="flex items-center gap-2">
                  <Star size={18} className="text-yellow-400 fill-yellow-400" />
                  <span>{movie.imdbRating}/10</span>
                </div>
              )}
            </div>

            {/* Genres */}
            {genres.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {genres.map((genre) => (
                  <span
                    key={genre}
                    className="px-3 py-1 bg-blue-600 rounded-full text-sm"
                  >
                    {genre}
                  </span>
                ))}
              </div>
            )}

            {/* Director & Stars */}
            <div className="space-y-2 text-gray-300">
              {movie.director && (
                <div className="flex items-start gap-2">
                  <User size={18} className="mt-1 flex-shrink-0" />
                  <div>
                    <span className="font-semibold">Director:</span> {movie.director}
                  </div>
                </div>
              )}
              {starsList.length > 0 && (
                <div className="flex items-start gap-2">
                  <Star size={18} className="mt-1 flex-shrink-0" />
                  <div>
                    <span className="font-semibold">Stars:</span> {starsList.join(', ')}
                  </div>
                </div>
              )}
            </div>

            {/* Storyline */}
            {movie.storyline && (
              <div>
                <h2 className="text-xl font-bold text-white mb-2">Storyline</h2>
                <p className="text-gray-300 leading-relaxed">
                  {movie.storyline}
                </p>
              </div>
            )}

            {/* Trailer */}
            {movie.trailer && (
              <div className="bg-gray-800 rounded-lg p-4">
                <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <Play size={24} />
                  Trailer
                </h2>
                <div className="relative aspect-video rounded-lg overflow-hidden">
                  <iframe
                    src={movie.trailer}
                    title="Movie Trailer"
                    className="w-full h-full"
                    allowFullScreen
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  />
                </div>
              </div>
            )}

            {/* Download Links */}
            {movie.downloadLinks && movie.downloadLinks.length > 0 && (
              <div className="bg-gray-800 rounded-lg p-6">
                <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <Download size={24} />
                  Download Links
                </h2>

                <div className="space-y-3">
                  {movie.downloadLinks.map((link, index) => (
                    <a
                      key={index}
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between p-4 bg-gray-700 hover:bg-blue-600 rounded-lg transition group"
                    >
                      <span className="font-semibold text-white">
                        {link.value}
                      </span>

                      <Download
                        size={20}
                        className="text-gray-400 group-hover:text-white"
                      />
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Screenshots Gallery */}
        {movie.screenshots && movie.screenshots.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-white mb-6">Screenshots</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {movie.screenshots.map((screenshot, index) => (
                <div
                  key={index}
                  className="relative aspect-video rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-shadow cursor-pointer group"
                >
                  <Image
                    src={screenshot}
                    alt={`Screenshot ${index + 1}`}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

// Generate metadata - also needs async params
export async function generateMetadata({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  const resolvedParams = await params;
  const movie = await getMovieDetails(resolvedParams.id);
  
  if (!movie) {
    return {
      title: 'Movie Not Found',
    };
  }
  
  return {
    title: `${formatTitle(movie.title)} - Download HD - MovieHub`,
    description: movie.storyline || movie.shortTitle || formatTitle(movie.title),
  };
}