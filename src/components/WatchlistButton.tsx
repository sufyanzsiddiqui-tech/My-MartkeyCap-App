"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { Check, Plus, Lock } from "lucide-react";
import { addToWatchlist, removeFromWatchlist } from "@/app/actions/watchlist";

type Props = {
  symbol: string;
  initiallyOn: boolean;
  isPaid: boolean;
  isAuthed: boolean;
};

export function WatchlistButton({ symbol, initiallyOn, isPaid, isAuthed }: Props) {
  const [on, setOn] = useState(initiallyOn);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  if (!isAuthed) {
    return (
      <Link
        href={`/login?next=/stock/${symbol}`}
        className="rounded-full bg-[var(--primary)] px-4 py-2 text-sm font-medium text-white hover:bg-[var(--primary-hover)]"
      >
        Log in to save
      </Link>
    );
  }

  if (!isPaid) {
    return (
      <Link
        href="/pricing"
        className="flex items-center gap-2 rounded-full border border-[var(--primary-soft-border)] bg-[var(--primary-soft)] px-4 py-2 text-sm font-medium text-[var(--primary-soft-fg)] hover:bg-[var(--primary-soft-hover)] dark:border-[var(--primary-soft-border)] dark:bg-[var(--primary-soft)] dark:text-[var(--primary-soft-fg)]"
      >
        <Lock size={14} /> Upgrade to save
      </Link>
    );
  }

  function toggle() {
    setError(null);
    startTransition(async () => {
      const res = on
        ? await removeFromWatchlist(symbol)
        : await addToWatchlist(symbol);
      if (res.error) setError(res.error);
      else setOn(!on);
    });
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <button
        onClick={toggle}
        disabled={pending}
        className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
          on
            ? "bg-[var(--success-bg)] text-[var(--success-fg)] hover:bg-[var(--success-bg)]"
            : "bg-[var(--primary)] text-white hover:bg-[var(--primary-hover)]"
        } disabled:opacity-60`}
      >
        {on ? <Check size={14} /> : <Plus size={14} />}
        {on ? "In watchlist" : "Add to watchlist"}
      </button>
      {error && <p className="text-xs text-[var(--danger-fg)]">{error}</p>}
    </div>
  );
}
