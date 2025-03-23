
import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import ProductGrid from '@/components/ProductGrid';
import Cart from '@/components/Cart';
import DashboardStats from '@/components/DashboardStats';
import { Product, Category, CartItem, Sale } from '@/types';

// Sample data
const sampleCategories: Category[] = [
  { id: 'cat-1', name: 'Boissons', color: '#0088FE' },
  { id: 'cat-2', name: 'Plats', color: '#00C49F' },
  { id: 'cat-3', name: 'Desserts', color: '#FFBB28' },
  { id: 'cat-4', name: 'Snacks', color: '#FF8042' },
];

const sampleProducts: Product[] = [
  { 
    id: 'prod-1', 
    name: 'Café', 
    description: 'Expresso ou allongé', 
    price: 1.50, 
    categoryId: 'cat-1',
    image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400&auto=format&fit=crop&q=80' 
  },
  { 
    id: 'prod-2', 
    name: 'Thé', 
    description: 'Thé noir ou vert', 
    price: 2.00, 
    categoryId: 'cat-1',
    image: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=400&auto=format&fit=crop&q=80' 
  },
  { 
    id: 'prod-3', 
    name: 'Sandwich', 
    description: 'Jambon-beurre', 
    price: 3.50, 
    categoryId: 'cat-2',
    image: 'https://images.unsplash.com/photo-1592894869086-f828b161e90a?w=400&auto=format&fit=crop&q=80' 
  },
  { 
    id: 'prod-4', 
    name: 'Salade', 
    description: 'Salade fraîche du jour', 
    price: 4.50, 
    categoryId: 'cat-2',
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&auto=format&fit=crop&q=80' 
  },
  { 
    id: 'prod-5', 
    name: 'Crêpe', 
    description: 'Sucre ou chocolat', 
    price: 3.00, 
    categoryId: 'cat-3',
    image: 'https://images.unsplash.com/photo-1569627909129-3ee65e2bbd5f?w=400&auto=format&fit=crop&q=80' 
  },
  { 
    id: 'prod-6', 
    name: 'Croissant', 
    description: 'Croissant au beurre', 
    price: 1.20, 
    categoryId: 'cat-4',
    image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=400&auto=format&fit=crop&q=80' 
  },
  { 
    id: 'prod-7', 
    name: 'Eau minérale', 
    description: '50cl', 
    price: 1.00, 
    categoryId: 'cat-1',
    image: 'https://images.unsplash.com/photo-1616118132534-381148898bb4?w=400&auto=format&fit=crop&q=80' 
  },
  { 
    id: 'prod-8', 
    name: 'Pizza', 
    description: 'Margherita', 
    price: 8.00, 
    categoryId: 'cat-2',
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&auto=format&fit=crop&q=80' 
  },
];

// Sample sales for dashboard
const sampleSales: Sale[] = [
  {
    id: 'sale-1',
    date: new Date().toISOString(),
    items: [
      { productId: 'prod-1', name: 'Café', price: 1.50, quantity: 2 },
      { productId: 'prod-6', name: 'Croissant', price: 1.20, quantity: 1 }
    ],
    subtotal: 4.20,
    tax: 0.84,
    total: 5.04,
    paymentMethod: 'card'
  },
  {
    id: 'sale-2',
    date: new Date(Date.now() - 86400000).toISOString(), // Yesterday
    items: [
      { productId: 'prod-3', name: 'Sandwich', price: 3.50, quantity: 1 },
      { productId: 'prod-7', name: 'Eau minérale', price: 1.00, quantity: 1 }
    ],
    subtotal: 4.50,
    tax: 0.90,
    total: 5.40,
    paymentMethod: 'cash'
  },
  {
    id: 'sale-3',
    date: new Date(Date.now() - 86400000 * 2).toISOString(), // 2 days ago
    items: [
      { productId: 'prod-8', name: 'Pizza', price: 8.00, quantity: 1 }
    ],
    subtotal: 8.00,
    tax: 1.60,
    total: 9.60,
    paymentMethod: 'card'
  },
  {
    id: 'sale-4',
    date: new Date(Date.now() - 86400000 * 3).toISOString(), // 3 days ago
    items: [
      { productId: 'prod-1', name: 'Café', price: 1.50, quantity: 3 },
      { productId: 'prod-5', name: 'Crêpe', price: 3.00, quantity: 2 }
    ],
    subtotal: 10.50,
    tax: 2.10,
    total: 12.60,
    paymentMethod: 'card'
  },
  {
    id: 'sale-5',
    date: new Date(Date.now() - 86400000 * 4).toISOString(), // 4 days ago
    items: [
      { productId: 'prod-4', name: 'Salade', price: 4.50, quantity: 1 },
      { productId: 'prod-2', name: 'Thé', price: 2.00, quantity: 1 }
    ],
    subtotal: 6.50,
    tax: 1.30,
    total: 7.80,
    paymentMethod: 'cash'
  },
];

