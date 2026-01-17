// lib/mongodb.ts
import { MongoClient, Db } from 'mongodb';

if (!process.env.MONGODB_URI) {
  throw new Error('Please add your Mongo URI to environment variables');
}

const uri: string = process.env.MONGODB_URI;
const dbName: string = process.env.MONGODB_DB_NAME || 'movies';

// Connection pooling options for better performance
const options = {
  maxPoolSize: 10,        // Maximum connections in pool
  minPoolSize: 2,         // Minimum connections maintained
  maxIdleTimeMS: 60000,   // Close idle connections after 60s
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
};

let client: MongoClient;
let clientPromise: Promise<MongoClient>;
let cachedDb: Db | null = null;

declare global {
  var _mongoClientPromise: Promise<MongoClient> | undefined;
  var _mongoDb: Db | undefined;
}

if (process.env.NODE_ENV === 'development') {
  // In development, use global variable to preserve connection across hot reloads
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  // In production, create new client
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

export async function connectToDatabase(): Promise<{
  client: MongoClient;
  db: Db;
}> {
  try {
    // Return cached DB if available (production optimization)
    if (cachedDb && process.env.NODE_ENV === 'production') {
      const client = await clientPromise;
      return { client, db: cachedDb };
    }

    // Development: use global cached DB
    if (global._mongoDb && process.env.NODE_ENV === 'development') {
      const client = await clientPromise;
      return { client, db: global._mongoDb };
    }

    // Connect and cache
    const client = await clientPromise;
    const db = client.db(dbName);
    
    // Cache the database instance
    if (process.env.NODE_ENV === 'production') {
      cachedDb = db;
    } else {
      global._mongoDb = db;
    }

    return { client, db };
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw new Error('Failed to connect to database');
  }
}

// Optional: Create indexes on application startup
export async function createIndexes() {
  try {
    const { db } = await connectToDatabase();
    const collection = db.collection('movies');

    // Check if indexes already exist
    const indexes = await collection.indexes();
    const hasReleaseDateIndex = indexes.some(
      (idx) => idx.name === 'releaseDate_-1'
    );

    if (!hasReleaseDateIndex) {
      await collection.createIndex({ releaseDate: -1 }, { name: 'releaseDate_-1' });
      console.log('✓ Created releaseDate index');
    }

    // Optional: Add other useful indexes
    // NOTE: Text index disabled due to language field conflicts
    // If you need search, create it manually in MongoDB with proper config
    // const hasTitleIndex = indexes.some((idx) => idx.name === 'title_text');
    // if (!hasTitleIndex) {
    //   await collection.createIndex(
    //     { title: 'text' }, 
    //     { 
    //       name: 'title_text',
    //       default_language: 'none',
    //       language_override: 'dummy'
    //     }
    //   );
    //   console.log('✓ Created title text index');
    // }

    const hasGenreIndex = indexes.some((idx) => idx.name === 'genre_1');
    if (!hasGenreIndex) {
      await collection.createIndex({ genre: 1 }, { name: 'genre_1' });
      console.log('✓ Created genre index');
    }

  } catch (error) {
    console.error('Error creating indexes:', error);
  }
}

// Graceful shutdown helper
export async function closeConnection() {
  try {
    const client = await clientPromise;
    await client.close();
    cachedDb = null;
    global._mongoDb = undefined;
    console.log('MongoDB connection closed');
  } catch (error) {
    console.error('Error closing MongoDB connection:', error);
  }
}