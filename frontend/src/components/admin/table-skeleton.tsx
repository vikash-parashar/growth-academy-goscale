type TableSkeletonProps = {
  columns: number;
  rows?: number;
};

export function TableSkeleton({ columns, rows = 8 }: TableSkeletonProps) {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200/90 dark:border-white/[0.07]">
      <div className="divide-y divide-slate-100 bg-white/70 dark:divide-white/[0.06] dark:bg-slate-900/40">
        {Array.from({ length: rows }).map((_, ri) => (
          <div key={ri} className="flex gap-3 px-4 py-3">
            {Array.from({ length: columns }).map((_, ci) => (
              <div
                key={ci}
                className="h-4 flex-1 animate-pulse rounded bg-slate-200 dark:bg-slate-800"
                style={{ animationDelay: `${(ri + ci) * 40}ms` }}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
