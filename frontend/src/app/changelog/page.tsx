import type { Metadata } from "next";
import Link from "next/link";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { CHANGELOG } from "@/lib/changelog";
import { getSiteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "What’s new",
  description: "Product updates and shipped improvements for Gopher Lab.",
  openGraph: {
    title: "What’s new · Gopher Lab",
    description: "Changelog of recent improvements to the site and internal tools.",
    url: `${getSiteUrl()}/changelog`,
  },
};

export default function ChangelogPage() {
  return (
    <div className="noise min-h-screen bg-background bg-hero-radial dark:bg-hero-radial-dark">
      <SiteHeader />
      <main className="page-shell pb-24 pt-12 sm:pt-16">
        <p className="section-eyebrow">Product</p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900 dark:text-slate-50 sm:text-4xl">
          What&apos;s new
        </h1>
        <p className="mt-3 max-w-2xl text-slate-600 dark:text-slate-400">
          A lightweight log of what we ship. Bigger narrative lives on the{" "}
          <Link href="/story" className="text-brand-sunset underline-offset-4 hover:underline dark:text-brand-onDark">
            founder story
          </Link>
          .
        </p>

        <ol className="mt-12 space-y-10 border-l border-slate-200 pl-6 dark:border-white/10">
          {CHANGELOG.map((entry) => (
            <li key={entry.date + entry.title} className="relative">
              <span className="absolute -left-[calc(0.25rem+1px)] top-1.5 h-2 w-2 -translate-x-1/2 rounded-full bg-brand-sunset/100 ring-4 ring-white dark:ring-slate-950" />
              <time
                dateTime={entry.date}
                className="font-mono text-xs uppercase tracking-widest text-slate-500 dark:text-slate-500"
              >
                {entry.date}
              </time>
              <h2 className="mt-2 text-xl font-semibold text-slate-900 dark:text-slate-100">{entry.title}</h2>
              <ul className="mt-3 list-inside list-disc space-y-1.5 text-[0.9375rem] text-slate-600 dark:text-slate-400">
                {entry.bullets.map((b) => (
                  <li key={b}>{b}</li>
                ))}
              </ul>
            </li>
          ))}
        </ol>

        <p className="mt-14 text-sm text-slate-500 dark:text-slate-500">
          <Link href="/" className="text-brand-sunset hover:underline dark:text-brand-onDark">
            ← Back to home
          </Link>
        </p>
      </main>
      <SiteFooter showBackToHome />
    </div>
  );
}
