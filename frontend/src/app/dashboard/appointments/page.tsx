"use client";

import { useCallback, useEffect, useState } from "react";
import { EmptyState } from "@/components/admin/empty-state";
import { PageHeader } from "@/components/admin/page-header";
import { TableSkeleton } from "@/components/admin/table-skeleton";
import { formatDateTime } from "@/lib/format";
import { Appointment, listAppointments, patchAppointment } from "@/lib/api";

export default function AppointmentsPage() {
  const [items, setItems] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setErr(null);
    try {
      const res = await listAppointments();
      setItems(res.items);
    } catch (e: unknown) {
      setErr(e instanceof Error ? e.message : "Failed to load appointments");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <PageHeader
        title="Appointments"
        subtitle="Bookings tied to lead IDs — accept or reject in one click."
        actions={
          <button
            type="button"
            onClick={() => void load()}
            className="btn-secondary px-3 py-2 text-sm"
          >
            Refresh
          </button>
        }
      />

      {err ? <p className="text-sm text-red-600 dark:text-red-400">{err}</p> : null}

      {loading ? (
        <TableSkeleton columns={5} rows={6} />
      ) : items.length === 0 ? (
        <EmptyState
          title="No bookings"
          description="When students schedule from the site, rows will show date, time, and status here."
        />
      ) : (
        <div className="overflow-x-auto rounded-xl border border-slate-200/90 dark:border-white/[0.07]">
          <table className="min-w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200/80 bg-slate-50/95 text-xs uppercase tracking-wide text-slate-500 dark:border-white/[0.07] dark:bg-slate-900/70 dark:text-slate-500">
                <th className="whitespace-nowrap px-4 py-3 font-medium">ID</th>
                <th className="whitespace-nowrap px-4 py-3 font-medium">Lead</th>
                <th className="whitespace-nowrap px-4 py-3 font-medium">Date & time</th>
                <th className="whitespace-nowrap px-4 py-3 font-medium">Status</th>
                <th className="whitespace-nowrap px-4 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-white/[0.05]">
              {items.map((a) => (
                <tr key={a.id} className="text-slate-700 dark:text-slate-300">
                  <td className="whitespace-nowrap px-4 py-3 font-mono text-xs text-slate-500">#{a.id}</td>
                  <td className="whitespace-nowrap px-4 py-3 font-mono text-xs text-slate-800 dark:text-slate-200">
                    Lead #{a.lead_id}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-slate-800 dark:text-slate-200">
                    {formatDateTime(a.datetime)}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3">
                    <span className="inline-flex rounded-md bg-brand-sunset/12 px-2 py-0.5 text-xs capitalize text-brand-berry dark:bg-white/[0.06] dark:text-brand-onDarkStrong/90">
                      {a.status}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-4 py-3">
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        className="rounded-md bg-brand-sunset/15 px-2.5 py-1 text-xs font-medium text-brand-berry hover:bg-brand-sunset/25 dark:text-brand-onDarkStrong dark:hover:bg-brand-sunsetBright/25"
                        onClick={async () => {
                          await patchAppointment(a.id, "accepted");
                          void load();
                        }}
                      >
                        Accept
                      </button>
                      <button
                        type="button"
                        className="rounded-md bg-red-500/15 px-2.5 py-1 text-xs font-medium text-red-700 hover:bg-red-500/25 dark:text-red-300"
                        onClick={async () => {
                          await patchAppointment(a.id, "rejected");
                          void load();
                        }}
                      >
                        Reject
                      </button>
                    </div>
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
