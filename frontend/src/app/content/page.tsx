"use client";

import Link from "next/link";
import { GlassCard } from "@/components/glass-card";
import { Section } from "@/components/section";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { CONTENT_YOUTUBE_LINKS } from "@/data/content-youtube-links";
import { useLanguage } from "@/contexts/language-context";

export default function ContentPage() {
  const { t } = useLanguage();
  const p = t.contentPage;

  return (
    <div className="noise min-h-screen bg-background bg-hero-radial dark:bg-hero-radial-dark">
      <SiteHeader />
      <main>
        <section className="page-shell pb-8 pt-10 sm:pt-14">
          <p className="section-eyebrow">{p.eyebrow}</p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900 dark:text-slate-50 sm:text-4xl">{p.title}</h1>
          <p className="mt-4 max-w-4xl text-sm leading-relaxed text-slate-600 dark:text-slate-400 sm:text-[0.9375rem]">{p.intro}</p>
        </section>

        <Section id="ai-go" eyebrow={p.aiGoEyebrow} title={p.aiGoTitle}>
          <GlassCard>
            <p className="whitespace-pre-line text-[0.9375rem] leading-relaxed text-slate-700 dark:text-slate-300">{p.aiGoBody}</p>
          </GlassCard>
        </Section>

        <Section id="pillars" eyebrow={p.tracksEyebrow} title={p.tracksTitle}>
          <p className="-mt-4 mb-8 max-w-3xl text-sm text-slate-600 dark:text-slate-400">{p.tracksIntro}</p>
          <ul className="grid gap-5 sm:grid-cols-2">
            {p.tracks.map((track) => (
              <li key={track.title}>
                <GlassCard className="h-full border-brand-sunset/30 dark:border-brand-sunset/25">
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-50">{track.title}</h3>
                    <span className="shrink-0 rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wide text-amber-900 dark:bg-amber-950/60 dark:text-amber-200">
                      {p.comingSoon}
                    </span>
                  </div>
                  <p className="mt-3 text-sm leading-relaxed text-slate-600 dark:text-slate-400">{track.desc}</p>
                </GlassCard>
              </li>
            ))}
          </ul>
        </Section>

        <Section id="delivery" eyebrow={p.deliveryEyebrow} title={p.deliveryTitle}>
          <GlassCard>
            <p className="whitespace-pre-line text-[0.9375rem] leading-relaxed text-slate-700 dark:text-slate-300">{p.deliveryBody}</p>
          </GlassCard>
        </Section>

        <section className="page-shell pb-10">
          <h2 className="text-xl font-semibold tracking-tight text-slate-900 dark:text-slate-50 sm:text-2xl">{p.youtubeTitle}</h2>
          <p className="mt-2 max-w-3xl text-sm text-slate-600 dark:text-slate-400">{p.youtubeIntro}</p>
          {CONTENT_YOUTUBE_LINKS.length === 0 ? (
            <div className="mt-6 rounded-2xl border border-dashed border-slate-300 bg-stone-50/80 px-5 py-10 text-center dark:border-slate-600 dark:bg-slate-900/40">
              <p className="text-sm text-slate-600 dark:text-slate-400">{p.youtubeEmpty}</p>
            </div>
          ) : (
            <ul className="mt-6 space-y-2">
              {CONTENT_YOUTUBE_LINKS.map((row) => (
                <li key={row.id}>
                  <a
                    href={row.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white/80 px-4 py-3 text-sm font-medium text-slate-800 transition hover:border-red-200 dark:border-white/10 dark:bg-slate-900/50 dark:text-slate-100"
                  >
                    <span>{row.label}</span>
                    <span className="btn-social-youtube btn-social-pill-sm shrink-0 font-sans">YouTube →</span>
                  </a>
                </li>
              ))}
            </ul>
          )}
        </section>

        <Section id="docs" eyebrow={p.docsEyebrow} title={p.docsTitle}>
          <div className="space-y-5">
            <GlassCard>
              <p className="text-[0.9375rem] leading-relaxed text-slate-700 dark:text-slate-300">{p.docsBody}</p>
            </GlassCard>
            <GlassCard className="border-brand-sunset/35 dark:border-brand-sunset/30">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-50">{p.deploymentGuideTitle}</h3>
              <p className="mt-3 text-[0.9375rem] leading-relaxed text-slate-700 dark:text-slate-300">
                {p.deploymentGuideBody}
              </p>
              <Link
                href="/content/deployment"
                className="mt-5 inline-flex rounded-full border border-brand-sunset/50 bg-brand-sunset/10 px-4 py-2.5 text-sm font-semibold text-brand-sunset underline-offset-2 transition hover:border-brand-sunset hover:bg-brand-sunset/15 dark:border-brand-onDark/50 dark:bg-brand-onDark/10 dark:text-brand-onDark dark:hover:bg-brand-onDark/20"
              >
                {p.deploymentGuideCta} →
              </Link>
            </GlassCard>
            <GlassCard>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-50">Learning hub</h3>
              <p className="mt-3 text-[0.9375rem] leading-relaxed text-slate-700 dark:text-slate-300">
                Beginner-first tutorials with examples: Start here explains computers, servers, HTTP, APIs, DNS, and localhost in
                plain language; then Go basics and advanced (including net/http, cookies, and tokens), plus HTTP, the internet,
                Docker, CI/CD, and AWS.
              </p>
              <Link
                href="/learning"
                className="mt-5 inline-flex rounded-full border border-slate-300 bg-white/80 px-4 py-2.5 text-sm font-semibold text-slate-800 underline-offset-2 transition hover:border-brand-sunset/50 hover:text-brand-sunset dark:border-slate-600 dark:bg-slate-900/50 dark:text-slate-100 dark:hover:border-brand-onDark/50 dark:hover:text-brand-onDark"
              >
                Open learning hub →
              </Link>
            </GlassCard>
          </div>
        </Section>

        <section className="page-shell flex flex-col gap-4 pb-20 sm:flex-row sm:flex-wrap">
          <Link href="/program" className="btn-secondary inline-flex">
            {p.ctaProgram}
          </Link>
          <Link href="/pricing" className="btn-secondary inline-flex">
            {p.ctaPricing}
          </Link>
          <Link href="/connect" className="btn-accent inline-flex">
            {p.ctaConnect}
          </Link>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
