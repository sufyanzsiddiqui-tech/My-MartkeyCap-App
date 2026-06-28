import { ArrowUp, ChevronRight, MoreVertical, Sparkles } from "lucide-react";

export function PortfolioValueCard() {
  return (
    <div className="flex flex-1 flex-col rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 dark:border-[var(--border)] dark:bg-[var(--surface)]">
      <div className="flex items-start justify-between">
        <h3 className="text-base font-semibold">Total Value</h3>
        <button className="text-[var(--text-subtle)] hover:text-[var(--text)] dark:hover:text-white">
          <MoreVertical size={18} />
        </button>
      </div>

      <div className="mt-3 flex items-center gap-2">
        <span className="text-3xl font-semibold tracking-tight">
          $17,580.00
        </span>
        <span className="flex items-center gap-1 rounded-full bg-[var(--success-bg)] px-2 py-0.5 text-xs font-semibold text-[var(--success-fg)]">
          <ArrowUp size={12} /> 5.90%
        </span>
      </div>

      <p className="mt-2 text-sm leading-relaxed text-[var(--text-muted)] dark:text-[var(--text-subtle)]">
        You profits is $4,790.00 in this months.
        <br />
        that&apos;s the best result in the last three months.
      </p>

      <div className="mt-4 flex gap-3">
        <button className="rounded-full border border-[var(--border)] px-4 py-2 text-sm font-medium text-[var(--text)] hover:bg-[var(--surface-hover)] dark:border-[var(--border)] dark:text-[var(--text)] dark:hover:bg-[var(--surface-hover)]">
          Worst Performance
        </button>
        <button className="rounded-full bg-[var(--primary)] px-4 py-2 text-sm font-medium text-white hover:bg-[var(--primary-hover)]">
          Top Performance
        </button>
      </div>

      <button className="mt-5 flex items-center justify-between gap-3 rounded-2xl bg-[var(--primary-soft)] px-4 py-3 text-left text-sm font-medium text-[var(--primary-soft-fg)] hover:bg-[var(--primary-soft-hover)] dark:bg-[var(--primary-soft)] dark:text-[var(--primary-soft-fg)] dark:hover:bg-[var(--primary-soft-hover)]">
        <span className="flex items-center gap-2">
          <Sparkles size={16} className="text-[var(--primary)]" />
          Here&apos;s to improve your portfolio and understanding how
          investing works.
        </span>
        <ChevronRight size={16} className="shrink-0" />
      </button>
    </div>
  );
}
