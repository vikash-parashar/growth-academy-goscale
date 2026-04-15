import { IconLock } from "./icons";

export function SecurityNotice() {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-amber-300/90 bg-gradient-to-br from-amber-50 via-stone-50 to-amber-100/80 p-6 shadow-soft dark:border-amber-500/25 dark:from-slate-900 dark:via-slate-900 dark:to-slate-950 dark:shadow-soft-dark sm:p-8">
      <div className="pointer-events-none absolute -right-16 top-0 h-40 w-40 rounded-full bg-amber-400/20 blur-3xl dark:bg-amber-500/10" />
      <div className="relative flex flex-col gap-6 sm:flex-row sm:items-start">
        <div className="inline-flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-amber-400/70 bg-amber-100 text-amber-900 shadow-sm dark:border-amber-400/30 dark:bg-amber-400/10 dark:text-amber-200">
          <IconLock className="h-7 w-7" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="font-mono text-xs uppercase tracking-[0.25em] text-amber-900 dark:text-amber-200/90">Important — how we handle proof</p>
          <h2 className="mt-3 text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-50 sm:text-3xl">Your privacy and trust come first</h2>
          <ul className="mt-6 space-y-3 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
            <li className="flex gap-3">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-600 dark:bg-amber-300" aria-hidden />
              <span>
                <strong className="font-medium text-slate-900 dark:text-slate-100">Proofs are not publicly shared.</strong> We do not post sensitive documents on the web or in open channels.
              </span>
            </li>
            <li className="flex gap-3">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-600 dark:bg-amber-300" aria-hidden />
              <span>
                <strong className="font-medium text-slate-900 dark:text-slate-100">Shown only to serious candidates</strong> after fit and intent are clear — typically on a live call with context.
              </span>
            </li>
            <li className="flex gap-3">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-600 dark:bg-amber-300" aria-hidden />
              <span>
                <strong className="font-medium text-slate-900 dark:text-slate-100">No screenshots allowed.</strong> This protects past employers, clients, and everyone in the mentorship community.
              </span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
