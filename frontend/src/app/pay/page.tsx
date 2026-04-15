"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { createPaymentOrder, loadRazorpay, verifyPayment } from "@/lib/api";
import { GlassCard } from "@/components/glass-card";
import { SiteHeader } from "@/components/site-header";

function PayInner() {
  const sp = useSearchParams();
  const leadId = Number(sp.get("lead_id") ?? "0");
  const [err, setErr] = useState<string | null>(null);
  const [ok, setOk] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function pay() {
    setErr(null);
    setOk(null);
    if (!leadId) {
      setErr("lead_id missing");
      return;
    }
    setLoading(true);
    try {
      const order = await createPaymentOrder(leadId);
      await loadRazorpay();
      const Rzp = window.Razorpay;
      if (!Rzp) throw new Error("Razorpay failed to initialize");

      const opts = {
        key: order.key_id,
        amount: String(order.amount_paise),
        currency: "INR",
        order_id: order.order_id,
        name: "Gopher Lab",
        description: "Mentorship seat",
        handler: async (response: {
          razorpay_payment_id: string;
          razorpay_order_id: string;
          razorpay_signature: string;
        }) => {
          try {
            await verifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });
            setOk("Payment verified on server. Welcome aboard 🚀");
          } catch (e: unknown) {
            setErr(e instanceof Error ? e.message : "Verify failed");
          }
        },
        theme: { color: "#059669" },
      };

      const rz = new Rzp(opts);
      rz.open();
    } catch (e: unknown) {
      setErr(e instanceof Error ? e.message : "Payment start failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto max-w-lg px-4 py-16 sm:px-6">
      <GlassCard>
        <h1 className="text-xl font-semibold text-slate-900 dark:text-slate-50">Razorpay checkout</h1>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
          Lead <span className="font-mono text-brand-sunset dark:text-brand-onDark">#{leadId || "—"}</span>. Amount defaults from server (
          <code className="font-mono text-xs">DEFAULT_PAYMENT_RUPEES</code>).
        </p>
        {err ? <p className="mt-4 text-sm text-red-400">{err}</p> : null}
        {ok ? <p className="mt-4 text-sm text-brand-sunset dark:text-brand-onDark">{ok}</p> : null}
        <button
          type="button"
          disabled={loading}
          onClick={() => void pay()}
          className="btn-accent mt-6 w-full disabled:opacity-50"
        >
          {loading ? "Opening…" : "Pay with Razorpay"}
        </button>
        <Link href="/eligibility" className="mt-6 inline-block text-sm text-brand-sunset hover:underline dark:text-brand-onDark">
          ← Apply again
        </Link>
      </GlassCard>
    </main>
  );
}

export default function PayPage() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <Suspense>
        <PayInner />
      </Suspense>
    </div>
  );
}
