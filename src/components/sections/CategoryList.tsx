// src/components/sections/CategoryList.tsx
'use client';

import React, { useState } from 'react';
import { Home, ChevronDown, Menu, X } from 'lucide-react';
import SearchBox from './SearchBox';
import TheatersIcon from '@mui/icons-material/Theaters';
export default function CategoryList() {
  const [isGenresOpen, setIsGenresOpen] = useState(false);
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const categories = [
    { name: 'HDHub4u Home', icon: <Home className="w-4 h-4" /> },
    { name: 'BollyWood' },
    { name: 'HollyWood' },
    { name: 'Hindi Dubbed' },
    { name: 'South Hindi' },
    { name: 'Web Series' },
    { name: '18+' },
  ];

  return (
    <nav className="w-screen bg-[#141414] text-white border-b border-gray-800">
      {/* TOP BAR */}
      <div className="flex items-center w-full px-4 py-3">

        {/* Logo */}
        <div className="flex items-center gap-2 bg-[#FFC107] text-black px-4 py-2 rounded font-semibold shrink-0">
          <TheatersIcon className="w-5 h-5" />
          <span className="text-lg">4KHDHub</span>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center gap-6 flex-1 ml-8">
          {categories.map((category, index) => (
            <a
              key={index}
              href="#"
              className="flex items-center gap-1 hover:text-yellow-500 transition-colors whitespace-nowrap text-sm font-medium"
            >
              {category.icon}
              <span>{category.name}</span>
            </a>
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
              <div className="absolute top-full mt-2 bg-gray-900 border border-gray-700 rounded shadow-lg py-2 min-w-[150px] z-50">
                {['Action', 'Comedy', 'Drama', 'Horror', 'Thriller'].map(item => (
                  <a key={item} href="#" className="block px-4 py-2 hover:bg-gray-800 text-sm">
                    {item}
                  </a>
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
              <div className="absolute top-full mt-2 bg-gray-900 border border-gray-700 rounded shadow-lg py-2 min-w-[150px] z-50">
                {['TV Shows', 'Anime', 'Documentaries'].map(item => (
                  <a key={item} href="#" className="block px-4 py-2 hover:bg-gray-800 text-sm">
                    {item}
                  </a>
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
              <a
                key={index}
                href="#"
                className="flex items-center gap-2 hover:text-yellow-500 py-2 text-sm font-medium"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {category.icon}
                <span>{category.name}</span>
              </a>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
