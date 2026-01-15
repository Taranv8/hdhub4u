// Movie Site - Folder Structure Generator for Existing Next.js Project
// Save this as: setup-structure.js
// Run with: node setup-structure.js

const fs = require('fs');
const path = require('path');

console.log('🎬 Setting up Movie Site structure in existing Next.js project...\n');

// Check if this is a Next.js project
function checkNextJsProject() {
  const packageJsonPath = path.join(process.cwd(), 'package.json');
  
  if (!fs.existsSync(packageJsonPath)) {
    console.error('❌ Error: package.json not found!');
    console.log('💡 Make sure you run this script in your Next.js project root folder.\n');
    return false;
  }

  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  
  if (!packageJson.dependencies || !packageJson.dependencies.next) {
    console.error('❌ Error: This doesn\'t appear to be a Next.js project!');
    console.log('💡 Next.js should be in dependencies.\n');
    return false;
  }

  console.log('✓ Next.js project detected!\n');
  return true;
}

// Folder structure definition (only add what doesn't exist)
const structure = {
  // Public assets
  'public/images/banners': [],
  'public/icons': [],
  
  // App directory structure
  'src/app/movie/[slug]': ['page.tsx'],
  'src/app/search': ['page.tsx'],
  'src/app/category/[categoryName]': ['page.tsx'],
  'src/app/disclaimer': ['page.tsx'],
  'src/app/how-to-download': ['page.tsx'],
  'src/app/year/[year]': ['page.tsx'],
  'src/app/language/[language]': ['page.tsx'],
  'src/app/quality/[quality]': ['page.tsx'],
  
  // API routes
  'src/app/api/movies': ['route.ts'],
  'src/app/api/movies/[id]': ['route.ts'],
  'src/app/api/search': ['route.ts'],
  'src/app/api/categories': ['route.ts'],
  'src/app/api/trending': ['route.ts'],
  'src/app/api/featured': ['route.ts'],
  
  // Layout components
  'src/components/layout': [
    'Header.tsx',
    'Footer.tsx',
    'Navbar.tsx',
    'Sidebar.tsx'
  ],
  
  // Movie components
  'src/components/movie': [
    'MovieCard.tsx',
    'MovieGrid.tsx',
    'MovieDetails.tsx',
    'MovieGallery.tsx',
    'DownloadLinks.tsx',
    'MovieInfo.tsx',
    'RelatedMovies.tsx'
  ],
  
  // Search components
  'src/components/search': [
    'SearchBar.tsx',
    'SearchResults.tsx'
  ],
  
  // Common components
  'src/components/common': [
    'Button.tsx',
    'Badge.tsx',
    'Loading.tsx',
    'Pagination.tsx',
    'Breadcrumb.tsx',
    'CategoryFilter.tsx',
    'ShareButtons.tsx'
  ],
  
  // Section components
  'src/components/sections': [
    'TopMoviesSlider.tsx',
    'CategorySection.tsx',
    'FeaturedMovies.tsx'
  ],
  
  // UI components
  'src/components/ui': [
    'Tooltip.tsx',
    'Modal.tsx'
  ],
  
  // Library - API functions
  'src/lib/api': [
    'movies.ts',
    'search.ts',
    'categories.ts'
  ],
  
  // Library - Utility functions
  'src/lib/utils': [
    'formatters.ts',
    'validators.ts',
    'slugify.ts',
    'seo.ts'
  ],
  
  // Library - Constants
  'src/lib/constants': [
    'categories.ts',
    'qualities.ts',
    'languages.ts',
    'navigation.ts'
  ],
  
  // Type definitions
  'src/types': [
    'movie.ts',
    'category.ts',
    'search.ts',
    'api.ts'
  ],
  
  // Custom hooks
  'src/hooks': [
    'useMovies.ts',
    'useSearch.ts',
    'useDebounce.ts',
    'useInfiniteScroll.ts',
    'useFavorites.ts'
  ],
  
  // State management
  'src/store/slices': [
    'moviesSlice.ts',
    'searchSlice.ts'
  ],
  'src/store': ['store.ts'],
  
  // Styles
  'src/styles/components': [],
  'src/styles': ['utilities.css'],
  
  // Data files
  'src/data': [
    'movies.json',
    'categories.json',
    'featured.json'
  ]
};

// Additional files to create (only if they don't exist)
const additionalFiles = [
  'public/images/logo.png',
  'public/images/placeholder.jpg',
  '.env.example'
];

