import { NextResponse } from "next/server";
import { fetchCompanyNews } from "@/lib/finnhub";

function ymd(d: Date) {
  return d.toISOString().slice(0, 10);
}

export async function GET(
  _req: Request,
  ctx: { params: Promise<{ symbol: string }> }
) {
  const { symbol } = await ctx.params;
  const to = new Date();
  const from = new Date();
  from.setDate(to.getDate() - 14);

  try {
    const news = await fetchCompanyNews(symbol, ymd(from), ymd(to));
    return NextResponse.json({ news: news.slice(0, 20) });
  } catch (e) {
    return NextResponse.json(
      { news: [], error: e instanceof Error ? e.message : "fetch_failed" },
      { status: 200 }
    );
  }
}
