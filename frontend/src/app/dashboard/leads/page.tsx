"use client";

import { useCallback, useEffect, useState } from "react";
import { EmptyState } from "@/components/admin/empty-state";
import { FieldLabel, SelectInput, TextInput } from "@/components/admin/form-controls";
import { PageHeader } from "@/components/admin/page-header";
import { TableSkeleton } from "@/components/admin/table-skeleton";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import { downloadCsv } from "@/lib/csv";
import { formatDateTime } from "@/lib/format";
import { type Lead, fetchLeads, updateLead } from "@/services/api";

function exportLeadsCsv(list: Lead[]) {
  const header = ["Name", "Email", "Phone", "Experience", "Salary", "Goal", "Status", "Notes", "Created"];
  const rows = list.map((l) => [
    l.name,
    l.email,
    l.phone,
    l.experience,
    l.salary,
    l.goal,
    l.status,
    l.notes.replace(/\r?\n/g, " "),
    l.created_at,
  ]);
  downloadCsv(`gopherlab-leads-${new Date().toISOString().slice(0, 10)}.csv`, header, rows);
}

const STATUS_OPTIONS = [
  { value: "all", label: "All statuses" },
  { value: "new", label: "New" },
  { value: "contacted", label: "Contacted" },
  { value: "converted", label: "Converted" },
  { value: "rejected", label: "Rejected" },
] as const;

