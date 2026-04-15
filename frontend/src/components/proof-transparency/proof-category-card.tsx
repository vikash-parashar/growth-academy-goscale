import type { ReactNode } from "react";

export function ProofCategoryCard({
  icon,
  title,
  description,
}: {
  icon: ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div
      className="group relative overflow-hidden rounded-2xl border border-slate-200/90 bg-slate-50/90 p-6 shadow-[0_8px_40px_rgba(0,0,0,0.06)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-brand-sunset/40 hover:shadow-[0_20px_50px_rgba(5,150,105,0.1)] dark:border-white/[0.08] dark:bg-slate-900/35 dark:shadow-[0_8px_40px_rgba(0,0,0,0.35)] dark:hover:border-brand-sunset/35 dark:hover:shadow-[0_20px_50px_rgba(16,185,129,0.1)]"
      role="article"
    >
      <div className="pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full bg-brand-sunset/15 blur-2xl transition-opacity duration-300 group-hover:opacity-80 dark:bg-brand-sunsetBright/10" />
      <div className="pointer-events-none absolute -bottom-10 -left-10 h-28 w-28 rounded-full bg-brand-berry/12 blur-2xl opacity-70 transition-opacity duration-300 group-hover:opacity-100 dark:bg-brand-berry/10" />
      <div
        className="relative mb-5 inline-flex h-12 w-12 items-center justify-center rounded-xl border border-slate-200 bg-white text-brand-sunset transition-colors duration-300 group-hover:border-brand-sunset/50 group-hover:text-brand-berry dark:border-white/10 dark:bg-white/[0.04] dark:text-brand-onDark dark:group-hover:border-brand-sunset/40 dark:group-hover:text-brand-onDarkStrong"
        aria-hidden
      >
        {icon}
      </div>
      <h3 className="relative text-lg font-semibold tracking-tight text-slate-900 dark:text-slate-50">{title}</h3>
      <p className="relative mt-2 text-sm leading-relaxed text-slate-600 transition-colors duration-300 group-hover:text-slate-700 dark:text-slate-400 dark:group-hover:text-slate-300">
        {description}
      </p>
    </div>
  );
}
