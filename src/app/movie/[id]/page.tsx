// src/app/movie/[id]/page.tsx

import { notFound } from 'next/navigation';
import Image from 'next/image';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { formatTitle } from '@/lib/utils/formatters';
import { Download, Calendar, Film, Languages, Star, User, Play } from 'lucide-react';
import { getMovieById } from '@/lib/controllers/movieidController';
import MovieIcon from '@mui/icons-material/Movie';
import { ThemeProvider, css, keyframes } from '@emotion/react';
import styled from '@emotion/styled';
import DateRangeIcon from '@mui/icons-material/DateRange';
import FolderIcon from '@mui/icons-material/Folder';
import GridViewSharpIcon from '@mui/icons-material/GridViewSharp';
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
  // Prepare quality array (if stored as string separated by '|')

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

  const genres = movie.genre ? movie.genre.split('|').map(g => g.trim()) : [];
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
                  <span
                    key={genre}
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
                  </span>
                ))}

                {/* {movie.quality && (
                  <span className="px-3 py-1.5 bg-gray-800 rounded text-sm text-white font-medium flex items-center gap-1.5">
                    <Film size={14} />
                    {movie.quality}
                  </span>
                )}
                {movie.language && (
                  <span className="px-3 py-1.5 bg-gray-800 rounded text-sm text-white font-medium flex items-center gap-1.5">
                    <Languages size={14} />
                    {movie.language}
                  </span>
                )} */}
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

                {/* Number of Episodes
  {movie.episodes && (
    <div className="text-gray-300">
      <span className="font-semibold text-[#A3A3A3]">No. of Episodes:</span> {movie.episodes}
    </div>
  )} */}

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
              {movie.screenshots && movie.screenshots.length > 0 && (
                <div className="mt-12">
                  {/* Heading */}
                  <h2 className="text-2xl font-bold text-red-500 text-center mb-6 px-4">
                    : Screen-Shots :
                  </h2>

                  {/* Screenshots grid */}
                  <div className="grid grid-cols-2 gap-0 px-4 max-w-3xl mx-auto">
                    {movie.screenshots.map((screenshot, index) => (
                      <div
                        key={index}
                        className="relative w-full h-55  overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer group border border-gray-800 hover:border-blue-500"
                      >
                        <Image
                          src={screenshot}
                          alt={`Screenshot ${index + 1}`}
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
                        <a
                          href={link.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block text-center p-4 text-[23px] font-[600] tracking-tight text-[#0087fc] hover:text-white transition-colors duration-200"

                        >
                          {link.value}
                        </a>

                        {/* Divider between links (not after last) */}
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
    {/* Heading */}
    <h2 className="text-center text-[24px] font-[600] italic text-[#FF0000] mb-4">
      EPISODE LINKS
    </h2>

    {/* Episodes */}
    <div>
      {(movie.episodeLinks || []).map((episode, epIndex) => (
        <div key={epIndex} className="mb-6">
          {/* Episode Title */}
          <h3 className="text-center text-[22px] font-[600] text-[#FF9900] mb-2">
            {episode.episode}
          </h3>

          {/* Loop through each quality */}
          {Object.entries(episode.links || {}).map(([quality, platforms], qIndex) => (
            <div key={qIndex} className="mb-3 flex justify-center flex-wrap gap-2">
              {/* Quality + Platforms in one line */}
              <span className="text-[18px] font-[600] text-red-600 mr-2">
                {quality.toUpperCase()} –
              </span>

              {Object.entries(platforms || {}).map(([platform, url], pIndex, arr) => (
                <span key={pIndex} className="text-[18px] font-[600]">
                  <a
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`${
                      platform.toLowerCase() === "watch" ? "text-teal-400" : "text-blue-500"
                    } hover:text-white transition-colors duration-200`}
                  >
                    {platform}
                  </a>
                  {pIndex !== arr.length - 1 && " | "}
                </span>
              ))}
            </div>
          ))}

          {/* Divider between episodes */}
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

          {/* Right Sidebar (1 column) */}
          <div className="lg:col-span-1">
            <div className="space-y-6  top-4">
              {/* Search Box */}
              <div className="bg-[#141414] rounded-lg p-4">
                <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
                  <span><GridViewSharpIcon/> </span> Search Here !!
                </h3>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Search..."
                    className="flex-1 px-3 py-2 bg-white text-black rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600 transition-colors">
                    Search
                  </button>
                </div>
              </div>

              {/* Categories Box */}
              <div className="bg-[#141414] rounded-lg p-4">
                <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
                  <span><GridViewSharpIcon/> </span> Categories
                </h3>
                <select className="w-full px-3 py-2 bg-white text-black rounded focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option>Comedy</option>
                  <option>Action</option>
                  <option>Drama</option>
                  <option>Thriller</option>
                  <option>Horror</option>
                  <option>Romance</option>
                  <option>Sci-Fi</option>
                  <option>Adventure</option>
                </select>
              </div>
            </div>
          </div>
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