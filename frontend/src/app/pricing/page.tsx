"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FeeBanner } from "@/components/fee-banner";
import { GlassCard } from "@/components/glass-card";
import { PricingValueComparison } from "@/components/pricing-value-comparison";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { useLanguage } from "@/contexts/language-context";
import { isApplyEligible } from "@/lib/eligibility-storage";
import { canViewPricingFees, hasCompletedMockTest } from "@/lib/pricing-access";

export default function PricingPage() {
  const { t } = useLanguage();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [unlocked, setUnlocked] = useState(false);
  const [eligibleDone, setEligibleDone] = useState(false);
  const [mockDone, setMockDone] = useState(false);

  useEffect(() => {
    function sync() {
      setUnlocked(canViewPricingFees());
      setEligibleDone(isApplyEligible());
      setMockDone(hasCompletedMockTest());
    }
    setMounted(true);
    sync();
    window.addEventListener("focus", sync);
    document.addEventListener("visibilitychange", sync);
    return () => {
      window.removeEventListener("focus", sync);
      document.removeEventListener("visibilitychange", sync);
    };
  }, []);

  return (
    <div className="noise min-h-screen bg-background bg-hero-radial dark:bg-hero-radial-dark">
      <SiteHeader />
      <main className="page-shell py-12 sm:py-16">
        <h1 className="text-3xl font-semibold text-slate-900 dark:text-slate-50">{t.pricing.title}</h1>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-600 dark:text-slate-400">{t.pricing.intro}</p>

        {!mounted ? (
          <p className="mt-8 text-sm text-slate-500">{t.pricing.loading}</p>
        ) : (
          <>
            <div className="mt-10">
              <PricingValueComparison t={t.pricing} />
            </div>

            {!unlocked ? (
              <GlassCard className="mt-10 max-w-2xl">
                <p className="text-sm font-medium text-slate-900 dark:text-slate-100">{t.pricing.gateTitle}</p>
                <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">{t.pricing.gateBody}</p>
                <ul className="mt-4 space-y-2 text-sm text-slate-600 dark:text-slate-400">
                  <li className="flex items-center gap-2">
                    <span className={eligibleDone ? "text-emerald-600 dark:text-emerald-400" : "text-slate-400"}>
                      {eligibleDone ? "✓" : "○"}
                    </span>
                    {t.pricing.gateStepEligibility}
                  </li>
                  <li className="flex items-center gap-2">
                    <span className={mockDone ? "text-emerald-600 dark:text-emerald-400" : "text-slate-400"}>
                      {mockDone ? "✓" : "○"}
                    </span>
                    {t.pricing.gateStepMock}
                  </li>
                </ul>
                <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                  <Link href="/eligibility?from=pricing" className="btn-accent text-center">
                    {t.pricing.gateEligibility}
                  </Link>
                  <Link href="/mock-test" className="btn-accent text-center">
                    {t.pricing.gateMockTest}
                  </Link>
                  <Link href="/program" className="btn-secondary text-center">
                    {t.pricing.gateProgram}
                  </Link>
                </div>
              </GlassCard>
            ) : (
              <>
                <div className="mt-10">
                  <FeeBanner />
                </div>
                <section className="mt-10">
                  <p className="mb-6 rounded-xl border border-amber-300/70 bg-amber-50/90 px-4 py-3 text-[0.9375rem] leading-relaxed text-amber-950 dark:border-amber-500/35 dark:bg-amber-950/35 dark:text-amber-100">
                    <span className="font-semibold">{t.pricing.headsUp}</span> {t.pricing.headsUpText}
                  </p>
                  <div className="grid gap-6 lg:grid-cols-2">
                    <GlassCard className="border-brand-sunset/25 dark:border-brand-sunset/30">
                      <p className="section-eyebrow tracking-widest">
                        {t.pricing.standard}
                      </p>
                      <p className="mt-4 text-4xl font-semibold tracking-tight text-slate-900 dark:text-slate-50 sm:text-[2.5rem]">
                        ₹2,50,000 <span className="text-base font-normal text-slate-500 dark:text-slate-400">{t.pricing.taxes}</span>
                      </p>
                      <p className="mt-4 text-[0.9375rem] leading-relaxed text-slate-600 dark:text-slate-400">{t.pricing.standardDesc}</p>
                    </GlassCard>
                    <GlassCard className="border-brand-berry/30 dark:border-brand-berry/35">
                      <p className="section-eyebrow tracking-widest">
                        {t.pricing.founding}
                      </p>
                      <p className="mt-4 text-4xl font-semibold tracking-tight text-slate-900 dark:text-slate-50 sm:text-[2.5rem]">
                        ₹2,25,000{" "}
                        <span className="text-base font-normal text-slate-500 dark:text-slate-400">{t.pricing.foundingAmountNote}</span>
                      </p>
                      <p className="mt-4 text-[0.9375rem] leading-relaxed text-slate-600 dark:text-slate-400">{t.pricing.foundingDesc}</p>
                    </GlassCard>
                  </div>
                </section>
                <div className="mt-10 flex flex-wrap gap-3">
                  <Link href="/apply" className="btn-accent">
                    {t.pricing.appForm}
                  </Link>
                  <button type="button" onClick={() => router.push("/eligibility")} className="btn-secondary">
                    {t.pricing.recheckEligibility}
                  </button>
                </div>
              </>
            )}
          </>
        )}
      </main>
      <SiteFooter />
    </div>
  );
}
