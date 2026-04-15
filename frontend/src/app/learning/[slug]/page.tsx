import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { DeploymentGuideBlocks } from "@/components/deployment-guide-blocks";
import { GlassCard } from "@/components/glass-card";
import { LearningSubnav } from "@/components/learning-subnav";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { getAllLearningSlugs, getLearningTopic } from "@/data/learning-hub";
import { getSiteUrl } from "@/lib/site";

type Props = { params: { slug: string } };

export function generateStaticParams() {
  return getAllLearningSlugs().map((slug) => ({ slug }));
}

export function generateMetadata({ params }: Props): Metadata {
  const topic = getLearningTopic(params.slug);
  if (!topic) {
    return { title: "Learning" };
  }
  const url = `${getSiteUrl()}/learning/${topic.slug}`;
  return {
    title: topic.title,
    description: topic.description,
    openGraph: { url, title: `${topic.title} · Gopher Lab` },
  };
}

export default function LearningTopicPage({ params }: Props) {
  const topic = getLearningTopic(params.slug);
  if (!topic) {
    notFound();
  }

  return (
    <div className="noise min-h-screen bg-background bg-hero-radial dark:bg-hero-radial-dark">
      <SiteHeader />
      <main>
        <section className="page-shell pb-6 pt-10 sm:pt-14">
          <p className="section-eyebrow">Learning hub</p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900 dark:text-slate-50 sm:text-4xl">{topic.title}</h1>
          <p className="mt-4 max-w-4xl text-[0.9375rem] leading-relaxed text-slate-600 dark:text-slate-400">{topic.intro}</p>
        </section>

        <LearningSubnav />

        <nav className="page-shell pb-10" aria-label="On this page">
          <GlassCard className="border-brand-sunset/25 dark:border-brand-sunset/20">
            <p className="text-xs font-semibold uppercase tracking-wide text-brand-sunset dark:text-brand-onDark">On this page</p>
            <ol className="mt-4 grid gap-2 sm:grid-cols-2">
              {topic.sections.map((s, idx) => (
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
          {topic.sections.map((section) => (
            <section key={section.id} id={section.id} className="scroll-mt-28">
              <div className="mb-4">
                {section.eyebrow ? (
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">{section.eyebrow}</p>
                ) : null}
                <h2 className="mt-1 text-xl font-semibold tracking-tight text-slate-900 dark:text-slate-50 sm:text-2xl">{section.title}</h2>
              </div>
              <GlassCard>
                <DeploymentGuideBlocks blocks={section.blocks} />
              </GlassCard>
            </section>
          ))}
        </div>

        <section className="page-shell flex flex-col gap-3 pb-20 sm:flex-row sm:flex-wrap">
          <Link href="/content" className="btn-secondary inline-flex">
            Content & courses
          </Link>
          <Link href="/content/deployment" className="btn-secondary inline-flex">
            Deployment guide
          </Link>
          <Link href="/" className="btn-accent inline-flex">
            Home
          </Link>
        </section>
      </main>
      <SiteFooter showBackToHome />
    </div>
  );
}
