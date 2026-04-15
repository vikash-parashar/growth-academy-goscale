"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="mx-auto max-w-lg rounded-xl border border-red-500/25 bg-red-950/20 p-8 text-center">
      <p className="font-mono text-xs uppercase tracking-widest text-red-400">Dashboard</p>
      <h2 className="mt-2 text-lg font-semibold text-slate-100">Could not load this section</h2>
      <p className="mt-2 text-sm text-slate-400">{error.message || "Please retry or go back."}</p>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <button
          type="button"
          onClick={() => reset()}
          className="rounded-lg bg-brand-sunset px-4 py-2 text-sm font-medium text-white hover:bg-brand-hover"
        >
          Retry
        </button>
        <Link href="/dashboard" className="rounded-lg border border-white/10 px-4 py-2 text-sm text-slate-300 hover:bg-white/5">
          Dashboard home
        </Link>
      </div>
    </div>
  );
}
