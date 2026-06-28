import { createSupabaseServerClient } from "@/lib/supabase/server";

export type Lot = {
  id: string;
  shares: number;
  buy_price: number;
  bought_at: string;
};

export type Holding = {
  symbol: string;
  totalShares: number;
  avgBuyPrice: number;
  totalCost: number;
  lots: Lot[];
};

export async function getUserPortfolio(): Promise<Holding[]> {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];

  const { data } = await supabase
    .from("portfolio_holdings")
    .select("id, symbol, shares, buy_price, bought_at")
    .order("bought_at", { ascending: false });

  if (!data) return [];

  const bySymbol = new Map<string, Holding>();
  for (const row of data) {
    const shares = Number(row.shares);
    const price = Number(row.buy_price);
    const existing = bySymbol.get(row.symbol);
    const lot: Lot = {
      id: row.id,
      shares,
      buy_price: price,
      bought_at: row.bought_at,
    };

    if (!existing) {
      bySymbol.set(row.symbol, {
        symbol: row.symbol,
        totalShares: shares,
        totalCost: shares * price,
        avgBuyPrice: price,
        lots: [lot],
      });
    } else {
      existing.totalShares += shares;
      existing.totalCost += shares * price;
      existing.avgBuyPrice = existing.totalCost / existing.totalShares;
      existing.lots.push(lot);
    }
  }

  return Array.from(bySymbol.values());
}
