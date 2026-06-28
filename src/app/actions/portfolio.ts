"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase/server";

async function isPaidUser(userId: string) {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("subscriptions")
    .select("status")
    .eq("user_id", userId)
    .maybeSingle();
  const status = data?.status ?? "inactive";
  return status === "active" || status === "trialing";
}

export async function addHolding(
  symbol: string,
  shares: number,
  buyPrice: number
) {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "not_authenticated" };

  if (!(await isPaidUser(user.id))) return { error: "subscription_required" };

  if (!Number.isFinite(shares) || shares <= 0) return { error: "Shares must be > 0" };
  if (!Number.isFinite(buyPrice) || buyPrice < 0) return { error: "Buy price must be ≥ 0" };

  const { error } = await supabase.from("portfolio_holdings").insert({
    user_id: user.id,
    symbol: symbol.toUpperCase(),
    shares,
    buy_price: buyPrice,
  });
  if (error) return { error: error.message };

  revalidatePath("/");
  revalidatePath(`/stock/${symbol.toUpperCase()}`);
  return { ok: true };
}

export async function removeHolding(id: string) {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "not_authenticated" };

  const { error } = await supabase
    .from("portfolio_holdings")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);
  if (error) return { error: error.message };

  revalidatePath("/");
  return { ok: true };
}

export async function removeAllOfSymbol(symbol: string) {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "not_authenticated" };

  const { error } = await supabase
    .from("portfolio_holdings")
    .delete()
    .eq("user_id", user.id)
    .eq("symbol", symbol.toUpperCase());
  if (error) return { error: error.message };

  revalidatePath("/");
  revalidatePath(`/stock/${symbol.toUpperCase()}`);
  return { ok: true };
}
