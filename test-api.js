// test-api.js
// Run this script with: node test-api.js

const { MongoClient } = require('mongodb');
require('dotenv').config({ path: '.env.local' });

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

function log(message, color = colors.reset) {
  console.log(`${color}${message}${colors.reset}`);
}

function logSection(title) {
  console.log('\n' + '='.repeat(60));
  log(title, colors.cyan);
  console.log('='.repeat(60));
}

async function testMongoDBConnection() {
  logSection('TEST 1: MongoDB Connection');
  
  const uri = process.env.MONGODB_URI;
  const dbName = process.env.MONGODB_DB_NAME || 'moviesDB';

  if (!uri) {
    log('❌ MONGODB_URI not found in .env.local', colors.red);
    return false;
  }

  log(`✓ MONGODB_URI found`, colors.green);
  log(`✓ Database name: ${dbName}`, colors.green);

  try {
    log('\nConnecting to MongoDB...', colors.yellow);
    const client = new MongoClient(uri);
    await client.connect();
    log('✅ Successfully connected to MongoDB!', colors.green);

    const db = client.db(dbName);
    const collections = await db.listCollections().toArray();
    
    log(`\nCollections in database "${dbName}":`, colors.blue);
    collections.forEach(col => log(`  - ${col.name}`, colors.cyan));

    const moviesCollection = db.collection('moviesDB');
    const movieCount = await moviesCollection.countDocuments();
    log(`\n✓ Total movies in collection: ${movieCount}`, colors.green);

    if (movieCount > 0) {
      const sampleMovie = await moviesCollection.findOne();
      log('\nSample movie document:', colors.blue);
      console.log(JSON.stringify(sampleMovie, null, 2));
    }

    await client.close();
    return true;
  } catch (error) {
    log(`❌ MongoDB Connection Error: ${error.message}`, colors.red);
    return false;
  }
}

async function testAPIEndpoint() {
  logSection('TEST 2: API Endpoint');

  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
  const apiUrl = `${baseUrl}/api/homepage?page=3`;

  log(`Testing: ${apiUrl}`, colors.blue);

  try {
    log('\nMaking API request...', colors.yellow);
    const response = await fetch(apiUrl);
    
    log(`Response Status: ${response.status} ${response.statusText}`, 
        response.ok ? colors.green : colors.red);

    const contentType = response.headers.get('content-type');
    log(`Content-Type: ${contentType}`, colors.blue);

    if (!response.ok) {
      const errorText = await response.text();
      log('\nError Response:', colors.red);
      console.log(errorText);
      return false;
    }

    const data = await response.json();
    
    log('\n✅ API Response received!', colors.green);
    log(`Success: ${data.success}`, data.success ? colors.green : colors.red);
    
    if (data.success && data.data) {
      log(`\nMovies returned: ${data.data.movies.length}`, colors.green);
      log(`Current page: ${data.data.pagination.currentPage}`, colors.cyan);
      log(`Total pages: ${data.data.pagination.totalPages}`, colors.cyan);
      log(`Total movies: ${data.data.pagination.totalMovies}`, colors.cyan);

      if (data.data.movies.length > 0) {
        log('\nFirst movie:', colors.blue);
        const movie = data.data.movies[0];
        console.log(JSON.stringify({
          id: movie._id,
          title: movie.title,
          imdbRating: movie.imdbRating,
          releaseDate: movie.releaseDate,
          genre: movie.genre
        }, null, 2));
      }
    } else {
      log(`Error: ${data.error || 'Unknown error'}`, colors.red);
      return false;
    }

    return true;
  } catch (error) {
    log(`❌ API Test Error: ${error.message}`, colors.red);
    console.error(error);
    return false;
  }
}

async function testFileStructure() {
  logSection('TEST 3: File Structure');

  const fs = require('fs');
  const path = require('path');

  const requiredFiles = [
    'lib/mongodb.ts',
    'lib/controllers/movieController.ts',
    'app/api/homepage/route.ts',
    '.env.local'
  ];

  let allFilesExist = true;

  for (const file of requiredFiles) {
    const filePath = path.join(process.cwd(), file);
    if (fs.existsSync(filePath)) {
      log(`✅ ${file}`, colors.green);
    } else {
      log(`❌ ${file} NOT FOUND`, colors.red);
      allFilesExist = false;
    }
  }

  return allFilesExist;
}

async function runAllTests() {
  log('\n🚀 Starting API Tests...', colors.cyan);
  log(`Time: ${new Date().toLocaleString()}`, colors.blue);

  const fileStructureOk = await testFileStructure();
  const mongoOk = await testMongoDBConnection();
  const apiOk = await testAPIEndpoint();

  logSection('TEST SUMMARY');
  log(`File Structure: ${fileStructureOk ? '✅ PASS' : '❌ FAIL'}`, 
      fileStructureOk ? colors.green : colors.red);
  log(`MongoDB Connection: ${mongoOk ? '✅ PASS' : '❌ FAIL'}`, 
      mongoOk ? colors.green : colors.red);
  log(`API Endpoint: ${apiOk ? '✅ PASS' : '❌ FAIL'}`, 
      apiOk ? colors.green : colors.red);

  if (fileStructureOk && mongoOk && apiOk) {
    log('\n🎉 All tests passed! Your API is working correctly!', colors.green);
  } else {
    log('\n⚠️  Some tests failed. Please fix the issues above.', colors.yellow);
  }

  console.log('\n');
}

// Run the tests
runAllTests().catch(error => {
  log(`\n❌ Fatal Error: ${error.message}`, colors.red);
  console.error(error);
  process.exit(1);
});