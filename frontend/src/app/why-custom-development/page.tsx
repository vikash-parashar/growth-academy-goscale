import type { Metadata } from "next";
import Link from "next/link";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { GlassCard } from "@/components/glass-card";

export const metadata: Metadata = {
  title: "Why Custom App Development — Gopher Lab",
  description:
    "Understand the difference between pre-built web builders (Wix, Squarespace) and custom app development. Learn why platforms take 1-3 years to build and what you gain through learning to code.",
};

export default function WhyCustomDevelopmentPage() {
  return (
    <div className="noise min-h-screen bg-background bg-hero-radial dark:bg-hero-radial-dark">
      <SiteHeader />

      <main className="page-shell">
        {/* Hero Section */}
        <section className="pb-16 pt-12 sm:pb-24 sm:pt-16 lg:pt-20">
          <p className="section-eyebrow tracking-[0.28em]">LEARNING PATH</p>
          <h1 className="mt-4 text-[2.1rem] font-semibold leading-[1.1] tracking-tight text-slate-900 dark:text-slate-50 sm:text-5xl lg:text-[3.35rem]">
            Why Custom <span className="text-gradient">Development</span> Matters
          </h1>
          <p className="mt-6 max-w-2xl text-[1.0625rem] leading-relaxed text-slate-600 dark:text-slate-400 sm:text-lg">
            You've seen Wix build sites in hours. You've wondered why backend platforms take 1-3 years. Here's the real difference — and why it matters for your career.
          </p>
        </section>

        {/* Quick Comparison Table */}
        <section className="border-t border-slate-200/90 pb-16 pt-16 dark:border-white/10 sm:pb-24 sm:pt-20">
          <div className="mb-10">
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-50 sm:text-3xl">The Quick Answer</h2>
            <p className="mt-3 max-w-2xl text-slate-600 dark:text-slate-400">
              These are different problems solving different needs. Neither is wrong &mdash; they&apos;re built for different outcomes.
            </p>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            {/* Pre-built builders card */}
            <GlassCard className="border-emerald-500/20 dark:border-emerald-500/15">
              <div className="mb-6">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-lg bg-emerald-500/10">
                  <span className="text-2xl">🏗️</span>
                </div>
                <h3 className="mt-4 text-xl font-semibold text-slate-900 dark:text-slate-50">Pre-built Builders (Wix, Squarespace, WebFlow)</h3>
              </div>
              <ul className="space-y-3 text-sm text-slate-600 dark:text-slate-400">
                <li className="flex gap-2">
                  <span className="font-semibold text-emerald-600 dark:text-emerald-400">•</span>
                  <span>Hours to days to launch</span>
                </li>
                <li className="flex gap-2">
                  <span className="font-semibold text-emerald-600 dark:text-emerald-400">•</span>
                  <span>No coding experience needed</span>
                </li>
                <li className="flex gap-2">
                  <span className="font-semibold text-emerald-600 dark:text-emerald-400">•</span>
                  <span>Drag-and-drop UI builder</span>
                </li>
                <li className="flex gap-2">
                  <span className="font-semibold text-emerald-600 dark:text-emerald-400">•</span>
                  <span>Fixed templates and patterns</span>
                </li>
                <li className="flex gap-2">
                  <span className="font-semibold text-emerald-600 dark:text-emerald-400">•</span>
                  <span>$10-100/month pricing</span>
                </li>
              </ul>
            </GlassCard>

            {/* Custom Development card */}
            <GlassCard className="border-blue-500/20 dark:border-blue-500/15">
              <div className="mb-6">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-lg bg-blue-500/10">
                  <span className="text-2xl">⚙️</span>
                </div>
                <h3 className="mt-4 text-xl font-semibold text-slate-900 dark:text-slate-50">Custom Development (Go, Python, Node.js)</h3>
              </div>
              <ul className="space-y-3 text-sm text-slate-600 dark:text-slate-400">
                <li className="flex gap-2">
                  <span className="font-semibold text-blue-600 dark:text-blue-400">•</span>
                  <span>6-36 months to production</span>
                </li>
                <li className="flex gap-2">
                  <span className="font-semibold text-blue-600 dark:text-blue-400">•</span>
                  <span>Full programming knowledge required</span>
                </li>
                <li className="flex gap-2">
                  <span className="font-semibold text-blue-600 dark:text-blue-400">•</span>
                  <span>Code-first architecture</span>
                </li>
                <li className="flex gap-2">
                  <span className="font-semibold text-blue-600 dark:text-blue-400">•</span>
                  <span>Complete customization freedom</span>
                </li>
                <li className="flex gap-2">
                  <span className="font-semibold text-blue-600 dark:text-blue-400">•</span>
                  <span>Scales to millions of users</span>
                </li>
              </ul>
            </GlassCard>
          </div>
        </section>

        {/* Why It Takes So Long */}
        <section className="border-t border-slate-200/90 pb-16 pt-16 dark:border-white/10 sm:pb-24 sm:pt-20">
          <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-50 sm:text-3xl">Why Custom Development Takes 1-3 Years</h2>
          <p className="mt-3 max-w-2xl text-slate-600 dark:text-slate-400">
            It&apos;s not that developers are slow. It&apos;s that you&apos;re solving fundamentally different problems.
          </p>

          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {/* Challenge 1 */}
            <div className="rounded-lg border border-slate-200/50 bg-slate-50/30 p-6 dark:border-white/5 dark:bg-slate-900/20">
              <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded bg-slate-200 text-lg dark:bg-slate-700">
                🎯
              </div>
              <h3 className="font-semibold text-slate-900 dark:text-slate-50">Requirements clarity</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                Wix builders have fixed features. EHR platforms need to define everything: workflows, compliance, user roles, integrations — this alone takes months.
              </p>
            </div>

            {/* Challenge 2 */}
            <div className="rounded-lg border border-slate-200/50 bg-slate-50/30 p-6 dark:border-white/5 dark:bg-slate-900/20">
              <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded bg-slate-200 text-lg dark:bg-slate-700">
                🔒
              </div>
              <h3 className="font-semibold text-slate-900 dark:text-slate-50">Security and compliance</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                EHR systems handle medical data (HIPAA compliance). E-commerce stores process payments (PCI compliance). Coding this correctly is not fast.
              </p>
            </div>

            {/* Challenge 3 */}
            <div className="rounded-lg border border-slate-200/50 bg-slate-50/30 p-6 dark:border-white/5 dark:bg-slate-900/20">
              <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded bg-slate-200 text-lg dark:bg-slate-700">
                📊
              </div>
              <h3 className="font-semibold text-slate-900 dark:text-slate-50">Data architecture</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                Designing databases for millions of records, queries that don&apos;t strangle under load, data integrity across transactions &mdash; this is design + testing.
              </p>
            </div>

            {/* Challenge 4 */}
            <div className="rounded-lg border border-slate-200/50 bg-slate-50/30 p-6 dark:border-white/5 dark:bg-slate-900/20">
              <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded bg-slate-200 text-lg dark:bg-slate-700">
                🧪
              </div>
              <h3 className="font-semibold text-slate-900 dark:text-slate-50">Testing</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                Unit tests, integration tests, load tests, security audits. A broken payment flow costs real money and trust. Testing takes time.
              </p>
            </div>

            {/* Challenge 5 */}
            <div className="rounded-lg border border-slate-200/50 bg-slate-50/30 p-6 dark:border-white/5 dark:bg-slate-900/20">
              <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded bg-slate-200 text-lg dark:bg-slate-700">
                🔌
              </div>
              <h3 className="font-semibold text-slate-900 dark:text-slate-50">Integrations</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                Payment gateways, SMS services, email, analytics, CRMs. Each integration has its own bugs, edge cases, and support overhead.
              </p>
            </div>

            {/* Challenge 6 */}
            <div className="rounded-lg border border-slate-200/50 bg-slate-50/30 p-6 dark:border-white/5 dark:bg-slate-900/20">
              <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded bg-slate-200 text-lg dark:bg-slate-700">
                📈
              </div>
              <h3 className="font-semibold text-slate-900 dark:text-slate-50">Performance and scale</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                Works fine at 100 users is very different from works fine at 100,000 users. Optimization, caching, monitoring — all come later but must be designed in.
              </p>
            </div>
          </div>
        </section>

        {/* The Real Comparison */}
        <section className="border-t border-slate-200/90 pb-16 pt-16 dark:border-white/10 sm:pb-24 sm:pt-20">
          <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-50 sm:text-3xl">Pros and Cons: Side by Side</h2>

          <div className="mt-10 grid gap-8 lg:grid-cols-2">
            {/* Builder Pros */}
            <div>
              <h3 className="flex items-center gap-2 text-lg font-semibold text-slate-900 dark:text-slate-50">
                <span className="text-2xl">✅</span> Pre-built Builders: The Wins
              </h3>
              <ul className="mt-6 space-y-4">
                <li className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                  <strong className="text-slate-900 dark:text-slate-200">Get live in days:</strong> Perfect if you need a portfolio, landing page, or small marketing site.
                </li>
                <li className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                  <strong className="text-slate-900 dark:text-slate-200">No server knowledge needed:</strong> No fighting with servers, databases, or deployments.
                </li>
                <li className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                  <strong className="text-slate-900 dark:text-slate-200">Included hosting:</strong> Updates, security patches, backups — handled for you.
                </li>
                <li className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                  <strong className="text-slate-900 dark:text-slate-200">Low cost:</strong> ₹500-2000/month covers everything. No infrastructure bill shock.
                </li>
                <li className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                  <strong className="text-slate-900 dark:text-slate-200">SEO templates built-in:</strong> Google-friendly foundations already there.
                </li>
              </ul>
            </div>

            {/* Builder Cons */}
            <div>
              <h3 className="flex items-center gap-2 text-lg font-semibold text-slate-900 dark:text-slate-50">
                <span className="text-2xl">⚠️</span> Pre-built Builders: The Limits
              </h3>
              <ul className="mt-6 space-y-4">
                <li className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                  <strong className="text-slate-900 dark:text-slate-200">You own nothing:</strong> Your site lives on their servers. They change terms, you adapt or lose everything.
                </li>
                <li className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                  <strong className="text-slate-900 dark:text-slate-200">Can&apos;t scale beyond templates:</strong> Want a custom workflow? Unique business logic? Impossible.
                </li>
                <li className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                  <strong className="text-slate-900 dark:text-slate-200">Locked into their ecosystem:</strong> Integrations are limited. Switching costs are high.
                </li>
                <li className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                  <strong className="text-slate-900 dark:text-slate-200">Not suitable for complex apps:</strong> EHR, fintech, machine learning platforms — impossible.
                </li>
                <li className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                  <strong className="text-slate-900 dark:text-slate-200">Performance is average:</strong> You can&apos;t optimize for your specific users.
                </li>
              </ul>
            </div>

            {/* Custom Pros */}
            <div>
              <h3 className="flex items-center gap-2 text-lg font-semibold text-slate-900 dark:text-slate-50">
                <span className="text-2xl">✅</span> Custom Development: The Wins
              </h3>
              <ul className="mt-6 space-y-4">
                <li className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                  <strong className="text-slate-900 dark:text-slate-200">Total customization:</strong> Build exactly what your customers need, no compromises.
                </li>
                <li className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                  <strong className="text-slate-900 dark:text-slate-200">You own the code:</strong> It&apos;s yours. You can move it, modify it, sell it, or open-source it.
                </li>
                <li className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                  <strong className="text-slate-900 dark:text-slate-200">Scales to any size:</strong> Works with 10 users or 10 million. You control the limits.
                </li>
                <li className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                  <strong className="text-slate-900 dark:text-slate-200">Business advantage:</strong> Your EHR works better than competitors&apos; because it&apos;s built for your users.
                </li>
                <li className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                  <strong className="text-slate-900 dark:text-slate-200">Defensible moat:</strong> Hard to copy, harder to compete against.
                </li>
              </ul>
            </div>

            {/* Custom Cons */}
            <div>
              <h3 className="flex items-center gap-2 text-lg font-semibold text-slate-900 dark:text-slate-50">
                <span className="text-2xl">⚠️</span> Custom Development: The Costs
              </h3>
              <ul className="mt-6 space-y-4">
                <li className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                  <strong className="text-slate-900 dark:text-slate-200">Slow to launch:</strong> 6-36 months. Competitors using Wix might be live in days.
                </li>
                <li className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                  <strong className="text-slate-900 dark:text-slate-200">High upfront costs:</strong> ₹20L - ₹1Cr+ to build properly. Cheap coding = technical debt.
                </li>
                <li className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                  <strong className="text-slate-900 dark:text-slate-200">You own the ops:</strong> You manage servers, security, backups, uptime. Responsibility is yours.
                </li>
                <li className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                  <strong className="text-slate-900 dark:text-slate-200">Requires expert teams:</strong> Can&apos;t hire juniors and expect it to work. Need experienced engineers.
                </li>
                <li className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                  <strong className="text-slate-900 dark:text-slate-200">Ongoing maintenance:</strong> Updates, security patches, database migrations — never ends.
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* When to Choose Which */}
        <section className="border-t border-slate-200/90 pb-16 pt-16 dark:border-white/10 sm:pb-24 sm:pt-20">
          <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-50 sm:text-3xl">Decision: When to Choose What</h2>

          <div className="mt-10 grid gap-6 lg:grid-cols-2">
            {/* Use Builders */}
            <GlassCard className="border-emerald-500/20 dark:border-emerald-500/15">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-50">Use Pre-built Builders If:</h3>
              <ul className="mt-5 space-y-2 text-sm text-slate-600 dark:text-slate-400">
                <li>✓ You need a portfolio or marketing site</li>
                <li>✓ You&apos;re a freelancer or creative professional</li>
                <li>✓ Your business is service-based (coaching, consulting)</li>
                <li>✓ You have minimal technical requirements</li>
                <li>✓ You want to bootstrap with nearly zero budget</li>
                <li>✓ Speed to market matters more than customization</li>
              </ul>
            </GlassCard>

            {/* Use Custom */}
            <GlassCard className="border-blue-500/20 dark:border-blue-500/15">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-50">Use Custom Development If:</h3>
              <ul className="mt-5 space-y-2 text-sm text-slate-600 dark:text-slate-400">
                <li>✓ You&apos;re building a SaaS product or platform</li>
                <li>✓ You handle sensitive data (health, finance, personal)</li>
                <li>✓ You need to scale to thousands or millions of users</li>
                <li>✓ You have complex business logic or workflows</li>
                <li>✓ You want to own your technology and data</li>
                <li>✓ You&apos;re building a defensible competitive advantage</li>
              </ul>
            </GlassCard>
          </div>
        </section>

        {/* Why Learn Backend Development */}
        <section className="border-t border-slate-200/90 pb-16 pt-16 dark:border-white/10 sm:pb-24 sm:pt-20">
          <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-50 sm:text-3xl">Why Learning Backend Development Matters</h2>
          <p className="mt-3 max-w-2xl text-slate-600 dark:text-slate-400">
            If you&apos;re considering Gopher Lab, here&apos;s why custom development skills are career-changing:
          </p>

          <div className="mt-10 space-y-6">
            {/* Reason 1 */}
            <div className="rounded-lg border border-slate-200/50 bg-slate-50/30 p-6 dark:border-white/5 dark:bg-slate-900/20">
              <h3 className="font-semibold text-slate-900 dark:text-slate-50">1. You&apos;re not a service provider &mdash; you&apos;re a builder</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                Wix is for people who need websites. Backend development is for people who build products that scale to businesses worth ₹100Cr+. Your scope changes entirely.
              </p>
            </div>

            {/* Reason 2 */}
            <div className="rounded-lg border border-slate-200/50 bg-slate-50/30 p-6 dark:border-white/5 dark:bg-slate-900/20">
              <h3 className="font-semibold text-slate-900 dark:text-slate-50">2. Salary and career trajectory are different</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                A Wix freelancer makes ₹2-5L/year. A backend engineer at a US company makes $100k-300k/year (₹83L - ₹2.5Cr). With equity, that&apos;s generational wealth.
              </p>
            </div>

            {/* Reason 3 */}
            <div className="rounded-lg border border-slate-200/50 bg-slate-50/30 p-6 dark:border-white/5 dark:bg-slate-900/20">
              <h3 className="font-semibold text-slate-900 dark:text-slate-50">3. You solve real problems that matter</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                EHR platforms save lives. Fintech apps bring banking to the unbanked. Backend engineers aren&apos;t just building websites &mdash; they&apos;re building infrastructure that changes behavior and economies.
              </p>
            </div>

            {/* Reason 4 */}
            <div className="rounded-lg border border-slate-200/50 bg-slate-50/30 p-6 dark:border-white/5 dark:bg-slate-900/20">
              <h3 className="font-semibold text-slate-900 dark:text-slate-50">4. Your code becomes your competitive advantage</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                You can start an EHR company and compete against multi-crore incumbents because your architecture is cleaner, faster, cheaper to run. A Wix user can&apos;t do this &mdash; they&apos;re forever bound by templates.
              </p>
            </div>

            {/* Reason 5 */}
            <div className="rounded-lg border border-slate-200/50 bg-slate-50/30 p-6 dark:border-white/5 dark:bg-slate-900/20">
              <h3 className="font-semibold text-slate-900 dark:text-slate-50">5. You become independent</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                Wix could shut down tomorrow or change their terms. Your custom codebase? You own it. You control it. You can move it anywhere, use it forever, modify it for new markets.
              </p>
            </div>

            {/* Reason 6 */}
            <div className="rounded-lg border border-slate-200/50 bg-slate-50/30 p-6 dark:border-white/5 dark:bg-slate-900/20">
              <h3 className="font-semibold text-slate-900 dark:text-slate-50">6. Learning compounds differently</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                Wix skills don&apos;t transfer. Backend skills&quest; Go, Python, databases, APIs, systems design &mdash; these skills work everywhere. Every platform, every company, every problem. You&apos;re not locked in.
              </p>
            </div>
          </div>
        </section>

        {/* The Learning Path */}
        <section className="border-t border-slate-200/90 pb-16 pt-16 dark:border-white/10 sm:pb-24 sm:pt-20">
          <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-50 sm:text-3xl">The Learning Path: What It Looks Like</h2>
          <p className="mt-3 max-w-2xl text-slate-600 dark:text-slate-400">
            This is why Gopher Lab takes 12 months instead of an online course that claims 3 months:
          </p>

          <div className="mt-10 space-y-4">
            <div className="flex gap-4 rounded-lg border border-slate-200/50 bg-slate-50/30 p-5 dark:border-white/5 dark:bg-slate-900/20">
              <span className="mt-0.5 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-200 text-sm font-bold text-slate-900 dark:bg-slate-700 dark:text-slate-50">
                1
              </span>
              <div>
                <p className="font-semibold text-slate-900 dark:text-slate-50">Months 1-3: Foundations</p>
                <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                  Learn Go basics, systems thinking, how computers actually work. Not just syntax — mental models.
                </p>
              </div>
            </div>

            <div className="flex gap-4 rounded-lg border border-slate-200/50 bg-slate-50/30 p-5 dark:border-white/5 dark:bg-slate-900/20">
              <span className="mt-0.5 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-200 text-sm font-bold text-slate-900 dark:bg-slate-700 dark:text-slate-50">
                2
              </span>
              <div>
                <p className="font-semibold text-slate-900 dark:text-slate-50">Months 4-6: Building real systems</p>
                <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                  APIs, databases, authentication, payment processing. Not tutorials — production patterns.
                </p>
              </div>
            </div>

            <div className="flex gap-4 rounded-lg border border-slate-200/50 bg-slate-50/30 p-5 dark:border-white/5 dark:bg-slate-900/20">
              <span className="mt-0.5 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-200 text-sm font-bold text-slate-900 dark:bg-slate-700 dark:text-slate-50">
                3
              </span>
              <div>
                <p className="font-semibold text-slate-900 dark:text-slate-50">Months 6-9: Deep dives</p>
                <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                  Scaling systems, debugging under load, security, distributed problems. Why Netflix doesn't crash on release day.
                </p>
              </div>
            </div>

            <div className="flex gap-4 rounded-lg border border-slate-200/50 bg-slate-50/30 p-5 dark:border-white/5 dark:bg-slate-900/20">
              <span className="mt-0.5 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-200 text-sm font-bold text-slate-900 dark:bg-slate-700 dark:text-slate-50">
                4
              </span>
              <div>
                <p className="font-semibold text-slate-900 dark:text-slate-50">Months 9-12: Interview prep and offers</p>
                <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                  System design, behavioral prep, negotiation. By now, you're placement-ready for ₹1.2Cr+ roles.
                </p>
              </div>
            </div>
          </div>

          <p className="mt-8 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
            <strong className="text-slate-900 dark:text-slate-200">Why this matters:</strong> A 3-month course teaches you to build Hello World. Gopher Lab teaches you to build systems that scale to millions of users, handle failure gracefully, and compete at the highest level. That's why it takes longer — you're learning a different league entirely.
          </p>
        </section>

        {/* The Real Cost Comparison */}
        <section className="border-t border-slate-200/90 pb-16 pt-16 dark:border-white/10 sm:pb-24 sm:pt-20">
          <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-50 sm:text-3xl">Total Cost of Ownership: The Real Math</h2>

          <div className="mt-10 grid gap-6 lg:grid-cols-2">
            {/* Wix */}
            <div className="rounded-lg border border-slate-200/50 bg-slate-50/30 p-8 dark:border-white/5 dark:bg-slate-900/20">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-50">Build with Wix</h3>
              <div className="mt-6 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600 dark:text-slate-400">Wix subscription (1 year)</span>
                  <span className="font-medium text-slate-900 dark:text-slate-50">₹30,000</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600 dark:text-slate-400">Premium theme</span>
                  <span className="font-medium text-slate-900 dark:text-slate-50">₹10,000</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600 dark:text-slate-400">Your time (40 hours)</span>
                  <span className="font-medium text-slate-900 dark:text-slate-50">₹8,000</span>
                </div>
              </div>
              <div className="mt-6 border-t border-slate-200 pt-4 dark:border-white/10">
                <div className="flex justify-between">
                  <span className="font-semibold text-slate-900 dark:text-slate-50">Total</span>
                  <span className="font-bold text-lg text-slate-900 dark:text-slate-50">₹48,000</span>
                </div>
              </div>
              <p className="mt-4 text-xs text-slate-600 dark:text-slate-400">+ Annual hosting/domain: ₹10-15k/year</p>
            </div>

            {/* Custom Development */}
            <div className="rounded-lg border border-slate-200/50 bg-slate-50/30 p-8 dark:border-white/5 dark:bg-slate-900/20">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-50">Learn Backend Development</h3>
              <div className="mt-6 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600 dark:text-slate-400">Gopher Lab mentorship (12 months)</span>
                  <span className="font-medium text-slate-900 dark:text-slate-50">₹4-8L</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600 dark:text-slate-400">Your time (1000+ hours)</span>
                  <span className="font-medium text-slate-900 dark:text-slate-50">Priceless</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600 dark:text-slate-400">Job offers post-completion</span>
                  <span className="font-medium text-slate-900 dark:text-slate-50">$100k-300k/year</span>
                </div>
              </div>
              <div className="mt-6 border-t border-slate-200 pt-4 dark:border-white/10">
                <div className="flex justify-between">
                  <span className="font-semibold text-slate-900 dark:text-slate-50">ROI (within 2 years)</span>
                  <span className="font-bold text-lg text-emerald-600 dark:text-emerald-400">&nbsp;₹2Cr+</span>
                </div>
              </div>
              <p className="mt-4 text-xs text-slate-600 dark:text-slate-400">Salary stays yours forever. Compounds with every role.</p>
            </div>
          </div>

          <div className="mt-8 rounded-lg border border-blue-500/20 bg-blue-50/30 p-6 dark:border-blue-500/15 dark:bg-blue-900/10">
            <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
              <strong className="text-slate-900 dark:text-slate-50">The compound difference:</strong> Wix is a one-time project. Backend skills are forever. A backend engineer earning ₹1.5Cr/year compounds to ₹3Cr over 10 years. Your Wix site is worth ₹0 in 10 years. Your code&quest; Still running, still valuable.
            </p>
          </div>
        </section>

        {/* Final Word */}
        <section className="border-t border-slate-200/90 pb-16 pt-16 dark:border-white/10 sm:pb-24 sm:pt-20">
          <GlassCard className="border-brand-sunset/25 dark:border-brand-sunset/30">
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-50">The Final Word</h2>
            <p className="mt-4 text-slate-600 dark:text-slate-400">
              Neither path is wrong. But they lead to different destinations.
            </p>
            <p className="mt-3 text-slate-600 dark:text-slate-400">
              Use Wix if you need a website fast. But if you want to <strong>build products that scale</strong>, solve <strong>complex problems</strong>, and earn income that makes financial noise &mdash; you need custom development skills.
            </p>
            <p className="mt-3 text-slate-600 dark:text-slate-400">
              That&apos;s why Gopher Lab exists. We teach you not how to build websites. We teach you how to think like a systems engineer, architect like a founder, and code like a professional.
            </p>
            <p className="mt-4 text-sm font-medium text-brand-sunset dark:text-brand-onDark">
              So the real question isn't: "Should I learn backend development?"
            </p>
            <p className="mt-1 text-sm font-medium text-brand-sunset dark:text-brand-onDark">
              The real question is: "What's the cost of not learning?"
            </p>
            <div className="mt-8 flex gap-3 sm:flex-row">
              <Link href="/eligibility" className="btn-accent px-8">
                Explore Gopher Lab
              </Link>
              <Link href="/" className="btn-secondary px-8">
                Back to home
              </Link>
            </div>
          </GlassCard>
        </section>
      </main>

      <SiteFooter showBackToHome />
    </div>
  );
}
