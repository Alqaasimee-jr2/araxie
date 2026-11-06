import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://xgcyuwaulllpdlsrgvla.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

// Client-side Supabase client for browser authentication
export const supabase = createClient(supabaseUrl, supabaseAnonKey || 'dummy-anon-key', {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});

// Server-side Admin Supabase client with Service Role privileges
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey || supabaseAnonKey || 'dummy-key', {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
});
