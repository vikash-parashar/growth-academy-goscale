import type { ReactNode } from "react";

export function Section({
  id,
  title,
  eyebrow,
  children,
}: {
  id?: string;
  title: string;
  eyebrow?: string;
  children: ReactNode;
}) {
  return (
    <section id={id} className="page-shell scroll-mt-28 py-14 sm:py-20 lg:py-24">
      <div className="mb-9 max-w-5xl sm:mb-11">
        {eyebrow ? <p className="section-eyebrow">{eyebrow}</p> : null}
        <h2 className="text-[1.65rem] font-semibold leading-tight tracking-tight text-slate-900 dark:text-slate-50 sm:text-3xl md:text-[2.1rem] lg:text-[2.35rem]">
          {title}
        </h2>
      </div>
      {children}
    </section>
  );
}
