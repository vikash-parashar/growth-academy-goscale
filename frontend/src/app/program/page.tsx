"use client";

import Link from "next/link";
import { GlassCard } from "@/components/glass-card";
import { Section } from "@/components/section";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { useLanguage } from "@/contexts/language-context";

export default function ProgramPage() {
  const { t } = useLanguage();

  return (
    <div className="noise min-h-screen bg-background bg-hero-radial dark:bg-hero-radial-dark">
      <SiteHeader />
      <main>
        <section className="page-shell pb-8 pt-10 sm:pt-14">
          <h1 className="text-3xl font-semibold text-slate-900 dark:text-slate-50">{t.program.title}</h1>
          <p className="mt-3 max-w-4xl text-sm leading-relaxed text-slate-600 dark:text-slate-400">
            {t.program.curriculumIntro}
            <Link href="/content" className="font-medium text-brand-sunset underline-offset-2 hover:underline dark:text-brand-onDark">
              {t.program.contentLinkLabel}
            </Link>
            {t.program.curriculumIntroEnd}
          </p>
          <p className="mt-4 max-w-4xl text-sm leading-relaxed text-slate-600 dark:text-slate-400">
            {t.program.introFee}
            <Link href="/pricing" className="font-medium text-brand-sunset underline-offset-2 hover:underline dark:text-brand-onDark">
              {t.program.feeLink}
            </Link>
            {t.program.introFeeEnd}
          </p>
        </section>

        <Section id="why-paid" eyebrow={t.program.whyPaid} title={t.program.freeVsPaidTitle}>
          <div className="grid gap-6 md:grid-cols-2">
            <GlassCard>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">{t.program.freeTitle}</h3>
              <ul className="mt-4 space-y-2.5 text-[0.9375rem] leading-relaxed text-slate-600 dark:text-slate-400">
                <li>{t.program.free1}</li>
                <li>{t.program.free2}</li>
              </ul>
            </GlassCard>
            <GlassCard className="border-brand-berry/40 dark:border-brand-berry/35">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">{t.program.paidTitle}</h3>
              <ul className="mt-4 space-y-2.5 text-[0.9375rem] leading-relaxed text-slate-700 dark:text-slate-300">
                <li>{t.program.paid1}</li>
                <li>{t.program.paid2}</li>
                <li>{t.program.paid3}</li>
              </ul>
            </GlassCard>
          </div>
        </Section>

        <Section id="language" eyebrow={t.program.langEyebrow} title={t.program.langTitle}>
          <GlassCard>
            <p className="text-[0.9375rem] leading-relaxed text-slate-700 dark:text-slate-300">{t.program.langBody}</p>
          </GlassCard>
        </Section>

        <section className="page-shell flex flex-col gap-4 pb-20 sm:flex-row sm:flex-wrap">
          <Link href="/content" className="btn-secondary inline-flex">
            {t.program.ctaContent}
          </Link>
          <Link href="/connect" className="btn-secondary inline-flex">
            {t.program.ctaConnect}
          </Link>
          <Link href="/eligibility" className="btn-accent inline-flex">
            {t.program.cta}
          </Link>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
