"use client";

import Link from "next/link";
import { PodcastFeature } from "@/components/podcast-feature";
import { Section } from "@/components/section";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { useLanguage } from "@/contexts/language-context";

export default function PodcastPage() {
  const { t } = useLanguage();

  return (
    <div className="noise min-h-screen bg-background bg-hero-radial dark:bg-hero-radial-dark">
      <SiteHeader />
      <main>
        <Section id="podcast" eyebrow={t.podcastPage.eyebrow} title={t.podcastPage.title}>
          <PodcastFeature />
        </Section>
        <section className="page-shell pb-20">
          <p className="text-sm text-slate-600 dark:text-slate-400">
            {t.podcastPage.hintPrefix}{" "}
            <Link href="/pricing" className="font-medium text-brand-sunset hover:underline dark:text-brand-onDark">
              {t.podcastPage.hintLink}
            </Link>{" "}
            {t.podcastPage.hintSuffix}
          </p>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
