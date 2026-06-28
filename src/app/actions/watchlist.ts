"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function addToWatchlist(symbol: string) {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "not_authenticated" };

  // Check subscription
  const { data: sub } = await supabase
    .from("subscriptions")
    .select("status")
    .eq("user_id", user.id)
    .maybeSingle();

  const isPaid = sub?.status === "active" || sub?.status === "trialing";
  if (!isPaid) return { error: "subscription_required" };

  const { error } = await supabase
    .from("watchlist_items")
    .insert({ user_id: user.id, symbol: symbol.toUpperCase() });

  if (error && !error.message.includes("duplicate")) return { error: error.message };
  revalidatePath("/");
  revalidatePath(`/stock/${symbol.toUpperCase()}`);
  return { ok: true };
}

export async function removeFromWatchlist(symbol: string) {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "not_authenticated" };

  const { error } = await supabase
    .from("watchlist_items")
    .delete()
    .eq("user_id", user.id)
    .eq("symbol", symbol.toUpperCase());

  if (error) return { error: error.message };
  revalidatePath("/");
  revalidatePath(`/stock/${symbol.toUpperCase()}`);
  return { ok: true };
}
