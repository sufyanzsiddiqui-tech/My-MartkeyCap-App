import { NextResponse } from "next/server";
import { fetchProfile } from "@/lib/finnhub";

export async function GET(
  _req: Request,
  ctx: { params: Promise<{ symbol: string }> }
) {
  const { symbol } = await ctx.params;
  try {
    const profile = await fetchProfile(symbol);
    return NextResponse.json({ profile });
  } catch (e) {
    return NextResponse.json(
      { profile: null, error: e instanceof Error ? e.message : "fetch_failed" },
      { status: 200 }
    );
  }
}
