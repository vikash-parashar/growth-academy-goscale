"use client";

import { useEffect } from "react";

export default function RootError({
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
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-6 py-16">
      <p className="font-mono text-xs uppercase tracking-[0.2em] text-red-600 dark:text-red-400">Error</p>
      <h1 className="mt-3 text-2xl font-semibold text-slate-900 dark:text-slate-50">Something went wrong</h1>
      <p className="mt-2 max-w-md text-center text-sm text-slate-600 dark:text-slate-400">
        {error.message || "An unexpected error occurred. Try again or return home."}
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <button
          type="button"
          onClick={() => reset()}
          className="rounded-full bg-brand-sunset px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-sunsetBright"
        >
          Try again
        </button>
        <a
          href="/"
          className="rounded-full border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-800 shadow-sm transition hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800"
        >
          Home
        </a>
      </div>
    </div>
  );
}
