"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { GlassCard } from "@/components/glass-card";
import { SiteHeader } from "@/components/site-header";
import { useLanguage } from "@/contexts/language-context";
import { APPLY_SITUATION_VALUES } from "@/lib/apply-situations";
import {
  clearApplyEligible,
  isApplyEligible,
  setApplyEligible,
  setSituationPrefill,
} from "@/lib/eligibility-storage";
import { situationLabel } from "@/lib/i18n/situations";

export default function EligibilityPage() {
  const { t } = useLanguage();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [fromApply, setFromApply] = useState(false);
  const [alreadyEligible, setAlreadyEligible] = useState(false);

  const [situation, setSituation] = useState<string>("");
  const [commitTime, setCommitTime] = useState(false);
  const [understandPaid, setUnderstandPaid] = useState(false);
  const [honest, setHonest] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
    setAlreadyEligible(isApplyEligible());
    setFromApply(new URLSearchParams(window.location.search).get("from") === "apply");
  }, []);

  const continueToApply = useCallback(() => {
    setErr(null);
    if (!situation) {
      setErr(t.eligibility.errSituation);
      return;
    }
    if (!commitTime || !understandPaid || !honest) {
      setErr(t.eligibility.errChecks);
      return;
    }
    setApplyEligible();
    setSituationPrefill(situation);
    router.push("/apply");
  }, [situation, commitTime, understandPaid, honest, router, t]);

  return (
    <div className="noise min-h-screen bg-background bg-hero-radial dark:bg-hero-radial-dark">
      <SiteHeader />
      <main className="mx-auto max-w-2xl px-4 py-12 sm:px-6 sm:py-16">
        <h1 className="text-3xl font-semibold text-slate-900 dark:text-slate-50">{t.eligibility.title}</h1>
        <p className="mt-3 text-sm leading-relaxed text-slate-600 dark:text-slate-400">{t.eligibility.intro}</p>
        {mounted && fromApply ? (
          <p className="mt-2 text-sm text-amber-800 dark:text-amber-200/90">{t.eligibility.fromApplyNote}</p>
        ) : null}
        {mounted && alreadyEligible ? (
          <p className="mt-4 rounded-xl border border-brand-sunset/30 bg-brand-sunset/10 px-4 py-3 text-sm text-brand-berry dark:border-brand-sunset/30 dark:bg-brand-berry/30 dark:text-brand-onDarkStrong">
            {t.eligibility.eligibleBanner}{" "}
            <Link href="/apply" className="font-semibold underline underline-offset-2">
              {t.eligibility.openForm}
            </Link>
            {" · "}
            <button
              type="button"
              onClick={() => {
                clearApplyEligible();
                setAlreadyEligible(false);
              }}
              className="text-brand-berry underline-offset-2 hover:underline dark:text-brand-onDarkStrong"
            >
              {t.eligibility.resetCheck}
            </button>
          </p>
        ) : null}

        <GlassCard className="mt-8 space-y-6">
          <div>
            <label className="block text-xs font-medium uppercase tracking-wider text-slate-600 dark:text-slate-500">
              {t.eligibility.situationLabel}
            </label>
            <select
              value={situation}
              onChange={(e) => setSituation(e.target.value)}
              className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none ring-brand-sunset/25 focus:ring-2 dark:border-white/10 dark:bg-slate-900/60 dark:text-slate-100"
            >
              <option value="">{t.eligibility.selectPlaceholder}</option>
              {APPLY_SITUATION_VALUES.map((value) => (
                <option key={value} value={value}>
                  {situationLabel(value, t)}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-3 text-sm text-slate-700 dark:text-slate-300">
            <label className="flex cursor-pointer items-start gap-3">
              <input
                type="checkbox"
                className="mt-1 h-4 w-4 rounded border-slate-300 dark:border-white/20"
                checked={commitTime}
                onChange={(e) => setCommitTime(e.target.checked)}
              />
              <span>{t.eligibility.commit}</span>
            </label>
            <label className="flex cursor-pointer items-start gap-3">
              <input
                type="checkbox"
                className="mt-1 h-4 w-4 rounded border-slate-300 dark:border-white/20"
                checked={understandPaid}
                onChange={(e) => setUnderstandPaid(e.target.checked)}
              />
              <span>{t.eligibility.paid}</span>
            </label>
            <label className="flex cursor-pointer items-start gap-3">
              <input
                type="checkbox"
                className="mt-1 h-4 w-4 rounded border-slate-300 dark:border-white/20"
                checked={honest}
                onChange={(e) => setHonest(e.target.checked)}
              />
              <span>{t.eligibility.honest}</span>
            </label>
          </div>

          {err ? <p className="text-sm text-red-600 dark:text-red-400">{err}</p> : null}

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <button type="button" onClick={continueToApply} className="btn-accent w-full sm:w-auto">
              {t.eligibility.cta}
            </button>
            <Link href="/" className="btn-secondary w-full text-center sm:w-auto">
              {t.eligibility.backHome}
            </Link>
          </div>

          <p className="border-t border-slate-200 pt-4 text-xs leading-relaxed text-slate-500 dark:border-white/10 dark:text-slate-500">
            {t.eligibility.footerHint}{" "}
            <Link href="/story" className="text-brand-sunset underline-offset-2 hover:underline dark:text-brand-onDark">
              {t.eligibility.founderStory}
            </Link>{" "}
            {t.eligibility.footerHint2}
          </p>
        </GlassCard>
      </main>
    </div>
  );
}
