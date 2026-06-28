"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Boxes } from "lucide-react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const router = useRouter();
  const search = useSearchParams();
  const next = search.get("next") || "/";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const supabase = createSupabaseBrowserClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) return setError(error.message);
    router.push(next);
    router.refresh();
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-sm rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-8 dark:border-[var(--border)] dark:bg-[var(--surface)]">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--primary)] text-white">
            <Boxes size={18} />
          </div>
          <span className="text-lg font-semibold">MarketCap</span>
        </div>
        <h1 className="mt-6 text-xl font-semibold">Welcome back</h1>
        <p className="text-sm text-[var(--text-subtle)]">Log in to access your portfolio.</p>

        <form onSubmit={onSubmit} className="mt-6 flex flex-col gap-3">
          <input
            type="email" required placeholder="Email" autoComplete="email"
            value={email} onChange={(e) => setEmail(e.target.value)}
            className="rounded-lg border border-[var(--border)] bg-transparent px-3 py-2 text-sm outline-none focus:border-[var(--primary)] dark:border-[var(--border)]"
          />
          <input
            type="password" required placeholder="Password" autoComplete="current-password"
            value={password} onChange={(e) => setPassword(e.target.value)}
            className="rounded-lg border border-[var(--border)] bg-transparent px-3 py-2 text-sm outline-none focus:border-[var(--primary)] dark:border-[var(--border)]"
          />
          {error && <p className="text-sm text-[var(--danger-fg)]">{error}</p>}
          <button
            type="submit" disabled={loading}
            className="rounded-full bg-[var(--primary)] py-2 text-sm font-medium text-white hover:bg-[var(--primary-hover)] disabled:opacity-60"
          >
            {loading ? "Logging in…" : "Log in"}
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-[var(--text-subtle)]">
          No account?{" "}
          <Link href="/signup" className="font-medium text-[var(--primary)] hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
