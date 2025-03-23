
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// S'assurer que le dossier electron existe
const electronDir = path.join(__dirname, 'electron');
if (!fs.existsSync(electronDir)) {
  fs.mkdirSync(electronDir, { recursive: true });
}

// Construire l'application Vite
console.log('📦 Construction de l\'application Vite...');
execSync('npm run build', { stdio: 'inherit' });

// Construire l'application Electron
console.log('📦 Construction de l\'exécutable Electron...');
execSync('npx electron-builder build --win --publish never', { stdio: 'inherit' });

console.log('✅ Construction terminée!');
