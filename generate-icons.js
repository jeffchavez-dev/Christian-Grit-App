// Run with: node generate-icons.js
// Generates SVG-based PNG icons for the PWA
const fs = require('fs');
const path = require('path');

const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
  <rect width="512" height="512" rx="80" fill="#F5E6C8"/>
  <rect x="220" y="80" width="72" height="352" rx="16" fill="#7C5C3E"/>
  <rect x="100" y="180" width="312" height="72" rx="16" fill="#7C5C3E"/>
</svg>`;

fs.writeFileSync(path.join(__dirname, 'public', 'icon.svg'), svg);
console.log('SVG icon written to public/icon.svg');
console.log('Use a tool like sharp or squoosh.app to convert to icon-192.png and icon-512.png');
console.log('Or use: https://www.pwabuilder.com/imageGenerator to generate all sizes from the SVG');
