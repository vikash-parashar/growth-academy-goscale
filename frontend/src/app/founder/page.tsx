"use client";

import Link from "next/link";
import { GlassCard } from "@/components/glass-card";
import { Section } from "@/components/section";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { useLanguage } from "@/contexts/language-context";

export default function FounderSnapshotPage() {
  const { t } = useLanguage();

  return (
    <div className="noise min-h-screen bg-background bg-hero-radial dark:bg-hero-radial-dark">
      <SiteHeader />
      <main>
        <section className="page-shell pb-8 pt-10 sm:pt-14">
          <h1 className="text-3xl font-semibold text-slate-900 dark:text-slate-50">{t.founder.title}</h1>
          <p className="mt-3 max-w-2xl text-sm text-slate-600 dark:text-slate-400">
            {t.founder.introPrefix}{" "}
            <Link href="/story" className="font-medium text-brand-sunset hover:underline dark:text-brand-onDark">
              {t.founder.introLink}
            </Link>{" "}
            {t.founder.introSuffix}
          </p>
        </section>

        <Section eyebrow={t.founder.sectionEyebrow} title={t.founder.sectionTitle}>
          <div className="grid gap-8 lg:grid-cols-2">
            <GlassCard>
              <p className="text-[0.9375rem] leading-relaxed text-slate-700 dark:text-slate-300">{t.founder.p1}</p>
              <p className="mt-4 text-[0.9375rem] leading-relaxed text-slate-600 dark:text-slate-400">{t.founder.p2}</p>
            </GlassCard>
            <GlassCard className="border-brand-sunset/25 dark:border-brand-sunset/25">
              <p className="section-eyebrow tracking-[0.2em]">
                {t.founder.noteLabel}
              </p>
              <p className="mt-4 text-lg font-medium leading-relaxed text-slate-900 dark:text-slate-100 sm:text-xl">{t.founder.quote}</p>
            </GlassCard>
          </div>
        </Section>

        <section className="page-shell pb-20">
          <Link
            href="/story"
            className="inline-flex rounded-full border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-800 shadow-sm transition hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800"
          >
            {t.founder.ctaStory} →
          </Link>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
