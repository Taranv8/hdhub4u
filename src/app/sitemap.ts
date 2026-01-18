// app/sitemap.ts
import { MetadataRoute } from 'next';
import { connectToDatabase } from '@/lib/mongodb';

// Get all movie IDs from database
async function getAllMovieIds(): Promise<Array<{ id: string; updatedAt: Date }>> {
  try {
    const { db } = await connectToDatabase();
    const movies = await db.collection('movies')
      .find({}, { projection: { _id: 1, releaseDate: 1 } })
      .sort({ releaseDate: -1 })
      .toArray();

    return movies.map(movie => ({
      id: movie._id.toString(),
      updatedAt: movie.releaseDate || new Date()
    }));
  } catch (error) {
    console.error('Error fetching movies:', error);
    return [];
  }
}

// Get all categories
async function getAllCategories(): Promise<string[]> {
  try {
    const { db } = await connectToDatabase();
    const genres = await db.collection('movies').distinct('genre');
    
    const uniqueGenres = new Set<string>();
    genres.forEach(genre => {
      if (Array.isArray(genre)) {
        genre.forEach(g => g && uniqueGenres.add(g.toString().toLowerCase()));
      } else if (genre) {
        uniqueGenres.add(genre.toString().toLowerCase());
      }
    });

    return Array.from(uniqueGenres);
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
}

// Get all languages
async function getAllLanguages(): Promise<string[]> {
  try {
    const { db } = await connectToDatabase();
    const languages = await db.collection('movies').distinct('language');
    return languages.filter(lang => lang).map(lang => lang.toString().toLowerCase());
  } catch (error) {
    console.error('Error fetching languages:', error);
    return [];
  }
}

// Get all qualities
async function getAllQualities(): Promise<string[]> {
  try {
    const { db } = await connectToDatabase();
    const qualities = await db.collection('movies').distinct('quality');
    return qualities.filter(q => q).map(q => q.toString().toLowerCase());
  } catch (error) {
    console.error('Error fetching qualities:', error);
    return [];
  }
}

// Get all years
async function getAllYears(): Promise<number[]> {
  try {
    const { db } = await connectToDatabase();
    const yearResults = await db.collection('movies').aggregate([
      { $group: { _id: { $year: '$releaseDate' } } },
      { $sort: { _id: -1 } }
    ]).toArray();

    const currentYear = new Date().getFullYear();
    return yearResults
      .map(result => result._id)
      .filter(year => year >= 2000 && year <= currentYear);
  } catch (error) {
    console.error('Error fetching years:', error);
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://hdhub4u.auction';
  const currentDate = new Date();

  // Fetch all data
  const [movieIds, categories, languages, qualities, years] = await Promise.all([
    getAllMovieIds(),
    getAllCategories(),
    getAllLanguages(),
    getAllQualities(),
    getAllYears()
  ]);

  const sitemap: MetadataRoute.Sitemap = [];

  // 1. Homepage - Priority 1.0
  sitemap.push({
    url: baseUrl,
    lastModified: currentDate,
    changeFrequency: 'daily',
    priority: 1.0,
  });

  // 2. All Movie Pages - Priority 1.0
  movieIds.forEach(movie => {
    sitemap.push({
      url: `${baseUrl}/movie/${movie.id}`,
      lastModified: movie.updatedAt,
      changeFrequency: 'weekly',
      priority: 1.0,
    });
  });

  // 3. Category Pages - Priority 0.8
  categories.forEach(category => {
    sitemap.push({
      url: `${baseUrl}/category/${encodeURIComponent(category)}`,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 0.8,
    });
  });

  // 4. Language Pages - Priority 0.7
  languages.forEach(language => {
    sitemap.push({
      url: `${baseUrl}/language/${encodeURIComponent(language)}`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.7,
    });
  });

  // 5. Quality Pages - Priority 0.7
  qualities.forEach(quality => {
    sitemap.push({
      url: `${baseUrl}/quality/${encodeURIComponent(quality)}`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.7,
    });
  });

  // 6. Year Pages - Priority 0.5-0.6
  const currentYear = new Date().getFullYear();
  years.forEach(year => {
    sitemap.push({
      url: `${baseUrl}/year/${year}`,
      lastModified: currentDate,
      changeFrequency: year === currentYear ? 'daily' : 'monthly',
      priority: year === currentYear ? 0.6 : 0.5,
    });
  });

  // 7. Pagination Pages (first 10) - Priority 0.5
  for (let page = 2; page <= 10; page++) {
    sitemap.push({
      url: `${baseUrl}/page/${page}`,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 0.5,
    });
  }

  // 8. Static Pages - Priority 0.3
  sitemap.push(
    {
      url: `${baseUrl}/disclaimer`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/how-to-download`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.3,
    }
  );

  return sitemap;
}

export const revalidate = 72000; // Revalidate every hour