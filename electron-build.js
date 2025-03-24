
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

// Vérifier si le dossier de sortie existe et le nettoyer si nécessaire
const releaseDir = path.join(__dirname, 'release');
function cleanupReleaseDir() {
  if (fs.existsSync(releaseDir)) {
    console.log('🧹 Nettoyage du dossier release...');
    try {
      // Sur Windows, on peut avoir besoin de plusieurs tentatives
      fs.rmSync(releaseDir, { recursive: true, force: true });
      console.log('✅ Dossier release nettoyé avec succès');
    } catch (err) {
      console.warn('⚠️ Impossible de supprimer complètement le dossier release:', err.message);
      console.log('➡️ Tentative de construction malgré tout...');
    }
  }
}

try {
  // Nettoyer le dossier release avant de commencer
  cleanupReleaseDir();

  // Construire l'application Vite
  console.log('📦 Construction de l\'application Vite...');
  execSync('npm run build', { stdio: 'inherit' });

  // Ajouter package.json dans le dossier electron pour la compatibilité ES modules
  const electronPackagePath = path.join(electronDir, 'package.json');
  if (!fs.existsSync(electronPackagePath)) {
    fs.writeFileSync(
      electronPackagePath,
      JSON.stringify({ type: "module" }, null, 2)
    );
    console.log('✅ Fichier package.json créé dans le dossier electron');
  }

  // Construire l'application Electron
  console.log('📦 Construction de l\'exécutable Electron...');
  execSync('npx electron-builder build --win --publish never --config electron-builder.yml', { 
    stdio: 'inherit',
    env: { ...process.env, NODE_ENV: 'production' }
  });

  console.log('✅ Construction terminée!');
} catch (error) {
  console.error('❌ Erreur lors de la construction:', error.message);
  process.exit(1);
}
