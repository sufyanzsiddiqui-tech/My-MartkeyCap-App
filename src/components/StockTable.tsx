"use client";

import { ArrowDown, ArrowUp, ChevronsUpDown } from "lucide-react";
import { useRouter } from "next/navigation";
import { metaFor, fmtMoney } from "@/lib/mock-data";
import { useLiveQuotes } from "@/lib/useLiveQuotes";
import { StockLogo } from "./StockLogo";

const columns = ["Name Stock", "Volume", "Change", "Price/stock"];

export function StockTable({
  symbols,
  heading = "My Stock",
}: {
  symbols: string[];
  heading?: string;
}) {
  const { quotes, loading } = useLiveQuotes(symbols);
  const router = useRouter();

  if (symbols.length === 0) return null;

  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 dark:border-[var(--border)] dark:bg-[var(--surface)]">
      <h3 className="text-base font-semibold">{heading}</h3>

      <div className="mt-4 overflow-x-auto">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead>
            <tr className="text-xs font-medium text-[var(--text-subtle)]">
              {columns.map((col) => (
                <th key={col} className="pb-3 pr-4 font-medium">
                  <span className="flex items-center gap-1">
                    {col}
                    <ChevronsUpDown size={12} />
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {symbols.map((symbol) => {
              const m = metaFor(symbol);
              const q = quotes[symbol];
              const changePct = q?.dp ?? 0;
              const price = q?.c;
              const isUp = changePct >= 0;
              return (
                <tr
                  key={symbol}
                  onClick={() => router.push(`/stock/${symbol}`)}
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
                  <td className="py-4 pr-4 text-[var(--text-muted)] dark:text-[var(--text-subtle)]">
                    {q?.h && q?.l ? `H ${q.h.toFixed(2)} / L ${q.l.toFixed(2)}` : "—"}
                  </td>
                  <td className="py-4 pr-4">
                    <span
                      className={`flex w-fit items-center gap-1 rounded-full px-2 py-1 text-xs font-semibold ${
                        isUp
                          ? "bg-[var(--success-bg)] text-[var(--success-fg)]"
                          : "bg-[var(--danger-bg)] text-[var(--danger-fg)]"
                      }`}
                    >
                      {isUp ? <ArrowUp size={12} /> : <ArrowDown size={12} />}
                      {Math.abs(changePct).toFixed(2)}%
                    </span>
                  </td>
                  <td className="py-4 pr-4 font-semibold">
                    {price != null ? fmtMoney(price) : loading ? "—" : "n/a"}
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
