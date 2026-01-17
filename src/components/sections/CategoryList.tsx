// src/components/sections/CategoryList.tsx
'use client';

import React, { useState } from 'react';
import { Home, ChevronDown, Menu, X } from 'lucide-react';
import SearchBox from './SearchBox';
import TheatersIcon from '@mui/icons-material/Theaters';
import Link from 'next/link';

export default function CategoryList() {
  const [isGenresOpen, setIsGenresOpen] = useState(false);
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Helper function to convert category name to URL slug
  const getCategorySlug = (name: string): string => {
    return name
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^\w-]/g, '');
  };

  const categories = [
    { name: 'HDHub4u Home', icon: <Home className="w-4 h-4" />, link: '/' },
    { name: 'BollyWood', link: '/category/bollywood' },
    { name: 'HollyWood', link: '/category/hollywood' },
    { name: 'Hindi Dubbed', link: '/category/hindi-dubbed' },
    { name: 'South Hindi', link: '/category/south-hindi' },
    { name: 'Web Series', link: '/category/web-series' },
    { name: '18+', link: '/category/18' },
  ];

  const genres = [
    'Action',
    'Animation',
    'Comedy',
    'Crime',
    'Drama',
    'Family',
    'Fantasy',
    'Horror',
    'Mystery',
    'Romance',
    'Sci-Fi',
    'Thriller',
    'War',
    'Western'
  ];

  const moreCategories = [
    '300mb Movies',
    'Awards',
    'Gujarati',
    'HD Movies',
    'HQ DUBs',
    'South VoiceOver Dubs',
    'MovieLogy Collection',
    'Punjabi',
    'TALKS',
    'TRAILERs',
    'WWE',
    'TV Shows',
    'Anime',
    'Documentaries'
  ];

  return (
    <nav className="w-screen bg-[#141414] text-white border-b border-gray-800">
      {/* TOP BAR */}
      <div className="flex items-center w-full px-4 py-3">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 bg-[#FFC107] text-black px-4 py-2 rounded font-semibold shrink-0">
          <TheatersIcon className="w-5 h-5" />
          <span className="text-lg">4KHDHub</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center gap-6 flex-1 ml-8">
          {categories.map((category, index) => (
            <Link
              key={index}
              href={category.link || '/'}
              className="flex items-center gap-1 hover:text-yellow-500 transition-colors whitespace-nowrap text-sm font-medium"
            >
              {category.icon}
              <span>{category.name}</span>
            </Link>
          ))}

          {/* GENREs */}
          <div className="relative">
            <button
              onClick={() => setIsGenresOpen(!isGenresOpen)}
              className="flex items-center gap-1 hover:text-yellow-500 text-sm font-medium"
            >
              GENREs
              <ChevronDown className="w-4 h-4" />
            </button>

            {isGenresOpen && (
              <div className="absolute top-full mt-2 bg-[#444444] border border-gray-700 rounded shadow-lg py-2 min-w-[150px] z-50">
                {genres.map(item => (
                  <Link
                    key={item}
                    href={`/category/${getCategorySlug(item)}`}
                    className="block px-4 py-2 text-sm hover:bg-gray-800"
                    onClick={() => setIsGenresOpen(false)}
                  >
                    {item}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* More */}
          <div className="relative">
            <button
              onClick={() => setIsMoreOpen(!isMoreOpen)}
              className="flex items-center gap-1 hover:text-yellow-500 text-sm font-medium"
            >
              More
              <ChevronDown className="w-4 h-4" />
            </button>

            {isMoreOpen && (
              <div className="absolute top-full mt-2 bg-[#444444] border border-gray-700 rounded shadow-lg py-2 min-w-[150px] z-50">
                {moreCategories.map(item => (
                  <Link
                    key={item}
                    href={`/category/${getCategorySlug(item)}`}
                    className="block px-4 py-2 text-sm hover:bg-gray-800"
                    onClick={() => setIsMoreOpen(false)}
                  >
                    {item}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Search Box (Right aligned) */}
        <div className="ml-auto hidden sm:flex items-center">
          <SearchBox />
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="lg:hidden ml-4 text-yellow-500"
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* MOBILE MENU */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-[#1a1a1a] border-t border-gray-700 px-4 py-4">
          <div className="flex flex-col gap-3">
            {categories.map((category, index) => (
              <Link
                key={index}
                href={category.link || '/'}
                className="flex items-center gap-2 hover:text-yellow-500 py-2 text-sm font-medium"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {category.icon}
                <span>{category.name}</span>
              </Link>
            ))}
            
            {/* Mobile Genres */}
            <div className="border-t border-gray-700 pt-3 mt-2">
              <p className="text-xs text-gray-400 mb-2 font-semibold">GENRES</p>
              {genres.map(item => (
                <Link
                  key={item}
                  href={`/category/${getCategorySlug(item)}`}
                  className="block py-2 text-sm hover:text-yellow-500"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item}
                </Link>
              ))}
            </div>

            {/* Mobile More Categories */}
            <div className="border-t border-gray-700 pt-3 mt-2">
              <p className="text-xs text-gray-400 mb-2 font-semibold">MORE</p>
              {moreCategories.map(item => (
                <Link
                  key={item}
                  href={`/category/${getCategorySlug(item)}`}
                  className="block py-2 text-sm hover:text-yellow-500"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item}
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}