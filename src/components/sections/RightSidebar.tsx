'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import GridViewSharpIcon from '@mui/icons-material/GridViewSharp';

export default function RightSidebar() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  const getCategorySlug = (name: string): string => {
    return name.toLowerCase().trim().replace(/\s+/g, '-').replace(/[^\w-]/g, '');
  };

  const handleSearch = () => {
    if (searchQuery.trim()) {
      router.push(`/search/${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const category = e.target.value;
    setSelectedCategory(category);
    if (category) {
      router.push(`/category/${getCategorySlug(category)}`);
    }
  };

  return (
<div className="hidden lg:block lg:col-span-1">
          <div className="space-y-6 top-4">
        {/* Search Box */}
        <div className="bg-[#141414] rounded-lg p-4">
          <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
            <span><GridViewSharpIcon /></span> Search Here !!
          </h3>
          <div className="flex gap-2">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="Search movies..."
              className="flex-1 px-3 py-2 bg-white text-black rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button 
              onClick={handleSearch}
              className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600 transition-colors"
            >
              Search
            </button>
          </div>
        </div>

        {/* Categories Box */}
        <div className="bg-[#141414] rounded-lg p-4">
          <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
            <span><GridViewSharpIcon /></span> Categories
          </h3>
          <select 
            value={selectedCategory}
            onChange={handleCategoryChange}
            className="w-full px-3 py-2 bg-white text-black rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select a category</option>
            <option value="Comedy">Comedy</option>
            <option value="Action">Action</option>
            <option value="Drama">Drama</option>
            <option value="Thriller">Thriller</option>
            <option value="Horror">Horror</option>
            <option value="Romance">Romance</option>
            <option value="Sci-Fi">Sci-Fi</option>
            <option value="Adventure">Adventure</option>
          </select>
        </div>
      </div>
    </div>
  );
}