import { getStripe } from "@/lib/stripe";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

// Looks up the user's Stripe customer by email, finds their most recent
// subscription, and upserts the result into our subscriptions table.
// Safe to call on every dashboard load — returns quickly if nothing changes.
export async function syncStripeSubscription(
  userId: string,
  email: string | null
): Promise<{ status: string }> {
  if (!email) return { status: "inactive" };

  const stripe = getStripe();
  const admin = createSupabaseAdminClient();

  // Find a Stripe customer with this email.
  const customers = await stripe.customers.list({ email, limit: 5 });
  if (customers.data.length === 0) {
    return { status: "inactive" };
  }

  // Look across all matching customers for the most relevant subscription.
  let best: { id: string; customerId: string; status: string; currentPeriodEnd: number | null } | null = null;
  for (const customer of customers.data) {
    const subs = await stripe.subscriptions.list({
      customer: customer.id,
      status: "all",
      limit: 5,
    });
    for (const s of subs.data) {
      const cpe = s.items.data[0]?.current_period_end ?? null;
      const candidate = {
        id: s.id,
        customerId: customer.id,
        status: s.status,
        currentPeriodEnd: cpe,
      };
      if (!best) best = candidate;
      else if (rank(candidate.status) > rank(best.status)) best = candidate;
      else if (rank(candidate.status) === rank(best.status) && (candidate.currentPeriodEnd ?? 0) > (best.currentPeriodEnd ?? 0)) {
        best = candidate;
      }
    }
  }

  if (!best) {
    await admin.from("subscriptions").upsert(
      {
        user_id: userId,
        stripe_customer_id: customers.data[0].id,
        status: "inactive",
        updated_at: new Date().toISOString(),
      },
      { onConflict: "user_id" }
    );
    return { status: "inactive" };
  }

  await admin.from("subscriptions").upsert(
    {
      user_id: userId,
      stripe_customer_id: best.customerId,
      stripe_subscription_id: best.id,
      status: best.status,
      current_period_end: best.currentPeriodEnd
        ? new Date(best.currentPeriodEnd * 1000).toISOString()
        : null,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "user_id" }
  );

  return { status: best.status };
}

// Higher = better/preferred.
function rank(status: string): number {
  switch (status) {
    case "active":
    case "trialing":
      return 4;
    case "past_due":
      return 3;
    case "unpaid":
      return 2;
    case "canceled":
      return 1;
    default:
      return 0;
  }
}
