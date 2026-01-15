// src/components/layout/Footer.tsx

import Link from 'next/link';

const FOOTER_LINKS = [
  { name: 'Disclaimer', href: '/disclaimer' },
  { name: 'Join Our Group', href: '/join-our-group' },
  { name: 'How To Download', href: '/how-to-download' },
  { name: 'Movie Request Page', href: '/request-a-movie' },
];

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#0D0D0D] text-gray-300 border-t border-gray-800 mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          {/* Copyright */}
          <div className="text-center md:text-left">
            <p className="text-sm">
              {currentYear} © <span className="text-white font-semibold">MovieHub</span> | All Rights Reserved.
            </p>
          </div>

          {/* Footer Links */}
          <div className="text-center md:text-right">
            <ul className="flex flex-wrap justify-center md:justify-end space-x-4 text-sm">
              {FOOTER_LINKS.map((link, index) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="hover:text-white transition"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}