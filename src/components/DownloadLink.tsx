// components/DownloadLink.tsx
'use client';

interface DownloadLinkProps {
  href: string;
  value: string;
  movieId: string;
  className?: string;
}

export default function DownloadLink({ href, value, movieId, className }: DownloadLinkProps) {
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
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onClick={handleClick}
      className={className}
    >
      {value}
    </a>
  );
}