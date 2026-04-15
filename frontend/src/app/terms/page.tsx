"use client";

import Link from "next/link";
import { GlassCard } from "@/components/glass-card";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { useLanguage } from "@/contexts/language-context";

export default function TermsPage() {
  const { t } = useLanguage();

  return (
    <div className="noise min-h-screen bg-background bg-hero-radial dark:bg-hero-radial-dark">
      <SiteHeader />
      <main className="page-shell py-12 sm:py-16">
        <h1 className="text-3xl font-semibold text-slate-900 dark:text-slate-50">{t.terms.title}</h1>
        <p className="mt-3 text-sm text-slate-600 dark:text-slate-400">{t.terms.intro}</p>
        <GlassCard className="mt-8">
          <ul className="list-inside list-disc space-y-2.5 text-[0.9375rem] leading-relaxed text-slate-600 dark:text-slate-400">
            <li>{t.terms.li1}</li>
            <li>{t.terms.li2}</li>
            <li>{t.terms.li3}</li>
            <li>{t.terms.li4}</li>
          </ul>
          <p className="mt-4 text-xs leading-relaxed text-slate-500 dark:text-slate-500">{t.terms.footnote}</p>
        </GlassCard>
        <p className="mt-8">
          <Link href="/eligibility" className="text-brand-sunset underline-offset-2 hover:underline dark:text-brand-onDark">
            {t.terms.applyLink}
          </Link>
        </p>
      </main>
      <SiteFooter />
    </div>
  );
}
