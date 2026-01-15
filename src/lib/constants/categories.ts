// src/lib/constants/categories.ts

export const MAIN_CATEGORIES = [
    { name: 'Bollywood', slug: 'bollywood-movies' },
    { name: 'Hollywood', slug: 'hollywood-movies' },
    { name: 'Hindi Dubbed', slug: 'hindi-dubbed' },
    { name: 'South Hindi', slug: 'south-hindi-movies' },
    { name: 'Web Series', slug: 'web-series' },
    { name: '18+', slug: 'adult' },
  ];
  
  export const GENRES = [
    'Action', 'Adventure', 'Animation', 'Biography', 'Comedy',
    'Crime', 'Drama', 'Documentary', 'Family', 'Fantasy',
    'History', 'Horror', 'Musical', 'Mystery', 'Romance',
    'Sci-Fi', 'Thriller', 'War'
  ];
  
  export const QUALITIES = ['4K', '1080p', '720p', '480p', 'HD', 'BluRay', 'WEB-DL'];
  
  export const LANGUAGES = ['Hindi', 'English', 'Tamil', 'Telugu', 'Punjabi', 'Malayalam'];
  
  export const NAVIGATION_LINKS = [
    { name: 'Home', href: '/' },
    { name: 'Disclaimer', href: '/disclaimer' },
    { name: 'How To Download', href: '/how-to-download' },
    { name: 'Request Movie', href: '/request-a-movie' },
  ];
  
  export const SITE_CONFIG = {
    name: 'MovieHub',
    description: 'Download HD Movies & TV Shows',
    itemsPerPage: 60,
  };