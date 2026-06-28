import Link from "next/link";
import { Check } from "lucide-react";
import { ArrowLeft } from "lucide-react";
import { Sidebar } from "@/components/Sidebar";
import { ThemeToggle } from "@/components/ThemeToggle";
import { UserMenu } from "@/components/UserMenu";
import { UpgradeButton } from "@/components/UpgradeButton";
import { ManageBillingButton } from "@/components/ManageBillingButton";
import { getUserSubscription } from "@/lib/getCurrentUser";

const FREE_FEATURES = [
  "Live stock prices",
  "Stock detail page with chart",
  "Per-stock news",
  "Search any ticker",
];
const PAID_FEATURES = [
  "Everything in Free",
  "Save unlimited stocks to your watchlist",
  "Per-user portfolio that syncs across devices",
  "Priority support",
];

export default async function PricingPage() {
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
            <ArrowLeft size={16} /> Back to dashboard
          </Link>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <UserMenu email={user?.email ?? null} isPaid={isPaid} />
          </div>
        </div>

        <div className="mx-auto mt-10 max-w-4xl text-center">
          <h1 className="text-3xl font-semibold tracking-tight">Pricing</h1>
          <p className="mt-2 text-sm text-[var(--text-muted)] dark:text-[var(--text-subtle)]">
            Start free. Upgrade when you&apos;re ready to build your watchlist.
          </p>
        </div>

        <div className="mx-auto mt-10 grid max-w-4xl gap-6 sm:grid-cols-2">
          {/* Free plan */}
          <div className="flex flex-col rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-8 dark:border-[var(--border)] dark:bg-[var(--surface)]">
            <h2 className="text-lg font-semibold">Free</h2>
            <p className="mt-1 text-sm text-[var(--text-subtle)]">For trying things out.</p>
            <p className="mt-6 text-4xl font-semibold tracking-tight">
              $0<span className="text-base font-normal text-[var(--text-subtle)]">/mo</span>
            </p>
            <ul className="mt-6 flex flex-1 flex-col gap-3 text-sm">
              {FREE_FEATURES.map((f) => (
                <li key={f} className="flex items-center gap-2">
                  <Check size={16} className="text-[var(--success-fg)]" /> {f}
                </li>
              ))}
            </ul>
            <button
              disabled
              className="mt-8 rounded-full border border-[var(--border)] py-2 text-sm font-medium text-[var(--text-muted)] dark:border-[var(--border)]"
            >
              {isPaid ? "Downgrade in billing" : "Current plan"}
            </button>
          </div>

          {/* Paid plan */}
          <div className="relative flex flex-col rounded-2xl border-2 border-[var(--primary)] bg-[var(--surface)] p-8 dark:bg-[var(--surface)]">
            <span className="absolute -top-3 left-8 rounded-full bg-[var(--primary)] px-3 py-0.5 text-xs font-semibold text-white">
              Recommended
            </span>
            <h2 className="text-lg font-semibold">Paid</h2>
            <p className="mt-1 text-sm text-[var(--text-subtle)]">
              For active traders building a real watchlist.
            </p>
            <p className="mt-6 text-4xl font-semibold tracking-tight">
              $20<span className="text-base font-normal text-[var(--text-subtle)]">/mo</span>
            </p>
            <ul className="mt-6 flex flex-1 flex-col gap-3 text-sm">
              {PAID_FEATURES.map((f) => (
                <li key={f} className="flex items-center gap-2">
                  <Check size={16} className="text-[var(--success-fg)]" /> {f}
                </li>
              ))}
            </ul>

            {!user ? (
              <Link
                href="/login?next=/pricing"
                className="mt-8 rounded-full bg-[var(--primary)] py-2 text-center text-sm font-medium text-white hover:bg-[var(--primary-hover)]"
              >
                Log in to upgrade
              </Link>
            ) : isPaid ? (
              <ManageBillingButton />
            ) : (
              <UpgradeButton
                paymentLinkUrl={process.env.NEXT_PUBLIC_STRIPE_PAYMENT_LINK!}
                userId={user.id}
                email={user.email ?? null}
              />
            )}
          </div>
        </div>

        <p className="mx-auto mt-8 max-w-4xl text-center text-xs text-[var(--text-subtle)]">
          Test mode: use Stripe test card{" "}
          <code className="rounded bg-[var(--bg)] px-1 py-0.5 dark:bg-[var(--surface-hover)]">
            4242 4242 4242 4242
          </code>{" "}
          · any future expiry · any CVC · any ZIP.
        </p>
      </main>
    </div>
  );
}
