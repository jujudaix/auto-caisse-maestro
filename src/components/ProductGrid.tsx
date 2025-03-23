
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Edit2, Search } from "lucide-react";
import ProductForm from './ProductForm';
import { Product, Category } from '@/types';

interface ProductGridProps {
  products: Product[];
  categories: Category[];
  onAddToCart: (product: Product) => void;
  onUpdateProduct: (product: Product) => void;
  onAddProduct: (product: Product) => void;
}

const ProductGrid = ({ 
  products, 
  categories, 
  onAddToCart, 
  onUpdateProduct, 
  onAddProduct 
}: ProductGridProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState<string | 'all'>('all');
  const [showProductForm, setShowProductForm] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory === 'all' || product.categoryId === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const handleProductEdit = (product: Product) => {
    setSelectedProduct(product);
    setShowProductForm(true);
  };

  const handleProductFormSubmit = (product: Product) => {
    if (selectedProduct) {
      onUpdateProduct(product);
    } else {
      onAddProduct(product);
    }
    setShowProductForm(false);
    setSelectedProduct(null);
  };

  return (
    <div className="container mx-auto py-6 animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Rechercher un produit..."
            className="pl-8 pr-4 h-10 rounded-full glass border-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Dialog open={showProductForm} onOpenChange={setShowProductForm}>
          <DialogTrigger asChild>
            <Button className="rounded-full glass btn-press">
              <Plus className="mr-2 h-4 w-4" />
              Nouveau Produit
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px] glass animate-scale-in">
            <DialogHeader>
              <DialogTitle>{selectedProduct ? 'Modifier le produit' : 'Ajouter un nouveau produit'}</DialogTitle>
            </DialogHeader>
            <ProductForm 
              product={selectedProduct || undefined} 
              categories={categories}
              onSubmit={handleProductFormSubmit} 
            />
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        <Badge 
          variant={activeCategory === 'all' ? "default" : "outline"} 
          className="cursor-pointer rounded-full px-4 py-1.5 hover:bg-primary/20"
          onClick={() => setActiveCategory('all')}
        >
          Tous
        </Badge>
        {categories.map(category => (
          <Badge 
            key={category.id}
            variant={activeCategory === category.id ? "default" : "outline"} 
            className="cursor-pointer rounded-full px-4 py-1.5 hover:bg-primary/20"
            onClick={() => setActiveCategory(category.id)}
          >
            {category.name}
          </Badge>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredProducts.map((product) => (
          <Card key={product.id} className="overflow-hidden card-hover border-none glass animate-slide-in">
            <CardContent className="p-0 relative">
              <div className="aspect-square bg-muted/30 flex items-center justify-center">
                {product.image ? (
                  <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="text-muted-foreground">Pas d'image</div>
                )}
              </div>
              <Badge className="absolute top-2 right-2">
                {product.price.toFixed(2)} €
              </Badge>
              <Button 
                variant="ghost" 
                size="icon" 
                className="absolute bottom-2 right-2 rounded-full bg-background/80 hover:bg-background"
                onClick={() => handleProductEdit(product)}
              >
                <Edit2 className="h-4 w-4" />
              </Button>
            </CardContent>
            <CardFooter className="flex justify-between p-4">
              <div>
                <h3 className="font-medium truncate">{product.name}</h3>
                <p className="text-sm text-muted-foreground truncate">{product.description}</p>
              </div>
              <Button 
                variant="ghost" 
                className="rounded-full w-8 h-8 p-0 btn-press" 
                onClick={() => onAddToCart(product)}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ProductGrid;
