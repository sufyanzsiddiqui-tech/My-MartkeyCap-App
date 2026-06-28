"use client";

import { useEffect, useState } from "react";
import type { FinnhubQuote } from "./finnhub";

export type Quotes = Record<string, FinnhubQuote | null>;

export function useLiveQuotes(symbols: string[], intervalMs = 15000) {
  const [quotes, setQuotes] = useState<Quotes>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (symbols.length === 0) return;
    let cancelled = false;

    async function load() {
      try {
        const res = await fetch(`/api/quote?symbols=${symbols.join(",")}`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        if (!cancelled) {
          setQuotes(data.quotes);
          setError(null);
        }
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : "fetch failed");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    const id = setInterval(load, intervalMs);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, [symbols.join(","), intervalMs]); // eslint-disable-line react-hooks/exhaustive-deps

  return { quotes, loading, error };
}
