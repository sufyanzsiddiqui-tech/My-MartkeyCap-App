import Link from "next/link";
import { Bell } from "lucide-react";
import { Sidebar } from "@/components/Sidebar";
import { SearchBar } from "@/components/SearchBar";
import { ThemeToggle } from "@/components/ThemeToggle";
import { StockSummaryCards } from "@/components/StockSummaryCards";
import { CryptoCards } from "@/components/CryptoCards";
import { UserMenu } from "@/components/UserMenu";
import { getUserSubscription } from "@/lib/getCurrentUser";
import {
  TOP_STOCKS_POOL,
  RECOMMENDED_POOL,
  TOP_TRADED_SYMBOLS,
} from "@/lib/mock-data";

export default async function OverviewPage() {
  const { user, isPaid } = await getUserSubscription();

  return (
    <div className="flex min-h-screen w-full">
      <Sidebar />

      <main className="min-w-0 flex-1 px-8 py-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-semibold">Overview</h1>
            <p className="text-sm text-[var(--text-subtle)] dark:text-[var(--text-muted)]">
              Markets at a glance — stocks, crypto, and what&apos;s moving today.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <SearchBar />
            <ThemeToggle />
            <button className="flex h-10 w-10 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--surface)] text-[var(--text-muted)] hover:text-[var(--text)] dark:border-[var(--border)] dark:bg-[var(--surface)] dark:hover:text-white">
              <Bell size={18} />
            </button>
            <UserMenu email={user?.email ?? null} isPaid={isPaid} />
          </div>
        </div>

        {!isPaid && (
          <div className="mt-6 flex items-center justify-between gap-4 rounded-2xl border border-[var(--primary-soft-border)] bg-[var(--primary-soft)] p-4 text-sm dark:border-[var(--primary-soft-border)] dark:bg-[var(--primary-soft)]">
            <p>
              <span className="font-semibold text-[var(--primary-soft-fg)] dark:text-[var(--primary-soft-fg)]">
                You&apos;re on the Free plan.
              </span>{" "}
              <span className="text-[var(--text-muted)] dark:text-[var(--text-subtle)]">
                Upgrade to add stocks to your{" "}
                <Link href="/portfolio" className="underline">portfolio</Link>.
              </span>
            </p>
            <Link
              href="/pricing"
              className="rounded-full bg-[var(--primary)] px-4 py-2 text-sm font-medium text-white hover:bg-[var(--primary-hover)]"
            >
              Upgrade
            </Link>
          </div>
        )}

        <div className="mt-6">
          <StockSummaryCards symbols={TOP_STOCKS_POOL} heading="Top Stocks" />
        </div>

        <div className="mt-6">
          <CryptoCards />
        </div>

        <div className="mt-6">
          <StockSummaryCards
            symbols={RECOMMENDED_POOL}
            heading="Recommended Buys"
            sortBy="changeDesc"
            limit={5}
          />
        </div>

        <div className="mt-6">
          <StockSummaryCards
            symbols={TOP_TRADED_SYMBOLS}
            heading="Top 5 Traded Today"
          />
        </div>
      </main>
    </div>
  );
}
