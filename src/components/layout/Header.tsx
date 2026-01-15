// src/components/layout/Header.tsx

'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Menu, X, Search } from 'lucide-react';
import { NAVIGATION_LINKS, MAIN_CATEGORIES, GENRES } from '@/lib/constants/categories';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [categoryMenuOpen, setCategoryMenuOpen] = useState(false);

  return (
    <header className="bg-gray-900 text-white sticky top-0 z-50 shadow-lg">
      {/* Primary Navigation */}
      <nav className="border-b border-gray-800">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 hover:bg-gray-800 rounded"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            {/* Logo */}
            <Link href="/" className="flex items-center">
              <Image
                src="/images/hdhub4ulogo.png"
                alt="MovieHub"
                width={150}
                height={40}
                className="h-10 w-auto"
              />
            </Link>

            {/* Desktop Navigation */}
            <div className={`${mobileMenuOpen ? 'block' : 'hidden'} lg:block absolute lg:relative top-16 lg:top-0 left-0 right-0 bg-gray-900 lg:bg-transparent`}>
              <ul className="flex flex-col lg:flex-row lg:items-center lg:space-x-6 p-4 lg:p-0">
                {NAVIGATION_LINKS.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="block py-2 lg:py-0 hover:text-blue-400 transition"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </nav>

      {/* Category Navigation */}
      <nav className="bg-gray-800 border-b border-gray-700">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            {/* Category Toggle */}
            <button
              onClick={() => setCategoryMenuOpen(!categoryMenuOpen)}
              className="lg:hidden p-3 hover:bg-gray-700 rounded flex items-center space-x-2"
            >
              <Menu size={20} />
              <span className="text-sm">Categories</span>
            </button>

            {/* External Link */}
            <Link
              href="https://4khdhub.dad"
              target="_blank"
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded text-sm font-medium transition"
            >
              <span>🎬 4KHDHub</span>
            </Link>

            {/* Desktop Categories */}
            <div className={`${categoryMenuOpen ? 'block' : 'hidden'} lg:flex flex-1 items-center space-x-1 absolute lg:relative top-full lg:top-0 left-0 right-0 bg-gray-800 lg:bg-transparent p-4 lg:p-0`}>
              <Link
                href="/"
                className="block lg:inline-block px-3 py-2 hover:bg-gray-700 rounded text-sm transition"
              >
                🏠 Home
              </Link>

              {MAIN_CATEGORIES.map((cat) => (
                <Link
                  key={cat.slug}
                  href={`/category/${cat.slug}`}
                  className="block lg:inline-block px-3 py-2 hover:bg-gray-700 rounded text-sm transition"
                >
                  {cat.name}
                </Link>
              ))}

              {/* Genres Dropdown */}
              <div className="relative group">
                <button className="px-3 py-2 hover:bg-gray-700 rounded text-sm transition flex items-center">
                  Genres <span className="ml-1">▼</span>
                </button>
                <div className="hidden group-hover:block absolute top-full left-0 mt-1 bg-gray-800 border border-gray-700 rounded shadow-lg min-w-[200px] max-h-96 overflow-y-auto">
                  {GENRES.map((genre) => (
                    <Link
                      key={genre}
                      href={`/category/${genre.toLowerCase()}`}
                      className="block px-4 py-2 hover:bg-gray-700 text-sm"
                    >
                      {genre}
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {/* Search Icon */}
            <Link href="/search" className="p-3 hover:bg-gray-700 rounded">
              <Search size={20} />
            </Link>
          </div>
        </div>
      </nav>
    </header>
  );
}