// Create directories and files
function createStructure() {
  let dirsCreated = 0;
  let filesCreated = 0;
  let skipped = 0;

  console.log('📦 Creating folder structure...\n');

  // Create folder structure with files
  for (const [dir, files] of Object.entries(structure)) {
    const dirPath = path.join(process.cwd(), dir);
    
    // Create directory if it doesn't exist
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
      dirsCreated++;
      console.log(`✓ Created directory: ${dir}`);
    } else {
      console.log(`⊘ Directory exists: ${dir}`);
      skipped++;
    }

    // Create files in directory
    files.forEach(file => {
      const filePath = path.join(dirPath, file);
      if (!fs.existsSync(filePath)) {
        fs.writeFileSync(filePath, '');
        filesCreated++;
        console.log(`  ✓ Created file: ${file}`);
      } else {
        console.log(`  ⊘ File exists: ${file}`);
        skipped++;
      }
    });
  }

  console.log('\n📄 Creating additional files...\n');

  // Create additional files
  additionalFiles.forEach(file => {
    const filePath = path.join(process.cwd(), file);
    const dir = path.dirname(filePath);
    
    // Create parent directory if needed
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    
    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, '');
      filesCreated++;
      console.log(`✓ Created: ${file}`);
    } else {
      console.log(`⊘ Exists: ${file}`);
      skipped++;
    }
  });

  return { dirsCreated, filesCreated, skipped };
}

// Create .env.example with sample content
function createEnvExample() {
  const envExamplePath = path.join(process.cwd(), '.env.example');
  const envContent = `# Movie Site Environment Variables
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_SITE_NAME=MovieHub
NEXT_PUBLIC_API_URL=/api

# Optional: External API
TMDB_API_KEY=your_api_key_here
`;

  if (!fs.existsSync(envExamplePath)) {
    fs.writeFileSync(envExamplePath, envContent);
  }
}

// Create a helpful README section
function appendToReadme() {
  const readmePath = path.join(process.cwd(), 'README.md');
  const additionalContent = `

## 🎬 Movie Site Structure

This project uses a well-organized folder structure:

- \`src/app/*\` - Next.js app router pages
- \`src/components/*\` - Reusable React components
- \`src/lib/*\` - Utility functions and API helpers
- \`src/types/*\` - TypeScript type definitions
- \`src/hooks/*\` - Custom React hooks
- \`src/store/*\` - State management
- \`src/data/*\` - Static data files

### Key Features:
- Movie listing and details pages
- Search functionality
- Category/year/language/quality filtering
- Responsive design with Tailwind CSS
- Type-safe with TypeScript

### Getting Started:
\`\`\`bash
npm install
npm run dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000) to view the site.
`;

  if (fs.existsSync(readmePath)) {
    const currentContent = fs.readFileSync(readmePath, 'utf8');
    if (!currentContent.includes('Movie Site Structure')) {
      fs.appendFileSync(readmePath, additionalContent);
      console.log('\n✓ Updated README.md with project structure info');
    }
  }
}

// Main execution
function main() {
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('  MOVIE SITE STRUCTURE SETUP');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  // Check if this is a Next.js project
  if (!checkNextJsProject()) {
    process.exit(1);
  }

  try {
    const stats = createStructure();
    createEnvExample();
    appendToReadme();
    
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('  ✅ SETUP COMPLETE!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    
    console.log('📊 Summary:');
    console.log(`   • Directories created: ${stats.dirsCreated}`);
    console.log(`   • Files created: ${stats.filesCreated}`);
    console.log(`   • Already existed: ${stats.skipped}\n`);
    
    console.log('📁 Structure created for:');
    console.log('   ✓ App routes (pages)');
    console.log('   ✓ API routes');
    console.log('   ✓ Components (layout, movie, search, common, sections, ui)');
    console.log('   ✓ Library functions (api, utils, constants)');
    console.log('   ✓ TypeScript types');
    console.log('   ✓ Custom hooks');
    console.log('   ✓ State management');
    console.log('   ✓ Styles');
    console.log('   ✓ Data files\n');
    
    console.log('🚀 Next steps:');
    console.log('   1. Install dependencies (if needed):');
    console.log('      npm install');
    console.log('');
    console.log('   2. Install additional packages:');
    console.log('      npm install -D @types/react @types/node');
    console.log('');
    console.log('   3. Start development server:');
    console.log('      npm run dev');
    console.log('');
    console.log('   4. Open http://localhost:3000\n');
    
    console.log('💡 Tips:');
    console.log('   • Check .env.example for environment variables');
    console.log('   • All files are empty - start filling them with code!');
    console.log('   • Use the folder structure to keep your code organized\n');
    
    console.log('Happy coding! 🎉\n');
    
  } catch (error) {
    console.error('\n❌ Error creating structure:', error.message);
    console.log('\n💡 Tips:');
    console.log('   • Make sure you have write permissions');
    console.log('   • Check if any files are open in your editor');
    console.log('   • Try running with sudo (on Mac/Linux) if permission denied\n');
    process.exit(1);
  }
}

// Run the script
main();