"use client";

import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { GlassCard } from "@/components/glass-card";
import { Section } from "@/components/section";
import { goDemandByRegion, goUseCaseMix, skillPairingIndex } from "@/data/go-ai-comparison";

const chartGreen = "#10b981";
const chartTeal = "#14b8a6";
const chartMuted = ["#34d399", "#2dd4bf", "#38bdf8", "#a78bfa"];

type TooltipContentProps = {
  active?: boolean;
  payload?: { name?: string; value?: string | number; dataKey?: string | number }[];
  label?: string | number;
};

/** Recharts default tooltip inherits bar fill for text — unreadable on dark popovers. Custom content = fixed contrast. */
function ChartTooltip({ active, payload, label }: TooltipContentProps) {
  if (!active || !payload?.length) return null;
  return (
    <div className="max-w-[280px] rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-xs shadow-lg ring-1 ring-black/5 dark:border-slate-600 dark:bg-slate-900 dark:ring-white/10">
      {label != null && String(label).length > 0 ? (
        <p className="mb-1.5 font-semibold leading-snug text-slate-900 dark:text-slate-50">{String(label)}</p>
      ) : null}
      <ul className="space-y-1">
        {payload.map((entry) => (
          <li key={`${entry.name}-${entry.dataKey}`} className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-0.5">
            <span className="text-slate-600 dark:text-slate-400">{entry.name}</span>
            <span className="font-mono text-sm font-semibold tabular-nums text-brand-berry dark:text-brand-onDarkStrong">
              {entry.value}
              {entry.name === "Share" || entry.dataKey === "pct" ? "%" : ""}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function GoLangAiSection() {
  return (
    <>
      <Section id="golang-ai" eyebrow="GO + AI" title="Why we focus on Go + AI — and what that unlocks">
        <p className="mb-8 max-w-3xl text-[0.9375rem] leading-relaxed text-slate-600 dark:text-slate-400">
          Go (Golang) is a modern backend language built for{" "}
          <strong className="font-medium text-slate-800 dark:text-slate-200">reliable systems at scale</strong>. AI is
          reshaping how software is built — but shipping real products still needs{" "}
          <strong className="font-medium text-slate-800 dark:text-slate-200">APIs, data, and disciplined engineering</strong>.
          Together, they pair well: Go for fast, maintainable services; AI for assistants, search, and automation on top.
        </p>

        <div className="grid gap-6 lg:grid-cols-2">
          <GlassCard>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Why Go is paid well in this era</h3>
            <ul className="mt-4 list-inside list-disc space-y-2 text-[0.9375rem] leading-relaxed text-slate-600 dark:text-slate-400">
              <li>
                <strong className="text-slate-800 dark:text-slate-200">Cloud-native default</strong> — Kubernetes, Docker, and
                much platform tooling are built with Go; teams pay for people who can move fast safely.
              </li>
              <li>
                <strong className="text-slate-800 dark:text-slate-200">Concurrency &amp; performance</strong> — great for
                APIs, microservices, and high-throughput systems without extra complexity.
              </li>
              <li>
                <strong className="text-slate-800 dark:text-slate-200">Small footprint</strong> — simpler deploys, fewer
                moving parts, easier ops — that saves money at scale.
              </li>
              <li>
                <strong className="text-slate-800 dark:text-slate-200">Supply vs demand</strong> — fewer Go experts than
                generic “CRUD only” devs; strong Go + systems thinking stays competitive.
              </li>
            </ul>
          </GlassCard>
          <GlassCard className="border-brand-sunset/25 dark:border-brand-sunset/25">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Why add AI to the stack</h3>
            <ul className="mt-4 list-inside list-disc space-y-2 text-[0.9375rem] leading-relaxed text-slate-600 dark:text-slate-400">
              <li>
                <strong className="text-slate-800 dark:text-slate-200">Productivity</strong> — LLMs accelerate design,
                docs, and boilerplate when used with review and tests.
              </li>
              <li>
                <strong className="text-slate-800 dark:text-slate-200">New features</strong> — search, summarization,
                chatbots, and internal tools are increasingly API-driven.
              </li>
              <li>
                <strong className="text-slate-800 dark:text-slate-200">Employability</strong> — teams want engineers who can
                integrate models responsibly (cost, privacy, safety).
              </li>
            </ul>
          </GlassCard>
        </div>
      </Section>

      <Section id="go-scope" eyebrow="SCOPE" title="India vs abroad — where Go shows up (and how to read it)">
        <GlassCard className="mb-6">
          <p className="text-[0.9375rem] leading-relaxed text-slate-700 dark:text-slate-300">
            <strong className="text-slate-900 dark:text-slate-100">India:</strong> Strong hiring in product startups, fintech,
            SaaS, and large IT firms building platforms. Many teams adopt Go for microservices and internal tooling.
            Compensation varies widely by city (Bangalore, Hyderabad, Pune, NCR) and whether you join a product company vs
            pure services.
          </p>
          <p className="mt-4 text-[0.9375rem] leading-relaxed text-slate-700 dark:text-slate-300">
            <strong className="text-slate-900 dark:text-slate-100">Abroad / remote:</strong> US and EU companies often pay
            higher cash for senior backend roles, but competition and bar for system design are higher. Remote global roles
            exist for candidates who can prove delivery, communication, and overlap with US/EU time zones.
          </p>
          <p className="mt-4 text-xs leading-relaxed text-slate-500 dark:text-slate-500">
            Charts below use an <strong>illustrative demand index (1–10)</strong>, not rupees or dollars. Real numbers change
            every quarter; use them as directional context, not a promise.
          </p>
        </GlassCard>

        <div className="grid gap-8 lg:grid-cols-2">
          <GlassCard className="flex flex-col">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-brand-sunset dark:text-brand-onDark">
              Relative demand signal (Go)
            </h3>
            <p className="mt-1 text-xs text-slate-500">Higher = more typical pull for Go backend roles in that bucket.</p>
            <div className="mt-4 h-[260px] w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart layout="vertical" data={goDemandByRegion} margin={{ left: 8, right: 16, top: 8, bottom: 8 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" horizontal={false} />
                  <XAxis type="number" domain={[0, 10]} tick={{ fill: "#71717a", fontSize: 11 }} />
                  <YAxis
                    type="category"
                    dataKey="region"
                    width={148}
                    tick={{ fill: "#a1a1aa", fontSize: 10 }}
                    interval={0}
                  />
                  <Tooltip content={<ChartTooltip />} cursor={{ fill: "rgba(16, 185, 129, 0.08)" }} />
                  <Bar dataKey="index" name="Index" fill={chartGreen} radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </GlassCard>

          <GlassCard className="flex flex-col">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-brand-sunset dark:text-brand-onDark">
              Typical Go work mix (illustrative %)
            </h3>
            <p className="mt-1 text-xs text-slate-500">Aggregated from common job descriptions — not a single company.</p>
            <div className="mt-4 h-[220px] w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart layout="vertical" data={goUseCaseMix} margin={{ left: 4, right: 16, top: 8, bottom: 8 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" horizontal={false} />
                  <XAxis type="number" domain={[0, 100]} tick={{ fill: "#71717a", fontSize: 11 }} tickFormatter={(v) => `${v}%`} />
                  <YAxis type="category" dataKey="name" width={118} tick={{ fill: "#a1a1aa", fontSize: 10 }} />
                  <Tooltip content={<ChartTooltip />} cursor={{ fill: "rgba(16, 185, 129, 0.08)" }} />
                  <Bar dataKey="pct" name="Share" radius={[0, 4, 4, 0]}>
                    {goUseCaseMix.map((_, i) => (
                      <Cell key={i} fill={chartMuted[i % chartMuted.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </GlassCard>
        </div>

        <GlassCard className="mt-8">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-brand-sunset dark:text-brand-onDark">
            Skills that pair with Go + AI (importance index)
          </h3>
          <p className="mt-1 text-xs text-slate-500">1 = nice-to-have, 10 = repeatedly decisive in interviews and delivery.</p>
          <div className="mt-4 h-[280px] w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={skillPairingIndex} layout="vertical" margin={{ left: 8, right: 16, top: 8, bottom: 8 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" horizontal={false} />
                <XAxis type="number" domain={[0, 10]} tick={{ fill: "#71717a", fontSize: 11 }} />
                <YAxis type="category" dataKey="skill" width={130} tick={{ fill: "#a1a1aa", fontSize: 10 }} />
                <Tooltip content={<ChartTooltip />} cursor={{ fill: "rgba(20, 184, 166, 0.1)" }} />
                <Bar dataKey="value" name="Index" fill={chartTeal} radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>
      </Section>

      <Section id="go-summary" eyebrow="BOTTOM LINE" title="What we are optimising for">
        <div className="grid gap-6 md:grid-cols-2">
          <GlassCard>
            <p className="text-[0.9375rem] leading-relaxed text-slate-700 dark:text-slate-300">
              <strong className="text-slate-900 dark:text-slate-100">Go</strong> helps you build credibility in{" "}
              <span className="font-medium text-slate-800 dark:text-slate-200">backend engineering</span> where companies
              actually feel pain: reliability, performance, and shipping on time.
            </p>
          </GlassCard>
          <GlassCard>
            <p className="text-[0.9375rem] leading-relaxed text-slate-700 dark:text-slate-300">
              <strong className="text-slate-900 dark:text-slate-100">AI</strong> helps you build leverage in{" "}
              <span className="font-medium text-slate-800 dark:text-slate-200">how you design and deliver</span> — not as a
              replacement for fundamentals, but as a multiplier when you stay honest about limits and quality.
            </p>
          </GlassCard>
        </div>
      </Section>
    </>
  );
}
