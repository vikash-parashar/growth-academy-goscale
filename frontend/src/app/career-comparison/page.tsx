import type { Metadata } from "next";
import dynamic from "next/dynamic";
import Link from "next/link";
import { GlassCard } from "@/components/glass-card";
import { Section } from "@/components/section";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { getSiteUrl } from "@/lib/site";

const GoLangAiSection = dynamic(
  () => import("@/components/career-comparison/go-lang-ai-section").then((m) => m.GoLangAiSection),
  {
    ssr: false,
    loading: () => (
      <div className="page-shell py-16">
        <div className="h-64 animate-pulse rounded-2xl bg-slate-200/50 dark:bg-white/5" />
      </div>
    ),
  },
);

const DeveloperSalaryComparison = dynamic(
  () => import("@/components/career-comparison/developer-salary-comparison").then((m) => m.DeveloperSalaryComparison),
  {
    ssr: false,
    loading: () => (
      <div className="page-shell py-16">
        <div className="h-64 animate-pulse rounded-2xl bg-slate-200/50 dark:bg-white/5" />
      </div>
    ),
  },
);

export const metadata: Metadata = {
  title: "Business vs private IT vs government job",
  description:
    "Compare business, private IT, and government prep. Plus: developer salaries globally (Go vs Python, Java, etc.), India vs USA markets, and earning potential with experience.",
  openGraph: {
    title: "Career paths compared · Gopher Lab",
    url: `${getSiteUrl()}/career-comparison`,
  },
};

