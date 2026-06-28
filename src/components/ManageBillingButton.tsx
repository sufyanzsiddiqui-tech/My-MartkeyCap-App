"use client";

import { useState } from "react";

export function ManageBillingButton() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function go() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/portal", { method: "POST" });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
        return;
      }
      setError(data.error || "Could not open billing portal.");
    } catch (e) {
      setError(e instanceof Error ? e.message : "portal failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mt-8 flex flex-col gap-2">
      <button
        onClick={go}
        disabled={loading}
        className="rounded-full border border-[var(--border)] py-2 text-sm font-medium hover:bg-[var(--surface-hover)] dark:border-[var(--border)] dark:hover:bg-[var(--surface-hover)] disabled:opacity-60"
      >
        {loading ? "Opening…" : "Manage billing"}
      </button>
      {error && <p className="text-xs text-[var(--danger-fg)]">{error}</p>}
    </div>
  );
}
