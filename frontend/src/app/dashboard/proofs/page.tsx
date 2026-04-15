"use client";

import { useCallback, useEffect, useState } from "react";
import { EmptyState } from "@/components/admin/empty-state";
import { PageHeader } from "@/components/admin/page-header";
import { FieldLabel, TextInput } from "@/components/admin/form-controls";
import { TableSkeleton } from "@/components/admin/table-skeleton";
import { formatDateTime } from "@/lib/format";
import { uploadAssetUrl } from "@/lib/assets";
import { AdminProof, listProofsAdmin, unlockProof, uploadProof } from "@/lib/api";

export default function ProofsPage() {
  const [items, setItems] = useState<AdminProof[]>([]);
  const [tag, setTag] = useState("salary");
  const [file, setFile] = useState<File | null>(null);
  const [previewFile, setPreviewFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setErr(null);
    try {
      const res = await listProofsAdmin();
      setItems(res.items);
    } catch (e: unknown) {
      setErr(e instanceof Error ? e.message : "Failed to load proofs");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  return (
    <div className="mx-auto max-w-6xl space-y-10">
      <PageHeader
        title="Proofs"
        subtitle="Upload offer letters and salary slips — optional preview for locked gallery state."
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

      <div className="grid gap-8 lg:grid-cols-2">
        <div className="admin-surface p-6">
          <h2 className="text-sm font-medium text-slate-800 dark:text-slate-200">Upload proof</h2>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-500">Tag helps organize the public proofs grid.</p>
          <div className="mt-5 space-y-4">
            <div>
              <FieldLabel>Tag</FieldLabel>
              <TextInput value={tag} onChange={(e) => setTag(e.target.value)} placeholder="salary, offer_letter…" />
            </div>
            <div>
              <FieldLabel>Main file</FieldLabel>
              <input
                type="file"
                onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                className="block w-full text-sm text-slate-600 file:mr-3 file:rounded-lg file:border-0 file:bg-slate-100 file:px-3 file:py-2 file:text-sm file:text-slate-800 hover:file:bg-slate-200 dark:text-slate-400 dark:file:bg-white/10 dark:file:text-slate-200 dark:hover:file:bg-white/15"
              />
            </div>
            <div>
              <FieldLabel>Preview (optional)</FieldLabel>
              <input
                type="file"
                onChange={(e) => setPreviewFile(e.target.files?.[0] ?? null)}
                className="block w-full text-sm text-slate-600 file:mr-3 file:rounded-lg file:border-0 file:bg-slate-100 file:px-3 file:py-2 file:text-sm file:text-slate-800 hover:file:bg-slate-200 dark:text-slate-400 dark:file:bg-white/10 dark:file:text-slate-200 dark:hover:file:bg-white/15"
              />
            </div>
            <button
              type="button"
              disabled={uploading || !file}
              onClick={async () => {
                if (!file) return;
                setUploading(true);
                setErr(null);
                try {
                  await uploadProof(tag, file, previewFile ?? undefined);
                  setFile(null);
                  setPreviewFile(null);
                  void load();
                } catch (e: unknown) {
                  setErr(e instanceof Error ? e.message : "Upload failed");
                } finally {
                  setUploading(false);
                }
              }}
              className="w-full rounded-lg bg-brand-sunset py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-brand-hover disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto sm:px-6"
            >
              {uploading ? "Uploading…" : "Upload"}
            </button>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-sm font-medium text-slate-800 dark:text-slate-200">Library</h2>
          {loading ? (
            <TableSkeleton columns={1} rows={4} />
          ) : items.length === 0 ? (
            <EmptyState title="No proofs" description="Upload a file to seed the proof gallery." />
          ) : (
            <ul className="space-y-3">
              {items.map((p) => (
                <li
                  key={p.id}
                  className="admin-surface p-4"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="section-eyebrow-pill mb-1 w-fit py-1 tracking-wide">{p.type}</p>
                      <p className="mt-0.5 font-mono text-xs text-slate-500">#{p.id} · {formatDateTime(p.created_at)}</p>
                    </div>
                    <label className="flex cursor-pointer items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
                      <input
                        type="checkbox"
                        checked={p.unlocked}
                        onChange={async (e) => {
                          await unlockProof(p.id, e.target.checked);
                          void load();
                        }}
                        className="rounded border-slate-600 bg-slate-900 text-brand-sunsetBright focus:ring-brand-sunset/30"
                      />
                      Public full file
                    </label>
                  </div>
                  {p.preview_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={uploadAssetUrl(p.preview_url)}
                      alt=""
                      className="mt-3 max-h-44 w-full rounded-lg object-cover object-center"
                    />
                  ) : null}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
