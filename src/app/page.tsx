'use client';

import React, { useState } from 'react';
import { INITIAL_PRODUCTS } from '@/data/mockProducts';
import { Product, ProductCategory, PurchasedItem, DynamicBundle } from '@/types';
import { Navbar } from '@/components/Navbar';
import { ProductCard } from '@/components/ProductCard';
import { ProductDetailDrawer } from '@/components/ProductDetailDrawer';
import { AIConciergeModal } from '@/components/AIConciergeModal';
import { PayPalCheckoutModal } from '@/components/PayPalCheckoutModal';
import { StudentLocker } from '@/components/StudentLocker';
import { CreatorStudioModal } from '@/components/CreatorStudioModal';
import { OrderHistoryModal } from '@/components/OrderHistoryModal';
import { PayPalConfigModal } from '@/components/PayPalConfigModal';
import { CartDrawer } from '@/components/CartDrawer';
import { 
  Sparkles, 
  Layers, 
  ArrowRight, 
  ShieldCheck, 
  GraduationCap, 
  Search,
  CheckCircle2,
  TrendingUp,
  Cpu,
  Zap,
  DollarSign
} from 'lucide-react';

export default function Home() {
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [purchasedItems, setPurchasedItems] = useState<PurchasedItem[]>([]);
  const [cart, setCart] = useState<Product[]>([]);
  const [currentTab, setCurrentTab] = useState<'explore' | 'me' | 'creator' | 'orders'>('explore');
  const [selectedCategory, setSelectedCategory] = useState<'all' | ProductCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals & Drawers state
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);
  const [checkoutProducts, setCheckoutProducts] = useState<Product[]>([]);
  const [checkoutBundle, setCheckoutBundle] = useState<DynamicBundle | null>(null);
  const [checkoutTotal, setCheckoutTotal] = useState<number>(0);
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);
  const [isPayPalConfigOpen, setIsPayPalConfigOpen] = useState(false);
  const [isCreatorModalOpen, setIsCreatorModalOpen] = useState(false);
  const [isOrdersModalOpen, setIsOrdersModalOpen] = useState(false);

  // Filter products by category and search
  const filteredProducts = products.filter((prod) => {
    const matchesCategory = selectedCategory === 'all' || prod.category === selectedCategory;
    const matchesSearch = 
      prod.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prod.tagline.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prod.creator.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prod.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  // Check if a product is already unlocked in locker
  const isProductUnlocked = (productId: string) => {
    return purchasedItems.some(item => item.productId === productId);
  };

  // Trigger quick buy for a single item
  const handleQuickBuy = (product: Product) => {
    setCheckoutProducts([product]);
    setCheckoutBundle(null);
    setCheckoutTotal(product.price);
    setIsCheckoutModalOpen(true);
  };

  // Trigger checkout for an AI-generated bundle
  const handleCheckoutBundle = (bundle: DynamicBundle) => {
    setCheckoutProducts(bundle.items);
    setCheckoutBundle(bundle);
    setCheckoutTotal(bundle.bundleTotal);
    setIsCheckoutModalOpen(true);
  };

  // Trigger checkout from Cart Drawer
  const handleCheckoutCart = (items: Product[], bundle: DynamicBundle | null, total: number) => {
    setCheckoutProducts(items);
    setCheckoutBundle(bundle);
    setCheckoutTotal(total);
    setIsCheckoutModalOpen(true);
  };

  // Payment confirmation handler
  const handlePaymentSuccess = (newPurchasedItems: PurchasedItem[]) => {
    setPurchasedItems(prev => [...newPurchasedItems, ...prev]);
    // Remove purchased items from cart if present
    const purchasedIds = new Set(newPurchasedItems.map(p => p.productId));
    setCart(prev => prev.filter(item => !purchasedIds.has(item.id)));
  };

  // Add newly created product from Creator Studio
  const handleProductCreated = (newProduct: Product) => {
    setProducts(prev => [newProduct, ...prev]);
    setSelectedCategory('all');
    setCurrentTab('explore');
  };

  const categories: Array<{ id: 'all' | ProductCategory; label: string }> = [
    { id: 'all', label: 'All Student Tools' },
    { id: 'chrome-extension', label: 'Chrome Extensions' },
    { id: 'ai-prompt', label: 'AI Prompts' },
    { id: 'study-pack', label: 'Study Packs' },
    { id: 'code-template', label: 'Code & Scripts' },
    { id: 'saas-micro', label: 'Micro-SaaS' },
  ];

  return (
    <div className="min-h-screen bg-[#090a0f] text-zinc-100 flex flex-col selection:bg-blue-600 selection:text-white">
      
      {/* Top Whop-Grade Navigation Bar */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={(tab) => {
          if (tab === 'creator') {
            setIsCreatorModalOpen(true);
          } else if (tab === 'orders') {
            setIsOrdersModalOpen(true);
          } else {
            setCurrentTab(tab);
          }
        }}
        unlockedCount={purchasedItems.length}
        cartCount={cart.length}
        onOpenCart={() => setIsCartDrawerOpen(true)}
        onOpenAI={() => setIsAIModalOpen(true)}
        onOpenPayPalConfig={() => setIsPayPalConfigOpen(true)}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {/* Render Tab: Explore (Storefront) */}
        {currentTab === 'explore' && (
          <div className="space-y-8">
            
            {/* Whop-Style Hero Spotlight Banner */}
            <div className="relative rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-[#121626] via-[#171b30] to-[#121524] border border-[#23293e] overflow-hidden shadow-2xl">
              
              <div className="relative z-10 max-w-2xl space-y-4">
                
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold">
                  <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
                  <span>The Peer-to-Peer Student Digital Marketplace</span>
                </div>

                <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
                  Where Campus Builders Trade Software &amp; Study Tools.
                </h1>

                <p className="text-sm sm:text-base text-zinc-300 leading-relaxed">
                  Discover peer-built Chrome extensions, verified Anki cram decks, and developer templates—bundled autonomously by AI and unlocked instantly with <span className="text-white font-semibold">PayPal Sandbox</span>.
                </p>

                {/* AI Concierge Trigger Input in Hero */}
                <div className="pt-2">
                  <div 
                    onClick={() => setIsAIModalOpen(true)}
                    className="p-3 rounded-2xl bg-[#0c0e16]/80 border border-[#23293d] hover:border-blue-500/50 cursor-pointer flex items-center justify-between gap-3 text-xs text-zinc-400 transition group shadow-inner"
                  >
                    <div className="flex items-center gap-2.5 truncate">
                      <Sparkles className="w-4 h-4 text-blue-400 group-hover:scale-110 transition shrink-0" />
                      <span className="truncate group-hover:text-zinc-200">
                        Ask AI Concierge: &quot;I&apos;m taking CS &amp; Chemistry with a $15 budget...&quot;
                      </span>
                    </div>
                    <span className="px-3 py-1.5 rounded-xl bg-blue-600 group-hover:bg-blue-500 text-white font-semibold text-[11px] shrink-0 transition flex items-center gap-1">
                      <span>Generate Bundle</span>
                      <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>

                {/* Social Proof & Platform Stats */}
                <div className="pt-4 flex flex-wrap items-center gap-4 sm:gap-6 text-xs text-zinc-400">
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Instant PayPal Sandbox Rails</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <TrendingUp className="w-4 h-4 text-blue-400" />
                    <span>95% Creator Royalty Payouts</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <GraduationCap className="w-4 h-4 text-indigo-400" />
                    <span>85+ University Campuses</span>
                  </div>
                </div>

              </div>

              {/* Decorative background glow circles */}
              <div className="absolute right-0 top-0 -mt-12 -mr-12 w-96 h-96 rounded-full bg-blue-600/10 blur-3xl pointer-events-none" />
              <div className="absolute right-1/4 bottom-0 -mb-12 w-64 h-64 rounded-full bg-indigo-600/10 blur-3xl pointer-events-none" />
            </div>

            {/* Category Filter Pills Bar */}
            <div className="flex items-center justify-between gap-4 overflow-x-auto pb-1 no-scrollbar">
              <div className="flex items-center gap-1.5 sm:gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                      selectedCategory === cat.id
                        ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/30'
                        : 'bg-[#12141d] hover:bg-[#1a1e2b] text-zinc-400 hover:text-zinc-200 border border-[#212534]'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>

              <div className="text-xs text-zinc-400 shrink-0 hidden sm:block">
                Showing <span className="font-semibold text-white">{filteredProducts.length}</span> tools
              </div>
            </div>

            {/* Product Grid */}
            {filteredProducts.length === 0 ? (
              <div className="text-center py-16 text-zinc-400 space-y-3">
                <Search className="w-10 h-10 mx-auto text-zinc-600" />
                <h3 className="text-base font-semibold text-white">No matching tools found</h3>
                <p className="text-xs text-zinc-500 max-w-sm mx-auto">
                  Try adjusting your search terms or ask the AI Concierge to recommend resources.
                </p>
                <button
                  onClick={() => { setSelectedCategory('all'); setSearchQuery(''); }}
                  className="px-4 py-2 rounded-xl bg-[#171b26] text-xs font-semibold text-zinc-300 hover:text-white border border-[#242a3c]"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onSelect={(prod) => setSelectedProduct(prod)}
                    onQuickBuy={handleQuickBuy}
                    isUnlocked={isProductUnlocked(product.id)}
                  />
                ))}
              </div>
            )}

          </div>
        )}

        {/* Render Tab: My Student Locker (@me) */}
        {currentTab === 'me' && (
          <StudentLocker
            purchasedItems={purchasedItems}
            onBrowseCatalog={() => setCurrentTab('explore')}
            onViewReceipt={(item) => setIsOrdersModalOpen(true)}
          />
        )}

      </main>

      {/* Footer highlighting PayPal Hackathon criteria */}
      <footer className="mt-16 border-t border-[#1a1e2b] bg-[#0b0c12] py-8 text-xs text-zinc-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-white text-sm">Araxie</span>
            <span>•</span>
            <span>Built for the PayPal AI Hackathon on Devpost</span>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-[11px]">
            <span className="text-zinc-500">PayPal v2 Orders</span>
            <span className="text-zinc-500">PayPal v1 Payouts</span>
            <span className="text-zinc-500">Agentic Commerce</span>
            <span className="text-zinc-500">MIT License</span>
            <button
              onClick={() => setIsPayPalConfigOpen(true)}
              className="text-blue-400 hover:text-blue-300 transition"
            >
              Sandbox Status
            </button>
          </div>
        </div>
      </footer>

      {/* Modal: Product Detail Drawer */}
      <ProductDetailDrawer
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onBuyNow={(prod) => {
          setSelectedProduct(null);
          handleQuickBuy(prod);
        }}
        isUnlocked={selectedProduct ? isProductUnlocked(selectedProduct.id) : false}
      />

      {/* Modal: Agentic Commerce AI Concierge */}
      <AIConciergeModal
        isOpen={isAIModalOpen}
        onClose={() => setIsAIModalOpen(false)}
        onCheckoutBundle={handleCheckoutBundle}
        catalog={products}
      />

      {/* Modal: PayPal Sandbox Checkout */}
      <PayPalCheckoutModal
        isOpen={isCheckoutModalOpen}
        onClose={() => setIsCheckoutModalOpen(false)}
        products={checkoutProducts}
        bundle={checkoutBundle}
        totalAmount={checkoutTotal}
        onPaymentSuccess={handlePaymentSuccess}
      />

      {/* Slide-over: Cart Drawer */}
      <CartDrawer
        isOpen={isCartDrawerOpen}
        onClose={() => setIsCartDrawerOpen(false)}
        cartItems={cart}
        onRemoveItem={(id) => setCart(prev => prev.filter(p => p.id !== id))}
        onCheckout={handleCheckoutCart}
      />

      {/* Modal: Creator Studio ("List a Tool") */}
      <CreatorStudioModal
        isOpen={isCreatorModalOpen}
        onClose={() => setIsCreatorModalOpen(false)}
        onProductCreated={handleProductCreated}
      />

      {/* Modal: Order History & Receipts */}
      <OrderHistoryModal
        isOpen={isOrdersModalOpen}
        onClose={() => setIsOrdersModalOpen(false)}
        purchasedItems={purchasedItems}
      />

      {/* Modal: PayPal Sandbox Configuration */}
      <PayPalConfigModal
        isOpen={isPayPalConfigOpen}
        onClose={() => setIsPayPalConfigOpen(false)}
      />

    </div>
  );
}
