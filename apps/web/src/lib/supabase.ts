import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export function hasPublicSupabaseConfig() {
  return Boolean(supabaseUrl && supabaseAnonKey);
}

export function hasServerSupabaseConfig() {
  return Boolean(supabaseUrl && (supabaseServiceRoleKey || supabaseAnonKey));
}

export function hasServiceRoleSupabaseConfig() {
  return Boolean(supabaseUrl && supabaseServiceRoleKey);
}

export function createBrowserSupabaseClient() {
  if (!hasPublicSupabaseConfig() || !supabaseUrl || !supabaseAnonKey) {
    return null;
  }

  return createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: false
    }
  });
}

export function createServerSupabaseClient() {
  const serverKey = supabaseServiceRoleKey ?? supabaseAnonKey;

  if (!supabaseUrl || !serverKey) {
    return null;
  }

  return createClient(supabaseUrl, serverKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });
}
