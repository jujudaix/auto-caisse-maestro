
import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const isDev = process.env.IS_DEV === "true";

// Fenêtre principale
let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    },
    icon: path.join(__dirname, '../public/favicon.ico')
  });

  // Chargement de l'application
  const startUrl = isDev
    ? 'http://localhost:8080'
    : `file://${path.join(__dirname, '../dist/index.html')}`;
    
  mainWindow.loadURL(startUrl);

  // Ouvrir les DevTools en mode développement
  if (isDev) {
    mainWindow.webContents.openDevTools();
  }

  // Gestion de la fermeture de la fenêtre
  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// Création de la fenêtre quand Electron est prêt
app.whenReady().then(createWindow);

// Quitter l'application quand toutes les fenêtres sont fermées (sauf sur macOS)
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// Gestion de l'impression des reçus
ipcMain.on('print-receipt', async (event, content) => {
  if (!mainWindow) return;
  
  // Créer une fenêtre invisible pour l'impression
  const printWindow = new BrowserWindow({ 
    show: false,
    webPreferences: {
      nodeIntegration: true
    }
  });
  
  // Charger le contenu HTML du reçu
  await printWindow.loadURL('data:text/html,' + encodeURIComponent(content));
  
  // Imprimer silencieusement (ou afficher la boîte de dialogue si silent est false)
  printWindow.webContents.print({ silent: false, printBackground: true }, (success) => {
    if (!success) {
      console.log('Échec de l\'impression');
    }
    printWindow.close();
  });
});
