import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Only create the client if we have the environment variables
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('⚠️ Supabase environment variables are missing. Using fallback values which will likely fail. Please check your .env file or environment configuration.');
}

// Log whether we're using actual or fallback configuration
console.log(`Initializing Supabase client with ${!supabaseUrl ? 'FALLBACK' : 'CONFIGURED'} URL and ${!supabaseAnonKey ? 'FALLBACK' : 'CONFIGURED'} key`);

export const supabase = createClient(
  supabaseUrl || 'https://your-project.supabase.co',
  supabaseAnonKey || 'your-anon-key',
  {
    auth: {
      autoRefreshToken: true,
      persistSession: true
    }
  }
);

// Basic connectivity test
async function testSupabaseConnection() {
  try {
    const { error } = await supabase.from('question_categories').select('count').limit(1);
    if (error) {
      console.error('❌ Supabase connection test failed:', error.message);
      return false;
    }
    console.log('✅ Supabase connection test successful');
    return true;
  } catch (err) {
    console.error('❌ Supabase connection test failed with exception:', err);
    return false;
  }
}

// Check if we're in a browser environment before initializing auth
if (typeof window !== 'undefined') {
  // Get the initial session
  supabase.auth.getSession().then(({ data, error }) => {
    if (error) {
      console.error('Error getting auth session:', error);
    } else if (data && data.session) {
      console.log('Auth session loaded successfully');
    }
  });
  
  // Test connection when browser loads
  testSupabaseConnection().then(isConnected => {
    if (!isConnected) {
      console.warn('Application may not function correctly due to database connectivity issues.');
    }
  });
}