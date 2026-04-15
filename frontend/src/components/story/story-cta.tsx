"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Reveal } from "./reveal";

export function StoryCta() {
  return (
    <section className="mx-auto w-full max-w-none pb-24 pt-4 sm:pb-32">
      <Reveal>
        <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-gradient-to-br from-slate-50 via-white to-brand-sunset/10 p-10 text-center shadow-[0_0_60px_-20px_rgba(5,150,105,0.2)] dark:border-white/[0.1] dark:from-slate-900/90 dark:via-slate-950 dark:to-slate-950 dark:shadow-[0_0_80px_-20px_rgba(16,185,129,0.25)] sm:p-14">
          <div className="pointer-events-none absolute -right-24 -top-24 h-56 w-56 rounded-full bg-brand-sunset/25 blur-3xl dark:bg-brand-sunsetBright/15" />
          <div className="pointer-events-none absolute -bottom-28 -left-20 h-56 w-56 rounded-full bg-brand-berry/15 blur-3xl dark:bg-brand-berry/10" />
          <p className="section-eyebrow relative tracking-[0.3em]">
            Next step
          </p>
          <h2 className="relative mt-4 text-2xl font-semibold text-slate-900 dark:text-slate-50 sm:text-3xl">
            Ready to build with someone who has walked the uneven road?
          </h2>
          <p className="relative mx-auto mt-4 max-w-md text-sm text-slate-600 dark:text-slate-400">
            Limited mentorship seats. We work with people who are serious about execution — not just consuming
            content.
          </p>
          <motion.div
            className="relative mt-10 flex justify-center"
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.15 }}
          >
            <Link href="/eligibility" className="btn-accent px-10 py-3.5 text-sm">
              Apply for Mentorship
            </Link>
          </motion.div>
        </div>
      </Reveal>
    </section>
  );
}
