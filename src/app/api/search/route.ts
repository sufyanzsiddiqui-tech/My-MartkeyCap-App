import { NextResponse } from "next/server";
import { searchSymbols } from "@/lib/finnhub";

export async function GET(req: Request) {
  const q = new URL(req.url).searchParams.get("q")?.trim();
  if (!q) return NextResponse.json({ result: [] });
  const data = await searchSymbols(q);
  const result = data.result
    .filter((r) => r.type === "Common Stock" || r.type === "ETP" || r.type === "")
    .slice(0, 10);
  return NextResponse.json({ result });
}
