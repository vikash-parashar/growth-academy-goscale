"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BrandTagline, BrandWordmark } from "@/components/brand-wordmark";
import { LogoMark } from "@/components/logo-mark";
import { useLanguage } from "@/contexts/language-context";

const nav = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/dashboard/leads", label: "Leads" },
  { href: "/dashboard/appointments", label: "Appointments" },
  { href: "/dashboard/payments", label: "Payments" },
  { href: "/dashboard/proofs", label: "Proofs" },
  { href: "/dashboard/employees", label: "Employees" },
  { href: "/dashboard/notifications", label: "Notifications" },
  { href: "/changelog", label: "What&apos;s new" },
] as const;

export function AdminSidebar() {
  const pathname = usePathname();
  const { t } = useLanguage();

  return (
    <aside className="flex h-screen w-56 shrink-0 flex-col border-r border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900">
      <div className="flex h-14 flex-col justify-center gap-0.5 border-b border-slate-200 px-3 dark:border-slate-700">
        <Link href="/dashboard" className="flex min-w-0 items-center gap-2">
          <LogoMark className="h-8 w-auto max-w-[100px] shrink-0" />
          <span className="min-w-0">
            <BrandWordmark size="sm" />
            <BrandTagline className="mt-0.5 max-w-[8.5rem] leading-tight text-slate-600 dark:text-slate-400 sm:max-w-none">{t.header.brandSub}</BrandTagline>
          </span>
        </Link>
        <p className="section-eyebrow-pill ml-[2.75rem] mt-0.5 w-fit text-xs text-slate-600 tracking-[0.14em] dark:text-slate-500">Admin portal</p>
      </div>
      <nav className="flex flex-1 flex-col gap-0.5 overflow-y-auto p-3" aria-label="Admin">
        {nav.map((item) => {
          const active = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`rounded-lg px-3 py-2 text-sm font-medium transition ${
                active
                  ? "bg-blue-600 text-white shadow-sm dark:bg-blue-700 dark:text-white"
                  : "text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="border-t border-slate-200 p-3 dark:border-slate-700">
        <p className="section-eyebrow-pill mb-2 ml-3 w-fit text-xs text-slate-600 tracking-wider dark:text-slate-500">Marketing site</p>
        <Link
          href="/"
          className="block rounded-lg px-3 py-2 text-xs font-medium text-slate-700 transition hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
        >
          ← Back to public site
        </Link>
      </div>
    </aside>
  );
}
