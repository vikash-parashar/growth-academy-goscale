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
    <aside className="flex h-screen w-56 shrink-0 flex-col border-r border-[#456882]/50 bg-gradient-to-b from-[#1b3c53] via-[#234c6a] to-[#1b3c53] backdrop-blur-md dark:border-[#456882]/45 dark:from-[#142a38] dark:via-[#1b3c53] dark:to-[#234c6a]">
      <div className="flex h-14 flex-col justify-center gap-0.5 border-b border-[#456882]/40 px-3">
        <Link href="/dashboard" className="flex min-w-0 items-center gap-2">
          <LogoMark className="h-8 w-auto max-w-[100px] shrink-0" />
          <span className="min-w-0">
            <BrandWordmark size="sm" />
            <BrandTagline className="mt-0.5 max-w-[8.5rem] leading-tight sm:max-w-none">{t.header.brandSub}</BrandTagline>
          </span>
        </Link>
        <p className="section-eyebrow-pill ml-[2.75rem] mt-0.5 w-fit tracking-[0.14em]">Admin portal</p>
      </div>
      <nav className="flex flex-1 flex-col gap-0.5 overflow-y-auto p-3" aria-label="Admin">
        {nav.map((item) => {
          const active = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`rounded-lg px-3 py-2 text-sm transition ${
                active
                  ? "bg-[#456882]/45 font-medium text-white shadow-sm dark:bg-white/10 dark:text-white"
                  : "text-[#d2c1b6]/88 hover:bg-[#234c6a]/55 hover:text-white dark:text-[#d2c1b6]/85 dark:hover:bg-white/[0.07] dark:hover:text-white"
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="border-t border-[#456882]/40 p-3">
        <p className="section-eyebrow-pill mb-2 ml-3 w-fit tracking-wider">Marketing site</p>
        <Link
          href="/"
          className="block rounded-lg px-3 py-2 text-xs font-medium text-[#d2c1b6]/88 transition hover:bg-[#234c6a]/55 hover:text-white"
        >
          ← Back to public site
        </Link>
      </div>
    </aside>
  );
}
