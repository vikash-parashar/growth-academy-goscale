"use client";

import { motion } from "framer-motion";

export function StoryHero() {
  return (
    <section className="relative w-full max-w-none overflow-hidden border-b border-slate-200 pb-20 pt-16 dark:border-white/[0.06] sm:pb-28 sm:pt-24">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_90%_50%_at_50%_-10%,rgba(16,185,129,0.12),transparent),radial-gradient(ellipse_50%_40%_at_100%_0%,rgba(20,184,166,0.08),transparent)] dark:bg-[radial-gradient(ellipse_90%_50%_at_50%_-10%,rgba(16,185,129,0.2),transparent),radial-gradient(ellipse_50%_40%_at_100%_0%,rgba(34,211,238,0.1),transparent)]" />
      <div className="relative mx-auto w-full max-w-none text-center">
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="section-eyebrow tracking-[0.35em]"
        >
          Gopher Lab · Founder story
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
          className="mt-6 text-[1.65rem] font-semibold leading-[1.12] tracking-tight text-slate-900 dark:text-slate-50 sm:text-4xl md:text-5xl lg:text-[3.25rem]"
        >
          I Was Not Supposed
          <br />
          <span className="text-slate-600 dark:text-slate-300">to Reach Here</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.18, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto mt-8 max-w-2xl text-lg text-slate-600 dark:text-slate-400 sm:text-xl md:text-2xl"
        >
          From{" "}
          <span className="bg-gradient-to-r from-brand-sunset to-brand-berry bg-clip-text font-medium text-transparent dark:from-brand-sunsetBright dark:to-brand-berryBright">
            ₹300/month
          </span>{" "}
          <span className="text-slate-500">→</span>{" "}
          <span className="bg-gradient-to-r from-brand-berry to-brand-sunset bg-clip-text font-medium text-transparent dark:from-brand-berryBright dark:to-brand-sunsetBright">
            ₹1L+/month
          </span>
        </motion.p>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.35 }}
          className="mx-auto mt-5 max-w-xl text-sm leading-relaxed text-slate-600 dark:text-slate-500"
        >
          This is not a flex. It is proof that context does not have to write your ending — only you and your
          consistency do.
        </motion.p>
      </div>
    </section>
  );
}
