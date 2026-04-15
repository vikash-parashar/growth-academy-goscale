"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { EmptyState } from "@/components/admin/empty-state";
import { FieldLabel, TextInput } from "@/components/admin/form-controls";
import { PageHeader } from "@/components/admin/page-header";
import { TableSkeleton } from "@/components/admin/table-skeleton";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import { downloadCsv } from "@/lib/csv";
import { formatINRFromPaise } from "@/lib/format";
import { type Employee, fetchEmployees } from "@/services/api";

function exportEmployeesCsv(list: Employee[]) {
  const header = [
    "Code",
    "Name",
    "Email",
    "Phone",
    "Role",
    "Department",
    "Monthly salary (paise)",
    "Status",
    "Start",
    "End",
    "Created",
  ];
  const rows = list.map((e) => [
    e.employee_code,
    e.name,
    e.email,
    e.phone,
    e.role_title,
    e.department,
    String(e.monthly_salary_paise),
    e.status,
    e.start_date,
    e.end_date ?? "",
    e.created_at,
  ]);
  downloadCsv(`gopherlab-employees-${new Date().toISOString().slice(0, 10)}.csv`, header, rows);
}

export default function EmployeesPage() {
  const [q, setQ] = useState("");
  const debouncedQ = useDebouncedValue(q, 320);
  const [items, setItems] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setErr(null);
    try {
      const res = await fetchEmployees(debouncedQ.trim() || undefined);
      setItems(res.items);
    } catch (e: unknown) {
      setErr(e instanceof Error ? e.message : "Failed to load employees");
    } finally {
      setLoading(false);
    }
  }, [debouncedQ]);

  useEffect(() => {
    void load();
  }, [load]);

  return (
    <div className="mx-auto w-full max-w-7xl space-y-8">
      <PageHeader
        title="Employees"
        subtitle="Onboard team members, track salary runs, and issue ID cards."
        actions={
          <Link href="/dashboard/employees/new" className="btn-accent-sm">
            Onboard employee
          </Link>
        }
      />

      {err ? <p className="text-sm text-red-600 dark:text-red-400">{err}</p> : null}

      <div className="admin-surface flex flex-col gap-4 p-4 sm:flex-row sm:items-end">
        <div className="flex-1">
          <FieldLabel>Search</FieldLabel>
          <TextInput
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Name, code, email, phone, role…"
            aria-label="Search employees"
          />
        </div>
        <div className="flex shrink-0 flex-wrap gap-2">
          <button
            type="button"
            disabled={loading || items.length === 0}
            onClick={() => exportEmployeesCsv(items)}
            className="rounded-lg border border-brand-sunset/35 bg-brand-sunset/10 px-4 py-2 text-sm font-medium text-brand-berry transition hover:bg-brand-sunset/15 disabled:cursor-not-allowed disabled:opacity-40 dark:bg-brand-berry/25 dark:text-brand-onDarkStrong dark:hover:bg-brand-berry/30"
          >
            Export CSV
          </button>
          <button
            type="button"
            onClick={() => void load()}
            className="btn-secondary px-4 py-2 text-sm"
          >
            Refresh
          </button>
        </div>
      </div>

      {loading ? (
        <TableSkeleton columns={6} rows={8} />
      ) : items.length === 0 ? (
        <EmptyState
          title="No employees yet"
          description="Start by onboarding your first team member."
          action={
            <Link
              href="/dashboard/employees/new"
              className="btn-accent-sm"
            >
              Onboard employee
            </Link>
          }
        />
      ) : (
        <div className="overflow-x-auto rounded-xl border border-slate-200/90 shadow-sm dark:border-white/[0.07]">
          <table className="min-w-[900px] w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200/80 bg-slate-50/95 text-xs uppercase tracking-wide text-slate-500 dark:border-white/[0.07] dark:bg-slate-900/70 dark:text-slate-500">
                <th className="whitespace-nowrap px-4 py-3 font-medium">Code</th>
                <th className="whitespace-nowrap px-4 py-3 font-medium">Name</th>
                <th className="whitespace-nowrap px-4 py-3 font-medium">Role</th>
                <th className="whitespace-nowrap px-4 py-3 font-medium">Monthly salary</th>
                <th className="whitespace-nowrap px-4 py-3 font-medium">Status</th>
                <th className="whitespace-nowrap px-4 py-3 font-medium">Start</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-white/[0.05]">
              {items.map((e) => (
                <tr key={e.id} className="hover:bg-slate-50/80 dark:hover:bg-white/[0.02]">
                  <td className="whitespace-nowrap px-4 py-3 font-mono text-xs text-brand-sunset dark:text-brand-onDark/90">
                    {e.employee_code}
                  </td>
                  <td className="px-4 py-3">
                    <Link
                      href={`/dashboard/employees/${e.id}`}
                      className="font-medium text-slate-900 hover:underline dark:text-slate-100"
                    >
                      {e.name}
                    </Link>
                  </td>
                  <td className="max-w-[200px] truncate px-4 py-3 text-slate-600 dark:text-slate-400">{e.role_title || "—"}</td>
                  <td className="whitespace-nowrap px-4 py-3 text-slate-700 dark:text-slate-300">
                    {formatINRFromPaise(e.monthly_salary_paise)}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-slate-600 dark:text-slate-400">{e.status}</td>
                  <td className="whitespace-nowrap px-4 py-3 text-slate-500 dark:text-slate-500">
                    {e.start_date ? new Date(e.start_date).toLocaleDateString("en-IN") : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
