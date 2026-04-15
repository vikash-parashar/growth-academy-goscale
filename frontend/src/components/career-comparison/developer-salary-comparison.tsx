"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Line, ComposedChart, Cell } from "recharts";
import { GlassCard } from "@/components/glass-card";
import { Section } from "@/components/section";
import {
  developerSalaryComparison,
  salaryFactors,
  careerProgression,
  remoteSalaryMultipliers,
  goSalaryPremiumReasons,
} from "@/data/developer-salary-comparison";

type TooltipContentProps = {
  active?: boolean;
  payload?: { name?: string; value?: string | number; dataKey?: string | number }[];
  label?: string | number;
};

function ChartTooltip({ active, payload, label }: TooltipContentProps) {
  if (!active || !payload?.length) return null;
  return (
    <div className="max-w-[300px] rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-xs shadow-lg ring-1 ring-black/5 dark:border-slate-600 dark:bg-slate-900 dark:ring-white/10">
      {label != null && String(label).length > 0 ? (
        <p className="mb-1.5 font-semibold leading-snug text-slate-900 dark:text-slate-50">{String(label)}</p>
      ) : null}
      <ul className="space-y-1">
        {payload.map((entry) => (
          <li key={`${entry.name}-${entry.dataKey}`} className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-0.5">
            <span className="text-slate-600 dark:text-slate-400">{entry.name}</span>
            <span className="font-mono text-sm font-semibold tabular-nums">
              {typeof entry.value === "number" ? `₹${(entry.value / 100000).toFixed(1)}L` : entry.value}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

const colors = {
  go: "#ec4899",
  python: "#3b82f6",
  java: "#f97316",
  node: "#10b981",
  cpp: "#8b5cf6",
  rust: "#f43f5e",
};

export function DeveloperSalaryComparison() {
  // Prepare data for India comparison chart
  const indiaChartData = developerSalaryComparison.map((data) => ({
    language: data.language,
    min: data.india.min,
    mid: data.india.mid,
    max: data.india.max,
  }));

  // Prepare data for USA comparison chart
  const usaChartData = developerSalaryComparison.map((data) => ({
    language: data.language,
    min: data.usa.min,
    mid: data.usa.mid,
    max: data.usa.max,
  }));

  // Prepare data for demand comparison
  const demandChartData = developerSalaryComparison.map((data) => ({
    language: data.language,
    demand: data.demand,
  }));

  // Prepare data for career progression (using Go as example)
  const goData = developerSalaryComparison.find((d) => d.language === "Go (Golang)");
  const progressionData = careerProgression.map((prog) => ({
    yoe: prog.label,
    india: (goData?.india.min || 0) * prog.multiplier,
    usa: (goData?.usa.min || 0) * prog.multiplier,
  }));

  // Prepare data for remote multipliers (using Go mid-level)
  const goMid = goData?.india.mid || 1800000;
  const remoteData = remoteSalaryMultipliers.map((r) => ({
    market: r.market.split("(")[0].trim(),
    salary: goMid * r.multiplier,
  }));

  const colorMap: Record<string, string> = {
    "Go (Golang)": colors.go,
    Python: colors.python,
    Java: colors.java,
    "Node.js": colors.node,
    "C++": colors.cpp,
    Rust: colors.rust,
  };

  return (
    <>
      <Section id="developer-salary" eyebrow="EARNING POTENTIAL" title="Developer salaries globally — Go vs other languages">
        <div className="mb-8">
          <GlassCard>
            <p className="text-[0.9375rem] leading-relaxed text-slate-700 dark:text-slate-300">
              <strong className="text-slate-900 dark:text-slate-100">Real salary numbers vary wildly</strong> based on
              experience, company, location, and negotiation. Below are{" "}
              <strong className="text-slate-900 dark:text-slate-100">illustrative ranges</strong> for mid-level developers
              (2-5 YOE) across markets. These are NOT guarantees — they are directional data to help you understand earning
              potential and why Go often commands a premium.
            </p>
          </GlassCard>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* India Salary Comparison */}
          <GlassCard className="flex flex-col">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-brand-sunset dark:text-brand-onDark">
              India — Annual salary range (₹)
            </h3>
            <p className="mt-1 text-xs text-slate-500">Entry (min), Mid, and Senior (max) levels</p>
            <div className="mt-4 h-[300px] w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={indiaChartData} margin={{ left: 0, right: 16, top: 8, bottom: 48 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                  <XAxis dataKey="language" angle={-45} textAnchor="end" height={100} tick={{ fontSize: 10 }} />
                  <YAxis tick={{ fontSize: 11, fill: "#71717a" }} tickFormatter={(v) => `${(v / 100000).toFixed(0)}L`} />
                  <Tooltip content={<ChartTooltip />} cursor={{ fill: "rgba(16, 185, 129, 0.08)" }} />
                  <Legend />
                  <Bar dataKey="min" name="Entry" fill="#94a3b8" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="mid" name="Mid-level" fill="#64748b" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="max" name="Senior" fill="#1e293b" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </GlassCard>

          {/* USA Salary Comparison */}
          <GlassCard className="flex flex-col">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-brand-berry dark:text-brand-onDarkStrong">
              USA — Annual salary range ($)
            </h3>
            <p className="mt-1 text-xs text-slate-500">Entry (min), Mid, and Senior (max) levels</p>
            <div className="mt-4 h-[300px] w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={usaChartData} margin={{ left: 0, right: 16, top: 8, bottom: 48 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                  <XAxis dataKey="language" angle={-45} textAnchor="end" height={100} tick={{ fontSize: 10 }} />
                  <YAxis tick={{ fontSize: 11, fill: "#71717a" }} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}K`} />
                  <Tooltip content={<ChartTooltip />} cursor={{ fill: "rgba(16, 185, 129, 0.08)" }} />
                  <Legend />
                  <Bar dataKey="min" name="Entry" fill="#fecaca" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="mid" name="Mid-level" fill="#fca5a5" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="max" name="Senior" fill="#f87171" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </GlassCard>
        </div>
      </Section>

      {/* Market Demand */}
      <Section id="market-demand" eyebrow="DEMAND" title="Relative market demand (1–10 scale)">
        <GlassCard className="flex flex-col">
          <p className="mb-4 text-[0.9375rem] leading-relaxed text-slate-700 dark:text-slate-300">
            Where is the market pull strongest right now? Higher scores = more job openings, easier interviews, and better
            negotiating power.
          </p>
          <div className="h-[280px] w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart layout="vertical" data={demandChartData} margin={{ left: 80, right: 16, top: 8, bottom: 8 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" horizontal={false} />
                <XAxis type="number" domain={[0, 10]} tick={{ fill: "#71717a", fontSize: 11 }} />
                <YAxis type="category" dataKey="language" width={75} tick={{ fill: "#a1a1aa", fontSize: 11 }} />
                <Tooltip content={<ChartTooltip />} cursor={{ fill: "rgba(16, 185, 129, 0.08)" }} />
                <Bar dataKey="demand" name="Demand Index">
                  {demandChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={colorMap[entry.language] || "#64748b"} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>
      </Section>

      {/* Career Progression */}
      <Section id="career-growth" eyebrow="TRAJECTORY" title="How salary grows with experience (Go example)">
        <GlassCard className="flex flex-col">
          <p className="mb-4 text-[0.9375rem] leading-relaxed text-slate-700 dark:text-slate-300">
            Years of experience compound significantly — both in India and USA markets. The chart shows illustrative growth
            using Go developer progression.
          </p>
          <div className="h-[300px] w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={progressionData} margin={{ left: 0, right: 16, top: 8, bottom: 80 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                <XAxis dataKey="yoe" angle={-30} textAnchor="end" height={100} tick={{ fontSize: 10 }} />
                <YAxis yAxisId="left" tick={{ fontSize: 11, fill: "#71717a" }} tickFormatter={(v) => `₹${(v / 100000).toFixed(0)}L`} />
                <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11, fill: "#71717a" }} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}K`} />
                <Tooltip content={<ChartTooltip />} cursor={{ fill: "rgba(16, 185, 129, 0.08)" }} />
                <Legend />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="india"
                  name="India Market (₹)"
                  stroke={colors.go}
                  strokeWidth={3}
                  dot={{ fill: colors.go, r: 5 }}
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="usa"
                  name="USA Market ($)"
                  stroke={colors.node}
                  strokeWidth={3}
                  dot={{ fill: colors.node, r: 5 }}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>
      </Section>

      {/* Salary Factors */}
      <Section id="salary-factors" eyebrow="CONTEXT" title="What actually moves your paycheck">
        <div className="grid gap-6 lg:grid-cols-2">
          {salaryFactors.map((factor) => (
            <GlassCard key={factor.factor}>
              <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">{factor.factor}</h3>
              <p className="mt-2 text-[0.9375rem] leading-relaxed text-slate-700 dark:text-slate-300">{factor.impact}</p>
              <p className="mt-3 text-xs font-medium text-brand-sunset dark:text-brand-onDark">{factor.range}</p>
            </GlassCard>
          ))}
        </div>
      </Section>

      {/* Remote Multiplier */}
      <Section id="remote-multiplier" eyebrow="REMOTE WORK" title="Remote hiring multiplier — the same Go dev, different pay">
        <GlassCard className="mb-6">
          <p className="text-[0.9375rem] leading-relaxed text-slate-700 dark:text-slate-300">
            A Go developer based in India working for a US company can earn significantly more than a local India startup role
            — despite living in India. These multipliers show the typical adjustment.
          </p>
        </GlassCard>
        <div className="h-[260px] w-full min-w-0">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={remoteData} margin={{ left: 0, right: 16, top: 8, bottom: 64 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
              <XAxis dataKey="market" angle={-45} textAnchor="end" height={120} tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 11, fill: "#71717a" }} tickFormatter={(v) => `₹${(v / 100000).toFixed(0)}L`} />
              <Tooltip content={<ChartTooltip />} cursor={{ fill: "rgba(16, 185, 129, 0.08)" }} />
              <Bar dataKey="salary" name="Typical salary" fill={colors.go} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Section>

      {/* Why Go Premium */}
      <Section id="why-go-premium" eyebrow="PREMIUM FACTOR" title="Why Go commands higher salaries">
        <div className="grid gap-4 lg:grid-cols-2">
          <GlassCard className="border-brand-sunset/25 dark:border-brand-sunset/30">
            <p className="text-[0.9375rem] leading-relaxed text-slate-700 dark:text-slate-300">
              Go developers typically earn 10–18% more than comparable Python or Java developers because:
            </p>
            <ul className="mt-4 list-inside list-disc space-y-2.5 text-[0.9375rem] leading-relaxed text-slate-600 dark:text-slate-400">
              {goSalaryPremiumReasons.map((reason, idx) => (
                <li key={idx}>{reason}</li>
              ))}
            </ul>
          </GlassCard>
          <GlassCard className="border-brand-berry/40 dark:border-brand-berry/35">
            <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">Bottom line</h3>
            <p className="mt-3 text-[0.9375rem] leading-relaxed text-slate-700 dark:text-slate-300">
              Go is not the highest-paid language globally — but it{" "}
              <strong className="text-slate-900 dark:text-slate-100">pairs well with systems thinking and DevOps demand</strong>,
              which tend to be premium domains. If you combine strong Go fundamentals with cloud infrastructure knowledge, your
              earning potential scales faster.
            </p>
          </GlassCard>
        </div>
      </Section>

      {/* Caveats */}
      <Section id="salary-caveats" eyebrow="REALITY CHECK" title="What these numbers don't tell you">
        <div className="space-y-4">
          <GlassCard>
            <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">Not everyone gets to max</h3>
            <p className="mt-2 text-[0.9375rem] leading-relaxed text-slate-700 dark:text-slate-300">
              Reaching senior levels requires skill, leverage, networking, and luck. Many developers stay mid-level or plateau.
              This is not a criticism — it is a fact. Career growth compounds with deliberate learning and good choices.
            </p>
          </GlassCard>
          <GlassCard>
            <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">Money alone does not make happiness</h3>
            <p className="mt-2 text-[0.9375rem] leading-relaxed text-slate-700 dark:text-slate-300">
              A burnout-inducing $300K salary is worse than a sane $150K job. Location, work culture, remote flexibility,
              learning opportunities, and team quality matter as much as the paycheck.
            </p>
          </GlassCard>
          <GlassCard>
            <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">Beware of survivorship bias</h3>
            <p className="mt-2 text-[0.9375rem] leading-relaxed text-slate-700 dark:text-slate-300">
              Public tech salaries are often from successful companies and experienced developers. Entry-level and mid-career
              reality for most people is smaller numbers. None of this is guaranteed — it depends on execution and timing.
            </p>
          </GlassCard>
        </div>
      </Section>
    </>
  );
}
