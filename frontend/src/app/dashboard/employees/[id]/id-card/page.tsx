"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { getEmployee, type Employee } from "@/services/api";

function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function formatShortDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "short", year: "numeric" }).format(d);
}

export default function EmployeeIdCardPage() {
  const params = useParams();
  const id = Number(params.id);
  const [emp, setEmp] = useState<Employee | null>(null);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    if (!Number.isFinite(id) || id <= 0) return;
    let cancelled = false;
    void (async () => {
      try {
        const e = await getEmployee(id);
        if (!cancelled) setEmp(e);
      } catch (ex: unknown) {
        if (!cancelled) setErr(ex instanceof Error ? ex.message : "Failed to load");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [id]);

  if (!Number.isFinite(id) || id <= 0) {
    return <p className="text-sm text-red-600">Invalid employee.</p>;
  }

  if (err) {
    return <p className="text-sm text-red-600">{err}</p>;
  }

  if (!emp) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center text-sm text-slate-500">
        Loading ID card…
      </div>
    );
  }

  return (
    <div className="id-card-print">
      <div
        id="id-card-print"
        className="mx-auto w-full max-w-[420px] overflow-hidden rounded-2xl border border-slate-200 bg-white text-slate-900 shadow-2xl print:max-w-none print:border-2 print:border-slate-300 print:shadow-none"
      >
        <div className="bg-gradient-to-r from-brand-sunset via-brand-berry to-brand-berry px-6 py-4 text-white">
          <p className="text-[0.65rem] font-semibold uppercase tracking-[0.35em] text-brand-onDarkStrong/90">
            Gopher Lab
          </p>
          <p className="mt-1 text-lg font-semibold tracking-tight">Employee identification</p>
        </div>
        <div className="flex gap-5 px-6 py-6">
          <div
            className="flex h-24 w-24 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-brand-sunset/20 to-brand-berry/15 text-2xl font-bold text-brand-berry ring-2 ring-brand-sunset/30"
            aria-hidden
          >
            {initials(emp.name)}
          </div>
          <div className="min-w-0 flex-1 space-y-1.5 text-sm">
            <p className="text-sm font-semibold text-slate-950">{emp.name}</p>
            <p className="text-xs text-slate-500">ID</p>
            <p className="font-mono text-base font-semibold text-brand-berry">{emp.employee_code}</p>
            <p className="pt-1 text-xs text-slate-500">Role</p>
            <p className="text-slate-800">{emp.role_title || "—"}</p>
            {emp.department ? (
              <>
                <p className="pt-1 text-xs text-slate-500">Department</p>
                <p className="text-slate-700">{emp.department}</p>
              </>
            ) : null}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3 border-t border-slate-100 bg-slate-50 px-6 py-4 text-xs">
          <div>
            <p className="text-slate-500">Joined</p>
            <p className="font-medium text-slate-900">{formatShortDate(emp.start_date)}</p>
          </div>
          <div>
            <p className="text-slate-500">Status</p>
            <p className="font-medium capitalize text-slate-900">{emp.status}</p>
          </div>
          {emp.end_date ? (
            <div className="col-span-2">
              <p className="text-slate-500">End date</p>
              <p className="font-medium text-slate-900">{formatShortDate(emp.end_date)}</p>
            </div>
          ) : null}
        </div>
        <div className="border-t border-white/0 bg-white px-6 py-3 text-center text-[0.65rem] text-slate-400">
          Issued for internal verification · not transferable
        </div>
      </div>
    </div>
  );
}
