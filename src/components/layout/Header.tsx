// src/components/layout/Header.tsx

'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Menu, X } from 'lucide-react';
import { NAVIGATION_LINKS } from '@/lib/constants/categories';
import BestMonthlyMovies from '@/components/sections/BestMonthlyMovies';
import CategoryList from '@/components/sections/CategoryList';
import { useMonthlyMovies } from '@/contexts/MonthlyMoviesContext';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { movies: monthlyMovies, loading } = useMonthlyMovies();

  return (
    <header className="bg-black text-white top-0 z-50 shadow-lg">
      {/* Primary Navigation */}
      <nav>
        <div className="container mx-1 px-1">
          <div className="flex items-center justify-between">
            {/* Mobile Menu Button - Hidden on mobile */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="hidden p-2 hover:bg-gray-800 rounded"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            {/* Logo */}
            <Link href="/" prefetch={true} className="flex items-center h-full pl-4 lg:pl-8">
              <Image
                src="/images/hdhub4ulogo.png"
                alt="MovieHub"
                width={161}
                height={32}
                className="h-full w-auto object-contain"
              />
            </Link>

            {/* Desktop Navigation - Only visible on desktop */}
            <div className="hidden lg:block">
              <ul className="flex flex-row items-center space-x-6">
                {NAVIGATION_LINKS.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="block hover:text-blue-400 transition"
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

      <div className="bg-black text-white">
        <div>
          {/* Best Monthly Movies Section */}
          <BestMonthlyMovies movies={monthlyMovies} loading={loading} />
        </div>

        <div>
          <CategoryList />
        </div>
      </div>
    </header>
  );
}