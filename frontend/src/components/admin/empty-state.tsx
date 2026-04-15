import type { ReactNode } from "react";

type EmptyStateProps = {
  title: string;
  description?: string;
  action?: ReactNode;
};

export function EmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-300/90 bg-slate-50/80 px-8 py-16 text-center dark:border-white/10 dark:bg-slate-900/30">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-200 text-slate-500 dark:bg-slate-800 dark:text-slate-500">
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M20 13V7a2 2 0 00-2-2H6a2 2 0 00-2 2v6m16 0v4a2 2 0 01-2 2H6a2 2 0 01-2-2v-4m16 0h-2M4 13h2m13-4V9a2 2 0 00-2-2h-2m-4 0H9a2 2 0 00-2 2v2M7 13v4a2 2 0 002 2h6a2 2 0 002-2v-4"
          />
        </svg>
      </div>
      <h3 className="mt-4 text-sm font-medium text-slate-800 dark:text-slate-200">{title}</h3>
      {description ? <p className="mt-1 max-w-sm text-sm text-slate-600 dark:text-slate-500">{description}</p> : null}
      {action ? <div className="mt-6">{action}</div> : null}
    </div>
  );
}
