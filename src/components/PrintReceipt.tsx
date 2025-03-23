
import { useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Printer } from "lucide-react";
import { CartItem } from '@/types';

interface PrintReceiptProps {
  cartItems: CartItem[];
  subtotal: number;
  tax: number;
  total: number;
  paymentMethod: 'card' | 'cash';
  onPrintComplete: () => void;
}

const PrintReceipt = ({ 
  cartItems, 
  subtotal, 
  tax, 
  total, 
  paymentMethod, 
  onPrintComplete 
}: PrintReceiptProps) => {
  const receiptRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    // Open the browser print dialog
    if (receiptRef.current) {
      const originalContents = document.body.innerHTML;
      const printContents = receiptRef.current.innerHTML;
      
      document.body.innerHTML = `
        <div class="print-receipt">
          <style>
            @media print {
              body { font-family: sans-serif; }
              @page { size: 80mm 297mm; margin: 0; }
              .receipt-header { text-align: center; margin-bottom: 10px; }
              .receipt-item { display: flex; justify-content: space-between; margin: 5px 0; }
              .receipt-separator { border-top: 1px dashed #ccc; margin: 10px 0; }
              .receipt-total { font-weight: bold; }
              .receipt-footer { text-align: center; margin-top: 20px; font-size: 12px; }
            }
          </style>
          ${printContents}
        </div>
      `;
      
      window.print();
      document.body.innerHTML = originalContents;
      onPrintComplete();
    }
  };

  const currentDate = new Date().toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <div className="space-y-6">
      <Card className="border-none glass">
        <CardContent className="p-6">
          <div ref={receiptRef} className="mx-auto max-w-[300px]">
            <div className="receipt-header">
              <h2 className="text-xl font-semibold">Auto-Caisse Maestro</h2>
              <p className="text-sm text-muted-foreground">{currentDate}</p>
            </div>
            
            <Separator className="my-4 receipt-separator" />
            
            <div className="space-y-2">
              {cartItems.map((item) => (
                <div key={item.id} className="receipt-item flex justify-between">
                  <div className="flex-1">
                    <span>{item.name}</span>
                    <div className="text-xs text-muted-foreground">
                      {item.quantity} x {item.price.toFixed(2)} €
                    </div>
                  </div>
                  <div className="text-right">
                    {(item.price * item.quantity).toFixed(2)} €
                  </div>
                </div>
              ))}
            </div>
            
            <Separator className="my-4 receipt-separator" />
            
            <div className="space-y-1">
              <div className="receipt-item flex justify-between">
                <span className="text-muted-foreground">Sous-total</span>
                <span>{subtotal.toFixed(2)} €</span>
              </div>
              <div className="receipt-item flex justify-between">
                <span className="text-muted-foreground">TVA (20%)</span>
                <span>{tax.toFixed(2)} €</span>
              </div>
              <div className="receipt-item flex justify-between receipt-total font-medium pt-2">
                <span>Total</span>
                <span>{total.toFixed(2)} €</span>
              </div>
            </div>
            
            <Separator className="my-4 receipt-separator" />
            
            <div className="receipt-item flex justify-between">
              <span>Mode de paiement</span>
              <span>{paymentMethod === 'card' ? 'Carte' : 'Espèces'}</span>
            </div>
            
            <div className="receipt-footer text-center mt-6 text-sm text-muted-foreground">
              <p>Merci pour votre achat!</p>
              <p className="mt-1">Auto-Caisse Maestro</p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Button 
        className="w-full btn-press flex items-center justify-center gap-2"
        onClick={handlePrint}
      >
        <Printer className="h-4 w-4" />
        Imprimer le ticket
      </Button>
    </div>
  );
};

export default PrintReceipt;
