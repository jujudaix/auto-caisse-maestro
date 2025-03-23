
const { contextBridge, ipcRenderer } = require('electron');

// Exposer des fonctions spécifiques à travers le contexte isolé
contextBridge.exposeInMainWorld('electron', {
  printReceipt: (content) => {
    ipcRenderer.send('print-receipt', content);
  }
});

// Indiquer quand la page est prête
window.addEventListener('DOMContentLoaded', () => {
  console.log('Electron preload script chargé');
});
