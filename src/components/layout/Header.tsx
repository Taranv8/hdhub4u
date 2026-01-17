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
            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 hover:bg-gray-800 rounded"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            {/* Logo */}
            <Link href="/" className="flex items-center h-full pl-8">
              <Image
                src="/images/hdhub4ulogo.png"
                alt="MovieHub"
                width={161}
                height={32}
                className="h-full w-auto object-contain"
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

      <div className="bg-black text-white">
        <div>
          {/* Best Monthly Movies Section */}
          {!loading && monthlyMovies.length > 0 && (
            <BestMonthlyMovies movies={monthlyMovies} />
          )}
        </div>

        <div>
          <CategoryList />
        </div>
      </div>
    </header>
  );
}