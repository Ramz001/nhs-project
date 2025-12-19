import { createClient } from "@supabase/supabase-js";
import "expo-sqlite/localStorage/install";
import { supabaseUrl, supabaseAnonKey } from "@/constants/config";

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Supabase environment variables not set!");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: localStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
