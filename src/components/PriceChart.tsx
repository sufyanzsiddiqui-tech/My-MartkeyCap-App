"use client";

import { useEffect, useState } from "react";
import {
  Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis,
} from "recharts";
import { useTheme } from "./ThemeProvider";
import { fmtMoney } from "@/lib/mock-data";

type Range = "1D" | "1W" | "1M" | "1Y";
type Point = { t: number; price: number };

const RANGES: Range[] = ["1D", "1W", "1M", "1Y"];

export function PriceChart({ symbol }: { symbol: string }) {
  const [range, setRange] = useState<Range>("1M");
  const [points, setPoints] = useState<Point[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { theme } = useTheme();

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    fetch(`/api/candles/${symbol}?range=${range}`)
      .then((r) => r.json())
      .then((d) => {
        if (cancelled) return;
        if (d.error) setError(d.error);
        setPoints(d.points || []);
      })
      .catch((e) => !cancelled && setError(String(e)))
      .finally(() => !cancelled && setLoading(false));
    return () => { cancelled = true; };
  }, [symbol, range]);

  const isDark = theme === "dark";
  const gridColor = isDark ? "#1e293b" : "#eef0f4";
  const tickColor = isDark ? "#64748b" : "#94a3b8";
  const firstPrice = points[0]?.price;
  const lastPrice = points[points.length - 1]?.price;
  const isUp = (lastPrice ?? 0) >= (firstPrice ?? 0);
  const stroke = isUp ? "#16a34a" : "#dc2626";

  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 dark:border-[var(--border)] dark:bg-[var(--surface)]">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-semibold">Performance</h3>
        <div className="flex rounded-full border border-[var(--border)] p-1 text-xs font-medium dark:border-[var(--border)]">
          {RANGES.map((r) => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className={`rounded-full px-3 py-1 ${
                range === r
                  ? "bg-[var(--primary)] text-white"
                  : "text-[var(--text-muted)] hover:text-[var(--text)] dark:text-[var(--text-subtle)] dark:hover:text-white"
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6 h-72 w-full">
        {loading ? (
          <div className="flex h-full items-center justify-center text-sm text-[var(--text-subtle)]">
            Loading chart…
          </div>
        ) : error || points.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center text-sm text-[var(--text-subtle)]">
            <p>Historical candles aren&apos;t available for this symbol on the free Finnhub tier.</p>
            <p className="mt-1 text-xs">Live quote still updates above.</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={points} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <defs>
                <linearGradient id="priceFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={stroke} stopOpacity={0.3} />
                  <stop offset="100%" stopColor={stroke} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} strokeDasharray="4 4" stroke={gridColor} />
              <XAxis
                dataKey="t"
                tickFormatter={(t) =>
                  range === "1D"
                    ? new Date(t).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
                    : new Date(t).toLocaleDateString([], { month: "short", day: "numeric" })
                }
                tickLine={false} axisLine={false} tick={{ fill: tickColor, fontSize: 12 }}
                minTickGap={40}
              />
              <YAxis
                domain={["auto", "auto"]} tickLine={false} axisLine={false}
                tick={{ fill: tickColor, fontSize: 12 }} tickFormatter={(v) => `$${v.toFixed(0)}`}
              />
              <Tooltip
                contentStyle={{
                  borderRadius: 12,
                  border: `1px solid ${gridColor}`,
                  background: isDark ? "#0f1626" : "#fff",
                  color: isDark ? "#e2e8f0" : "#0f172a",
                  fontSize: 12,
                }}
                labelFormatter={(t) => new Date(t).toLocaleString()}
                formatter={(v) => [fmtMoney(Number(v)), "Price"]}
              />
              <Area type="monotone" dataKey="price" stroke={stroke} strokeWidth={2} fill="url(#priceFill)" />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
