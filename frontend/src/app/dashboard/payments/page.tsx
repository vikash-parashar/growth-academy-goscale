"use client";

import { useCallback, useEffect, useState } from "react";
import { EmptyState } from "@/components/admin/empty-state";
import { PageHeader } from "@/components/admin/page-header";
import { TableSkeleton } from "@/components/admin/table-skeleton";
import { formatDateTime, formatINRFromPaise } from "@/lib/format";
import { AdminPayment, listPaymentsAdmin } from "@/lib/api";

function statusStyle(status: string) {
  switch (status) {
    case "captured":
      return "bg-brand-sunset/15 text-brand-berry dark:text-brand-onDarkStrong";
    case "created":
      return "bg-amber-500/15 text-amber-900 dark:text-amber-200";
    default:
      return "bg-slate-100 text-slate-700 dark:bg-white/[0.06] dark:text-slate-300";
  }
}

export default function PaymentsPage() {
  const [items, setItems] = useState<AdminPayment[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setErr(null);
    try {
      const res = await listPaymentsAdmin();
      setItems(res.items);
    } catch (e: unknown) {
      setErr(e instanceof Error ? e.message : "Failed to load payments");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const capturedTotal = items.filter((p) => p.status === "captured").reduce((s, p) => s + p.amount, 0);

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <PageHeader
        title="Payments"
        subtitle="Razorpay orders and capture state — amounts in INR."
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

      {err ? <p className="text-sm text-red-400">{err}</p> : null}

      {!loading && items.length > 0 ? (
        <p className="text-sm text-slate-500">
          Captured total:{" "}
          <span className="font-medium text-slate-200">{formatINRFromPaise(capturedTotal)}</span>
        </p>
      ) : null}

      {loading ? (
        <TableSkeleton columns={6} rows={6} />
      ) : items.length === 0 ? (
        <EmptyState
          title="No payment records"
          description="Orders appear when checkout starts; successful verifies show as captured."
        />
      ) : (
        <div className="overflow-x-auto rounded-xl border border-slate-200/90 dark:border-white/[0.07]">
          <table className="min-w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200/80 bg-slate-50/95 text-xs uppercase tracking-wide text-slate-500 dark:border-white/[0.07] dark:bg-slate-900/70 dark:text-slate-500">
                <th className="whitespace-nowrap px-4 py-3 font-medium">ID</th>
                <th className="whitespace-nowrap px-4 py-3 font-medium">Lead</th>
                <th className="whitespace-nowrap px-4 py-3 font-medium">Amount</th>
                <th className="whitespace-nowrap px-4 py-3 font-medium">Status</th>
                <th className="whitespace-nowrap px-4 py-3 font-medium">Order</th>
                <th className="whitespace-nowrap px-4 py-3 font-medium">Created</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-white/[0.05]">
              {items.map((p) => (
                <tr key={p.id} className="text-slate-700 dark:text-slate-300">
                  <td className="whitespace-nowrap px-4 py-3 font-mono text-xs text-slate-500">#{p.id}</td>
                  <td className="whitespace-nowrap px-4 py-3 font-mono text-xs text-slate-800 dark:text-slate-200">
                    #{p.lead_id}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 font-medium text-slate-900 dark:text-slate-100">
                    {formatINRFromPaise(p.amount)}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3">
                    <span className={`inline-flex rounded-md px-2 py-0.5 text-xs capitalize ${statusStyle(p.status)}`}>
                      {p.status}
                    </span>
                  </td>
                  <td className="max-w-[140px] truncate px-4 py-3 font-mono text-xs text-slate-500" title={p.order_id}>
                    {p.order_id}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-xs text-slate-500">
                    {formatDateTime(p.created_at)}
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
