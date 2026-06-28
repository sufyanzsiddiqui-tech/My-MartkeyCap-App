"use client";

import Link from "next/link";
import { useRef } from "react";
import { ArrowDown, ArrowUp, ChevronLeft, ChevronRight } from "lucide-react";
import { metaFor, fmtMoney } from "@/lib/mock-data";
import { useLiveQuotes } from "@/lib/useLiveQuotes";
import { StockLogo } from "./StockLogo";

export function StockSummaryCards({
  symbols,
  heading = "Watchlist",
  sortBy,
  limit,
}: {
  symbols: string[];
  heading?: string;
  sortBy?: "changeDesc" | "changeAsc";
  limit?: number;
}) {
  const { quotes, loading } = useLiveQuotes(symbols);
  const scrollerRef = useRef<HTMLDivElement>(null);

  let displaySymbols = symbols;
  if (sortBy) {
    displaySymbols = [...symbols].sort((a, b) => {
      const da = quotes[a]?.dp ?? 0;
      const db = quotes[b]?.dp ?? 0;
      return sortBy === "changeDesc" ? db - da : da - db;
    });
  }
  if (limit != null) displaySymbols = displaySymbols.slice(0, limit);

  function scrollBy(dir: 1 | -1) {
    scrollerRef.current?.scrollBy({ left: dir * 260, behavior: "smooth" });
  }

  if (symbols.length === 0) return null;

  return (
    <div className="relative">
      <div className="flex items-center justify-between pb-3">
        <h2 className="text-sm font-semibold text-[var(--text-muted)] dark:text-[var(--text-subtle)]">
          {heading}
        </h2>
        <div className="flex gap-2">
          <button
            onClick={() => scrollBy(-1)}
            aria-label="Scroll left"
            className="flex h-8 w-8 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--surface)] text-[var(--text-muted)] hover:text-[var(--text)] dark:border-[var(--border)] dark:bg-[var(--surface)] dark:hover:text-white"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            onClick={() => scrollBy(1)}
            aria-label="Scroll right"
            className="flex h-8 w-8 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--surface)] text-[var(--text-muted)] hover:text-[var(--text)] dark:border-[var(--border)] dark:bg-[var(--surface)] dark:hover:text-white"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      <div
        ref={scrollerRef}
        className="flex gap-4 overflow-x-auto scroll-smooth pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {displaySymbols.map((symbol) => {
          const m = metaFor(symbol);
          const q = quotes[symbol];
          const price = q?.c;
          const changePct = q?.dp ?? 0;
          const isUp = changePct >= 0;

          return (
            <Link
              key={symbol}
              href={`/stock/${symbol}`}
              className="min-w-[230px] shrink-0 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 transition-shadow hover:shadow-md dark:border-[var(--border)] dark:bg-[var(--surface)]"
            >
              <div className="flex items-center gap-3">
                <StockLogo symbol={m.symbol} bg={m.logoBg} />
                <div>
                  <p className="text-sm font-semibold">{m.symbol}</p>
                  <p className="text-xs text-[var(--text-subtle)] dark:text-[var(--text-muted)]">{m.name}</p>
                </div>
              </div>
              <p className="mt-4 text-2xl font-semibold tracking-tight">
                {price != null ? fmtMoney(price) : loading ? "—" : "n/a"}
              </p>
              <p
                className={`mt-1 flex items-center gap-1 text-xs font-medium ${
                  isUp ? "text-[var(--success-fg)]" : "text-[var(--danger-fg)]"
                }`}
              >
                {isUp ? <ArrowUp size={12} /> : <ArrowDown size={12} />}
                {Math.abs(changePct).toFixed(2)}% today
              </p>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
