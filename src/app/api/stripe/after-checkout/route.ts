import { NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

// Called when the user returns from a Stripe Payment Link success URL.
// Configure the payment link's success URL in the Stripe dashboard to:
//   http://localhost:3000/api/stripe/after-checkout?session_id={CHECKOUT_SESSION_ID}
export async function GET(req: Request) {
  const url = new URL(req.url);
  const sessionId = url.searchParams.get("session_id");
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  if (!sessionId) {
    return NextResponse.redirect(`${siteUrl}/pricing?error=missing_session`);
  }

  try {
    const stripe = getStripe();
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ["subscription", "customer"],
    });

    const userId = session.client_reference_id;
    const customerId =
      typeof session.customer === "string"
        ? session.customer
        : session.customer?.id;
    const subscription = session.subscription;
    const subscriptionId =
      typeof subscription === "string" ? subscription : subscription?.id;

    if (!userId || !customerId || !subscriptionId) {
      return NextResponse.redirect(`${siteUrl}/pricing?error=incomplete_session`);
    }

    const sub =
      typeof subscription === "string"
        ? await stripe.subscriptions.retrieve(subscription)
        : subscription!;

    const admin = createSupabaseAdminClient();
    await admin.from("subscriptions").upsert(
      {
        user_id: userId,
        stripe_customer_id: customerId,
        stripe_subscription_id: subscriptionId,
        status: sub.status,
        current_period_end: sub.items.data[0]?.current_period_end
          ? new Date(sub.items.data[0].current_period_end * 1000).toISOString()
          : null,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "user_id" }
    );

    return NextResponse.redirect(`${siteUrl}/?upgraded=1`);
  } catch (e) {
    console.error("[after-checkout] error", e);
    const msg = e instanceof Error ? e.message : "stripe_error";
    return NextResponse.redirect(`${siteUrl}/pricing?error=${encodeURIComponent(msg)}`);
  }
}
