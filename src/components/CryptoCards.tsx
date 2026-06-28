"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowDown, ArrowUp, ChevronLeft, ChevronRight } from "lucide-react";
import { fmtMoney } from "@/lib/mock-data";

type Coin = {
  id: string;
  symbol: string;
  name: string;
  image: string;
  price: number;
  changePct: number;
};

export function CryptoCards() {
  const [coins, setCoins] = useState<Coin[]>([]);
  const [loading, setLoading] = useState(true);
  const scrollerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const res = await fetch("/api/crypto");
        const data = await res.json();
        if (!cancelled) setCoins(data.coins || []);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    const id = setInterval(load, 30_000);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, []);

  function scrollBy(dir: 1 | -1) {
    scrollerRef.current?.scrollBy({ left: dir * 260, behavior: "smooth" });
  }

  return (
    <div className="relative">
      <div className="flex items-center justify-between pb-3">
        <h2 className="text-sm font-semibold text-[var(--text-muted)] dark:text-[var(--text-subtle)]">
          Top Crypto
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
        {loading && coins.length === 0
          ? Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="min-w-[230px] shrink-0 animate-pulse rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 dark:border-[var(--border)] dark:bg-[var(--surface)]"
              >
                <div className="h-10 w-10 rounded-full bg-[var(--bg)] dark:bg-[var(--surface-hover)]" />
                <div className="mt-4 h-6 w-24 rounded bg-[var(--bg)] dark:bg-[var(--surface-hover)]" />
              </div>
            ))
          : coins.map((c) => {
              const isUp = c.changePct >= 0;
              return (
                <div
                  key={c.id}
                  className="min-w-[230px] shrink-0 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 dark:border-[var(--border)] dark:bg-[var(--surface)]"
                >
                  <div className="flex items-center gap-3">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={c.image}
                      alt={c.name}
                      className="h-10 w-10 rounded-full"
                    />
                    <div>
                      <p className="text-sm font-semibold">{c.symbol}</p>
                      <p className="text-xs text-[var(--text-subtle)] dark:text-[var(--text-muted)]">
                        {c.name}
                      </p>
                    </div>
                  </div>
                  <p className="mt-4 text-2xl font-semibold tracking-tight">
                    {fmtMoney(c.price)}
                  </p>
                  <p
                    className={`mt-1 flex items-center gap-1 text-xs font-medium ${
                      isUp ? "text-[var(--success-fg)]" : "text-[var(--danger-fg)]"
                    }`}
                  >
                    {isUp ? <ArrowUp size={12} /> : <ArrowDown size={12} />}
                    {Math.abs(c.changePct).toFixed(2)}% 24h
                  </p>
                </div>
              );
            })}
      </div>
    </div>
  );
}
