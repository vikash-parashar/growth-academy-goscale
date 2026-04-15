"use client";

import Link from "next/link";
import { DeploymentGuideBlocks } from "@/components/deployment-guide-blocks";
import { GlassCard } from "@/components/glass-card";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { DEPLOYMENT_GUIDE_SECTIONS } from "@/data/deployment-guide-sections";
import { useLanguage } from "@/contexts/language-context";

export default function DeploymentGuidePage() {
  const { t } = useLanguage();
  const g = t.deploymentGuidePage;

  return (
    <div className="noise min-h-screen bg-background bg-hero-radial dark:bg-hero-radial-dark">
      <SiteHeader />
      <main>
        <section className="page-shell pb-8 pt-10 sm:pt-14">
          <p className="section-eyebrow">{g.eyebrow}</p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900 dark:text-slate-50 sm:text-4xl">
            {g.title}
          </h1>
          <p className="mt-4 max-w-4xl text-[0.9375rem] leading-relaxed text-slate-600 dark:text-slate-400">{g.intro}</p>
          <p className="mt-3 text-sm text-slate-600 dark:text-slate-400">{g.repoNote}</p>
        </section>

        <nav
          className="page-shell pb-10"
          aria-label={g.tocAriaLabel}
        >
          <GlassCard className="border-brand-sunset/25 dark:border-brand-sunset/20">
            <p className="text-xs font-semibold uppercase tracking-wide text-brand-sunset dark:text-brand-onDark">
              {g.tocTitle}
            </p>
            <ol className="mt-4 grid gap-2 sm:grid-cols-2">
              {DEPLOYMENT_GUIDE_SECTIONS.map((s, idx) => (
                <li key={s.id}>
                  <a
                    href={`#${s.id}`}
                    className="text-sm font-medium text-slate-800 underline-offset-2 hover:text-brand-sunset hover:underline dark:text-slate-200 dark:hover:text-brand-onDark"
                  >
                    <span className="text-slate-400 dark:text-slate-500">{idx + 1}. </span>
                    {s.title}
                  </a>
                </li>
              ))}
            </ol>
          </GlassCard>
        </nav>

        <div className="page-shell space-y-12 pb-20">
          {DEPLOYMENT_GUIDE_SECTIONS.map((section) => (
            <section key={section.id} id={section.id} className="scroll-mt-28">
              <div className="mb-4">
                {section.eyebrow ? (
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                    {section.eyebrow}
                  </p>
                ) : null}
                <h2 className="mt-1 text-xl font-semibold tracking-tight text-slate-900 dark:text-slate-50 sm:text-2xl">
                  {section.title}
                </h2>
              </div>
              <GlassCard>
                <DeploymentGuideBlocks blocks={section.blocks} />
              </GlassCard>
            </section>
          ))}
        </div>

        <section className="page-shell pb-20">
          <Link href="/content" className="btn-secondary inline-flex">
            {g.backToContent}
          </Link>
        </section>
      </main>
      <SiteFooter showBackToHome />
    </div>
  );
}
