import type { MessageTree } from "@/lib/i18n/messages";

export function GolangSalaryInsight({ t }: { t: MessageTree["jobsPage"] }) {
  const rows = [
    { band: t.salaryEarly, us: t.salaryEarlyUsd, inr: t.salaryEarlyInr },
    { band: t.salaryMid, us: t.salaryMidUsd, inr: t.salaryMidInr },
    { band: t.salarySenior, us: t.salarySeniorUsd, inr: t.salarySeniorInr },
  ] as const;

  return (
    <section
      className="mt-10 overflow-hidden rounded-2xl border border-slate-200/90 bg-gradient-to-br from-white via-slate-50/90 to-brand-sunset/10 shadow-soft dark:border-white/[0.08] dark:from-slate-900/80 dark:via-slate-900/60 dark:to-brand-berry/25 dark:shadow-soft-dark"
      aria-labelledby="golang-salary-heading"
    >
      <div className="border-b border-slate-200/80 px-5 py-5 dark:border-white/10 sm:px-8 sm:py-6">
        <h2 id="golang-salary-heading" className="text-lg font-semibold tracking-tight text-slate-900 dark:text-slate-50 sm:text-xl">
          {t.salaryTitle}
        </h2>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-slate-600 dark:text-slate-400">{t.salaryIntro}</p>
      </div>

      <div className="overflow-x-auto px-2 py-4 sm:px-4">
        <table className="w-full min-w-[520px] border-separate border-spacing-0 text-left text-sm">
          <caption className="sr-only">{t.salaryTableCaption}</caption>
          <thead>
            <tr className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
              <th scope="col" className="rounded-tl-xl bg-slate-100/90 px-4 py-3 dark:bg-slate-800/80">
                {t.salaryBand}
              </th>
              <th scope="col" className="bg-slate-100/90 px-4 py-3 dark:bg-slate-800/80">
                {t.salaryRegionUS}
              </th>
              <th scope="col" className="rounded-tr-xl bg-slate-100/90 px-4 py-3 dark:bg-slate-800/80">
                {t.salaryRegionIN}
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr
                key={row.band}
                className={`border-t border-slate-200/80 dark:border-white/[0.06] ${
                  i === rows.length - 1 ? "last:border-b-0" : ""
                }`}
              >
                <th
                  scope="row"
                  className="whitespace-nowrap bg-white/60 px-4 py-3.5 font-medium text-slate-900 dark:bg-slate-900/40 dark:text-slate-100"
                >
                  {row.band}
                </th>
                <td className="bg-white/40 px-4 py-3.5 font-mono text-[0.8125rem] text-slate-800 dark:bg-slate-900/25 dark:text-slate-200">
                  {row.us}
                </td>
                <td className="bg-white/40 px-4 py-3.5 font-mono text-[0.8125rem] text-slate-800 dark:bg-slate-900/25 dark:text-slate-200">
                  {row.inr}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="space-y-4 border-t border-slate-200/80 px-5 py-5 dark:border-white/10 sm:px-8">
        <div>
          <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">{t.salaryCompaniesTitle}</h3>
          <p className="mt-1.5 text-sm leading-relaxed text-slate-600 dark:text-slate-400">{t.salaryCompaniesBody}</p>
        </div>
        <p className="text-xs leading-relaxed text-slate-500 dark:text-slate-500">{t.salaryDisclaimer}</p>
      </div>
    </section>
  );
}
