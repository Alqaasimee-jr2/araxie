'use client';

import React, { useState, useEffect } from 'react';
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
import { InteractiveToolModal } from '@/components/tools/InteractiveToolModal';
import { 
  Sparkles, 
  Layers, 
  ArrowRight, 
  ShieldCheck, 
  GraduationCap, 
  Search,
  CheckCircle2,
  TrendingUp,
  Play
} from 'lucide-react';

export default function Home() {
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [purchasedItems, setPurchasedItems] = useState<PurchasedItem[]>([]);
  const [cart, setCart] = useState<Product[]>([]);
  const [currentTab, setCurrentTab] = useState<'explore' | 'me' | 'creator' | 'orders'>('explore');
  const [selectedCategory, setSelectedCategory] = useState<'all' | ProductCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals & Interactive Tools state
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [activeInteractiveTool, setActiveInteractiveTool] = useState<Product | null>(null);
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);
  const [checkoutProducts, setCheckoutProducts] = useState<Product[]>([]);
  const [checkoutBundle, setCheckoutBundle] = useState<DynamicBundle | null>(null);
  const [checkoutTotal, setCheckoutTotal] = useState<number>(0);
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);
  const [isPayPalConfigOpen, setIsPayPalConfigOpen] = useState(false);
  const [isCreatorModalOpen, setIsCreatorModalOpen] = useState(false);
  const [isOrdersModalOpen, setIsOrdersModalOpen] = useState(false);

  // Load persistent products & orders from backend DB on mount
  useEffect(() => {
    async function loadData() {
      try {
        const prodRes = await fetch('/api/products');
        if (prodRes.ok) {
          const data = await prodRes.json();
          if (data.products && data.products.length > 0) {
            setProducts(data.products);
          }
        }

        const ordRes = await fetch('/api/orders');
        if (ordRes.ok) {
          const data = await ordRes.json();
          if (data.orders) {
            setPurchasedItems(data.orders);
          }
        }
      } catch (e) {
        console.warn('Initial data load error:', e);
      }
    }
    loadData();
  }, []);

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

  const isProductUnlocked = (productId: string) => {
    return purchasedItems.some(item => item.productId === productId);
  };

  const handleQuickBuy = (product: Product) => {
    setCheckoutProducts([product]);
    setCheckoutBundle(null);
    setCheckoutTotal(product.price);
    setIsCheckoutModalOpen(true);
  };

  const handleCheckoutBundle = (bundle: DynamicBundle) => {
    setCheckoutProducts(bundle.items);
    setCheckoutBundle(bundle);
    setCheckoutTotal(bundle.bundleTotal);
    setIsCheckoutModalOpen(true);
  };

  const handleCheckoutCart = (items: Product[], bundle: DynamicBundle | null, total: number) => {
    setCheckoutProducts(items);
    setCheckoutBundle(bundle);
    setCheckoutTotal(total);
    setIsCheckoutModalOpen(true);
  };

  const handlePaymentSuccess = (newPurchasedItems: PurchasedItem[]) => {
    setPurchasedItems(prev => [...newPurchasedItems, ...prev]);
    const purchasedIds = new Set(newPurchasedItems.map(p => p.productId));
    setCart(prev => prev.filter(item => !purchasedIds.has(item.id)));
  };

  const handleProductCreated = (newProduct: Product) => {
    setProducts(prev => [newProduct, ...prev]);
    setSelectedCategory('all');
    setCurrentTab('explore');
  };

  const categories: Array<{ id: 'all' | ProductCategory; label: string }> = [
    { id: 'all', label: 'All Tools' },
    { id: 'chrome-extension', label: 'Extensions' },
    { id: 'ai-prompt', label: 'AI Prompts' },
    { id: 'study-pack', label: 'Study Packs' },
    { id: 'code-template', label: 'Code & Scripts' },
    { id: 'saas-micro', label: 'Micro-SaaS' },
  ];

  return (
    <div className="min-h-screen bg-[#0b0c0e] text-zinc-100 flex flex-col selection:bg-zinc-800 selection:text-white">
      
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
          <div className="space-y-7">
            
            {/* Whop-Style Hero Spotlight Banner (Clean, Matte, Muted) */}
            <div className="rounded-2xl p-6 sm:p-7 bg-[#121317] border border-[#1e2027]">
              
              <div className="max-w-2xl space-y-3.5">
                
                <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-[#181a20] border border-[#252834] text-zinc-300 text-xs font-medium">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>Student Digital Commerce Platform</span>
                </div>

                <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight leading-tight">
                  The marketplace where campus builders trade software and study tools.
                </h1>

                <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
                  Discover peer-built Chrome extensions, interactive algorithm visualizers, and curated study suites. Bundled autonomously by AI with instant <span className="text-zinc-200 font-semibold">PayPal Sandbox</span> settlement.
                </p>

                {/* AI Concierge Trigger Input */}
                <div className="pt-1.5">
                  <div 
                    onClick={() => setIsAIModalOpen(true)}
                    className="p-3 rounded-xl bg-[#0d0e11] border border-[#1d1f27] hover:border-[#2a2c38] cursor-pointer flex items-center justify-between gap-3 text-xs text-zinc-400 transition"
                  >
                    <div className="flex items-center gap-2.5 truncate">
                      <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
                      <span className="truncate text-zinc-300">
                        Ask AI Concierge: &quot;I&apos;m taking CS &amp; Chemistry with a $15 budget...&quot;
                      </span>
                    </div>
                    <span className="px-3 py-1.5 rounded-lg bg-[#1f222b] hover:bg-[#282b36] text-white font-medium text-[11px] border border-[#2b2f3d] shrink-0 transition flex items-center gap-1">
                      <span>Curate Bundle</span>
                      <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>

                {/* Platform Guarantees */}
                <div className="pt-2 flex flex-wrap items-center gap-4 text-xs text-zinc-500">
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-zinc-400" />
                    <span>PayPal Sandbox Payments</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-zinc-400" />
                    <span>Live In-Browser Tool Execution</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-zinc-400" />
                    <span>95% Direct Creator Payouts</span>
                  </div>
                </div>

              </div>

            </div>

            {/* Category Filter Pills Bar */}
            <div className="flex items-center justify-between gap-4 overflow-x-auto pb-1 no-scrollbar">
              <div className="flex items-center gap-1.5">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition ${
                      selectedCategory === cat.id
                        ? 'bg-[#1e212b] text-white border border-[#2c303f]'
                        : 'bg-[#121317] hover:bg-[#181a20] text-zinc-400 hover:text-zinc-200 border border-[#1e2027]'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>

              <div className="text-xs text-zinc-500 shrink-0 hidden sm:block">
                Showing <span className="font-semibold text-zinc-300">{filteredProducts.length}</span> tools
              </div>
            </div>

            {/* Product Grid */}
            {filteredProducts.length === 0 ? (
              <div className="text-center py-16 text-zinc-500 space-y-3 rounded-xl bg-[#0f1014] border border-[#1b1c23]">
                <Search className="w-8 h-8 mx-auto text-zinc-600" />
                <h3 className="text-sm font-semibold text-zinc-300">No tools found</h3>
                <p className="text-xs text-zinc-500 max-w-sm mx-auto">
                  Try adjusting your search terms or ask the AI Concierge for recommendations.
                </p>
                <button
                  onClick={() => { setSelectedCategory('all'); setSearchQuery(''); }}
                  className="px-3.5 py-1.5 rounded-lg bg-[#181a20] text-xs font-medium text-zinc-300 hover:text-white border border-[#22242e]"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onSelect={(prod) => setSelectedProduct(prod)}
                    onQuickBuy={handleQuickBuy}
                    onLaunchDemo={(prod) => setActiveInteractiveTool(prod)}
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
            onLaunchTool={(prod) => setActiveInteractiveTool(prod)}
          />
        )}

      </main>

      {/* Footer */}
      <footer className="mt-16 border-t border-[#17181f] bg-[#0c0d10] py-8 text-xs text-zinc-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-zinc-300">Araxie</span>
            <span>•</span>
            <span>Built for the PayPal AI Hackathon on Devpost</span>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-[11px]">
            <span className="text-zinc-500">PayPal v2 Orders</span>
            <span className="text-zinc-500">PayPal v1 Payouts</span>
            <span className="text-zinc-500">Agentic Commerce</span>
            <a 
              href="https://github.com/Alqaasimee-jr2/araxie" 
              target="_blank" 
              rel="noreferrer"
              className="text-zinc-400 hover:text-white transition"
            >
              GitHub Repository
            </a>
            <button
              onClick={() => setIsPayPalConfigOpen(true)}
              className="text-zinc-400 hover:text-white transition"
            >
              Sandbox Status
            </button>
          </div>
        </div>
      </footer>

      {/* Modal: Interactive In-App Tool Execution Workspace */}
      <InteractiveToolModal
        isOpen={!!activeInteractiveTool}
        onClose={() => setActiveInteractiveTool(null)}
        toolId={activeInteractiveTool?.id}
        toolTitle={activeInteractiveTool?.title}
      />

      {/* Modal: Product Detail Drawer */}
      <ProductDetailDrawer
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onBuyNow={(prod) => {
          setSelectedProduct(null);
          handleQuickBuy(prod);
        }}
        onLaunchDemo={(prod) => {
          setSelectedProduct(null);
          setActiveInteractiveTool(prod);
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

      {/* Modal: Creator Studio */}
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
