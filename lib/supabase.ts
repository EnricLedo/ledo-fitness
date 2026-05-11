import { createBrowserClient as createBrowserSupabaseClient } from "@supabase/ssr";
import type { Database } from "@/lib/types";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!;

// Cliente para Client Components (browser) — maneja cookies automáticamente
export function createBrowserClient() {
  return createBrowserSupabaseClient<Database>(supabaseUrl, supabaseKey);
}
