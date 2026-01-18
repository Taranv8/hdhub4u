// src/app/movie/[id]/page.tsx

import { notFound } from 'next/navigation';
import Image from 'next/image';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { formatTitle } from '@/lib/utils/formatters';
import { getMovieById } from '@/lib/controllers/movieidController';
import MovieIcon from '@mui/icons-material/Movie';
import DateRangeIcon from '@mui/icons-material/DateRange';
import FolderIcon from '@mui/icons-material/Folder';
import DownloadLink from '@/components/DownloadLink';
import EpisodeLink from '@/components/EpisodeLink';
import RightSidebar from '@/components/sections/RightSidebar';
import Link from 'next/link';


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
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;
  console.log('=== Page params received:', resolvedParams);

  const movie = await getMovieDetails(resolvedParams.id);

  if (!movie) {
    notFound();
  }

  const formattedReleaseDate = movie.releaseDate
    ? new Date(movie.releaseDate).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    })
    : null;

  const genres = movie.genre || [];
  const starsList = movie.stars ? movie.stars.split(',').map(s => s.trim()) : [];
  const qualityList = movie.quality ? movie.quality.split('|').map(q => q.trim()) : [];
  
 
  return (
    <div className="min-h-screen bg-black flex flex-col">
      <Header />
 
      <main className="flex-1 container mx-auto px-2 py-8 max-w-7xl">
        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Left Content Area (3 columns) */}
          <div className="lg:col-span-3">
            {/* Movie Title Header */}
            <div className="mb-6">
              <h1
                className="
    bg-[#171717]
    text-white
    font-[600]
    text-[20px]
    md:text-[18px]
    px-[12px]
    py-[10px]
    mb-[15px]
    rounded-[3px]
    shadow-[0_1px_1px_rgba(204,197,185,0.5)]
    whitespace-normal
    break-words
    leading-[1.7]
  "
              >
                <span className="inline-flex align-text-top mr-2">
                  <MovieIcon className="text-[18px]" />
                </span>

                <span className="[word-spacing:3px]">
                  {formatTitle(movie.title)}
                </span>
              </h1>

              {/* Tags/Badges Row */}
              <div className="flex flex-wrap gap-2 mb-4">
                {formattedReleaseDate && (
                  <span className="px-3 py-1 bg-[#4285F4] rounded text-sm text-white font-medium flex items-center gap-1.5">
                    <DateRangeIcon />
                    {formattedReleaseDate}
                  </span>
                )}

                {genres.map((genre) => (
                  <Link
                    key={genre}
                    href={`/category/${genre.toLowerCase().trim().replace(/\s+/g, '-').replace(/[^\w-]/g, '')}`}
                    className="
                      inline-flex items-center gap-1.5
                      px-3 py-1 rounded text-m font-medium
                      bg-white text-[#444444]
                      hover:bg-[#444444] hover:text-white
                      transition-colors duration-200
                      cursor-pointer
                    "
                  >
                    <FolderIcon sx={{ fontSize: 16, color: 'currentColor' }} />
                    {genre}
                  </Link>
                ))}
              </div>
            </div>
            {/* br line */}
            <div className="w-[96%] h-[2px] bg-[#252525] mx-auto mb-4"></div>

           {/* Storyline */}
           {movie.storyline && (
                <div>
                  <h2 className="text-xl font-bold text-white mb-3">Storyline</h2>
                  <p className="text-gray-400 leading-relaxed">
                    {movie.storyline}
                  </p>
                </div>
              )}

            {/* Poster Image */}
            <div className="mb-8 mt-6 flex justify-center">
              <div className="relative w-full max-w-[300px] max-h-[450px] rounded-lg overflow-hidden shadow-2xl">
                <Image
                  src={movie.image || 'https://new1.hdhub4u.fo/wp-content/uploads/2021/05/hdhub4ulogo.png'}
                  alt={formatTitle(movie.title)}
                  width={300}
                  height={450}
                  className="object-cover w-full h-auto"
                  priority
                />
              </div>
            </div>

            {/* br line */}
            <div className="w-[96%] h-[2px] bg-[#252525] mx-auto mb-4"></div>

            {/* Details Section */}
            <div className="space-y-6">
              {/* Details Section */}
              <div className="space-y-3 text-center">
                {/* Heading */}
                <h2
                  className="text-white"
                  style={{ fontSize: '24px', fontWeight: 600 }}
                >
                  {movie.heading || 'Details'}
                </h2>

                {/* IMDB Rating */}
                <div className="flex items-center justify-center gap-2 text-[#A3A3A3]">
                  <span className="text-lg font-semibold">
                    iMDb Rating: {movie.imdbRating || (Math.floor(Math.random() * 5) + 5)}/10
                  </span>
                </div>

                {/* Genre */}
                {genres.length > 0 && (
                  <div className="text-[#A3A3A3]">
                    <span className="font-semibold text-[#A3A3A3]">Genre:</span>{' '}
                    {genres.join(' | ')}
                  </div>
                )}

                {/* Stars */}
                {starsList.length > 0 && (
                  <div className="text-[#A3A3A3]">
                    <span className="font-semibold text-[#A3A3A3]">Stars:</span>{' '}
                    {starsList.join(', ')}
                  </div>
                )}

                {/* Creator / Director */}
                {movie.director && (
                  <div className="text-[#A3A3A3]">
                    <span className="font-semibold text-[#A3A3A3]">Creator:</span> {movie.director}
                  </div>
                )}

                {/* Language */}
                {movie.language && (
                  <div className="text-[#A3A3A3]">
                    <span className="font-semibold text-[#A3A3A3]">Language:</span> {movie.language}
                  </div>
                )}

                {/* Quality */}
                {qualityList.length > 0 && (
                  <div className="text-[#A3A3A3]">
                    <span className="font-semibold text-[#A3A3A3]">Quality:</span> {qualityList.join(' | ')}
                  </div>
                )}
              </div>
              {/* br line */}
              <div className="w-[96%] h-[2px] bg-[#252525] mx-auto mb-4"></div>

              {/* Screenshots Gallery */}
              {movie.screenshots && movie.screenshots.length > 1 && (
                <div className="mt-12">
                  {/* Heading */}
                  <h2 className="text-2xl font-bold text-red-500 text-center mb-6 px-4">
                    : Screen-Shots :
                  </h2>

                  {/* Screenshots grid */}
                  <div className="grid grid-cols-2 gap-0 px-4 max-w-3xl mx-auto">
                    {movie.screenshots.slice(1).map((screenshot, index) => (
                      <div
                        key={index}
                        className="relative w-full h-55  overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer group border border-gray-800 hover:border-blue-500"
                      >
                        <Image
                          src={screenshot}
                          alt={`Screenshot ${index + 2}`}
                          fill
                          sizes="50vw"
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {/* br line */}
              <div className="w-[96%] h-[2px] bg-[#252525] mx-auto mb-4"></div>

              {/* Download Links */}
              {movie.downloadLinks && movie.downloadLinks.length > 0 && (
                <div className="bg-black rounded-lg p-6">
                  <h2
                    style={{
                      fontSize: "22px",
                      fontWeight: 600,
                      fontStyle: "italic",
                      color: "#FF0000",
                      textAlign: "center",
                      marginBottom: "16px",
                    }}
                  >
                    : DOWNLOAD LINKS :
                  </h2>

                  {/* Divider below heading */}
                  <div className="w-[96%] h-[2px] bg-[#252525] mx-auto mb-4"></div>

                  <div>
                    {movie.downloadLinks.map((link, index) => (
                      <div key={index}>
                        <DownloadLink
                          href={link.href}
                          value={link.value}
                          movieId={movie._id}
                          className="block text-center p-4 text-[23px] font-[600] tracking-tight text-[#0087fc] hover:text-white transition-colors duration-200"
                        />

                        {index !== movie.downloadLinks.length - 1 && (
                          <div className="w-[96%] h-[2px] bg-[#252525] mx-auto my-3"></div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Episode Links */}
              {movie.episodeLinks && movie.episodeLinks.length > 0 && (
                <div className="bg-black rounded-lg p-6 mt-6">
                  <h2 className="text-center text-[24px] font-[600] italic text-[#FF0000] mb-4">
                    EPISODE LINKS
                  </h2>

                  <div>
                    {(movie.episodeLinks || []).map((episode, epIndex) => (
                      <div key={epIndex} className="mb-6">
                        <h3 className="text-center text-[22px] font-[600] text-[#FF9900] mb-2">
                          {episode.episode}
                        </h3>

                        {Object.entries(episode.links || {}).map(([quality, platforms], qIndex) => (
                          <div key={qIndex} className="mb-3 flex justify-center flex-wrap gap-2">
                            <span className="text-[18px] font-[600] text-red-600 mr-2">
                              {quality.toUpperCase()} –
                            </span>

                            {Object.entries(platforms || {}).map(([platform, url], pIndex, arr) => (
                              <span key={pIndex} className="text-[18px] font-[600]">
                                <EpisodeLink
                                  url={url}
                                  platform={platform}
                                  movieId={movie._id}
                                  isWatch={platform.toLowerCase() === "watch"}
                                />
                                {pIndex !== arr.length - 1 && " | "}
                              </span>
                            ))}
                          </div>
                        ))}

                        {epIndex !== (movie.episodeLinks?.length || 0) - 1 && (
                          <div className="w-full h-[2px] bg-[#333] my-4"></div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Trailer */}
              {movie.trailer && (
                <div className="bg-black rounded-lg p-0">
                  <h2 className="text-[30px] font-[600] tracking-tight text-[#FF0000] text-center mb-4">
                    Trailer
                  </h2>

                  <div className="relative aspect-video rounded-lg overflow-hidden bg-black">
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
            </div>
          </div>

          {/* Right Sidebar (1 column) - Replace with RightSidebar component */}
          <RightSidebar />
        </div>
      </main>

      <Footer />
    </div>
  );
}

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