export default function CareerComparisonPage() {
  return (
    <div className="noise min-h-screen bg-background bg-hero-radial dark:bg-hero-radial-dark">
      <SiteHeader />

      <main>
        <section className="page-shell pb-8 pt-10 sm:pt-16">
          <p className="section-eyebrow tracking-[0.28em]">
            Perspective
          </p>
          <h1 className="mt-4 text-[2rem] font-semibold leading-tight tracking-tight text-slate-900 dark:text-slate-50 sm:text-4xl md:text-[2.75rem]">
            Business, private IT, or government job?
          </h1>
          <p className="mt-5 max-w-3xl text-[1.0625rem] leading-relaxed text-slate-600 dark:text-slate-400 sm:text-lg">
            No path is “bad” — each has a different price tag in{" "}
            <span className="font-medium text-slate-800 dark:text-slate-200">money, time, risk, and freedom</span>. Below is a
            straight comparison so you can think clearly — especially if you are weighing years of prep against building
            skills that pay in the market.
          </p>
        </section>

        <Section
          id="overview"
          eyebrow="SNAPSHOT"
          title="Three lanes — what you typically pay (not just fees)"
        >
          <div className="overflow-x-auto rounded-2xl border border-slate-200/90 dark:border-white/10">
            <table className="min-w-[640px] w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/90 text-xs uppercase tracking-wide text-slate-500 dark:border-white/10 dark:bg-slate-900/60 dark:text-slate-400">
                  <th className="px-4 py-3 font-medium">Dimension</th>
                  <th className="px-4 py-3 font-medium">Business</th>
                  <th className="px-4 py-3 font-medium">Private sector (esp. IT)</th>
                  <th className="px-4 py-3 font-medium">Government job</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200/80 text-slate-700 dark:divide-white/10 dark:text-slate-300">
                <tr>
                  <td className="px-4 py-3 font-medium text-slate-900 dark:text-slate-100">Upfront money</td>
                  <td className="px-4 py-3">Capital, inventory, tools, legal — often lumpy and risky.</td>
                  <td className="px-4 py-3">Mostly laptop, courses, internet — scales with how you learn.</td>
                  <td className="px-4 py-3">Coaching, forms, travel, stays — adds up over multiple attempts.</td>
                </tr>
                <tr className="bg-slate-50/50 dark:bg-white/[0.02]">
                  <td className="px-4 py-3 font-medium text-slate-900 dark:text-slate-100">Time horizon</td>
                  <td className="px-4 py-3">Uncertain; revenue may take years.</td>
                  <td className="px-4 py-3">Skills compound; interviews reward proof of work.</td>
                  <td className="px-4 py-3">Long cycles: syllabus, tests, sometimes years of attempts.</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-medium text-slate-900 dark:text-slate-100">Selection</td>
                  <td className="px-4 py-3">Market — customers pay if you solve a problem.</td>
                  <td className="px-4 py-3">Employers hire for skills, output, and fit.</td>
                  <td className="px-4 py-3">Exam + rules + quotas + physicals + eligibility.</td>
                </tr>
                <tr className="bg-slate-50/50 dark:bg-white/[0.02]">
                  <td className="px-4 py-3 font-medium text-slate-900 dark:text-slate-100">Location</td>
                  <td className="px-4 py-3">Often local at first; can expand later.</td>
                  <td className="px-4 py-3">Remote / hybrid / global teams are common in IT.</td>
                  <td className="px-4 py-3">People often move states for coaching, tests, or postings.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </Section>

        <Section id="business" eyebrow="BUSINESS" title="Building a business — freedom with full risk">
          <GlassCard>
            <p className="text-[0.9375rem] leading-relaxed text-slate-700 dark:text-slate-300">
              A business can unlock upside, but you pay in{" "}
              <strong className="font-medium text-slate-900 dark:text-slate-100">capital risk, ops stress, compliance, and volatility</strong>. There
              is no fixed “salary day” — cash flow, reputation, and execution decide outcomes. Many succeed; many learn
              expensive lessons. It is a valid path — just know you are trading predictability for optionality.
            </p>
          </GlassCard>
        </Section>

        <Section id="govt" eyebrow="GOVERNMENT" title="Government preparation — cost beyond books">
          <div className="grid gap-6 lg:grid-cols-2">
            <GlassCard>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">What preparation often costs</h3>
              <ul className="mt-4 list-inside list-disc space-y-2 text-[0.9375rem] leading-relaxed text-slate-600 dark:text-slate-400">
                <li>Coaching fees, test series, study material — year on year.</li>
                <li>Application fees, travel to exam centers, sometimes multiple states.</li>
                <li>Physical tests, medicals, document runs — time and money.</li>
                <li>Staying away from home for coaching or exams — rent and emotional cost.</li>
                <li>Years of attempts while peers move ahead in other tracks.</li>
              </ul>
            </GlassCard>
            <GlassCard className="border-amber-200/80 dark:border-amber-500/25">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">A hard truth (bribery)</h3>
              <p className="mt-3 text-[0.9375rem] leading-relaxed text-slate-700 dark:text-slate-300">
                Some people face pressure around{" "}
                <strong className="font-medium text-slate-900 dark:text-slate-100">illegal shortcuts</strong> — paying
                third parties (“rishwat” / bribes) to influence selection. It is unethical, risky, and can destroy careers
                and families. We are not glorifying it; we are naming it because silence helps no one. Merit-based prep
                and clean process are slower — but they stay yours.
              </p>
            </GlassCard>
          </div>
        </Section>

        <Section id="it" eyebrow="PRIVATE IT" title="IT in the private sector — skill as leverage">
          <GlassCard className="border-brand-sunset/25 dark:border-brand-sunset/30">
            <p className="text-[0.9375rem] leading-relaxed text-slate-700 dark:text-slate-300">
              In much of the <strong className="font-medium text-slate-900 dark:text-slate-100">private IT market</strong>,
              your leverage is{" "}
              <strong className="font-medium text-slate-900 dark:text-slate-100">what you can build, debug, ship, and communicate</strong>.
              Packages can grow faster than many assume — especially with strong fundamentals, English, and exposure to
              product companies or global teams. Remote and US-aligned roles reward{" "}
              <strong className="font-medium text-slate-900 dark:text-slate-100">proof</strong>: GitHub, projects, system
              thinking, and interview performance.
            </p>
            <p className="mt-4 text-[0.9375rem] leading-relaxed text-slate-700 dark:text-slate-300">
              You still pay a price: <strong className="font-medium text-slate-900 dark:text-slate-100">discipline</strong>,{" "}
              <strong className="font-medium text-slate-900 dark:text-slate-100">learning hours</strong>, and sometimes{" "}
              <strong className="font-medium text-slate-900 dark:text-slate-100">mentorship</strong> — but the game rewards
              skill more directly than many traditional ladders.{" "}
              <strong className="font-medium text-slate-900 dark:text-slate-100">
                Good faith, honesty, and hard work compound
              </strong>{" "}
              when you work in teams that value output — and when you refuse to cut corners on fundamentals.
            </p>
          </GlassCard>
        </Section>

        <Section id="mindset" eyebrow="MINDSET" title="Earning potential — why IT surprises people">
          <div className="grid gap-6 md:grid-cols-2">
            <GlassCard>
              <p className="text-[0.9375rem] leading-relaxed text-slate-700 dark:text-slate-300">
                Many underestimate how high income can go in tech{" "}
                <span className="font-medium text-slate-900 dark:text-slate-100">if skills stack over 3–7 years</span>: better
                problem-solving, better systems, better communication, and better companies. It is not magic — it is{" "}
                <span className="font-medium text-slate-900 dark:text-slate-100">repetition + feedback + ambition</span>.
              </p>
            </GlassCard>
            <GlassCard>
              <p className="text-[0.9375rem] leading-relaxed text-slate-700 dark:text-slate-300">
                No path guarantees anything. But private IT often lets you{" "}
                <span className="font-medium text-slate-900 dark:text-slate-100">re-test the market</span> with new skills,
                unlike a single-day exam that defines a whole year. That flexibility is part of earning potential.
              </p>
            </GlassCard>
          </div>
        </Section>

        <GoLangAiSection />

        <DeveloperSalaryComparison />

        <section className="page-shell pb-24 pt-4">
          <GlassCard className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
            <div>
              <h2 className="text-xl font-semibold tracking-tight text-slate-900 dark:text-slate-50 sm:text-2xl">
                Check your aptitude — then apply
              </h2>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                Mock test (50% pass) · honest application · fit call.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Link href="/mock-test" className="btn-accent px-8 py-3 text-sm">
                Take mock test
              </Link>
              <Link href="/eligibility" className="btn-secondary px-8 py-3 text-sm font-medium">
                Apply
              </Link>
            </div>
          </GlassCard>
        </section>
      </main>

      <SiteFooter showBackToHome />
    </div>
  );
}
