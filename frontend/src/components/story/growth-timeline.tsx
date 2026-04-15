"use client";

import { motion } from "framer-motion";
import { Reveal } from "./reveal";

const milestones = [
  {
    label: "First lift",
    amount: "₹25K",
    period: "/ month",
    note: "A door opened — small, but real. Enough to believe the graph could move.",
  },
  {
    label: "Compound phase",
    amount: "₹35K",
    period: "/ month",
    note: "Discipline stopped being inspiration and became a habit — show up, ship, repeat.",
  },
  {
    label: "Where I stand today",
    amount: "₹1L+",
    period: "/ month",
    note: "Not overnight. Not luck alone. Systems, accountability, and refusing to quit quietly.",
  },
] as const;

export function GrowthTimeline() {
  return (
    <section id="growth" className="mx-auto w-full max-w-none scroll-mt-28 py-14 sm:py-20">
      <Reveal className="mb-10 max-w-2xl">
        <p className="section-eyebrow tracking-[0.28em]">
          Growth · timeline
        </p>
        <h2 className="mt-3 text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-50 sm:text-3xl md:text-4xl">
          Income became a mirror — not of talent alone, but of{" "}
          <span className="text-slate-600 dark:text-slate-300">execution over years</span>
        </h2>
      </Reveal>

      <div>
        <div className="grid gap-6 md:grid-cols-3 md:gap-8">
          {milestones.map((m, i) => (
            <Reveal key={m.label} delay={i * 0.12} y={36}>
              <motion.article
                whileHover={{ y: -4 }}
                transition={{ type: "spring", stiffness: 400, damping: 28 }}
                className="group relative rounded-2xl border border-slate-200/90 bg-slate-50/90 p-6 shadow-[0_12px_40px_rgba(0,0,0,0.06)] backdrop-blur-xl dark:border-white/[0.08] dark:bg-slate-900/45 dark:shadow-[0_12px_40px_rgba(0,0,0,0.35)] sm:p-8 md:text-center"
              >
                <div className="absolute right-5 top-5 hidden h-2 w-2 rounded-full bg-gradient-to-br from-brand-sunset to-brand-berryBright opacity-90 md:block" />
                <p className="font-mono text-[0.65rem] uppercase tracking-widest text-slate-500">{m.label}</p>
                <p className="mt-4 text-3xl font-semibold tracking-tight text-slate-900 dark:text-slate-50 sm:text-4xl">
                  {m.amount}
                  <span className="text-lg font-normal text-slate-500">{m.period}</span>
                </p>
                <p className="mt-4 text-sm leading-relaxed text-slate-600 dark:text-slate-400">{m.note}</p>
                {i < milestones.length - 1 ? (
                  <div
                    className="my-6 h-px w-full bg-gradient-to-r from-transparent via-slate-200 to-transparent dark:via-white/10 md:hidden"
                    aria-hidden
                  />
                ) : null}
              </motion.article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
