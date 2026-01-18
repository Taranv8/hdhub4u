// src/components/sections/CategoryList.tsx
'use client';

import React, { useState } from 'react';
import { Home, ChevronDown, Menu, X } from 'lucide-react';
import SearchBox from './SearchBox';
import TheatersIcon from '@mui/icons-material/Theaters';
import Link from 'next/link';

export default function CategoryList() {
  const [isGenresOpen, setIsGenresOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Simple slug generator - backend is now flexible enough to handle variations
  const getCategorySlug = (name: string): string => {
    return name
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-')
      .replace(/[^\w-]/g, '');
  };

  const mainCategories = [
    { name: 'HDHub4u Home', icon: <Home className="w-4 h-4" />, link: '/' },
    { name: 'BollyWood', link: '/category/bollywood' },
    { name: 'HollyWood', link: '/category/hollywood' },
    { name: 'Hindi Dubbed', link: '/category/hindi-dubbed' },
    { name: 'South Hindi Movies', link: '/category/south-hindi-movies' },
    { name: 'WEB-Series', link: '/category/web-series' },
    { name: '18+ [Adult]', link: '/category/18-adult' },
  ];

  // All genres from database - exact matches
  const allGenres = [
    // Main Categories
    'Action',
    'Adventure',
    'Animated',
    'Biography',
    'Comedy',
    'Crime',
    'Documentary',
    'Drama',
    'Family',
    'Fantasy',
    'History',
    'Horror',
    'Music',
    'Mystery',
    'Romance',
    'Sci-Fi',
    'Thriller',
    'War',
    
    // Quality/Type
    '300MB Movies',
    'HD Movies',
    'BluRay',
    'TRUE WEB-DL',
    'Dual Audio',
    'Movie Series Collection',
    'Awards',
    
    // Content Types
    'TV-Shows',
    'Talk',
    "TRAiLER's",
    'WWE',
    
    // Streaming Platforms
    'Amazon Prime Video',
    'Netflix',
    'ZEE5',
    'SonyLIV',
    'JioHotstar',
    
    // Regional/Dubbed
    'HQ-SouthHindiDubs',
    'SouthHindiDubs [VoiceOver]',
    'Gujarati',
    'Punjabi',
  ];

  return (
    <>
      <nav className="w-full bg-[#1a1a1a] text-white border-b border-gray-800">
        {/* TOP BAR */}
        <div className="flex items-center justify-between w-full px-4 py-2.5">

          {/* Mobile Menu Button (Left on mobile) */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden text-white mr-3"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

          {/* Logo */}
          <Link 
            href="https://4khdhub.dad/" 
            className="flex items-center gap-2 bg-[#FFC107] text-black px-3 py-1.5 rounded font-semibold shrink-0"
            target="_blank"
            rel="noopener noreferrer"
          >
            <TheatersIcon className="w-5 h-5" />
            <span className="text-base">4KHDHub</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-6 flex-1 ml-8">
            {mainCategories.map((category, index) => (
              <Link
                key={index}
                href={category.link || '/'}
                className="flex items-center gap-1 hover:text-yellow-400 transition-colors whitespace-nowrap text-sm font-medium"
              >
                {category.icon}
                <span>{category.name}</span>
              </Link>
            ))}

            {/* All Genres Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsGenresOpen(!isGenresOpen)}
                className="flex items-center gap-1 hover:text-yellow-400 text-sm font-medium"
              >
                All Categories
                <ChevronDown className="w-4 h-4" />
              </button>

              {isGenresOpen && (
                <div className="absolute top-full mt-2 bg-[#2a2a2a] border border-gray-700 rounded shadow-lg py-2 w-[300px] max-h-[500px] overflow-y-auto z-50 grid grid-cols-2 gap-1">
                  {allGenres.map(item => (
                    <Link
                      key={item}
                      href={`/category/${getCategorySlug(item)}`}
                      className="block px-4 py-2 text-sm hover:bg-gray-800 hover:text-yellow-400 rounded"
                      onClick={() => setIsGenresOpen(false)}
                    >
                      {item}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Search Box (Right aligned) */}
          <div className="ml-auto lg:ml-4">
            <SearchBox />
          </div>
        </div>

        {/* MOBILE MENU */}
        {isMobileMenuOpen && (
          <div className="lg:hidden bg-[#252525] border-t border-gray-700 px-4 py-4 max-h-[80vh] overflow-y-auto">
            <div className="flex flex-col gap-3">
              {/* Main Categories */}
              {mainCategories.map((category, index) => (
                <Link
                  key={index}
                  href={category.link || '/'}
                  className="flex items-center gap-2 hover:text-yellow-400 py-2 text-sm font-medium"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {category.icon}
                  <span>{category.name}</span>
                </Link>
              ))}
              
              {/* All Genres */}
              <div className="border-t border-gray-700 pt-3 mt-2">
                <p className="text-xs text-gray-400 mb-2 font-semibold">ALL CATEGORIES</p>
                <div className="grid grid-cols-2 gap-2">
                  {allGenres.map(item => (
                    <Link
                      key={item}
                      href={`/category/${getCategorySlug(item)}`}
                      className="block py-2 px-2 text-sm hover:text-yellow-400 hover:bg-gray-800 rounded"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {item}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </nav>
    </>
  );
}