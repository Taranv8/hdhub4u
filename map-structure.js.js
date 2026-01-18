const fs = require('fs');
const path = require('path');

// Directories and files to ignore
const IGNORE_LIST = [
  'node_modules',
  '.next',
  '.git',
  'dist',
  'build',
  '.vercel',
  '.env',
  '.env.local',
  '.DS_Store',
  'package-lock.json',
  'yarn.lock',
  'pnpm-lock.yaml',
];

// Function to check if path should be ignored
function shouldIgnore(name) {
  return IGNORE_LIST.some(ignore => name.includes(ignore));
}

// Function to generate tree structure
function generateTree(dir, prefix = '', isLast = true) {
  let output = '';
  const baseName = path.basename(dir);
  
  // Add current directory/file
  const connector = isLast ? '└── ' : '├── ';
  output += prefix + connector + baseName + '\n';
  
  // If it's a file, return
  if (!fs.statSync(dir).isDirectory()) {
    return output;
  }
  
  // Read directory contents
  let items;
  try {
    items = fs.readdirSync(dir);
  } catch (err) {
    return output;
  }
  
  // Filter out ignored items
  items = items.filter(item => !shouldIgnore(item));
  
  // Sort: directories first, then files
  items.sort((a, b) => {
    const aPath = path.join(dir, a);
    const bPath = path.join(dir, b);
    const aIsDir = fs.statSync(aPath).isDirectory();
    const bIsDir = fs.statSync(bPath).isDirectory();
    
    if (aIsDir && !bIsDir) return -1;
    if (!aIsDir && bIsDir) return 1;
    return a.localeCompare(b);
  });
  
  // Process each item
  items.forEach((item, index) => {
    const itemPath = path.join(dir, item);
    const isLastItem = index === items.length - 1;
    const newPrefix = prefix + (isLast ? '    ' : '│   ');
    
    output += generateTree(itemPath, newPrefix, isLastItem);
  });
  
  return output;
}

// Main function
function mapProjectStructure() {
  const projectRoot = process.cwd();
  const outputFile = 'project-structure.txt';
  
  console.log('🔍 Mapping Next.js project structure...');
  console.log(`📁 Project root: ${projectRoot}\n`);
  
  // Generate the tree
  let structure = `Next.js App Router Project Structure
Generated on: ${new Date().toLocaleString()}
Project: ${path.basename(projectRoot)}

`;
  
  structure += generateTree(projectRoot, '', true);
  
  // Write to file
  fs.writeFileSync(outputFile, structure, 'utf8');
  
  console.log('✅ Project structure mapped successfully!');
  console.log(`📄 Output saved to: ${outputFile}`);
  console.log(`\n📊 Preview:\n`);
  console.log(structure.split('\n').slice(0, 30).join('\n'));
  
  if (structure.split('\n').length > 30) {
    console.log('\n... (see full structure in project-structure.txt)');
  }
}

// Run the script
mapProjectStructure();