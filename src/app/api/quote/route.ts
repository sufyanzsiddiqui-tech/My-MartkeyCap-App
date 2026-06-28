import { NextResponse } from "next/server";
import { fetchQuote, type FinnhubQuote } from "@/lib/finnhub";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const symbolsParam = searchParams.get("symbols");
  if (!symbolsParam) {
    return NextResponse.json({ error: "symbols query param required" }, { status: 400 });
  }
  const symbols = symbolsParam.split(",").map((s) => s.trim()).filter(Boolean);

  const results = await Promise.all(
    symbols.map(async (symbol) => {
      try {
        const quote = await fetchQuote(symbol);
        return [symbol, quote] as const;
      } catch {
        return [symbol, null] as const;
      }
    })
  );

  const quotes: Record<string, FinnhubQuote | null> = {};
  for (const [symbol, quote] of results) quotes[symbol] = quote;
  return NextResponse.json({ quotes });
}
