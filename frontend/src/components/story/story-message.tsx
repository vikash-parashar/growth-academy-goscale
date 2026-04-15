"use client";

import { Reveal } from "./reveal";

export function StoryMessage() {
  return (
    <section className="mx-auto w-full max-w-none py-16 sm:py-24">
      <Reveal>
        <blockquote className="relative text-center">
          <span
            className="pointer-events-none absolute -left-2 -top-6 font-serif text-6xl leading-none text-brand-sunset/15 dark:text-brand-sunset/20 sm:-left-4 sm:text-8xl"
            aria-hidden
          >
            “
          </span>
          <p className="relative text-2xl font-semibold leading-snug tracking-tight text-slate-900 dark:text-slate-100 sm:text-3xl md:text-[2.15rem] md:leading-[1.35]">
            If I can do it, <span className="text-gradient">you can too.</span>
          </p>
          <p className="mx-auto mt-8 max-w-xl text-sm leading-relaxed text-slate-600 dark:text-slate-500 sm:text-base">
            Not because the path is easy — because it is walkable. Your starting line may be harsher than most
            people&apos;s; that only makes the proof sharper when you move.
          </p>
        </blockquote>
      </Reveal>
    </section>
  );
}
