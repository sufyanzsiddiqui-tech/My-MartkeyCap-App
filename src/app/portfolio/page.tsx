import Link from "next/link";
import { Bell } from "lucide-react";
import { Sidebar } from "@/components/Sidebar";
import { SearchBar } from "@/components/SearchBar";
import { ThemeToggle } from "@/components/ThemeToggle";
import { StockSummaryCards } from "@/components/StockSummaryCards";
import { PortfolioTotalCard } from "@/components/PortfolioTotalCard";
import { StatisticsChart } from "@/components/StatisticsChart";
import { HoldingsTable } from "@/components/HoldingsTable";
import { UserMenu } from "@/components/UserMenu";
import { getUserSubscription } from "@/lib/getCurrentUser";
import { getUserPortfolio } from "@/lib/getPortfolio";

export default async function PortfolioPage() {
  const { user, isPaid } = await getUserSubscription();
  const holdings = await getUserPortfolio();
  const hasHoldings = holdings.length > 0;
  const heldSymbols = holdings.map((h) => h.symbol);

  return (
    <div className="flex min-h-screen w-full">
      <Sidebar />

      <main className="min-w-0 flex-1 px-8 py-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-semibold">Portfolio</h1>
            <p className="text-sm text-[var(--text-subtle)] dark:text-[var(--text-muted)]">
              Track your holdings and live profit & loss.
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
                Upgrade to add stocks to your portfolio with shares & buy price.
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

        {hasHoldings && (
          <div className="mt-6">
            <StockSummaryCards symbols={heldSymbols} heading="Your Holdings" />
          </div>
        )}

        <div className="mt-6 flex flex-col gap-6 lg:flex-row">
          <PortfolioTotalCard holdings={holdings} />
          <StatisticsChart />
        </div>

        {hasHoldings ? (
          <div className="mt-6">
            <HoldingsTable holdings={holdings} />
          </div>
        ) : (
          <div className="mt-6 rounded-2xl border border-dashed border-[var(--border)] bg-[var(--surface)] p-10 text-center dark:border-[var(--border)] dark:bg-[var(--surface)]">
            <p className="text-sm font-medium">No holdings yet.</p>
            <p className="mt-1 text-sm text-[var(--text-subtle)]">
              Open a stock from{" "}
              <Link href="/" className="text-[var(--primary)] hover:underline">
                Overview
              </Link>{" "}
              and tap <span className="font-medium">Add to portfolio</span>.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
