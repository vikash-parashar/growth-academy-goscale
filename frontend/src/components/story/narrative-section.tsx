"use client";

import type { ReactNode } from "react";
import { GlassCard } from "@/components/glass-card";
import { Reveal } from "./reveal";

type NarrativeSectionProps = {
  id?: string;
  eyebrow: string;
  title: string;
  children: ReactNode;
  /** Use a softer card for alternating visual rhythm */
  variant?: "default" | "emphasis";
};

export function NarrativeSection({ id, eyebrow, title, children, variant = "default" }: NarrativeSectionProps) {
  return (
    <section id={id} className="mx-auto w-full max-w-none scroll-mt-28 py-14 sm:py-20">
      <Reveal>
        <GlassCard
          className={
            variant === "emphasis"
              ? "border-[#fc819e]/30 bg-[#fec7b4]/25 shadow-[0_0_50px_-12px_rgba(252,129,158,0.2)] dark:border-[#456882]/40 dark:bg-[#234c6a]/45 dark:shadow-[0_0_60px_-12px_rgba(69,104,130,0.22)]"
              : ""
          }
        >
          <p className="section-eyebrow tracking-[0.28em]">{eyebrow}</p>
          <h2 className="mt-3 text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-50 sm:text-3xl">{title}</h2>
          <div className="mt-6 space-y-4 text-base leading-relaxed text-slate-600 dark:text-slate-400 sm:text-lg">{children}</div>
        </GlassCard>
      </Reveal>
    </section>
  );
}
