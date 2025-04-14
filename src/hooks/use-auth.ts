import { create } from 'zustand';
import { useMutation } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { User } from '@supabase/supabase-js';
import { InsertUser } from '@/shared/schema';

interface AuthState {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  setUser: (user: User | null) => void;
}

const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: true,
  signIn: async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
  },
  signUp: async (email: string, password: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
    });
    if (error) throw error;
  },
  signOut: async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    set({ user: null });
  },
  resetPassword: async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    if (error) throw error;
  },
  setUser: (user) => set({ user, loading: false }),
}));

// Initialize auth state - moved inside a function to avoid React hooks rules violation
function initializeAuth() {
  const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
    useAuthStore.getState().setUser(session?.user ?? null);
  });
  
  // Return cleanup function
  return () => {
    subscription.unsubscribe();
  };
}

// Call the initialization function
initializeAuth();

export function useAuth() {
  const { user, loading, signOut, resetPassword } = useAuthStore();

  const loginMutation = useMutation({
    mutationFn: async (credentials: Pick<InsertUser, "email" | "password">) => {
      const { error } = await supabase.auth.signInWithPassword({
        email: credentials.email,
        password: credentials.password,
      });
      if (error) throw error;
    },
  });

  const registerMutation = useMutation({
    mutationFn: async (userData: InsertUser) => {
      const { error } = await supabase.auth.signUp({
        email: userData.email,
        password: userData.password,
        options: {
          data: {
            full_name: userData.fullName,
            phone_number: userData.phoneNumber,
            passing_year: userData.passingYear,
            is_nsat_registered: userData.isNsatRegistered,
          },
        },
      });
      if (error) throw error;
    },
  });

  const resetPasswordMutation = useMutation({
    mutationFn: async (email: string) => {
      await resetPassword(email);
    },
  });

  return {
    user,
    loading,
    signOut,
    loginMutation,
    registerMutation,
    resetPasswordMutation,
  };
}