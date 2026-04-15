"use client";

import { useMemo, useState } from "react";
import { GlassCard } from "@/components/glass-card";
import { GolangLearnResources } from "@/components/jobs/golang-learn-resources";
import { GolangSalaryInsight } from "@/components/jobs/golang-salary-insight";
import type { UnifiedJob } from "@/lib/remote-jobs";
import { filterJobs } from "@/lib/remote-jobs";
import type { MessageTree } from "@/lib/i18n/messages";

type Chip = "all" | "remote" | "ai" | "golang";

export function JobBoard({ jobs, t }: { jobs: UnifiedJob[]; t: MessageTree["jobsPage"] }) {
  const [q, setQ] = useState("");
  const [chip, setChip] = useState<Chip>("all");

  const filtered = useMemo(() => filterJobs(jobs, q, chip), [jobs, q, chip]);

  return (
    <div className="page-shell py-10 sm:py-14">
      <h1 className="text-3xl font-semibold tracking-tight text-slate-900 dark:text-slate-50 sm:text-4xl">{t.title}</h1>
      <p className="mt-3 max-w-3xl text-sm leading-relaxed text-slate-600 dark:text-slate-400 sm:text-[0.9375rem]">{t.intro}</p>

      <GolangLearnResources t={t} />

      <GolangSalaryInsight t={t} />

      <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center">
        <input
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder={t.searchPlaceholder}
          className="w-full max-w-md rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 shadow-sm outline-none ring-brand-sunset/20 focus:ring-2 dark:border-white/10 dark:bg-slate-900/60 dark:text-slate-100 sm:flex-1"
          aria-label={t.searchPlaceholder}
        />
        <div className="flex flex-wrap gap-2">
          {(
            [
              ["all", t.filterAll],
              ["remote", t.filterRemote],
              ["ai", t.filterAi],
              ["golang", t.filterGolang],
            ] as const
          ).map(([id, label]) => (
            <button
              key={id}
              type="button"
              onClick={() => setChip(id)}
              className={`rounded-full border px-3 py-1.5 text-sm font-medium transition ${
                chip === id
                  ? "border-brand-sunset bg-brand-sunset/10 text-brand-berry dark:border-brand-sunset/50 dark:bg-brand-berry/30 dark:text-brand-onDarkStrong"
                  : "border-slate-200 bg-slate-50 text-slate-700 hover:border-slate-300 dark:border-white/10 dark:bg-slate-900/40 dark:text-slate-300"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <p className="mt-4 text-xs text-slate-500 dark:text-slate-500">{t.updated}</p>

      {filtered.length === 0 ? (
        <p className="mt-10 text-sm text-slate-600 dark:text-slate-400">{t.noResults}</p>
      ) : (
        <ul className="mt-10 grid gap-5 lg:grid-cols-2">
          {filtered.map((job) => (
            <li key={job.id}>
              <GlassCard className="flex h-full flex-col border-slate-200/90 dark:border-white/10">
                <div className="flex gap-4">
                  {job.logoUrl && job.source === "remotive" ? (
                    <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-slate-100 dark:bg-slate-800">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={job.logoUrl} alt="" className="h-full w-full object-contain p-1" loading="lazy" />
                    </div>
                  ) : (
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-brand-sunset/15 text-sm font-bold text-brand-berry dark:text-brand-onDarkStrong">
                      {job.company.slice(0, 2).toUpperCase()}
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <h2 className="text-lg font-semibold leading-snug text-slate-900 dark:text-slate-50">{job.title}</h2>
                    <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{job.company}</p>
                    <div className="mt-2 flex flex-wrap gap-2 text-xs">
                      {job.remote ? (
                        <span className="rounded-md bg-brand-sunset/15 px-2 py-0.5 font-medium text-brand-berry dark:text-brand-onDarkStrong">
                          {t.remoteBadge}
                        </span>
                      ) : null}
                      {job.location ? (
                        <span className="rounded-md bg-slate-500/10 px-2 py-0.5 text-slate-600 dark:text-slate-400">
                          {job.location}
                        </span>
                      ) : null}
                      <span className="rounded-md bg-slate-500/10 px-2 py-0.5 text-slate-500 dark:text-slate-500">
                        {t.sourceLabel}: {job.source === "remotive" ? "Remotive" : "Arbeitnow"}
                      </span>
                    </div>
                  </div>
                </div>
                {job.tags.length > 0 ? (
                  <p className="mt-3 flex flex-wrap gap-1.5 text-xs text-slate-500 dark:text-slate-500">
                    {job.tags.slice(0, 8).map((tag) => (
                      <span key={tag} className="rounded bg-slate-100 px-2 py-0.5 dark:bg-slate-800">
                        {tag}
                      </span>
                    ))}
                  </p>
                ) : null}
                <p className="mt-3 line-clamp-4 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                  {job.descriptionText.slice(0, 320)}
                  {job.descriptionText.length > 320 ? "…" : ""}
                </p>
                {job.postedAt ? (
                  <p className="mt-2 text-xs text-slate-500">
                    {t.posted}: {job.postedAt}
                  </p>
                ) : null}
                <div className="mt-4 flex flex-wrap gap-3 border-t border-slate-200/80 pt-4 dark:border-white/10">
                  <a
                    href={job.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-accent inline-flex text-sm"
                  >
                    {t.applyOn}
                  </a>
                </div>
              </GlassCard>
            </li>
          ))}
        </ul>
      )}

      <div className="mt-12 rounded-xl border border-amber-200/80 bg-amber-50/80 px-4 py-3 text-xs leading-relaxed text-amber-950 dark:border-amber-500/30 dark:bg-amber-950/30 dark:text-amber-100">
        {t.attribution}
      </div>
    </div>
  );
}
