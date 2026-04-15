"use client";

import Link from "next/link";
import { useMemo } from "react";
import { GlassCard } from "@/components/glass-card";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { useLanguage } from "@/contexts/language-context";

const EXPLORE_HREFS = [
  "/founder",
  "/story",
  "/podcast",
  "/program",
  "/why-custom-development",
  "/content",
  "/connect",
  "/proof",
  "/pricing",
  "/terms",
  "/jobs",
] as const;

type HomePageContentProps = {
  whatsappDigits: string;
};

export function HomePageContent({ whatsappDigits }: HomePageContentProps) {
  const { t } = useLanguage();
  const whatsappInquiryHref = useMemo(() => {
    if (!whatsappDigits) return "";
    return `https://wa.me/${whatsappDigits}?text=${encodeURIComponent(t.home.whatsappPreset)}`;
  }, [whatsappDigits, t.home.whatsappPreset]);
  const explore = t.home.explore;

  return (
    <div className="noise min-h-screen bg-background bg-hero-radial dark:bg-hero-radial-dark">
      <SiteHeader />

      <main>
        <section className="page-shell pb-16 pt-10 sm:pb-24 sm:pt-16 lg:pt-20">
          <div className="grid gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
            <div>
              <p className="section-eyebrow tracking-[0.28em]">{t.home.eyebrow}</p>
              <h1 className="mt-4 text-[2.1rem] font-semibold leading-[1.1] tracking-tight text-slate-900 dark:text-slate-50 sm:text-5xl lg:text-[3.35rem]">
                {t.home.heroLine1} <span className="text-gradient">{t.home.heroGradient}</span>{" "}
                <span className="text-slate-600 dark:text-slate-400">{t.home.heroLine2}</span>
              </h1>
              <p className="mt-6 max-w-xl text-[1.0625rem] leading-relaxed text-slate-600 dark:text-slate-400 sm:text-lg">{t.home.intro}</p>
              <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center">
                <Link href="/eligibility" className="btn-accent">
                  {t.home.ctaApply}
                </Link>
                {whatsappInquiryHref ? (
                  <a href={whatsappInquiryHref} target="_blank" rel="noopener noreferrer" className="btn-social-whatsapp">
                    {t.home.ctaWhatsApp}
                  </a>
                ) : (
                  <Link href="/eligibility" className="btn-secondary">
                    {t.home.ctaWhatsApp}
                  </Link>
                )}
              </div>
              <p className="mt-4 text-xs leading-relaxed text-slate-500 dark:text-slate-500">{t.home.note}</p>
            </div>
            <GlassCard className="relative overflow-hidden border-brand-sunset/25 dark:border-brand-sunset/30">
              <div className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-brand-sunset/20 blur-3xl dark:bg-brand-sunsetBright/15" />
              <div className="pointer-events-none absolute -bottom-24 -left-16 h-56 w-56 rounded-full bg-brand-berry/15 blur-3xl dark:bg-brand-berry/10" />
              <p className="section-eyebrow mb-4 mt-1 tracking-[0.2em]">{t.home.pipeline}</p>
              <ul className="mt-6 space-y-4 text-[0.9375rem] leading-relaxed text-slate-700 dark:text-slate-300">
                {t.home.pipelineSteps.map((line, i) => (
                  <li key={line} className="flex gap-3">
                    <span className="mt-0.5 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-white text-xs font-mono font-semibold text-brand-sunset shadow-sm dark:border-slate-600 dark:bg-slate-800 dark:text-brand-onDark">
                      {i + 1}
                    </span>
                    {line}
                  </li>
                ))}
              </ul>
            </GlassCard>
          </div>
        </section>

        <section className="page-shell border-t border-slate-200/90 pb-24 pt-16 dark:border-white/10">
          <div className="mx-auto max-w-3xl rounded-2xl border border-brand-sunset/25 bg-gradient-to-br from-brand-sunset/5 to-brand-berry/5 p-8 dark:border-brand-sunset/30 dark:from-brand-sunsetBright/5 dark:to-brand-berry/5 sm:p-12">
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-50 sm:text-3xl">What You Get With Signup</h2>
            <p className="mt-4 text-slate-600 dark:text-slate-400">
              Join hundreds of developers building real systems and landing competitive offers.
            </p>
            <ul className="mt-8 grid gap-4 sm:grid-cols-2">
              <li className="flex items-start gap-3">
                <span className="mt-1 inline-flex h-6 w-6 items-center justify-center rounded-full bg-brand-sunset/20 text-sm font-semibold text-brand-sunset dark:bg-brand-onDark/20 dark:text-brand-onDark">✓</span>
                <div>
                  <p className="font-medium text-slate-900 dark:text-slate-50">Live Mentorship</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Weekly accountability sprints with founder</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1 inline-flex h-6 w-6 items-center justify-center rounded-full bg-brand-sunset/20 text-sm font-semibold text-brand-sunset dark:bg-brand-onDark/20 dark:text-brand-onDark">✓</span>
                <div>
                  <p className="font-medium text-slate-900 dark:text-slate-50">Interview Prep</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Real-world mock interviews and feedback</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1 inline-flex h-6 w-6 items-center justify-center rounded-full bg-brand-sunset/20 text-sm font-semibold text-brand-sunset dark:bg-brand-onDark/20 dark:text-brand-onDark">✓</span>
                <div>
                  <p className="font-medium text-slate-900 dark:text-slate-50">Job Market Access</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Curated Go & AI roles from public APIs</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1 inline-flex h-6 w-6 items-center justify-center rounded-full bg-brand-sunset/20 text-sm font-semibold text-brand-sunset dark:bg-brand-onDark/20 dark:text-brand-onDark">✓</span>
                <div>
                  <p className="font-medium text-slate-900 dark:text-slate-50">Learning Resources</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Custom Go bootcamp curriculum & docs</p>
                </div>
              </li>
            </ul>
            <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Link href="/signup" className="btn-accent px-8 py-3 text-center text-sm font-medium">
                Start Your Journey Free
              </Link>
              <p className="text-xs text-slate-600 dark:text-slate-400">No credit card needed. Complete eligibility form first.</p>
            </div>
          </div>
        </section>

        <section className="page-shell border-t border-slate-200/90 pb-24 pt-16 dark:border-white/10">
          <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-50 sm:text-2xl">{t.home.exploreTitle}</h2>
          <p className="mt-2 max-w-2xl text-sm text-slate-600 dark:text-slate-400">
            {t.home.exploreBodyPrefix}{" "}
            <Link href="/pricing" className="font-medium text-brand-sunset hover:underline dark:text-brand-onDark">
              {t.home.exploreInvestment}
            </Link>{" "}
            {t.home.exploreBodySuffix}
          </p>
          <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {EXPLORE_HREFS.map((href, idx) => {
              const item = explore[idx];
              if (!item) return null;
              return (
                <li key={href}>
                  <Link
                    href={href}
                    className="block rounded-2xl border border-slate-200/90 bg-slate-50/80 p-5 shadow-sm transition hover:border-brand-sunset/40 hover:bg-white hover:shadow-md dark:border-white/10 dark:bg-slate-900/40 dark:hover:bg-slate-900/70"
                  >
                    <p className="font-semibold text-slate-900 dark:text-slate-50">{item.title}</p>
                    <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">{item.desc}</p>
                    <span className="mt-3 inline-block text-sm font-medium text-brand-sunset dark:text-brand-onDark">
                      {t.home.exploreOpen} →
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </section>

        <section className="page-shell pb-24 pt-4">
          <GlassCard className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
            <div>
              <h2 className="text-xl font-semibold tracking-tight text-slate-900 dark:text-slate-50 sm:text-2xl md:text-[1.75rem]">{t.home.ctaBandTitle}</h2>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">{t.home.ctaBandSub}</p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Link href="/eligibility" className="btn-accent px-8 py-3 text-sm">
                {t.home.startEligibility}
              </Link>
            </div>
          </GlassCard>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