export default function LeadsPage() {
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [q, setQ] = useState("");
  const debouncedQ = useDebouncedValue(q, 320);
  const [items, setItems] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setErr(null);
    try {
      const res = await fetchLeads({ status: statusFilter, q: debouncedQ });
      setItems(res.items);
    } catch (e: unknown) {
      setErr(e instanceof Error ? e.message : "Failed to load leads");
    } finally {
      setLoading(false);
    }
  }, [statusFilter, debouncedQ]);

  useEffect(() => {
    void load();
  }, [load]);

  return (
    <div className="mx-auto w-full max-w-7xl space-y-8">
      <PageHeader title="Leads" subtitle="Search, filter, and update status without leaving the table." />

      {err ? <p className="text-sm text-red-600 dark:text-red-400">{err}</p> : null}

      <div className="admin-surface flex flex-col gap-4 p-4 sm:flex-row sm:items-end">
        <div className="flex-1 space-y-4 sm:flex sm:gap-4 sm:space-y-0">
          <div className="flex-1">
            <FieldLabel>Search</FieldLabel>
            <TextInput
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Name, email, phone…"
              aria-label="Search leads"
            />
          </div>
          <div className="w-full sm:w-48">
            <FieldLabel>Status</FieldLabel>
            <SelectInput
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              aria-label="Filter by status"
            >
              {STATUS_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </SelectInput>
          </div>
        </div>
        <div className="flex shrink-0 flex-wrap gap-2">
          <button
            type="button"
            disabled={loading || items.length === 0}
            onClick={() => exportLeadsCsv(items)}
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
        <TableSkeleton columns={7} rows={8} />
      ) : items.length === 0 ? (
        <EmptyState
          title="No leads match"
          description="Try widening your search or reset the status filter."
          action={
            <button
              type="button"
              onClick={() => {
                setQ("");
                setStatusFilter("all");
              }}
              className="btn-secondary px-4 py-2 text-sm"
            >
              Clear filters
            </button>
          }
        />
      ) : (
        <div className="overflow-x-auto rounded-xl border border-slate-200/90 shadow-sm dark:border-white/[0.07]">
          <table className="min-w-[900px] w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200/80 bg-slate-50/95 text-xs uppercase tracking-wide text-slate-500 dark:border-white/[0.07] dark:bg-slate-900/70 dark:text-slate-500">
                <th className="whitespace-nowrap px-4 py-3 font-medium">Name</th>
                <th className="whitespace-nowrap px-4 py-3 font-medium">Phone</th>
                <th className="whitespace-nowrap px-4 py-3 font-medium">Experience</th>
                <th className="whitespace-nowrap px-4 py-3 font-medium">Salary</th>
                <th className="whitespace-nowrap px-4 py-3 font-medium">Status</th>
                <th className="min-w-[200px] px-4 py-3 font-medium">Notes</th>
                <th className="whitespace-nowrap px-4 py-3 font-medium">Created</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-white/[0.05]">
              {items.map((lead) => (
                <LeadRow key={lead.id} lead={lead} onPatch={() => void load()} />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function LeadRow({ lead, onPatch }: { lead: Lead; onPatch: () => void }) {
  const [notes, setNotes] = useState(lead.notes);
  const [status, setStatus] = useState(lead.status);
  const [statusBusy, setStatusBusy] = useState(false);
  const [notesBusy, setNotesBusy] = useState(false);
  const [statusErr, setStatusErr] = useState<string | null>(null);

  useEffect(() => {
    setNotes(lead.notes);
    setStatus(lead.status);
  }, [lead.id, lead.notes, lead.status]);

  async function saveStatus(next: string) {
    const prev = status;
    setStatus(next);
    setStatusBusy(true);
    setStatusErr(null);
    try {
      await updateLead(lead.id, { status: next });
      await onPatch();
    } catch (e: unknown) {
      setStatus(prev);
      setStatusErr(e instanceof Error ? e.message : "Update failed");
    } finally {
      setStatusBusy(false);
    }
  }

  async function saveNotes() {
    if (notes === lead.notes) return;
    setNotesBusy(true);
    try {
      await updateLead(lead.id, { notes });
      await onPatch();
    } finally {
      setNotesBusy(false);
    }
  }

  return (
    <tr className="text-slate-700 dark:text-slate-300">
      <td className="whitespace-nowrap px-4 py-3">
        <div className="font-medium text-slate-900 dark:text-slate-50">{lead.name}</div>
        <div className="text-xs text-slate-500 dark:text-slate-500">{lead.email}</div>
      </td>
      <td className="whitespace-nowrap px-4 py-3 text-xs text-slate-600 dark:text-slate-400">{lead.phone}</td>
      <td className="max-w-[200px] truncate px-4 py-3 text-xs text-slate-600 dark:text-slate-400" title={lead.experience}>
        {lead.experience}
      </td>
      <td className="whitespace-nowrap px-4 py-3 text-xs text-slate-600 dark:text-slate-400">{lead.salary}</td>
      <td className="whitespace-nowrap px-4 py-3">
        <div className="flex flex-col gap-1">
          <select
            value={status}
            disabled={statusBusy}
            onChange={(e) => void saveStatus(e.target.value)}
            className="w-[140px] rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-xs capitalize text-slate-900 outline-none focus:border-brand-sunset/40 disabled:opacity-50 dark:border-white/[0.1] dark:bg-slate-950 dark:text-slate-100"
            aria-label={`Status for ${lead.name}`}
          >
            <option value="new">new</option>
            <option value="contacted">contacted</option>
            <option value="converted">converted</option>
            <option value="rejected">rejected</option>
          </select>
          {statusErr ? <span className="text-[10px] text-red-400">{statusErr}</span> : null}
        </div>
      </td>
      <td className="px-4 py-3 align-top">
        <textarea
          value={notes}
          disabled={notesBusy}
          onChange={(e) => setNotes(e.target.value)}
          onBlur={() => void saveNotes()}
          rows={2}
          className="w-full min-w-[180px] max-w-xs rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-xs text-slate-900 outline-none focus:border-brand-sunset/40 disabled:opacity-50 dark:border-white/[0.1] dark:bg-slate-950 dark:text-slate-200"
          aria-label={`Notes for ${lead.name}`}
        />
      </td>
      <td className="whitespace-nowrap px-4 py-3 text-xs text-slate-500">{formatDateTime(lead.created_at)}</td>
    </tr>
  );
}
