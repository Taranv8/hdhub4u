// components/EpisodeLink.tsx
'use client';

interface EpisodeLinkProps {
  url: string;
  platform: string;
  movieId: string;
  isWatch?: boolean;
}

export default function EpisodeLink({ url, platform, movieId, isWatch = false }: EpisodeLinkProps) {
  const handleClick = async () => {
    try {
      await fetch('/api/downloadincrement', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ movieId }),
      });
    } catch (error) {
      console.error('Error tracking download:', error);
    }
  };

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      onClick={handleClick}
      className={`${
        isWatch ? "text-teal-400" : "text-blue-500"
      } hover:text-white transition-colors duration-200`}
    >
      {platform}
    </a>
  );
}