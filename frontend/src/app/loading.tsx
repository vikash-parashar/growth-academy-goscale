export default function RootLoading() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background">
      <div
        className="h-10 w-10 animate-spin rounded-full border-2 border-brand-sunset/30 border-t-brand-sunset dark:border-brand-onDark/30 dark:border-t-brand-onDark"
        role="status"
        aria-label="Loading"
      />
      <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">Loading…</p>
    </div>
  );
}
