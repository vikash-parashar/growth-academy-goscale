"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { EmptyState } from "@/components/admin/empty-state";
import { MetricCard } from "@/components/admin/metric-card";
import { PageHeader } from "@/components/admin/page-header";
import { TableSkeleton } from "@/components/admin/table-skeleton";
import { formatINRFromPaise } from "@/lib/format";
import { AdminPayment, listPaymentsAdmin } from "@/lib/api";
import { type Lead, fetchLeads } from "@/services/api";

type NextStep = {
  title: string;
  subtitle: string;
  href: string;
  cta: string;
};

export default function DashboardHomePage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [payments, setPayments] = useState<AdminPayment[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      setErr(null);
      try {
        const [lr, pr] = await Promise.all([
          fetchLeads({ status: "all", q: "" }),
          listPaymentsAdmin(),
        ]);
        if (!cancelled) {
          setLeads(lr.items);
          setPayments(pr.items);
        }
      } catch (e: unknown) {
        if (!cancelled) setErr(e instanceof Error ? e.message : "Failed to load");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    void load();
    return () => {
      cancelled = true;
    };
  }, []);

  const metrics = useMemo(() => {
    const total = leads.length;
    const contacted = leads.filter((l) => l.status === "contacted").length;
    const converted = leads.filter((l) => l.status === "converted").length;
    const revenuePaise = payments.filter((p) => p.status === "captured").reduce((s, p) => s + p.amount, 0);
    return { total, contacted, converted, revenuePaise };
  }, [leads, payments]);

  const recentLeads = useMemo(() => {
    return [...leads]
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .slice(0, 6);
  }, [leads]);

  const nextStep = useMemo((): NextStep | null => {
    if (loading) return null;
    const total = leads.length;
    const newCount = leads.filter((l) => l.status === "new").length;
    if (total === 0) {
      return {
        title: "Fill the pipeline",
        subtitle: "Share the apply link. New leads will show here and under Leads.",
        href: "/eligibility",
        cta: "Open apply form",
      };
    }
    if (newCount > 0) {
      return {
        title: `${newCount} new lead${newCount > 1 ? "s" : ""} to review`,
        subtitle: "Triage quickly — first touch wins conversions.",
        href: "/dashboard/leads",
        cta: "Open leads",
      };
    }
    if (metrics.converted === 0) {
      return {
        title: "Move leads down the funnel",
        subtitle: "Update statuses and notes so nothing slips.",
        href: "/dashboard/leads",
        cta: "Manage pipeline",
      };
    }
    return {
      title: "Team & payroll",
      subtitle: "Onboard people, run salary, issue ID cards.",
      href: "/dashboard/employees",
      cta: "Employees",
    };
  }, [loading, leads, metrics.converted]);

  return (
    <div className="mx-auto max-w-6xl space-y-10">
      <PageHeader
        title="Dashboard"
        subtitle="Pipeline health, leads, and revenue at a glance."
        actions={
          <Link href="/dashboard/leads" className="btn-accent-sm">
            View leads
          </Link>
        }
      />

      {err ? <p className="text-sm text-red-600 dark:text-red-400">{err}</p> : null}

      {nextStep ? (
        <section
          aria-label="Suggested next step"
          className="rounded-2xl border border-[#fc819e]/35 bg-gradient-to-br from-[#fec7b4]/35 via-white/92 to-[#ff8e8f]/18 p-5 shadow-sm dark:border-[#456882]/45 dark:from-[#234c6a]/55 dark:via-[#1b3c53]/50 dark:to-[#456882]/28 sm:flex sm:items-center sm:justify-between sm:gap-6"
        >
          <div>
            <p className="section-eyebrow tracking-[0.2em]">
              Next step
            </p>
            <h2 className="mt-1 text-lg font-semibold text-slate-900 dark:text-slate-50">{nextStep.title}</h2>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{nextStep.subtitle}</p>
            <p className="mt-3 text-xs text-slate-500 dark:text-slate-500">
              Product updates:{" "}
              <Link
                href="/changelog"
                className="text-brand-sunset underline-offset-2 hover:underline dark:text-brand-onDark/90"
              >
                What&apos;s new
              </Link>
            </p>
          </div>
          <Link
            href={nextStep.href}
            className="btn-accent mt-4 inline-flex shrink-0 px-5 py-2.5 text-sm sm:mt-0"
          >
            {nextStep.cta}
          </Link>
        </section>
      ) : null}

      <section>
        <h2 className="sr-only">Metrics</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <MetricCard label="Total leads" value={String(metrics.total)} loading={loading} />
          <MetricCard label="Contacted" value={String(metrics.contacted)} loading={loading} />
          <MetricCard label="Converted" value={String(metrics.converted)} loading={loading} />
          <MetricCard
            label="Revenue"
            value={formatINRFromPaise(metrics.revenuePaise)}
            hint="Captured payments"
            loading={loading}
          />
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="text-sm font-medium text-slate-800 dark:text-slate-300">Pipeline</h2>
            <p className="mt-0.5 text-sm text-slate-600 dark:text-slate-500">Newest leads — keep SLAs tight.</p>
          </div>
          <Link
            href="/dashboard/leads"
            className="text-sm font-medium text-brand-sunset hover:text-brand-berry dark:text-brand-onDark dark:hover:text-brand-onDarkStrong"
          >
            Manage →
          </Link>
        </div>

        {loading ? (
          <TableSkeleton columns={4} rows={5} />
        ) : recentLeads.length === 0 ? (
          <EmptyState
            title="No leads yet"
            description="When applications arrive, they will appear here and in the Leads tab."
            action={
              <Link
                href="/eligibility"
                className="text-sm font-medium text-brand-onDark hover:text-brand-onDarkStrong"
              >
                Open apply form
              </Link>
            }
          />
        ) : (
          <div className="overflow-x-auto rounded-xl border border-slate-200/90 shadow-sm dark:border-white/[0.07]">
            <table className="min-w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200/80 bg-slate-50/95 text-xs uppercase tracking-wide text-slate-500 dark:border-white/[0.07] dark:bg-slate-900/60 dark:text-slate-500">
                  <th className="whitespace-nowrap px-4 py-3 font-medium">Name</th>
                  <th className="whitespace-nowrap px-4 py-3 font-medium">Status</th>
                  <th className="whitespace-nowrap px-4 py-3 font-medium">Salary</th>
                  <th className="whitespace-nowrap px-4 py-3 font-medium">Created</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-white/[0.05]">
                {recentLeads.map((l) => (
                  <tr key={l.id} className="text-slate-700 dark:text-slate-300">
                    <td className="whitespace-nowrap px-4 py-3 font-medium text-slate-900 dark:text-slate-100">
                      {l.name}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3">
                      <span className="inline-flex rounded-md bg-slate-100 px-2 py-0.5 text-xs capitalize text-slate-700 dark:bg-white/[0.06] dark:text-slate-200">
                        {l.status}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-slate-600 dark:text-slate-400">{l.salary}</td>
                    <td className="whitespace-nowrap px-4 py-3 text-xs text-slate-500 dark:text-slate-500">
                      {new Date(l.created_at).toLocaleString("en-IN", {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
