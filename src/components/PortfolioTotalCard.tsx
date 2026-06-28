"use client";

import { MoreVertical, Sparkles } from "lucide-react";
import { useLiveQuotes } from "@/lib/useLiveQuotes";
import { fmtMoney } from "@/lib/mock-data";
import type { Holding } from "@/lib/getPortfolio";

export function PortfolioTotalCard({ holdings }: { holdings: Holding[] }) {
  const { quotes, loading } = useLiveQuotes(holdings.map((h) => h.symbol));

  let marketValue = 0;
  let totalCost = 0;
  let hasAnyQuote = false;
  for (const h of holdings) {
    const q = quotes[h.symbol];
    if (q?.c != null) {
      marketValue += q.c * h.totalShares;
      hasAnyQuote = true;
    } else {
      marketValue += h.avgBuyPrice * h.totalShares; // fallback to cost basis
    }
    totalCost += h.totalCost;
  }
  const pnl = marketValue - totalCost;
  const pnlPct = totalCost > 0 ? (pnl / totalCost) * 100 : 0;
  const isUp = pnl >= 0;
  const empty = holdings.length === 0;

  return (
    <div className="flex flex-1 flex-col rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 dark:border-[var(--border)] dark:bg-[var(--surface)]">
      <div className="flex items-start justify-between">
        <h3 className="text-base font-semibold">Total Value</h3>
        <button className="text-[var(--text-subtle)] hover:text-[var(--text)] dark:hover:text-white">
          <MoreVertical size={16} />
        </button>
      </div>

      <div className="mt-3 flex items-center gap-3">
        <p className="text-4xl font-semibold tracking-tight">
          {empty ? "$0.00" : fmtMoney(marketValue)}
        </p>
        {!empty && (
          <span
            className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
              isUp
                ? "bg-[var(--success-bg)] text-[var(--success-fg)]"
                : "bg-[var(--danger-bg)] text-[var(--danger-fg)]"
            }`}
          >
            {isUp ? "▲" : "▼"} {Math.abs(pnlPct).toFixed(2)}%
          </span>
        )}
      </div>

      {empty ? (
        <p className="mt-3 text-sm text-[var(--text-muted)] dark:text-[var(--text-subtle)]">
          You haven&apos;t added any holdings yet. Open a stock and tap{" "}
          <span className="font-medium">Add to portfolio</span>.
        </p>
      ) : (
        <p className="mt-3 text-sm text-[var(--text-muted)] dark:text-[var(--text-subtle)]">
          Cost basis {fmtMoney(totalCost)} ·{" "}
          <span className={isUp ? "text-[var(--success-fg)]" : "text-[var(--danger-fg)]"}>
            {isUp ? "+" : ""}
            {fmtMoney(pnl)} unrealized
          </span>
          {!hasAnyQuote && !loading && " (live prices unavailable)"}
        </p>
      )}

      <div className="mt-5 flex flex-wrap items-center gap-2">
        <button className="rounded-full border border-[var(--border)] px-4 py-2 text-sm font-medium text-[var(--text)] hover:bg-[var(--surface-hover)] dark:border-[var(--border)] dark:text-[var(--text)] dark:hover:bg-[var(--surface-hover)]">
          Worst Performance
        </button>
        <button className="rounded-full bg-[var(--primary)] px-4 py-2 text-sm font-medium text-white hover:bg-[var(--primary-hover)]">
          Top Performance
        </button>
      </div>

      <button className="mt-5 flex items-center justify-between gap-3 rounded-2xl bg-[var(--primary-soft)] px-4 py-3 text-left text-sm font-medium text-[var(--primary-soft-fg)] hover:bg-[var(--primary-soft-hover)] dark:bg-[var(--primary-soft)] dark:text-[var(--primary-soft-fg)] dark:hover:bg-[var(--primary-soft-hover)]">
        <span className="flex items-center gap-2">
          <Sparkles size={14} />
          Here&apos;s to improve your portfolio and understanding how investing works.
        </span>
        <span>›</span>
      </button>
    </div>
  );
}
