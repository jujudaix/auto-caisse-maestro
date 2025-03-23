
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { MinusCircle, PlusCircle, Trash2, Receipt, CreditCard, Banknote } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import PrintReceipt from './PrintReceipt';
import { CartItem, Product } from '@/types';

interface CartProps {
  cartItems: CartItem[];
  onUpdateQuantity: (id: string, quantity: number) => void;
  onRemoveItem: (id: string) => void;
  onClearCart: () => void;
}

const Cart = ({ cartItems, onUpdateQuantity, onRemoveItem, onClearCart }: CartProps) => {
  const { toast } = useToast();
  const [isPrintDialogOpen, setIsPrintDialogOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'cash' | null>(null);

  const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const tax = subtotal * 0.20; // 20% TVA
  const total = subtotal + tax;

  const handleCompleteSale = () => {
    if (cartItems.length === 0) {
      toast({
        title: "Panier vide",
        description: "Ajoutez des produits au panier pour finaliser la vente.",
        variant: "destructive",
      });
      return;
    }

    if (!paymentMethod) {
      toast({
        title: "Sélectionnez un mode de paiement",
        description: "Veuillez choisir un mode de paiement pour continuer.",
        variant: "destructive",
      });
      return;
    }

    setIsPrintDialogOpen(true);
  };

  const handlePrintComplete = () => {
    setIsPrintDialogOpen(false);
    setPaymentMethod(null);
    onClearCart();
    
    toast({
      title: "Vente terminée",
      description: "La vente a été traitée avec succès.",
    });
  };

  return (
    <div className="container mx-auto py-6 animate-fade-in">
      <div className="grid md:grid-cols-[1fr_350px] gap-6">
        {/* Cart items */}
        <Card className="glass border-none">
          <CardHeader className="pb-4 pt-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-medium">Panier</h2>
              {cartItems.length > 0 && (
                <Button variant="outline" size="sm" onClick={onClearCart} className="btn-press">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Vider
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {cartItems.length === 0 ? (
              <div className="h-[400px] flex flex-col items-center justify-center text-muted-foreground">
                <div className="w-16 h-16 rounded-full bg-muted/30 flex items-center justify-center mb-4">
                  <Receipt className="h-6 w-6" />
                </div>
                <p>Le panier est vide</p>
                <p className="text-sm">Ajoutez des produits pour commencer</p>
              </div>
            ) : (
              <ScrollArea className="h-[400px] pr-4">
                <div className="space-y-4">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex items-center justify-between py-3">
                      <div className="flex items-center gap-3">
                        {item.image ? (
                          <div className="w-12 h-12 rounded overflow-hidden bg-muted/30">
                            <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                          </div>
                        ) : (
                          <div className="w-12 h-12 rounded bg-muted/30" />
                        )}
                        <div>
                          <h3 className="font-medium">{item.name}</h3>
                          <p className="text-sm text-muted-foreground">{item.price.toFixed(2)} €</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="flex items-center">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 rounded-full btn-press"
                            onClick={() => onUpdateQuantity(item.id, Math.max(1, item.quantity - 1))}
                            disabled={item.quantity <= 1}
                          >
                            <MinusCircle className="h-4 w-4" />
                          </Button>
                          <span className="w-8 text-center">{item.quantity}</span>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 rounded-full btn-press"
                            onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                          >
                            <PlusCircle className="h-4 w-4" />
                          </Button>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 rounded-full text-destructive btn-press"
                          onClick={() => onRemoveItem(item.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            )}
          </CardContent>
        </Card>

        {/* Summary and Payment */}
        <Card className="glass border-none">
          <CardHeader className="pb-4 pt-6">
            <h2 className="text-2xl font-medium">Résumé</h2>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Sous-total</span>
                <span>{subtotal.toFixed(2)} €</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">TVA (20%)</span>
                <span>{tax.toFixed(2)} €</span>
              </div>
              <Separator className="my-2" />
              <div className="flex justify-between font-medium text-lg">
                <span>Total</span>
                <span>{total.toFixed(2)} €</span>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-medium mb-3">Mode de paiement</h3>
              <div className="grid grid-cols-2 gap-2">
                <Button 
                  variant={paymentMethod === 'card' ? 'default' : 'outline'} 
                  className="justify-start btn-press"
                  onClick={() => setPaymentMethod('card')}
                >
                  <CreditCard className="mr-2 h-4 w-4" />
                  Carte
                </Button>
                <Button 
                  variant={paymentMethod === 'cash' ? 'default' : 'outline'} 
                  className="justify-start btn-press"
                  onClick={() => setPaymentMethod('cash')}
                >
                  <Banknote className="mr-2 h-4 w-4" />
                  Espèces
                </Button>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button 
              className="w-full rounded-full btn-press"
              onClick={handleCompleteSale}
              disabled={cartItems.length === 0}
            >
              Finaliser la vente
            </Button>
          </CardFooter>
        </Card>
      </div>

      {/* Print Receipt Dialog */}
      <Sheet open={isPrintDialogOpen} onOpenChange={setIsPrintDialogOpen}>
        <SheetContent className="glass animate-scale-in">
          <SheetHeader>
            <SheetTitle>Imprimer le ticket</SheetTitle>
          </SheetHeader>
          <div className="py-6">
            <PrintReceipt 
              cartItems={cartItems} 
              subtotal={subtotal} 
              tax={tax} 
              total={total} 
              paymentMethod={paymentMethod || 'card'} 
              onPrintComplete={handlePrintComplete}
            />
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default Cart;
