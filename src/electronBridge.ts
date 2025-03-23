
// Interface pour les fonctions exposées par Electron
interface ElectronAPI {
  printReceipt: (content: string) => void;
}

// Déclaration globale pour l'API Electron
declare global {
  interface Window {
    electron?: ElectronAPI;
  }
}

// Fonction pour imprimer un reçu via Electron
export const printReceipt = (receiptHTML: string): void => {
  if (window.electron) {
    window.electron.printReceipt(receiptHTML);
  } else {
    console.log('Electron non disponible, impression simulée');
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(receiptHTML);
      printWindow.document.close();
      printWindow.print();
      printWindow.close();
    }
  }
};
