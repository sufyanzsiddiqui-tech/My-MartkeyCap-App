import { createSupabaseServerClient } from "@/lib/supabase/server";
import { syncStripeSubscription } from "@/lib/syncStripeSubscription";

export async function getCurrentUser() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

export async function getUserSubscription() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { user: null, isPaid: false, status: "inactive" as const };

  const { data } = await supabase
    .from("subscriptions")
    .select("status, current_period_end, updated_at")
    .eq("user_id", user.id)
    .maybeSingle();

  let status = data?.status ?? "inactive";
  let isPaid = status === "active" || status === "trialing";

  // If we don't already have an active sub locally, check Stripe directly so a
  // user who just paid (via Payment Link) gets unlocked without a webhook or
  // redirect handshake. Cap the lookup to avoid hammering Stripe on every load.
  if (!isPaid) {
    const lastUpdated = data?.updated_at ? new Date(data.updated_at).getTime() : 0;
    const stale = Date.now() - lastUpdated > 30_000; // re-check every 30s while inactive
    if (stale) {
      try {
        const synced = await syncStripeSubscription(user.id, user.email ?? null);
        status = synced.status;
        isPaid = status === "active" || status === "trialing";
      } catch (e) {
        console.error("[sync] stripe lookup failed", e);
      }
    }
  }

  return { user, isPaid, status };
}

export async function getUserWatchlist(): Promise<string[]> {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];
  const { data } = await supabase
    .from("watchlist_items")
    .select("symbol")
    .order("added_at", { ascending: false });
  return (data ?? []).map((r) => r.symbol);
}
