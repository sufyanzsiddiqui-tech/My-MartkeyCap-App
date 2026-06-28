"use client";

import { useTransition } from "react";
import { ArrowDown, ArrowUp, ChevronsUpDown, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { metaFor, fmtMoney } from "@/lib/mock-data";
import { useLiveQuotes } from "@/lib/useLiveQuotes";
import { StockLogo } from "./StockLogo";
import { removeAllOfSymbol } from "@/app/actions/portfolio";
import type { Holding } from "@/lib/getPortfolio";

const columns = ["Name Stock", "Shares", "Avg Cost", "Current", "Market Value", "P&L", ""];

export function HoldingsTable({ holdings }: { holdings: Holding[] }) {
  const symbols = holdings.map((h) => h.symbol);
  const { quotes, loading } = useLiveQuotes(symbols);
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  if (holdings.length === 0) return null;

  function onRemove(e: React.MouseEvent, symbol: string) {
    e.stopPropagation();
    if (!confirm(`Remove all ${symbol} holdings from your portfolio?`)) return;
    startTransition(async () => {
      await removeAllOfSymbol(symbol);
      router.refresh();
    });
  }

  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 dark:border-[var(--border)] dark:bg-[var(--surface)]">
      <h3 className="text-base font-semibold">My Portfolio</h3>

      <div className="mt-4 overflow-x-auto">
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead>
            <tr className="text-xs font-medium text-[var(--text-subtle)]">
              {columns.map((col) => (
                <th key={col} className="pb-3 pr-4 font-medium">
                  {col && (
                    <span className="flex items-center gap-1">
                      {col}
                      <ChevronsUpDown size={12} />
                    </span>
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {holdings.map((h) => {
              const m = metaFor(h.symbol);
              const q = quotes[h.symbol];
              const current = q?.c;
              const marketValue = current != null ? current * h.totalShares : null;
              const pnl = marketValue != null ? marketValue - h.totalCost : null;
              const pnlPct = pnl != null && h.totalCost > 0 ? (pnl / h.totalCost) * 100 : null;
              const isUp = (pnl ?? 0) >= 0;

              return (
                <tr
                  key={h.symbol}
                  onClick={() => router.push(`/stock/${h.symbol}`)}
                  className="cursor-pointer border-t border-[var(--border-soft)] hover:bg-[var(--surface-hover)] dark:border-[var(--border)] dark:hover:bg-[var(--surface-hover)]"
                >
                  <td className="py-4 pr-4">
                    <div className="flex items-center gap-3">
                      <StockLogo symbol={m.symbol} bg={m.logoBg} size={32} />
                      <div>
                        <p className="font-semibold">{m.symbol}</p>
                        <p className="text-xs text-[var(--text-subtle)] dark:text-[var(--text-muted)]">{m.name}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 pr-4 font-medium">{h.totalShares.toLocaleString()}</td>
                  <td className="py-4 pr-4 text-[var(--text-muted)] dark:text-[var(--text-subtle)]">
                    {fmtMoney(h.avgBuyPrice)}
                  </td>
                  <td className="py-4 pr-4 font-medium">
                    {current != null ? fmtMoney(current) : loading ? "—" : "n/a"}
                  </td>
                  <td className="py-4 pr-4 font-semibold">
                    {marketValue != null ? fmtMoney(marketValue) : "—"}
                  </td>
                  <td className="py-4 pr-4">
                    {pnl != null ? (
                      <span
                        className={`flex w-fit items-center gap-1 rounded-full px-2 py-1 text-xs font-semibold ${
                          isUp ? "bg-[var(--success-bg)] text-[var(--success-fg)]" : "bg-[var(--danger-bg)] text-[var(--danger-fg)]"
                        }`}
                      >
                        {isUp ? <ArrowUp size={12} /> : <ArrowDown size={12} />}
                        {fmtMoney(Math.abs(pnl))} ({pnlPct?.toFixed(2)}%)
                      </span>
                    ) : (
                      "—"
                    )}
                  </td>
                  <td className="py-4 pr-2 text-right">
                    <button
                      onClick={(e) => onRemove(e, h.symbol)}
                      disabled={pending}
                      aria-label={`Remove ${h.symbol}`}
                      className="rounded-lg p-1.5 text-[var(--text-subtle)] hover:bg-[var(--danger-bg)] hover:text-[var(--danger-fg)] disabled:opacity-60 dark:hover:bg-[var(--danger-bg)]"
                    >
                      <Trash2 size={14} />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
