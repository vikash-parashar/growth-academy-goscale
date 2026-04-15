"use client";

import Link from "next/link";
import { useMemo } from "react";
import { GlassCard } from "@/components/glass-card";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { FOUNDER_FACEBOOK_URL, FOUNDER_INSTAGRAM_URL, FOUNDER_LINKEDIN_URL } from "@/lib/site-links";
import { useLanguage } from "@/contexts/language-context";

export function ConnectPageContent({ whatsappDigits }: { whatsappDigits: string }) {
  const { t } = useLanguage();
  const p = t.connectPage;
  const whatsappHref = useMemo(() => {
    if (!whatsappDigits) return "";
    return `https://wa.me/${whatsappDigits}?text=${encodeURIComponent(p.whatsappPreset)}`;
  }, [whatsappDigits, p.whatsappPreset]);

  return (
    <div className="noise min-h-screen bg-background bg-hero-radial dark:bg-hero-radial-dark">
      <SiteHeader />
      <main className="page-shell py-12 sm:py-16">
        <p className="section-eyebrow">{p.eyebrow}</p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900 dark:text-slate-50 sm:text-4xl">{p.title}</h1>
        <p className="mt-4 max-w-3xl text-sm leading-relaxed text-slate-600 dark:text-slate-400 sm:text-[0.9375rem]">{p.intro}</p>

        <div className="mt-10 grid gap-6 md:grid-cols-2">
          <GlassCard>
            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">{p.whatsappTitle}</h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">{p.whatsappBody}</p>
            {whatsappHref ? (
              <a href={whatsappHref} target="_blank" rel="noopener noreferrer" className="btn-social-whatsapp mt-5 inline-flex">
                {p.whatsappCta}
              </a>
            ) : (
              <p className="mt-4 text-xs text-amber-800 dark:text-amber-200/90">{p.whatsappMissing}</p>
            )}
          </GlassCard>

          <GlassCard>
            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">{p.socialTitle}</h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">{p.socialBody}</p>
            <div className="mt-5 flex flex-wrap gap-3">
              <a href={FOUNDER_LINKEDIN_URL} target="_blank" rel="noopener noreferrer" className="btn-social-linkedin">
                {p.linkedinLabel}
              </a>
              <a href={FOUNDER_INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" className="btn-social-instagram">
                {p.instagramLabel}
              </a>
              {FOUNDER_FACEBOOK_URL ? (
                <a href={FOUNDER_FACEBOOK_URL} target="_blank" rel="noopener noreferrer" className="btn-social-facebook">
                  {p.facebookLabel}
                </a>
              ) : null}
            </div>
          </GlassCard>

          <GlassCard className="md:col-span-2">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">{p.bookTitle}</h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">{p.bookBody}</p>
            <Link href="/book" className="btn-secondary mt-5 inline-flex text-sm">
              {p.bookCta}
            </Link>
          </GlassCard>
        </div>

        <div className="mt-10 flex flex-wrap gap-3">
          <Link href="/eligibility" className="btn-accent inline-flex">
            {p.ctaEligibility}
          </Link>
          <Link href="/content" className="btn-secondary inline-flex">
            {p.ctaContent}
          </Link>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
