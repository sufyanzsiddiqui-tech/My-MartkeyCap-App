import { NextResponse } from "next/server";
import { fetchCandles } from "@/lib/finnhub";

type Range = "1D" | "1W" | "1M" | "1Y";

function rangeParams(range: Range) {
  const now = Math.floor(Date.now() / 1000);
  const day = 86400;
  switch (range) {
    case "1D": return { resolution: "5",  from: now - day,        to: now };
    case "1W": return { resolution: "30", from: now - 7 * day,    to: now };
    case "1M": return { resolution: "60", from: now - 30 * day,   to: now };
    case "1Y": return { resolution: "D",  from: now - 365 * day,  to: now };
  }
}

export async function GET(
  req: Request,
  ctx: { params: Promise<{ symbol: string }> }
) {
  const { symbol } = await ctx.params;
  const range = (new URL(req.url).searchParams.get("range") || "1M") as Range;
  const { resolution, from, to } = rangeParams(range);

  try {
    const data = await fetchCandles(symbol, resolution, from, to);
    if (data.s !== "ok") {
      return NextResponse.json({ points: [], error: "no_data" });
    }
    const points = data.t.map((t, i) => ({ t: t * 1000, price: data.c[i] }));
    return NextResponse.json({ points });
  } catch (e) {
    return NextResponse.json(
      { points: [], error: e instanceof Error ? e.message : "fetch_failed" },
      { status: 200 }
    );
  }
}
