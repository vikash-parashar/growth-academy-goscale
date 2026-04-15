import type { InputHTMLAttributes, ReactNode, SelectHTMLAttributes, TextareaHTMLAttributes } from "react";

const inputClass =
  "w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-brand-sunset/45 focus:ring-1 focus:ring-brand-sunset/25 dark:border-white/[0.1] dark:bg-slate-950/80 dark:text-slate-100 dark:placeholder:text-slate-600 dark:focus:border-brand-sunset/40";

export function FieldLabel({ children }: { children: ReactNode }) {
  return (
    <span className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-slate-600 dark:text-slate-500">
      {children}
    </span>
  );
}

export function TextInput(props: InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={`${inputClass} ${props.className ?? ""}`} />;
}

export function SelectInput(props: SelectHTMLAttributes<HTMLSelectElement>) {
  return <select {...props} className={`${inputClass} ${props.className ?? ""}`} />;
}

export function TextArea(props: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea {...props} rows={4} className={`${inputClass} resize-y ${props.className ?? ""}`} />;
}
