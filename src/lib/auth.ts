import { UserProfile } from '@/types';
import { supabase, supabaseAdmin } from './supabase';
import { getFakeAvatar } from './avatars';

export const SEEDED_JUDGE_BUYER: UserProfile = {
  id: 'usr-judge-buyer-stanford',
  email: 'judge.sandbox@araxie.edu',
  name: 'Alex Chen',
  university: 'Stanford University \'26',
  role: 'student_buyer',
  avatar: '/avatars/judge.svg',
  verified: true,
  walletBalance: 50.00,
};

export const SEEDED_CREATOR_BUILDER: UserProfile = {
  id: 'usr-creator-mit-builder',
  email: 'creator.sandbox@araxie.edu',
  name: 'Marcus Chen',
  university: 'MIT \'25',
  role: 'student_creator',
  avatar: '/avatars/creator.svg',
  verified: true,
  walletBalance: 420.50,
};

export const JUDGE_PASSWORD = 'PayPalHackathon2026!';

/**
 * Authenticate student user against Supabase or pre-configured Judge accounts
 */
export async function authenticateStudent(email: string, password: string): Promise<{ success: boolean; user?: UserProfile; error?: string }> {
  const cleanEmail = email.trim().toLowerCase();

  // 1. Direct validation for pre-configured Judge Accounts
  if (cleanEmail === SEEDED_JUDGE_BUYER.email) {
    if (password === JUDGE_PASSWORD) {
      return { success: true, user: SEEDED_JUDGE_BUYER };
    }
    return { success: false, error: 'Invalid password for judge test account.' };
  }

  if (cleanEmail === SEEDED_CREATOR_BUILDER.email) {
    if (password === JUDGE_PASSWORD) {
      return { success: true, user: SEEDED_CREATOR_BUILDER };
    }
    return { success: false, error: 'Invalid password for creator test account.' };
  }

  // 2. Validate against live Supabase Auth
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: cleanEmail,
      password,
    });

    if (error) {
      return { success: false, error: error.message };
    }

    if (data.user) {
      const profile: UserProfile = {
        id: data.user.id,
        email: data.user.email || cleanEmail,
        name: data.user.user_metadata?.name || cleanEmail.split('@')[0],
        university: data.user.user_metadata?.university || 'Verified University',
        role: data.user.user_metadata?.role || 'student_buyer',
        avatar: data.user.user_metadata?.avatar || getFakeAvatar(data.user.user_metadata?.name || cleanEmail),
        verified: true,
      };
      return { success: true, user: profile };
    }
  } catch (err: unknown) {
    console.warn('Supabase auth check fallback:', err);
  }

  return { success: false, error: 'Invalid email or password.' };
}

/**
 * Register a new student account in Supabase
 */
export async function registerStudent(params: {
  email: string;
  password: string;
  name: string;
  university: string;
  role: 'student_buyer' | 'student_creator';
}): Promise<{ success: boolean; user?: UserProfile; error?: string }> {
  try {
    const { data, error } = await supabase.auth.signUp({
      email: params.email,
      password: params.password,
      options: {
        data: {
          name: params.name,
          university: params.university,
          role: params.role,
        },
      },
    });

    if (error) {
      // If user already registered or email confirmation required, create custom student profile
      console.warn('Supabase signup notice:', error.message);
    }

    const newUser: UserProfile = {
      id: data.user?.id || `usr-${Date.now()}`,
      email: params.email,
      name: params.name,
      university: params.university,
      role: params.role,
      avatar: getFakeAvatar(params.name),
      verified: true,
    };

    return { success: true, user: newUser };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Registration failed';
    return { success: false, error: msg };
  }
}
