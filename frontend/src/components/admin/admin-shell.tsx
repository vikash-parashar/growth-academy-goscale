"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { clearToken, getToken } from "@/lib/api";
import { isDummyToken } from "@/lib/dummy-auth";
import { ThemeToggle } from "@/components/theme-toggle";
import { AdminSidebar } from "./admin-sidebar";

export function AdminShell({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const isIdCardPrint = pathname?.includes("/id-card");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!getToken()) {
      router.replace("/admin");
      return;
    }
    setReady(true);
  }, [router]);

  if (!ready) {
    return (
      <div className="noise flex min-h-screen items-center justify-center bg-background bg-hero-radial text-sm text-slate-600 dark:bg-hero-radial-dark dark:text-slate-400">
        <div className="flex items-center gap-3">
          <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-brand-berry/40 border-t-brand-sunset" />
          Loading workspace…
        </div>
      </div>
    );
  }

  if (isIdCardPrint) {
    return (
      <div className="min-h-screen bg-slate-200 print:bg-white">
        <header className="no-print sticky top-0 z-10 flex h-14 shrink-0 items-center justify-between border-b border-[#456882]/50 bg-gradient-to-b from-[#1b3c53] via-[#234c6a] to-[#1b3c53] px-4 backdrop-blur-md sm:px-6">
          <Link
            href={pathname?.replace(/\/id-card\/?$/, "") ?? "/dashboard/employees"}
            className="text-sm font-medium text-slate-200 transition hover:text-white"
          >
            ← Back to employee
          </Link>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <button
              type="button"
              onClick={() => window.print()}
              className="btn-accent-sm"
            >
              Print / Save as PDF
            </button>
            <button
              type="button"
              onClick={() => {
                clearToken();
                router.push("/admin");
              }}
              className="btn-secondary px-3 py-2 text-xs sm:text-sm"
            >
              Log out
            </button>
          </div>
        </header>
        <main className="flex min-h-[calc(100vh-3.5rem)] items-start justify-center px-4 py-8 print:min-h-0 print:p-0">
          {children}
        </main>
      </div>
    );
  }

  return (
    <div className="noise flex min-h-screen bg-background bg-hero-radial dark:bg-hero-radial-dark">
      <AdminSidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-10 flex h-14 shrink-0 items-center justify-between gap-3 border-b border-[#456882]/55 bg-gradient-to-b from-[#1b3c53] via-[#234c6a] to-[#1b3c53] px-4 shadow-[0_1px_0_rgba(0,0,0,0.18)] backdrop-blur-md dark:border-[#456882]/50 dark:from-[#142a38] dark:via-[#1b3c53] dark:to-[#234c6a] dark:shadow-[0_1px_0_rgba(0,0,0,0.25)] sm:px-6">
          <div className="flex min-w-0 flex-1 items-center gap-2 sm:gap-3">
            <span className="section-eyebrow-pill">Admin portal</span>
            {isDummyToken(getToken()) ? (
              <span className="max-w-[10rem] truncate rounded-md border border-amber-500/40 bg-amber-500/10 px-2 py-1 text-[0.62rem] text-amber-950 sm:max-w-none dark:text-amber-200/95 sm:text-xs">
                Preview mode · empty data
              </span>
            ) : null}
            <span className="hidden min-w-0 truncate font-mono text-[0.65rem] text-[#d2c1b6]/65 md:inline">
              {process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080"}
            </span>
          </div>
          <div className="flex shrink-0 items-center gap-2 sm:gap-3">
            <ThemeToggle />
            <button
              type="button"
              onClick={() => {
                clearToken();
                router.push("/admin");
              }}
              className="btn-secondary px-3 py-2 text-xs sm:text-sm"
            >
              Log out
            </button>
          </div>
        </header>
        <main className="flex-1 overflow-auto px-4 py-8 text-foreground sm:px-6">{children}</main>
      </div>
    </div>
  );
}
