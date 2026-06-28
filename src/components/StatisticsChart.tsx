"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { statisticsData } from "@/lib/mock-data";
import { useTheme } from "./ThemeProvider";

export function StatisticsChart() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const gridColor = isDark ? "#1e293b" : "#eef0f4";
  const tickColor = isDark ? "#64748b" : "#94a3b8";
  const accent = isDark ? "#60a5fa" : "#2563eb";

  return (
    <div className="flex flex-[1.4] flex-col rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6">
      <h3 className="text-base font-semibold">Statistics</h3>
      <div className="mt-4 h-56 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={statisticsData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
            <defs>
              <linearGradient id="statFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={accent} stopOpacity={0.3} />
                <stop offset="100%" stopColor={accent} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} strokeDasharray="4 4" stroke={gridColor} />
            <XAxis
              dataKey="day"
              tickLine={false}
              axisLine={false}
              tick={{ fill: tickColor, fontSize: 12 }}
            />
            <YAxis
              tickFormatter={(v) => `${v / 1000}k`}
              tickLine={false}
              axisLine={false}
              tick={{ fill: tickColor, fontSize: 12 }}
            />
            <Tooltip
              contentStyle={{
                borderRadius: 12,
                border: `1px solid ${gridColor}`,
                background: isDark ? "#0f1626" : "#fff",
                color: isDark ? "#e2e8f0" : "#0f172a",
                fontSize: 12,
              }}
              formatter={(value) => [`$${Number(value).toLocaleString()}`, "Value"]}
            />
            <Area
              type="monotone"
              dataKey="value"
              stroke={accent}
              strokeWidth={2}
              fill="url(#statFill)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
