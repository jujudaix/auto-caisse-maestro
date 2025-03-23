
import { useState } from 'react';
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Settings, Receipt, BarChart3, Menu } from "lucide-react";

interface NavbarProps {
  activeTab: string;
  onTabChange: (value: string) => void;
}

const Navbar = ({ activeTab, onTabChange }: NavbarProps) => {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  return (
    <header className="w-full py-4 px-6 glass fixed top-0 z-50 flex justify-between items-center animate-fade-in">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
          <Menu className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h1 className="text-xl font-medium tracking-tight">Auto-Caisse Maestro</h1>
          <p className="text-xs text-muted-foreground">Système de caisse élégant</p>
        </div>
      </div>

      <Tabs defaultValue={activeTab} value={activeTab} onValueChange={onTabChange} className="mx-auto">
        <TabsList className="grid grid-cols-3 w-[400px]">
          <TabsTrigger value="products" className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary rounded-md">
            Produits
          </TabsTrigger>
          <TabsTrigger value="cart" className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary rounded-md">
            Panier
          </TabsTrigger>
          <TabsTrigger value="dashboard" className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary rounded-md">
            Tableau de bord
          </TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="flex items-center gap-2">
        <Dialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="icon" className="rounded-full w-10 h-10 btn-press">
              <Settings className="h-4 w-4" />
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px] glass animate-scale-in">
            <DialogHeader>
              <DialogTitle>Paramètres</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <h3 className="text-sm font-medium">Configuration de l'imprimante</h3>
                <p className="text-sm text-muted-foreground">Ajustez les paramètres de l'imprimante pour les tickets de caisse.</p>
              </div>
              <div className="space-y-2">
                <h3 className="text-sm font-medium">Paramètres du système</h3>
                <p className="text-sm text-muted-foreground">Configurez les options générales du système de caisse.</p>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </header>
  );
};

export default Navbar;
