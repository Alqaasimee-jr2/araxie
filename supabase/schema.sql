-- ==============================================================================
-- Araxie — Student Digital Economy Database Schema & Row-Level Security (RLS)
-- Target: Supabase PostgreSQL (Postgres 15+)
-- ==============================================================================

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Student User Profiles
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  university TEXT NOT NULL DEFAULT 'Stanford University ''26',
  major TEXT DEFAULT 'Computer Science',
  grad_year TEXT DEFAULT '2026',
  role TEXT NOT NULL DEFAULT 'student_buyer' CHECK (role IN ('student_buyer', 'student_creator', 'admin')),
  avatar_url TEXT DEFAULT 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
  bio TEXT DEFAULT 'Building and discovering high-utility student software on Araxie.',
  payout_email TEXT,
  verified_student BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Student Products Catalog
CREATE TABLE IF NOT EXISTS public.products (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  tagline TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('chrome-extension', 'ai-prompt', 'study-pack', 'code-template', 'saas-micro')),
  price NUMERIC(10, 2) NOT NULL CHECK (price >= 0),
  original_price NUMERIC(10, 2),
  creator_id UUID REFERENCES public.profiles(id),
  creator_name TEXT NOT NULL,
  creator_university TEXT NOT NULL,
  creator_payout_email TEXT NOT NULL,
  rating NUMERIC(2, 1) DEFAULT 5.0,
  reviews_count INTEGER DEFAULT 0,
  sales_count INTEGER DEFAULT 0,
  features JSONB DEFAULT '[]'::jsonb,
  download_url TEXT NOT NULL,
  license_prefix TEXT DEFAULT 'ARX',
  tags JSONB DEFAULT '[]'::jsonb,
  badge TEXT,
  accent_color TEXT DEFAULT '#3b82f6',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Captured PayPal Orders & Unlocked Student Assets
CREATE TABLE IF NOT EXISTS public.orders (
  id TEXT PRIMARY KEY,
  product_id TEXT NOT NULL REFERENCES public.products(id),
  buyer_id UUID REFERENCES public.profiles(id),
  buyer_email TEXT NOT NULL,
  order_id TEXT NOT NULL, -- PayPal Order ID
  capture_id TEXT NOT NULL, -- PayPal Capture ID
  license_key TEXT UNIQUE NOT NULL, -- HMAC-signed cryptographic license
  amount_paid NUMERIC(10, 2) NOT NULL,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'revoked', 'refunded')),
  download_url TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_orders_order_product ON public.orders(order_id, product_id);
CREATE INDEX IF NOT EXISTS idx_orders_buyer_email ON public.orders(buyer_email);

-- 5. Creator Royalties & PayPal Payout Disbursements
CREATE TABLE IF NOT EXISTS public.payouts (
  id TEXT PRIMARY KEY,
  order_id TEXT NOT NULL,
  creator_name TEXT NOT NULL,
  creator_email TEXT NOT NULL,
  gross_amount NUMERIC(10, 2) NOT NULL,
  platform_fee NUMERIC(10, 2) NOT NULL,
  net_payout NUMERIC(10, 2) NOT NULL,
  batch_id TEXT NOT NULL, -- PayPal Payout Batch ID
  status TEXT DEFAULT 'SUCCESS' CHECK (status IN ('SUCCESS', 'PENDING', 'FAILED')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_payouts_creator_email ON public.payouts(creator_email);
CREATE INDEX IF NOT EXISTS idx_payouts_order_id ON public.payouts(order_id);

-- 6. Verified Peer Reviews
CREATE TABLE IF NOT EXISTS public.reviews (
  id TEXT PRIMARY KEY,
  product_id TEXT NOT NULL REFERENCES public.products(id),
  author_name TEXT NOT NULL,
  author_university TEXT NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT NOT NULL,
  verified_buyer BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_reviews_product_id ON public.reviews(product_id);

-- 7. Shared Serverless Rate Limiting Ledger (Upstash / Supabase fallback)
CREATE TABLE IF NOT EXISTS public.rate_limits (
  key TEXT PRIMARY KEY,
  tokens INTEGER NOT NULL,
  last_refill BIGINT NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL
);

-- ==============================================================================
-- Row-Level Security (RLS) Policies
-- ==============================================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rate_limits ENABLE ROW LEVEL SECURITY;

-- Profiles: Anyone can view; user can edit own
CREATE POLICY "Public profiles are viewable by everyone" ON public.profiles
  FOR SELECT USING (true);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- Products: Everyone can browse; creators can insert
CREATE POLICY "Products are viewable by everyone" ON public.products
  FOR SELECT USING (true);

CREATE POLICY "Creators can insert their own tools" ON public.products
  FOR INSERT WITH CHECK (auth.uid() = creator_id);

-- Orders: Buyers can view their own unlocked items
CREATE POLICY "Buyers can view own orders" ON public.orders
  FOR SELECT USING (auth.uid() = buyer_id OR auth.jwt() ->> 'email' = buyer_email);

-- Payouts: Creators can view their own payouts
CREATE POLICY "Creators can view their own payouts" ON public.payouts
  FOR SELECT USING (auth.jwt() ->> 'email' = creator_email);

-- Reviews: Public read; authenticated users can review
CREATE POLICY "Reviews are viewable by everyone" ON public.reviews
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can submit reviews" ON public.reviews
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');
