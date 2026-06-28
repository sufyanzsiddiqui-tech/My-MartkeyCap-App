"use client";

type Props = {
  paymentLinkUrl: string;
  userId: string;
  email: string | null;
};

export function UpgradeButton({ paymentLinkUrl, userId, email }: Props) {
  function go() {
    const url = new URL(paymentLinkUrl);
    url.searchParams.set("client_reference_id", userId);
    if (email) url.searchParams.set("prefilled_email", email);
    window.location.href = url.toString();
  }

  return (
    <div className="mt-8 flex flex-col gap-2">
      <button
        onClick={go}
        className="rounded-full bg-[var(--primary)] py-2 text-sm font-medium text-white hover:bg-[var(--primary-hover)]"
      >
        Upgrade — $20/month
      </button>
    </div>
  );
}
