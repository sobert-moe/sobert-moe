const fs = require('fs');
const path = require('path');

const journalDir = path.join(__dirname, '../../developer-journal');
const readmePath = path.join(journalDir, 'README.md');

// Get all .md files except the README
const files = fs.readdirSync(journalDir).filter(file => {
  return file.endsWith('.md') && file.toLowerCase() !== 'readme.md';
});

// Sort files alphabetically (or tweak if you have a naming convention)
files.sort();

// Build the markdown links
const linksList = files.map(file => {
  // Remove the file extension for display purposes
  const displayName = file.replace('.md', '');
  return `- [${displayName}](${file})`;
}).join('\n');

// New content for README.md
const newContent = `# Weekly Developer Journal

${linksList}
`;

// Write back to README.md
fs.writeFileSync(readmePath, newContent, 'utf8');

console.log('README.md updated with current journal entries.');