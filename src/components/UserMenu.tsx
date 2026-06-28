"use client";

import { useRef, useState, useEffect } from "react";
import Link from "next/link";
import { LogOut, Sparkles } from "lucide-react";
import { logoutAction } from "@/app/actions/auth";

export function UserMenu({ email, isPaid }: { email: string | null; isPaid: boolean }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  if (!email) {
    return (
      <Link
        href="/login"
        className="rounded-full bg-[var(--primary)] px-4 py-2 text-sm font-medium text-white hover:bg-[var(--primary-hover)]"
      >
        Log in
      </Link>
    );
  }

  const initial = email[0].toUpperCase();

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--primary)] text-sm font-semibold text-white"
      >
        {initial}
      </button>
      {open && (
        <div className="absolute right-0 z-50 mt-2 w-56 overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)] shadow-lg dark:border-[var(--border)] dark:bg-[var(--surface)]">
          <div className="px-4 py-3 text-xs">
            <p className="text-[var(--text-subtle)]">Signed in as</p>
            <p className="truncate font-medium">{email}</p>
            <p className="mt-2 inline-flex items-center gap-1 rounded-full bg-[var(--primary-soft)] px-2 py-0.5 text-[10px] font-semibold uppercase text-[var(--primary-soft-fg)] dark:bg-[var(--primary-soft)] dark:text-[var(--primary-soft-fg)]">
              <Sparkles size={10} /> {isPaid ? "Paid" : "Free"}
            </p>
          </div>
          <Link
            href="/pricing"
            className="block border-t border-[var(--border-soft)] px-4 py-2 text-sm hover:bg-[var(--surface-hover)] dark:border-[var(--border)] dark:hover:bg-[var(--surface-hover)]"
          >
            Billing & plan
          </Link>
          <form action={logoutAction}>
            <button
              type="submit"
              className="flex w-full items-center gap-2 border-t border-[var(--border-soft)] px-4 py-2 text-left text-sm hover:bg-[var(--surface-hover)] dark:border-[var(--border)] dark:hover:bg-[var(--surface-hover)]"
            >
              <LogOut size={14} /> Log out
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
