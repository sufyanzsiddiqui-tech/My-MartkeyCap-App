import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Sidebar } from "@/components/Sidebar";
import { SearchBar } from "@/components/SearchBar";
import { ThemeToggle } from "@/components/ThemeToggle";
import { StockHeader } from "@/components/StockHeader";
import { PriceChart } from "@/components/PriceChart";
import { NewsList } from "@/components/NewsList";
import { UserMenu } from "@/components/UserMenu";
import { AddToPortfolioForm } from "@/components/AddToPortfolioForm";
import { getUserSubscription } from "@/lib/getCurrentUser";

export default async function StockDetail({
  params,
}: {
  params: Promise<{ symbol: string }>;
}) {
  const { symbol: rawSymbol } = await params;
  const symbol = decodeURIComponent(rawSymbol).toUpperCase();

  const { user, isPaid } = await getUserSubscription();

  return (
    <div className="flex min-h-screen w-full">
      <Sidebar />

      <main className="min-w-0 flex-1 px-8 py-6">
        <div className="flex items-center justify-between gap-4">
          <Link
            href="/"
            className="flex items-center gap-2 text-sm text-[var(--text-muted)] hover:text-[var(--text)] dark:text-[var(--text-subtle)] dark:hover:text-white"
          >
            <ArrowLeft size={16} />
            Back to dashboard
          </Link>
          <div className="flex items-center gap-3">
            <SearchBar />
            <ThemeToggle />
            <UserMenu email={user?.email ?? null} isPaid={isPaid} />
          </div>
        </div>

        <div className="mt-6">
          <StockHeader symbol={symbol} />
        </div>

        <div className="mt-6 flex justify-end">
          <AddToPortfolioForm
            symbol={symbol}
            isPaid={isPaid}
            isAuthed={!!user}
          />
        </div>

        <div className="mt-6">
          <PriceChart symbol={symbol} />
        </div>

        <div className="mt-6">
          <NewsList symbol={symbol} />
        </div>
      </main>
    </div>
  );
}
