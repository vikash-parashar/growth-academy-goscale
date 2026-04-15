import type { MessageTree } from "@/lib/i18n/messages";

export function PricingValueComparison({ t }: { t: MessageTree["pricing"] }) {
  return (
    <div className="space-y-10">
      <section aria-labelledby="simple-vs-work-heading">
        <h2 id="simple-vs-work-heading" className="text-xl font-semibold tracking-tight text-slate-900 dark:text-slate-50 sm:text-2xl">
          {t.simpleVsWorkTitle}
        </h2>
        <p className="mt-3 max-w-3xl whitespace-pre-line text-sm leading-relaxed text-slate-600 dark:text-slate-400">
          {t.simpleVsWorkBody}
        </p>
      </section>

      <section aria-labelledby="value-compare-heading">
        <h2 id="value-compare-heading" className="text-xl font-semibold tracking-tight text-slate-900 dark:text-slate-50 sm:text-2xl">
          {t.valueComparisonTitle}
        </h2>
        <p className="mt-3 max-w-3xl text-sm leading-relaxed text-slate-600 dark:text-slate-400">{t.valueComparisonIntro}</p>

        <div className="mt-6 overflow-x-auto rounded-2xl border border-slate-200/90 dark:border-white/10">
          <table className="w-full min-w-[720px] border-separate border-spacing-0 text-left text-sm">
            <caption className="sr-only">{t.valueComparisonCaption}</caption>
            <thead>
              <tr className="bg-slate-100/95 text-xs font-semibold uppercase tracking-wide text-slate-600 dark:bg-slate-800/90 dark:text-slate-300">
                <th scope="col" className="rounded-tl-xl px-4 py-3">
                  {t.vcColChannel}
                </th>
                <th scope="col" className="px-4 py-3">
                  {t.vcColCost}
                </th>
                <th scope="col" className="px-4 py-3">
                  {t.vcColDelivery}
                </th>
                <th scope="col" className="rounded-tr-xl px-4 py-3">
                  {t.vcColGap}
                </th>
              </tr>
            </thead>
            <tbody>
              {t.valueComparisonRows.map((row, i) => (
                <tr
                  key={row.channel}
                  className={`border-t border-slate-200/80 dark:border-white/[0.06] ${
                    i === t.valueComparisonRows.length - 1 ? "last:[&>td]:rounded-b-xl" : ""
                  }`}
                >
                  <th
                    scope="row"
                    className="max-w-[11rem] bg-white/70 px-4 py-3.5 align-top font-semibold text-slate-900 dark:bg-slate-900/50 dark:text-slate-100"
                  >
                    {row.channel}
                  </th>
                  <td className="bg-white/50 px-4 py-3.5 align-top text-slate-700 dark:bg-slate-900/35 dark:text-slate-300">
                    {row.typicalCost}
                  </td>
                  <td className="bg-white/50 px-4 py-3.5 align-top text-slate-700 dark:bg-slate-900/35 dark:text-slate-300">
                    {row.delivery}
                  </td>
                  <td className="bg-white/50 px-4 py-3.5 align-top text-slate-700 dark:bg-slate-900/35 dark:text-slate-300">
                    {row.gap}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-4 text-xs leading-relaxed text-slate-500 dark:text-slate-500">{t.valueComparisonDisclaimer}</p>
      </section>
    </div>
  );
}
