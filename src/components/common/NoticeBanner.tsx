// src/components/common/NoticeBanner.tsx

'use client';

import { useState } from 'react';
import Link from 'next/link';
import { X } from 'lucide-react';

export default function NoticeBanner() {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="bg-gradient-to-r from-blue-900 to-purple-900 border-b border-blue-700 relative">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <button
            onClick={() => setIsVisible(false)}
            className="text-yellow-400 hover:text-yellow-300 text-2xl leading-none lg:hidden"
            aria-label="Close"
          >
            ×
          </button>

          <div className="flex-1 text-center px-4">
            <p className="text-white text-sm md:text-base">
              <span className="text-red-400 font-bold">Avoid FAKE Copies</span> of{' '}
              <Link 
                href="https://moviehub.tv" 
                target="_blank" 
                className="text-red-400 font-bold hover:underline"
              >
                MovieHub
              </Link>{' '}
              on Google. Always use{' '}
              <Link 
                href="https://moviehub.tv/" 
                target="_blank"
                className="text-blue-400 font-bold hover:underline"
              >
                MovieHub.Tv
              </Link>{' '}
              with VPN. Follow us on{' '}
              <Link
                href="https://discord.gg/example"
                target="_blank"
                className="text-cyan-400 font-bold hover:underline"
              >
                Discord 💬
              </Link>{' '}
              <span className="text-yellow-400">for Latest Updates.</span>
            </p>
          </div>

          <button
            onClick={() => setIsVisible(false)}
            className="hidden lg:block text-yellow-400 hover:text-yellow-300 transition"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}