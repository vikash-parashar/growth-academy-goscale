import Link from "next/link";
import { GlassCard } from "@/components/glass-card";

export function ProofCtaSection() {
  return (
    <section className="mx-auto max-w-6xl px-4 pb-24 sm:px-6">
      <GlassCard className="relative overflow-hidden border-brand-sunset/25 dark:border-brand-berry/30">
        <div className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-brand-berry/20 blur-3xl dark:bg-brand-berry/15" />
        <div className="pointer-events-none absolute -bottom-24 -left-10 h-48 w-48 rounded-full bg-brand-sunset/15 blur-3xl dark:bg-brand-sunsetBright/12" />
        <div className="relative flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-center">
          <div>
            <p className="section-eyebrow tracking-[0.2em]">Next step</p>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-50 sm:text-3xl">
              Ready to verify with context?
            </h2>
            <p className="mt-3 max-w-xl text-sm text-slate-600 dark:text-slate-400">
              Book a fit call. We&apos;ll walk through what matters to you — offers, trajectory, and real execution — without compromising anyone&apos;s
              confidentiality.
            </p>
          </div>
          <Link href="/eligibility" className="btn-accent w-full shrink-0 px-10 py-3.5 text-center text-sm sm:w-auto">
            Request proof on call
          </Link>
        </div>
      </GlassCard>
    </section>
  );
}
