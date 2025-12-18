import { createClient } from "@supabase/supabase-js";
import "expo-sqlite/localStorage/install";
import Constants from 'expo-constants';
const { supabaseUrl, supabaseKey } = Constants.expoConfig?.extra || {};

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Supabase environment variables not set!');
}

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    storage: localStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
