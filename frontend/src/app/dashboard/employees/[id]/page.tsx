"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { FieldLabel, TextArea, TextInput } from "@/components/admin/form-controls";
import { PageHeader } from "@/components/admin/page-header";
import { TableSkeleton } from "@/components/admin/table-skeleton";
import { formatINRFromPaise, formatMonthLabel, formatRelativeDay } from "@/lib/format";
import { API_BASE } from "@/lib/http";
import {
  type Employee,
  type EmployeeSalaryPayment,
  getEmployee,
  listEmployeePayments,
  patchEmployee,
  recordEmployeePayment,
  uploadEmployeeResume,
} from "@/services/api";

function rupeesToPaise(s: string): number {
  const n = Number.parseFloat(s.replace(/,/g, "").trim());
  if (Number.isNaN(n) || n < 0) return 0;
  return Math.round(n * 100);
}

function paiseToRupeesInput(paise: number): string {
  return (paise / 100).toFixed(2).replace(/\.?0+$/, "");
}

export default function EmployeeDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = Number(params.id);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const [emp, setEmp] = useState<Employee | null>(null);
  const [payments, setPayments] = useState<EmployeeSalaryPayment[]>([]);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [roleTitle, setRoleTitle] = useState("");
  const [department, setDepartment] = useState("");
  const [experience, setExperience] = useState("");
  const [monthlySalaryRupees, setMonthlySalaryRupees] = useState("");
  const [incentivesNotes, setIncentivesNotes] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [status, setStatus] = useState("active");
  const [saving, setSaving] = useState(false);

  const [payMonth, setPayMonth] = useState("");
  const [payAmount, setPayAmount] = useState("");
  const [payIncentive, setPayIncentive] = useState("");
  const [payNotes, setPayNotes] = useState("");
  const [paySaving, setPaySaving] = useState(false);

  const [resumeUploading, setResumeUploading] = useState(false);

  const load = useCallback(async () => {
    if (!Number.isFinite(id) || id <= 0) return;
    setLoading(true);
    setErr(null);
    try {
      const [e, pr] = await Promise.all([getEmployee(id), listEmployeePayments(id)]);
      setEmp(e);
      setPayments(pr.items);
      setName(e.name);
      setEmail(e.email);
      setPhone(e.phone);
      setRoleTitle(e.role_title);
      setDepartment(e.department);
      setExperience(e.experience);
      setMonthlySalaryRupees(paiseToRupeesInput(e.monthly_salary_paise));
      setIncentivesNotes(e.incentives_notes);
      setStartDate(e.start_date ? e.start_date.slice(0, 10) : "");
      setEndDate(e.end_date ? e.end_date.slice(0, 10) : "");
      setStatus(e.status);
    } catch (e: unknown) {
      setErr(e instanceof Error ? e.message : "Failed to load");
      setEmp(null);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    void load();
  }, [load]);

  async function saveProfile(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setErr(null);
    try {
      const body: Record<string, unknown> = {
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        role_title: roleTitle.trim(),
        department: department.trim(),
        experience: experience.trim(),
        monthly_salary_paise: rupeesToPaise(monthlySalaryRupees),
        incentives_notes: incentivesNotes.trim(),
        start_date: startDate,
        status: status.trim() || "active",
      };
      if (endDate.trim()) {
        body.end_date = endDate.trim();
        body.clear_end_date = false;
      } else {
        body.clear_end_date = true;
      }
      await patchEmployee(id, body);
      await load();
    } catch (ex: unknown) {
      setErr(ex instanceof Error ? ex.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  async function addPayment(e: React.FormEvent) {
    e.preventDefault();
    if (!payMonth) {
      setErr("Select a month for salary.");
      return;
    }
    setPaySaving(true);
    setErr(null);
    try {
      const period = `${payMonth}-01`;
      await recordEmployeePayment(id, {
        period_month: period,
        amount_paise: rupeesToPaise(payAmount),
        incentive_paise: rupeesToPaise(payIncentive || "0"),
        notes: payNotes.trim(),
      });
      setPayAmount("");
      setPayIncentive("");
      setPayNotes("");
      await load();
    } catch (ex: unknown) {
      setErr(ex instanceof Error ? ex.message : "Could not record payment");
    } finally {
      setPaySaving(false);
    }
  }

  async function onResumeChange(f: File | null) {
    if (!f) return;
    setResumeUploading(true);
    setErr(null);
    try {
      const updated = await uploadEmployeeResume(id, f);
      setEmp(updated);
    } catch (ex: unknown) {
      setErr(ex instanceof Error ? ex.message : "Upload failed");
    } finally {
      setResumeUploading(false);
    }
  }

  if (!Number.isFinite(id) || id <= 0) {
    return <p className="text-sm text-red-600 dark:text-red-400">Invalid employee.</p>;
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-4xl space-y-6">
        <PageHeader title="Employee" subtitle="Loading…" />
        <TableSkeleton columns={4} rows={5} />
      </div>
    );
  }

  if (!emp) {
    return (
      <div className="space-y-4">
        <p className="text-sm text-red-600 dark:text-red-400">{err ?? "Not found."}</p>
        <button
          type="button"
          onClick={() => router.push("/dashboard/employees")}
          className="text-sm font-medium text-brand-sunset hover:underline dark:text-brand-onDark"
        >
          ← Back to list
        </button>
      </div>
    );
  }

  const resumeHref = emp.resume_url ? `${API_BASE}${emp.resume_url}` : null;

  return (
    <div className="mx-auto w-full max-w-4xl space-y-10">
      <PageHeader
        title={emp.name}
        subtitle={`${emp.employee_code} · ${emp.role_title || "—"}`}
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <Link
              href={`/dashboard/employees/${id}/id-card`}
              className="btn-secondary px-4 py-2 text-sm font-medium"
            >
              Generate ID card
            </Link>
            <Link
              href="/dashboard/employees"
              className="text-sm text-slate-600 hover:text-slate-900 dark:text-slate-500 dark:hover:text-slate-300"
            >
              All employees
            </Link>
          </div>
        }
      />

      {err ? <p className="text-sm text-red-600 dark:text-red-400">{err}</p> : null}

      <section className="admin-surface p-6">
        <h2 className="text-sm font-semibold tracking-wide text-slate-800 dark:text-slate-200">Profile & compensation</h2>
        <form onSubmit={(e) => void saveProfile(e)} className="mt-4 grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <FieldLabel>Full name</FieldLabel>
            <TextInput value={name} onChange={(e) => setName(e.target.value)} required />
          </div>
          <div>
            <FieldLabel>Email</FieldLabel>
            <TextInput type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div>
            <FieldLabel>Phone</FieldLabel>
            <TextInput value={phone} onChange={(e) => setPhone(e.target.value)} />
          </div>
          <div>
            <FieldLabel>Role / title</FieldLabel>
            <TextInput value={roleTitle} onChange={(e) => setRoleTitle(e.target.value)} />
          </div>
          <div>
            <FieldLabel>Department</FieldLabel>
            <TextInput value={department} onChange={(e) => setDepartment(e.target.value)} />
          </div>
          <div className="sm:col-span-2">
            <FieldLabel>Experience & resume</FieldLabel>
            <TextArea value={experience} onChange={(e) => setExperience(e.target.value)} rows={4} />
          </div>
          <div>
            <FieldLabel>Monthly salary (INR)</FieldLabel>
            <TextInput value={monthlySalaryRupees} onChange={(e) => setMonthlySalaryRupees(e.target.value)} />
          </div>
          <div>
            <FieldLabel>Status</FieldLabel>
            <TextInput value={status} onChange={(e) => setStatus(e.target.value)} />
          </div>
          <div className="sm:col-span-2">
            <FieldLabel>Incentives (notes)</FieldLabel>
            <TextArea value={incentivesNotes} onChange={(e) => setIncentivesNotes(e.target.value)} rows={3} />
          </div>
          <div>
            <FieldLabel>Start date</FieldLabel>
            <TextInput type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} required />
          </div>
          <div>
            <FieldLabel>End date</FieldLabel>
            <TextInput type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
            <p className="mt-1 text-xs text-slate-600 dark:text-slate-500">Clear the field and save to mark as current.</p>
          </div>
          <div className="sm:col-span-2 flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="btn-accent px-5 py-2 text-sm disabled:opacity-50"
            >
              {saving ? "Saving…" : "Save changes"}
            </button>
          </div>
        </form>
      </section>

      <section className="admin-surface p-6">
        <h2 className="text-sm font-semibold tracking-wide text-slate-800 dark:text-slate-200">Resume file</h2>
        <p className="mt-1 text-xs text-slate-600 dark:text-slate-500">PDF or DOCX. Stored on the server under your uploads.</p>
        <div className="mt-4 flex flex-wrap items-center gap-4">
          <label className="cursor-pointer rounded-lg border border-dashed border-slate-300 px-4 py-3 text-sm text-slate-700 hover:border-brand-sunset/50 dark:border-white/20 dark:text-slate-300 dark:hover:border-brand-sunset/40">
            <input
              type="file"
              className="hidden"
              accept=".pdf,.doc,.docx,application/pdf"
              onChange={(e) => void onResumeChange(e.target.files?.[0] ?? null)}
              disabled={resumeUploading}
            />
            {resumeUploading ? "Uploading…" : "Upload / replace resume"}
          </label>
          {resumeHref ? (
            <a
              href={resumeHref}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium text-brand-sunset hover:underline dark:text-brand-onDark"
            >
              Open current file
            </a>
          ) : (
            <span className="text-sm text-slate-600 dark:text-slate-500">No file yet</span>
          )}
        </div>
      </section>

      <section className="admin-surface p-6">
        <h2 className="text-sm font-semibold tracking-wide text-slate-800 dark:text-slate-200">Salary payment history</h2>
        <p className="mt-1 text-xs text-slate-600 dark:text-slate-500">One row per month. Re-entering the same month updates the amounts.</p>

        <form
          onSubmit={(e) => void addPayment(e)}
          className="mt-4 grid gap-3 rounded-lg border border-slate-200/80 bg-slate-50/90 p-4 sm:grid-cols-2 lg:grid-cols-4 dark:border-white/[0.06] dark:bg-slate-950/50"
        >
          <div>
            <FieldLabel>Month</FieldLabel>
            <TextInput type="month" value={payMonth} onChange={(e) => setPayMonth(e.target.value)} />
          </div>
          <div>
            <FieldLabel>Salary paid (INR)</FieldLabel>
            <TextInput
              inputMode="decimal"
              value={payAmount}
              onChange={(e) => setPayAmount(e.target.value)}
              placeholder="Gross / net as you track"
            />
          </div>
          <div>
            <FieldLabel>Incentives (INR)</FieldLabel>
            <TextInput inputMode="decimal" value={payIncentive} onChange={(e) => setPayIncentive(e.target.value)} placeholder="0" />
          </div>
          <div className="sm:col-span-2 lg:col-span-1">
            <FieldLabel>Notes</FieldLabel>
            <TextInput value={payNotes} onChange={(e) => setPayNotes(e.target.value)} placeholder="Optional" />
          </div>
          <div className="flex items-end sm:col-span-2 lg:col-span-4">
            <button
              type="submit"
              disabled={paySaving}
              className="btn-accent px-4 py-2 text-sm disabled:opacity-50"
            >
              {paySaving ? "Saving…" : "Record payment"}
            </button>
          </div>
        </form>

        <div className="mt-6 overflow-x-auto">
          <table className="min-w-[640px] w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200/80 text-xs uppercase tracking-wide text-slate-500 dark:border-white/[0.07] dark:text-slate-500">
                <th className="py-2 pr-4 font-medium">Month</th>
                <th className="py-2 pr-4 font-medium">Salary</th>
                <th className="py-2 pr-4 font-medium">Incentives</th>
                <th className="py-2 pr-4 font-medium">Notes</th>
                <th className="py-2 font-medium">Logged</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-white/[0.05]">
              {payments.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-6 text-center text-slate-500">
                    No payments yet.
                  </td>
                </tr>
              ) : (
                payments.map((p) => (
                  <tr key={p.id}>
                    <td className="py-3 text-slate-800 dark:text-slate-200">{formatMonthLabel(p.period_month)}</td>
                    <td className="py-3 text-slate-800 dark:text-slate-300">{formatINRFromPaise(p.amount_paise)}</td>
                    <td className="py-3 text-slate-600 dark:text-slate-400">{formatINRFromPaise(p.incentive_paise)}</td>
                    <td className="max-w-[220px] truncate py-3 text-slate-600 dark:text-slate-500">{p.notes || "—"}</td>
                    <td className="whitespace-nowrap py-3 text-xs text-slate-500 dark:text-slate-600">
                      {formatRelativeDay(p.created_at)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
