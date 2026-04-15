"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { GlassCard } from "@/components/glass-card";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { useLanguage } from "@/contexts/language-context";
import {
  getConsultationAvailability,
  getConsultationConfig,
  loadRazorpay,
  reserveConsultation,
  verifyPayment,
  type ConsultationConfig,
  type ConsultationSlot,
} from "@/lib/api";

function formatSlotLabel(iso: string) {
  try {
    const d = new Date(iso);
    return d.toLocaleString(undefined, {
      weekday: "short",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  } catch {
    return iso;
  }
}

export default function BookPage() {
  const { t } = useLanguage();
  const b = t.bookPage;
  const [cfg, setCfg] = useState<ConsultationConfig | null>(null);
  const [slots, setSlots] = useState<ConsultationSlot[]>([]);
  const [loadErr, setLoadErr] = useState<string | null>(null);
  const [loadingSlots, setLoadingSlots] = useState(true);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [accepted, setAccepted] = useState(false);
  const [slotUtc, setSlotUtc] = useState<string | null>(null);

  const [err, setErr] = useState<string | null>(null);
  const [paying, setPaying] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoadingSlots(true);
      setLoadErr(null);
      try {
        const [c, a] = await Promise.all([getConsultationConfig(), getConsultationAvailability(14)]);
        if (cancelled) return;
        setCfg(c);
        setSlots(a.slots ?? []);
      } catch (e: unknown) {
        if (!cancelled) setLoadErr(e instanceof Error ? e.message : b.errConfig);
      } finally {
        if (!cancelled) setLoadingSlots(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [b.errConfig]);

  async function onPay() {
    setErr(null);
    if (!name.trim() || !phone.trim() || !email.trim()) {
      setErr("Please fill in name, phone, and email.");
      return;
    }
    if (!accepted) {
      setErr(b.errTerms);
      return;
    }
    if (!slotUtc) {
      setErr("Please choose a time slot.");
      return;
    }
    setPaying(true);
    try {
      const res = await reserveConsultation({
        name: name.trim(),
        phone: phone.trim(),
        email: email.trim(),
        slot_utc: slotUtc,
      });
      await loadRazorpay();
      const Rzp = window.Razorpay;
      if (!Rzp) throw new Error("Checkout failed to load");

      const rz = new Rzp({
        key: res.key_id,
        amount: String(res.amount_paise),
        currency: "INR",
        order_id: res.order_id,
        name: "Gopher Lab",
        description: `Consultation — ${formatSlotLabel(res.slot_utc)}`,
        prefill: { name: name.trim(), email: email.trim(), contact: phone.trim() },
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
            setDone(true);
          } catch (e: unknown) {
            setErr(e instanceof Error ? e.message : b.errPay);
          } finally {
            setPaying(false);
          }
        },
        theme: { color: "#D6336B" },
        modal: {
          ondismiss: () => setPaying(false),
        },
      });
      rz.open();
    } catch (e: unknown) {
      setErr(e instanceof Error ? e.message : b.errReserve);
      setPaying(false);
    }
  }

  const fee = cfg?.fee_rupees ?? "10000";

  return (
    <div className="noise min-h-screen bg-background bg-hero-radial dark:bg-hero-radial-dark">
      <SiteHeader />
      <main className="page-shell py-10 sm:py-14">
        <p className="section-eyebrow tracking-[0.2em]">{b.eyebrow}</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900 dark:text-slate-50 sm:text-4xl">{b.title}</h1>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-600 dark:text-slate-400">{b.intro}</p>

        <div className="mt-6 flex flex-wrap items-baseline gap-2 text-sm">
          <span className="font-semibold text-slate-900 dark:text-slate-100">{b.feeLine}:</span>
          <span className="font-mono text-lg text-brand-sunset dark:text-brand-onDark">₹{fee}</span>
          <span className="text-slate-500 dark:text-slate-500">{b.feeNote}</span>
        </div>

        {loadErr ? <p className="mt-6 text-sm text-red-600 dark:text-red-400">{loadErr}</p> : null}

        {done ? (
          <GlassCard className="mt-10 w-full max-w-none">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-50">{b.successTitle}</h2>
            <p className="mt-3 text-sm leading-relaxed text-slate-600 dark:text-slate-400">{b.successBody}</p>
            <Link href="/" className="btn-accent mt-8 inline-flex">
              {b.backHome}
            </Link>
          </GlassCard>
        ) : (
          <GlassCard className="mt-10 w-full max-w-none">
            <div className="grid gap-8 lg:grid-cols-2">
              <div>
                <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">{b.stepDetails}</h2>
                <div className="mt-4 space-y-4">
                  <label className="block text-xs font-medium text-slate-600 dark:text-slate-400">
                    {b.name}
                    <input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 outline-none ring-brand-sunset/20 focus:ring-2 dark:border-white/10 dark:bg-slate-900/60 dark:text-slate-100"
                      autoComplete="name"
                    />
                  </label>
                  <label className="block text-xs font-medium text-slate-600 dark:text-slate-400">
                    {b.phone}
                    <input
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 outline-none ring-brand-sunset/20 focus:ring-2 dark:border-white/10 dark:bg-slate-900/60 dark:text-slate-100"
                      inputMode="tel"
                      autoComplete="tel"
                    />
                  </label>
                  <label className="block text-xs font-medium text-slate-600 dark:text-slate-400">
                    {b.email}
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 outline-none ring-brand-sunset/20 focus:ring-2 dark:border-white/10 dark:bg-slate-900/60 dark:text-slate-100"
                      autoComplete="email"
                    />
                  </label>
                  <label className="flex cursor-pointer items-start gap-2 text-sm text-slate-600 dark:text-slate-400">
                    <input
                      type="checkbox"
                      checked={accepted}
                      onChange={(e) => setAccepted(e.target.checked)}
                      className="mt-1 rounded border-slate-300 text-brand-sunset focus:ring-brand-sunset"
                    />
                    <span>{b.acceptTerms}</span>
                  </label>
                </div>
              </div>

              <div>
                <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">{b.stepSlot}</h2>
                <p className="mt-2 text-xs text-slate-500 dark:text-slate-500">{b.selectSlotHint}</p>
                {cfg ? (
                  <p className="mt-1 text-xs text-slate-500">
                    Mentor timezone: <span className="font-mono">{cfg.timezone}</span> · {cfg.slot_minutes} min slots
                  </p>
                ) : null}

                {loadingSlots ? (
                  <p className="mt-6 text-sm text-slate-500">{b.loadingSlots}</p>
                ) : slots.length === 0 ? (
                  <p className="mt-6 text-sm text-amber-800 dark:text-amber-200/90">{b.noSlots}</p>
                ) : (
                  <ul className="mt-4 max-h-[min(22rem,50vh)] space-y-2 overflow-y-auto pr-1">
                    {slots.map((s) => {
                      const active = slotUtc === s.start_utc;
                      return (
                        <li key={s.start_utc}>
                          <button
                            type="button"
                            onClick={() => setSlotUtc(s.start_utc)}
                            className={`w-full rounded-xl border px-4 py-3 text-left text-sm font-medium transition ${
                              active
                                ? "border-brand-sunset bg-brand-sunset/10 text-brand-berry dark:border-brand-sunset/50 dark:bg-brand-berry/30 dark:text-brand-onDarkStrong"
                                : "border-slate-200 bg-white text-slate-800 hover:border-slate-300 dark:border-white/10 dark:bg-slate-900/40 dark:text-slate-200"
                            }`}
                          >
                            {formatSlotLabel(s.start_utc)}
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                )}
                {slotUtc ? (
                  <p className="mt-4 text-xs text-slate-500">
                    {b.selectedSlot}: <span className="font-medium text-slate-700 dark:text-slate-300">{formatSlotLabel(slotUtc)}</span>
                  </p>
                ) : null}
              </div>
            </div>

            <div className="mt-10 border-t border-slate-200/80 pt-8 dark:border-white/10">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">{b.stepPay}</h2>
              <p className="mt-2 text-xs text-slate-500 dark:text-slate-500">{b.termsShort}</p>
              {err ? <p className="mt-4 text-sm text-red-600 dark:text-red-400">{err}</p> : null}
              <button
                type="button"
                disabled={paying || loadingSlots || !cfg}
                onClick={() => void onPay()}
                className="btn-accent mt-6 w-full max-w-md disabled:opacity-50"
              >
                {paying ? b.paying : `Pay ₹${fee} — book consultation`}
              </button>
            </div>
          </GlassCard>
        )}

        <p className="mt-10 text-center text-sm">
          <Link href="/eligibility" className="text-brand-sunset hover:underline dark:text-brand-onDark">
            Full programme application →
          </Link>
        </p>
      </main>
      <SiteFooter />
    </div>
  );
}
