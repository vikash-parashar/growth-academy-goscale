type MetricCardProps = {
  label: string;
  value: string;
  hint?: string;
  loading?: boolean;
};

export function MetricCard({ label, value, hint, loading }: MetricCardProps) {
  return (
    <div className="admin-surface px-5 py-4">
      <p className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-500">{label}</p>
      {loading ? (
        <div className="mt-3 h-8 w-24 animate-pulse rounded-md bg-slate-200 dark:bg-slate-800" />
      ) : (
        <p className="mt-2 text-2xl font-semibold tabular-nums tracking-tight text-slate-900 dark:text-slate-50">{value}</p>
      )}
      {hint && !loading ? <p className="mt-1 text-xs text-slate-600 dark:text-slate-500">{hint}</p> : null}
    </div>
  );
}
