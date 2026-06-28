import { createClient } from "@supabase/supabase-js";

// Server-only client that uses the service role key. Bypasses RLS.
// Use only in trusted server contexts (e.g. Stripe webhook).
export function createSupabaseAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false, autoRefreshToken: false } }
  );
}