const Index = () => {
  // State management
  const [activeTab, setActiveTab] = useState('products');
  const [products, setProducts] = useState<Product[]>(sampleProducts);
  const [categories, setCategories] = useState<Category[]>(sampleCategories);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [sales, setSales] = useState<Sale[]>(sampleSales);

  // Local storage persistence
  useEffect(() => {
    const savedProducts = localStorage.getItem('products');
    const savedCategories = localStorage.getItem('categories');
    const savedSales = localStorage.getItem('sales');
    
    if (savedProducts) setProducts(JSON.parse(savedProducts));
    if (savedCategories) setCategories(JSON.parse(savedCategories));
    if (savedSales) setSales(JSON.parse(savedSales));
  }, []);

  useEffect(() => {
    localStorage.setItem('products', JSON.stringify(products));
    localStorage.setItem('categories', JSON.stringify(categories));
    localStorage.setItem('sales', JSON.stringify(sales));
  }, [products, categories, sales]);

  // Cart operations
  const addToCart = (product: Product) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === product.id);
      
      if (existingItem) {
        return prevItems.map(item => 
          item.id === product.id 
            ? { ...item, quantity: item.quantity + 1 } 
            : item
        );
      }
      
      return [...prevItems, { ...product, quantity: 1 }];
    });
  };

  const updateCartItemQuantity = (id: string, quantity: number) => {
    setCartItems(prevItems => 
      prevItems.map(item => 
        item.id === id ? { ...item, quantity } : item
      )
    );
  };

  const removeCartItem = (id: string) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== id));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  // Product operations
  const addProduct = (product: Product) => {
    setProducts(prevProducts => [...prevProducts, product]);
  };

  const updateProduct = (product: Product) => {
    setProducts(prevProducts => 
      prevProducts.map(p => p.id === product.id ? product : p)
    );
  };

  // Sale operations
  const recordSale = (
    items: CartItem[], 
    subtotal: number, 
    tax: number, 
    total: number, 
    paymentMethod: 'card' | 'cash'
  ) => {
    const saleItems = items.map(item => ({
      productId: item.id,
      name: item.name,
      price: item.price,
      quantity: item.quantity
    }));
    
    const newSale: Sale = {
      id: `sale-${Date.now()}`,
      date: new Date().toISOString(),
      items: saleItems,
      subtotal,
      tax,
      total,
      paymentMethod
    };
    
    setSales(prevSales => [newSale, ...prevSales]);
  };

  // Render the active tab content
  const renderContent = () => {
    switch (activeTab) {
      case 'products':
        return (
          <ProductGrid 
            products={products} 
            categories={categories} 
            onAddToCart={addToCart}
            onUpdateProduct={updateProduct}
            onAddProduct={addProduct}
          />
        );
      case 'cart':
        return (
          <Cart 
            cartItems={cartItems} 
            onUpdateQuantity={updateCartItemQuantity} 
            onRemoveItem={removeCartItem}
            onClearCart={clearCart}
          />
        );
      case 'dashboard':
        return <DashboardStats sales={sales} products={products} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar activeTab={activeTab} onTabChange={setActiveTab} />
      <main className="pt-24 pb-16">
        {renderContent()}
      </main>
    </div>
  );
};

export default Index;
