import type { MessageTree } from "@/lib/i18n/messages";
import { GO_PLAYGROUND_URL, GO_TOUR_URL } from "@/lib/site-links";

export function GolangLearnResources({ t }: { t: MessageTree["jobsPage"] }) {
  return (
    <section
      className="mt-10 overflow-hidden rounded-2xl border border-slate-200/90 bg-gradient-to-br from-white via-slate-50/80 to-brand-berry/10 shadow-soft dark:border-white/[0.08] dark:from-slate-900/80 dark:via-slate-900/60 dark:to-brand-berry/25 dark:shadow-soft-dark"
      aria-labelledby="golang-build-heading"
    >
      <div className="px-5 py-5 sm:px-8 sm:py-6">
        <h2 id="golang-build-heading" className="text-lg font-semibold tracking-tight text-slate-900 dark:text-slate-50 sm:text-xl">
          {t.goBuildTitle}
        </h2>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-slate-600 dark:text-slate-400">{t.goBuildIntro}</p>
        <ul className="mt-4 list-disc space-y-2 pl-5 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          {t.goBuildBullets.map((line) => (
            <li key={line}>{line}</li>
          ))}
        </ul>

        <h3 className="mt-8 text-base font-semibold tracking-tight text-slate-900 dark:text-slate-50 sm:text-lg">
          {t.goLearnTitle}
        </h3>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <a
            href={GO_TOUR_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="group rounded-xl border border-slate-200/90 bg-white/80 p-4 transition hover:border-brand-sunset/50 hover:shadow-md dark:border-white/10 dark:bg-slate-900/50 dark:hover:border-brand-sunset/40"
          >
            <span className="font-semibold text-brand-berry group-hover:underline dark:text-brand-onDarkStrong">{t.goLearnTourTitle}</span>
            <span className="mt-1.5 block text-sm leading-relaxed text-slate-600 dark:text-slate-400">{t.goLearnTourBody}</span>
            <span className="mt-3 inline-block font-mono text-xs text-brand-sunset dark:text-brand-onDark">go.dev/tour</span>
          </a>
          <a
            href={GO_PLAYGROUND_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="group rounded-xl border border-slate-200/90 bg-white/80 p-4 transition hover:border-brand-sunset/50 hover:shadow-md dark:border-white/10 dark:bg-slate-900/50 dark:hover:border-brand-sunset/40"
          >
            <span className="font-semibold text-brand-berry group-hover:underline dark:text-brand-onDarkStrong">{t.goLearnPlayTitle}</span>
            <span className="mt-1.5 block text-sm leading-relaxed text-slate-600 dark:text-slate-400">{t.goLearnPlayBody}</span>
            <span className="mt-3 inline-block font-mono text-xs text-brand-sunset dark:text-brand-onDark">go.dev/play</span>
          </a>
        </div>
        <p className="mt-4 text-xs text-slate-500 dark:text-slate-500">{t.goLearnExternalHint}</p>
      </div>
    </section>
  );
}
