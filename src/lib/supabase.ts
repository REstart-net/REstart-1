import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Only create the client if we have the environment variables
if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase environment variables are missing. Please connect your Supabase project using the "Connect to Supabase" button in the top right corner.');
}

export const supabase = createClient(
  supabaseUrl || 'https://your-project.supabase.co',
  supabaseAnonKey || 'your-anon-key'
);

// Check if we're in a browser environment before initializing auth
if (typeof window !== 'undefined') {
  // Get the initial session
  supabase.auth.getSession().then(({ data }) => {
    if (data && data.session) {
      // We'll handle this in the auth hook initialization
    }
  });
}