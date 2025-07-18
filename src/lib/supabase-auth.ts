import { AuthError, User } from '@supabase/supabase-js';
import { supabase } from './supabase';

// Sign in with email and password
export const signIn = async (email: string, password: string) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return { user: null, error: error.message };
    }

    return { user: data.user, error: null };
  } catch (error: unknown) {
    const authError = error as AuthError;
    return { user: null, error: authError.message };
  }
};

// Sign up with email and password
export const signUp = async (email: string, password: string) => {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      return { user: null, error: error.message };
    }

    return { user: data.user, error: null };
  } catch (error: unknown) {
    const authError = error as AuthError;
    return { user: null, error: authError.message };
  }
};

// Sign out
export const signOutUser = async () => {
  try {
    const { error } = await supabase.auth.signOut();

    if (error) {
      return { error: error.message };
    }

    // Clear localStorage
    if (typeof window !== 'undefined') {
      localStorage.removeItem('supabase.auth.token');
      // Clear other auth-related data
      Object.keys(localStorage).forEach((key) => {
        if (key.startsWith('supabase.auth.') || key.startsWith('sb-')) {
          localStorage.removeItem(key);
        }
      });
    }

    return { error: null };
  } catch (error: unknown) {
    const authError = error as AuthError;
    return { error: authError.message };
  }
};

// Get current user
export const getCurrentUser = async (): Promise<User | null> => {
  try {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error) {
      return null;
    }

    return user;
  } catch (error: unknown) {
    if (error instanceof AuthError) {
      return null;
    }
    return null;
  }
};

// Validate user from localStorage and check token expiry
export const validateUserFromLocalStorage = async (): Promise<{
  user: User | null;
  needsRefresh: boolean;
}> => {
  try {
    // Check localStorage first
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      return { user: null, needsRefresh: true };
    }

    const user = JSON.parse(storedUser) as User;

    // Get current session to check token validity
    const {
      data: { session },
      error,
    } = await supabase.auth.getSession();

    if (error) {
      return { user: null, needsRefresh: true };
    }

    if (session && session.user.id === user.id) {
      // Check if token is expired or will expire soon (within 5 minutes)
      const expiresAt = session.expires_at;
      const now = Math.floor(Date.now() / 1000);
      const fiveMinutes = 5 * 60;

      if (expiresAt && expiresAt - now > fiveMinutes) {
        return { user: session.user, needsRefresh: false };
      } else {
        return { user: session.user, needsRefresh: true };
      }
    }
    return { user: null, needsRefresh: true };
  } catch (error: unknown) {
    if (error instanceof AuthError) {
      return { user: null, needsRefresh: true };
    }
    return { user: null, needsRefresh: true };
  }
};

// Check if user session is valid and refresh if needed
export const checkAndRefreshSession = async () => {
  try {
    const {
      data: { session },
      error,
    } = await supabase.auth.getSession();

    if (error) {
      return { user: null, error: error.message };
    }

    if (session) {
      return { user: session.user, error: null };
    }

    return { user: null, error: null };
  } catch (error: unknown) {
    const authError = error as AuthError;
    return { user: null, error: authError.message };
  }
};

// Reset password
export const resetPassword = async (email: string) => {
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    if (error) {
      return { error: error.message };
    }

    return { error: null };
  } catch (error: unknown) {
    const authError = error as AuthError;
    return { error: authError.message };
  }
};

// Sign in with Google
export const signInWithGoogle = async () => {
  try {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    if (error) {
      return { user: null, error: error.message };
    }

    // Supabase OAuth sẽ redirect, không trả về user ngay lập tức
    // Kiểm tra email sau khi redirect về
    return { user: null, error: null };
  } catch (error: unknown) {
    const authError = error as AuthError;
    return { user: null, error: authError.message };
  }
};

// Validate allowed email (chỉ cho phép email cụ thể)
export const validateAllowedEmail = (email: string | undefined): boolean => {
  const allowedEmail = 'tranthanhloc130600@gmail.com';
  return email === allowedEmail;
};

// Listen to auth changes
export const onAuthStateChange = (callback: (user: User | null) => void) => {
  return supabase.auth.onAuthStateChange((event, session) => {
    callback(session?.user ?? null);
  });
};
