"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LEARNING_TOPICS } from "@/data/learning-hub";

const tabBase =
  "whitespace-nowrap rounded-full border px-3.5 py-2 text-xs font-semibold transition sm:px-4 sm:text-sm";
const tabIdle =
  "border-slate-200 bg-white/80 text-slate-800 hover:border-brand-sunset/45 hover:text-brand-sunset dark:border-white/10 dark:bg-slate-900/50 dark:text-slate-200 dark:hover:border-brand-onDark/45 dark:hover:text-brand-onDark";
const tabActive =
  "border-brand-sunset/60 bg-brand-sunset/15 text-brand-sunset shadow-sm dark:border-brand-onDark/55 dark:bg-brand-onDark/20 dark:text-brand-onDark";

export function LearningSubnav() {
  const pathname = usePathname();

  return (
    <nav className="page-shell pb-6" aria-label="Learning topics">
      <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Topics</p>
      <div className="-mx-1 overflow-x-auto pb-1">
        <ul className="flex w-max min-w-full gap-2 px-1 sm:flex-wrap sm:gap-2.5">
          {LEARNING_TOPICS.map((t) => {
            const href = `/learning/${t.slug}`;
            const active = pathname === href;
            return (
              <li key={t.slug}>
                <Link
                  href={href}
                  className={`${tabBase} ${active ? tabActive : tabIdle}`}
                  aria-current={active ? "page" : undefined}
                >
                  {t.navLabel}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}
