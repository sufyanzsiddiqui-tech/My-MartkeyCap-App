import { NextResponse } from "next/server";

// Proxies CoinGecko's public markets endpoint (no API key required, free tier).
export async function GET() {
  try {
    const res = await fetch(
      "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=8&page=1&price_change_percentage=24h",
      { next: { revalidate: 30 } }
    );
    if (!res.ok) {
      return NextResponse.json({ coins: [], error: `HTTP ${res.status}` });
    }
    const data = await res.json();
    const coins = (Array.isArray(data) ? data : []).map((c: {
      id: string; symbol: string; name: string; image: string;
      current_price: number; price_change_percentage_24h: number;
    }) => ({
      id: c.id,
      symbol: c.symbol.toUpperCase(),
      name: c.name,
      image: c.image,
      price: c.current_price,
      changePct: c.price_change_percentage_24h ?? 0,
    }));
    return NextResponse.json({ coins });
  } catch (e) {
    return NextResponse.json(
      { coins: [], error: e instanceof Error ? e.message : "fetch_failed" },
      { status: 200 }
    );
  }
}
