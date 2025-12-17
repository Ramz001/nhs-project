import { createClient } from "@supabase/supabase-js";
import "expo-sqlite/localStorage/install";

const supabaseUrl = process.env.SUPABASE_URL || "";
const supabasePublishableKey =
  process.env.SUPABASE_PUBLISHABLE_DEFAULT_KEY || "";

export const supabase = createClient(supabaseUrl, supabasePublishableKey, {
  auth: {
    storage: localStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
