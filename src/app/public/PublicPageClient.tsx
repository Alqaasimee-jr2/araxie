'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { INITIAL_PRODUCTS } from '@/data/mockProducts';
import { Product, UserProfile } from '@/types';
import { Navbar } from '@/components/Navbar';
import { PublicSpaceView } from '@/components/PublicSpaceView';
import { InteractiveToolModal } from '@/components/tools/InteractiveToolModal';
import { ProductDetailDrawer } from '@/components/ProductDetailDrawer';
import { AuthModal } from '@/components/AuthModal';

export default function PublicPageClient() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [activeInteractiveTool, setActiveInteractiveTool] = useState<Product | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch live products
  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch('/api/products');
        if (res.ok) {
          const data = await res.json();
          if (data.products && data.products.length > 0) {
            setProducts(data.products);
          }
        }
      } catch (e) {
        console.warn('Failed to fetch products on public space:', e);
      }
    }
    fetchProducts();
  }, []);

  return (
    <div className="min-h-screen bg-[#0b0c0e] text-zinc-100 flex flex-col selection:bg-zinc-800 selection:text-white pb-16 sm:pb-0">
      
      {/* Top Navbar */}
      <Navbar
        currentTab="public"
        setCurrentTab={(tab) => {
          if (tab === 'public') {
            // Already here
          } else {
            router.push('/marketplace');
          }
        }}
        unlockedCount={0}
        cartCount={0}
        onOpenCart={() => router.push('/marketplace')}
        onOpenAI={() => router.push('/marketplace')}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        currentUser={currentUser}
        onOpenAuth={() => setIsAuthModalOpen(true)}
        onLogout={() => setCurrentUser(null)}
      />

      {/* Main Public Commons Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <PublicSpaceView
          products={products}
          onSelectProduct={(prod) => setSelectedProduct(prod)}
          onLaunchTool={(prod) => setActiveInteractiveTool(prod)}
          onEnterMarketplace={() => router.push('/marketplace')}
          onOpenDashboard={() => {
            if (currentUser) {
              router.push('/marketplace');
            } else {
              setIsAuthModalOpen(true);
            }
          }}
          onOpenAuth={() => setIsAuthModalOpen(true)}
          isLoggedIn={!!currentUser}
          searchQuery={searchQuery}
        />
      </main>

      {/* Interactive Tool Modal (Runs in-browser for Flow7, CI-Guardian, etc.) */}
      <InteractiveToolModal
        isOpen={!!activeInteractiveTool}
        onClose={() => setActiveInteractiveTool(null)}
        toolId={activeInteractiveTool?.id}
        toolTitle={activeInteractiveTool?.title}
      />

      {/* Product Detail Drawer */}
      <ProductDetailDrawer
        product={selectedProduct}
        isUnlocked={false}
        onClose={() => setSelectedProduct(null)}
        onBuyNow={() => router.push('/marketplace')}
        onAddToCart={() => router.push('/marketplace')}
        isInCart={false}
        onLaunchDemo={(prod) => {
          setSelectedProduct(null);
          setActiveInteractiveTool(prod);
        }}
      />

      {/* Auth Modal with 1-Click Judge Access */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onLoginSuccess={(user) => {
          setCurrentUser(user);
          setIsAuthModalOpen(false);
        }}
      />

      {/* Footer */}
      <footer className="mt-16 border-t border-[#17181f] bg-[#0c0d10] py-8 text-xs text-zinc-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <img src="/logo.svg" alt="Araxie Logo" className="w-5 h-5 rounded" />
            <span className="font-bold text-zinc-200">Araxie</span>
            <span>&bull;</span>
            <span>Campus Commons &bull; Open University Peer Software Square</span>
          </div>

          <div className="flex flex-wrap items-center gap-5 text-[11px]">
            <button 
              onClick={() => router.push('/marketplace')}
              className="text-zinc-400 hover:text-white transition"
            >
              Marketplace Storefront
            </button>
            <a 
              href="https://github.com/Alqaasimee-jr2/araxie" 
              target="_blank" 
              rel="noreferrer"
              className="text-zinc-400 hover:text-white transition"
            >
              GitHub
            </a>
            <span className="text-zinc-600">&copy; 2026 Araxie Inc.</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
