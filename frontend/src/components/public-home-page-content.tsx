'use client';

import Link from 'next/link';
import { useMemo } from 'react';
import { GlassCard } from '@/components/glass-card';
import { SiteFooter } from '@/components/site-footer';
import { SiteHeader } from '@/components/site-header';
import { useLanguage } from '@/contexts/language-context';

type PublicHomePageProps = {
  whatsappDigits: string;
};

export function PublicHomePageContent({ whatsappDigits }: PublicHomePageProps) {
  const { t } = useLanguage();
  const whatsappInquiryHref = useMemo(() => {
    if (!whatsappDigits) return '';
    return `https://wa.me/${whatsappDigits}?text=${encodeURIComponent(t.home.whatsappPreset)}`;
  }, [whatsappDigits, t.home.whatsappPreset]);

  return (
    <div className="noise min-h-screen bg-background bg-hero-radial dark:bg-hero-radial-dark">
      <SiteHeader />

      <main>
        {/* Hero Section */}
        <section className="page-shell pb-16 pt-10 sm:pb-24 sm:pt-16 lg:pt-20">
          <div className="grid gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
            <div>
              <p className="section-eyebrow tracking-[0.28em]">{t.home.eyebrow}</p>
              <h1 className="mt-4 text-[2.1rem] font-semibold leading-[1.1] tracking-tight text-slate-900 dark:text-slate-50 sm:text-5xl lg:text-[3.35rem]">
                {t.home.heroLine1} <span className="text-gradient">{t.home.heroGradient}</span>{' '}
                <span className="text-slate-600 dark:text-slate-400">{t.home.heroLine2}</span>
              </h1>
              <p className="mt-6 max-w-xl text-[1.0625rem] leading-relaxed text-slate-600 dark:text-slate-400 sm:text-lg">
                {t.home.intro}
              </p>
              <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center">
                <Link href="/eligibility" className="btn-accent">
                  {t.home.ctaApply}
                </Link>
                {whatsappInquiryHref ? (
                  <a
                    href={whatsappInquiryHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-social-whatsapp"
                  >
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

        {/* Benefits Section */}
        <section className="page-shell border-t border-slate-200/90 pb-24 pt-16 dark:border-white/10">
          <div className="mx-auto max-w-3xl rounded-2xl border border-brand-sunset/25 bg-gradient-to-br from-brand-sunset/5 to-brand-berry/5 p-8 dark:border-brand-sunset/30 dark:from-brand-sunsetBright/5 dark:to-brand-berry/5 sm:p-12">
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-50 sm:text-3xl">
              Sign Up and Get Access To
            </h2>
            <p className="mt-4 text-slate-600 dark:text-slate-400">
              Join hundreds of developers learning real-world backend development skills.
            </p>
            <ul className="mt-8 grid gap-4 sm:grid-cols-2">
              <li className="flex items-start gap-3">
                <span className="mt-1 inline-flex h-6 w-6 items-center justify-center rounded-full bg-brand-sunset/20 text-sm font-semibold text-brand-sunset dark:bg-brand-onDark/20 dark:text-brand-onDark">
                  ✓
                </span>
                <div>
                  <p className="font-medium text-slate-900 dark:text-slate-50">Complete Curriculum</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">6-month structured backend training</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1 inline-flex h-6 w-6 items-center justify-center rounded-full bg-brand-sunset/20 text-sm font-semibold text-brand-sunset dark:bg-brand-onDark/20 dark:text-brand-onDark">
                  ✓
                </span>
                <div>
                  <p className="font-medium text-slate-900 dark:text-slate-50">Live Classes</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Interactive sessions with mentors</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1 inline-flex h-6 w-6 items-center justify-center rounded-full bg-brand-sunset/20 text-sm font-semibold text-brand-sunset dark:bg-brand-onDark/20 dark:text-brand-onDark">
                  ✓
                </span>
                <div>
                  <p className="font-medium text-slate-900 dark:text-slate-50">Hands-on Projects</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Build real applications with Go</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1 inline-flex h-6 w-6 items-center justify-center rounded-full bg-brand-sunset/20 text-sm font-semibold text-brand-sunset dark:bg-brand-onDark/20 dark:text-brand-onDark">
                  ✓
                </span>
                <div>
                  <p className="font-medium text-slate-900 dark:text-slate-50">Certificates</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Earn recognized credentials</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1 inline-flex h-6 w-6 items-center justify-center rounded-full bg-brand-sunset/20 text-sm font-semibold text-brand-sunset dark:bg-brand-onDark/20 dark:text-brand-onDark">
                  ✓
                </span>
                <div>
                  <p className="font-medium text-slate-900 dark:text-slate-50">Job Placement</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Connect with top companies</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1 inline-flex h-6 w-6 items-center justify-center rounded-full bg-brand-sunset/20 text-sm font-semibold text-brand-sunset dark:bg-brand-onDark/20 dark:text-brand-onDark">
                  ✓
                </span>
                <div>
                  <p className="font-medium text-slate-900 dark:text-slate-50">24/7 Support</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Always there when you need us</p>
                </div>
              </li>
            </ul>

            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <Link href="/login" className="btn-accent w-full sm:w-auto">
                👤 Create Account
              </Link>
              <Link href="/login" className="btn-secondary w-full sm:w-auto">
                🔑 Sign In
              </Link>
            </div>
          </div>
        </section>

        {/* Programs Overview */}
        <section className="page-shell border-t border-slate-200/90 pb-24 pt-16 dark:border-white/10">
          <h2 className="text-center text-2xl font-semibold text-slate-900 dark:text-slate-50 sm:text-3xl">
            Our Programs
          </h2>
          <p className="mt-4 text-center text-slate-600 dark:text-slate-400">
            Choose the program that fits your goals
          </p>

          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                title: 'Backend Developer',
                duration: '6 Months',
                description: 'Master Go, APIs, databases, and deployment',
                features: ['Complete Backend Stack', 'Real Projects', 'Job Ready'],
              },
              {
                title: 'Full Stack Developer',
                duration: '8 Months',
                description: 'Frontend + Backend + DevOps',
                features: ['Frontend Skills', 'Backend Mastery', 'DevOps Basics'],
              },
              {
                title: 'DevOps Engineer',
                duration: '4 Months',
                description: 'Docker, Kubernetes, Cloud deployment',
                features: ['Infrastructure', 'Automation', 'Scaling'],
              },
            ].map((program, idx) => (
              <div
                key={idx}
                className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800"
              >
                <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-50">{program.title}</h3>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{program.duration}</p>
                <p className="mt-4 text-slate-600 dark:text-slate-400">{program.description}</p>
                <ul className="mt-4 space-y-2">
                  {program.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                      <span className="inline-block h-1.5 w-1.5 rounded-full bg-brand-sunset"></span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="page-shell border-t border-slate-200/90 pb-24 pt-16 dark:border-white/10">
          <div className="mx-auto max-w-2xl rounded-2xl bg-gradient-to-r from-brand-sunset to-brand-berry p-8 text-center text-white sm:p-12">
            <h2 className="text-2xl font-semibold sm:text-3xl">Ready to Start Your Journey?</h2>
            <p className="mt-4 text-white/90">
              Join our community of developers and transform your career with hands-on backend development training.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <Link href="/eligibility" className="inline-block rounded-lg bg-white px-6 py-3 font-semibold text-brand-sunset hover:bg-slate-50">
                Apply Now
              </Link>
              <Link href="/pricing" className="inline-block rounded-lg border border-white/30 px-6 py-3 font-semibold hover:bg-white/10">
                View Pricing
              </Link>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
