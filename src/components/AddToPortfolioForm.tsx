"use client";

import { useEffect, useState, useTransition } from "react";
import Link from "next/link";
import { Check, Lock, Plus } from "lucide-react";
import { addHolding } from "@/app/actions/portfolio";
import { useLiveQuotes } from "@/lib/useLiveQuotes";

type Props = {
  symbol: string;
  isPaid: boolean;
  isAuthed: boolean;
};

export function AddToPortfolioForm({ symbol, isPaid, isAuthed }: Props) {
  const { quotes } = useLiveQuotes([symbol]);
  const livePrice = quotes[symbol]?.c;

  const [open, setOpen] = useState(false);
  const [shares, setShares] = useState("");
  const [price, setPrice] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [pending, startTransition] = useTransition();

  // Prefill the buy price with the live quote once it arrives.
  useEffect(() => {
    if (open && !price && livePrice != null) {
      setPrice(livePrice.toFixed(2));
    }
  }, [open, livePrice, price]);

  if (!isAuthed) {
    return (
      <Link
        href={`/login?next=/stock/${symbol}`}
        className="rounded-full bg-[var(--primary)] px-4 py-2 text-sm font-medium text-white hover:bg-[var(--primary-hover)]"
      >
        Log in to add to portfolio
      </Link>
    );
  }

  if (!isPaid) {
    return (
      <Link
        href="/pricing"
        className="flex items-center gap-2 rounded-full border border-[var(--primary-soft-border)] bg-[var(--primary-soft)] px-4 py-2 text-sm font-medium text-[var(--primary-soft-fg)] hover:bg-[var(--primary-soft-hover)] dark:border-[var(--primary-soft-border)] dark:bg-[var(--primary-soft)] dark:text-[var(--primary-soft-fg)]"
      >
        <Lock size={14} /> Upgrade to add to portfolio
      </Link>
    );
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    const s = parseFloat(shares);
    const p = parseFloat(price);
    if (!Number.isFinite(s) || s <= 0) return setError("Shares must be > 0");
    if (!Number.isFinite(p) || p < 0) return setError("Buy price must be ≥ 0");

    startTransition(async () => {
      const res = await addHolding(symbol, s, p);
      if (res.error) return setError(res.error);
      setSuccess(true);
      setShares("");
      setPrice(livePrice != null ? livePrice.toFixed(2) : "");
      setTimeout(() => setSuccess(false), 2500);
    });
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 rounded-full bg-[var(--primary)] px-4 py-2 text-sm font-medium text-white hover:bg-[var(--primary-hover)]"
      >
        <Plus size={14} /> Add to portfolio
      </button>
    );
  }

  return (
    <form
      onSubmit={submit}
      className="w-full max-w-md rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 dark:border-[var(--border)] dark:bg-[var(--surface)]"
    >
      <div className="flex items-center justify-between">
        <h3 className="text-base font-semibold">Add {symbol} to portfolio</h3>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="text-xs text-[var(--text-subtle)] hover:underline"
        >
          Cancel
        </button>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <label className="flex flex-col gap-1 text-xs">
          <span className="text-[var(--text-muted)] dark:text-[var(--text-subtle)]">Shares</span>
          <input
            type="number" step="any" min="0" placeholder="10"
            value={shares} onChange={(e) => setShares(e.target.value)}
            className="rounded-lg border border-[var(--border)] bg-transparent px-3 py-2 text-sm outline-none focus:border-[var(--primary)] dark:border-[var(--border)]"
          />
        </label>
        <label className="flex flex-col gap-1 text-xs">
          <span className="text-[var(--text-muted)] dark:text-[var(--text-subtle)]">
            Buy price {livePrice != null && (
              <button
                type="button"
                onClick={() => setPrice(livePrice.toFixed(2))}
                className="ml-1 text-[var(--primary)] hover:underline"
              >
                use live (${livePrice.toFixed(2)})
              </button>
            )}
          </span>
          <input
            type="number" step="0.01" min="0" placeholder="150.00"
            value={price} onChange={(e) => setPrice(e.target.value)}
            className="rounded-lg border border-[var(--border)] bg-transparent px-3 py-2 text-sm outline-none focus:border-[var(--primary)] dark:border-[var(--border)]"
          />
        </label>
      </div>

      {error && <p className="mt-3 text-xs text-[var(--danger-fg)]">{error}</p>}
      {success && (
        <p className="mt-3 flex items-center gap-1 text-xs text-[var(--success-fg)]">
          <Check size={12} /> Added to portfolio.
        </p>
      )}

      <button
        type="submit" disabled={pending}
        className="mt-4 w-full rounded-full bg-[var(--primary)] py-2 text-sm font-medium text-white hover:bg-[var(--primary-hover)] disabled:opacity-60"
      >
        {pending ? "Adding…" : "Add to portfolio"}
      </button>
    </form>
  );
}
