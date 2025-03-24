
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Obtenir le chemin du répertoire actuel en ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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
