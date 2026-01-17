// src/app/layout.tsx

import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Open_Sans } from 'next/font/google';
import Providers from '@/components/Providers';
import { initializeDatabase } from '@/lib/db-init';

const inter = Inter({ subsets: ['latin'] });
const openSans = Open_Sans({
  subsets: ['latin'],
  weight: ['400', '600','800'],
  display: 'swap',
});
export const metadata: Metadata = {
  title: 'MovieHub - Download HD Movies & TV Shows',
  description: 'Download latest Bollywood, Hollywood, Hindi Dubbed movies and web series in HD quality',
  keywords: 'movies, download, HD movies, Bollywood, Hollywood, web series, Hindi dubbed',
  authors: [{ name: 'MovieHub' }],
  viewport: 'width=device-width, initial-scale=1',
  themeColor: '#1f2937',
};
// Initialize database indexes on startup
initializeDatabase().catch(console.error);

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={openSans.className}>
      <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
