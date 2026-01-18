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

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://hdhub4u.auction';
  const currentDate = new Date();

  try {
    const movieIds = await getAllMovieIds();
    
    const sitemap: MetadataRoute.Sitemap = [];

    // Homepage
    sitemap.push({
      url: baseUrl,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 1.0,
    });

    // Movie Pages
    movieIds.forEach(movie => {
      sitemap.push({
        url: `${baseUrl}/movie/${movie.id}`,
        lastModified: movie.updatedAt,
        changeFrequency: 'weekly',
        priority: 0.8,
      });
    });

    // Pagination Pages
    for (let page = 2; page <= 10; page++) {
      sitemap.push({
        url: `${baseUrl}/page/${page}`,
        lastModified: currentDate,
        changeFrequency: 'daily',
        priority: 0.5,
      });
    }

    return sitemap;
    
  } catch (error) {
    console.error('Sitemap generation failed:', error);
    // Return at least homepage if movies fail
    return [{
      url: baseUrl,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 1.0,
    }];
  }
}

export const revalidate = 86400; // 24 hours