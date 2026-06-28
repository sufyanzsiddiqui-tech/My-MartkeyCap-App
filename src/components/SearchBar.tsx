"use client";

import { Search, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

type Result = { symbol: string; description: string; displaySymbol: string };

export function SearchBar() {
  const [q, setQ] = useState("");
  const [results, setResults] = useState<Result[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const boxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!q.trim()) {
      setResults([]);
      return;
    }
    setLoading(true);
    const id = setTimeout(async () => {
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`);
        const data = await res.json();
        setResults(data.result || []);
      } finally {
        setLoading(false);
      }
    }, 250);
    return () => clearTimeout(id);
  }, [q]);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (boxRef.current && !boxRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  return (
    <div ref={boxRef} className="relative">
      <div className="flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--surface)] px-4 py-2 dark:border-[var(--border)] dark:bg-[var(--surface)]">
        <Search size={16} className="text-[var(--text-subtle)]" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onFocus={() => setOpen(true)}
          placeholder="Search stocks..."
          className="w-56 bg-transparent text-sm outline-none placeholder:text-[var(--text-subtle)]"
        />
        {q && (
          <button
            onClick={() => {
              setQ("");
              setResults([]);
            }}
            className="text-[var(--text-subtle)] hover:text-[var(--text)] dark:hover:text-white"
          >
            <X size={14} />
          </button>
        )}
      </div>

      {open && q && (
        <div className="absolute right-0 z-50 mt-2 w-80 overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)] shadow-lg dark:border-[var(--border)] dark:bg-[var(--surface)]">
          {loading && (
            <p className="px-4 py-3 text-sm text-[var(--text-subtle)]">Searching…</p>
          )}
          {!loading && results.length === 0 && (
            <p className="px-4 py-3 text-sm text-[var(--text-subtle)]">No matches.</p>
          )}
          {!loading &&
            results.map((r) => (
              <Link
                key={r.symbol}
                href={`/stock/${encodeURIComponent(r.symbol)}`}
                onClick={() => setOpen(false)}
                className="flex items-center justify-between gap-3 px-4 py-3 text-sm hover:bg-[var(--surface-hover)] dark:hover:bg-[var(--surface-hover)]"
              >
                <span>
                  <span className="font-semibold">{r.displaySymbol}</span>
                  <span className="ml-2 text-[var(--text-subtle)]">{r.description}</span>
                </span>
              </Link>
            ))}
        </div>
      )}
    </div>
  );
}
