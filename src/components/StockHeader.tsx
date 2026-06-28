"use client";

import { useEffect, useState } from "react";
import { ArrowDown, ArrowUp } from "lucide-react";
import { useLiveQuotes } from "@/lib/useLiveQuotes";
import { fmtMoney } from "@/lib/mock-data";

type Profile = {
  name?: string;
  logo?: string;
  exchange?: string;
  finnhubIndustry?: string;
  weburl?: string;
};

export function StockHeader({ symbol }: { symbol: string }) {
  const { quotes, loading } = useLiveQuotes([symbol]);
  const q = quotes[symbol];
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    fetch(`/api/profile/${symbol}`)
      .then((r) => r.json())
      .then((d) => setProfile(d.profile))
      .catch(() => setProfile(null));
  }, [symbol]);

  const changePct = q?.dp ?? 0;
  const isUp = changePct >= 0;

  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 dark:border-[var(--border)] dark:bg-[var(--surface)]">
      <div className="flex items-start gap-4">
        {profile?.logo ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={profile.logo} alt="" className="h-12 w-12 rounded-full bg-[var(--surface)] object-contain p-1 ring-1 ring-[#ececf1] dark:ring-[#1f2230]" />
        ) : (
          <div className="h-12 w-12 rounded-full bg-[var(--bg)] dark:bg-[var(--surface-hover)]" />
        )}
        <div className="flex-1">
          <div className="flex items-baseline gap-3">
            <h1 className="text-2xl font-semibold">{symbol}</h1>
            <span className="text-sm text-[var(--text-muted)] dark:text-[var(--text-subtle)]">
              {profile?.name || ""}
            </span>
          </div>
          <p className="text-xs text-[var(--text-subtle)]">
            {profile?.exchange}{profile?.finnhubIndustry ? ` · ${profile.finnhubIndustry}` : ""}
          </p>
        </div>
      </div>

      <div className="mt-6 flex items-baseline gap-3">
        <p className="text-4xl font-semibold tracking-tight">
          {q?.c != null ? fmtMoney(q.c) : loading ? "—" : "n/a"}
        </p>
        <p className={`flex items-center gap-1 text-sm font-medium ${isUp ? "text-[var(--success-fg)]" : "text-[var(--danger-fg)]"}`}>
          {isUp ? <ArrowUp size={14} /> : <ArrowDown size={14} />}
          {q?.d != null ? `${q.d >= 0 ? "+" : ""}${q.d.toFixed(2)}` : "—"} ({Math.abs(changePct).toFixed(2)}%)
        </p>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-4 text-sm sm:grid-cols-4">
        <Stat label="Open"  value={q?.o} />
        <Stat label="High"  value={q?.h} />
        <Stat label="Low"   value={q?.l} />
        <Stat label="Prev Close" value={q?.pc} />
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value?: number }) {
  return (
    <div>
      <p className="text-xs text-[var(--text-subtle)]">{label}</p>
      <p className="mt-0.5 font-semibold">{value != null ? fmtMoney(value) : "—"}</p>
    </div>
  );
}
