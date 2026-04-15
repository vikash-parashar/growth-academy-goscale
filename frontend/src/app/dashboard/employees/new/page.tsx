"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FieldLabel, TextArea, TextInput } from "@/components/admin/form-controls";
import { PageHeader } from "@/components/admin/page-header";
import { createEmployee } from "@/services/api";

function rupeesToPaise(s: string): number {
  const n = Number.parseFloat(s.replace(/,/g, "").trim());
  if (Number.isNaN(n) || n < 0) return 0;
  return Math.round(n * 100);
}

export default function NewEmployeePage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState<string | null>(null);

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

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    if (!name.trim()) {
      setErr("Name is required.");
      return;
    }
    if (!startDate) {
      setErr("Start date is required.");
      return;
    }
    setSaving(true);
    try {
      const emp = await createEmployee({
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        role_title: roleTitle.trim(),
        department: department.trim(),
        experience: experience.trim(),
        monthly_salary_paise: rupeesToPaise(monthlySalaryRupees),
        incentives_notes: incentivesNotes.trim(),
        start_date: startDate,
        end_date: endDate.trim() ? endDate : null,
        status: status.trim() || "active",
      });
      router.push(`/dashboard/employees/${emp.id}`);
    } catch (ex: unknown) {
      setErr(ex instanceof Error ? ex.message : "Could not save employee");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="mx-auto w-full max-w-3xl space-y-8">
      <PageHeader
        title="Onboard employee"
        subtitle="Basic profile, compensation, and dates. You can add resume and payroll history after saving."
        actions={
          <Link
            href="/dashboard/employees"
            className="btn-secondary px-4 py-2 text-sm"
          >
            Cancel
          </Link>
        }
      />

      {err ? <p className="text-sm text-red-600 dark:text-red-400">{err}</p> : null}

      <form onSubmit={(e) => void onSubmit(e)} className="admin-surface space-y-6 p-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <FieldLabel>Full name *</FieldLabel>
            <TextInput value={name} onChange={(e) => setName(e.target.value)} required autoComplete="name" />
          </div>
          <div>
            <FieldLabel>Email</FieldLabel>
            <TextInput type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" />
          </div>
          <div>
            <FieldLabel>Phone</FieldLabel>
            <TextInput value={phone} onChange={(e) => setPhone(e.target.value)} autoComplete="tel" />
          </div>
          <div>
            <FieldLabel>Role / title</FieldLabel>
            <TextInput value={roleTitle} onChange={(e) => setRoleTitle(e.target.value)} placeholder="e.g. Backend Engineer" />
          </div>
          <div>
            <FieldLabel>Department</FieldLabel>
            <TextInput value={department} onChange={(e) => setDepartment(e.target.value)} />
          </div>
          <div className="sm:col-span-2">
            <FieldLabel>Experience & background</FieldLabel>
            <TextArea value={experience} onChange={(e) => setExperience(e.target.value)} placeholder="Years, stack, highlights…" />
          </div>
          <div>
            <FieldLabel>Monthly salary (INR)</FieldLabel>
            <TextInput
              inputMode="decimal"
              value={monthlySalaryRupees}
              onChange={(e) => setMonthlySalaryRupees(e.target.value)}
              placeholder="e.g. 85000"
            />
            <p className="mt-1 text-xs text-slate-600 dark:text-slate-500">Stored precisely (paise) for payroll.</p>
          </div>
          <div>
            <FieldLabel>Incentives (notes)</FieldLabel>
            <TextArea value={incentivesNotes} onChange={(e) => setIncentivesNotes(e.target.value)} rows={3} placeholder="Structure, targets, bonuses…" />
          </div>
          <div>
            <FieldLabel>Start date *</FieldLabel>
            <TextInput type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} required />
          </div>
          <div>
            <FieldLabel>End date</FieldLabel>
            <TextInput type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
            <p className="mt-1 text-xs text-slate-600">Leave empty if currently employed.</p>
          </div>
          <div>
            <FieldLabel>Status</FieldLabel>
            <TextInput value={status} onChange={(e) => setStatus(e.target.value)} placeholder="active" />
          </div>
        </div>

        <div className="flex justify-end gap-3 border-t border-slate-200/80 pt-6 dark:border-white/[0.06]">
          <Link href="/dashboard/employees" className="btn-secondary px-4 py-2 text-sm">
            Back
          </Link>
          <button type="submit" disabled={saving} className="btn-accent px-6 py-2 text-sm disabled:opacity-50">
            {saving ? "Saving…" : "Save & continue"}
          </button>
        </div>
      </form>
    </div>
  );
}
