"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import { ThemeToggle } from "@/components/theme-toggle";
import { useLanguage } from "@/contexts/language-context";
import { useStudent } from "@/contexts/StudentContext";

function CloseIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" />
    </svg>
  );
}

/**
 * Profile-style control on the header: opens a right-edge sheet with theme + account options.
 */
export function HeaderAccountDrawer() {
  const { t } = useLanguage();
  const { resolvedTheme } = useTheme();
  const router = useRouter();
  const { isAuthenticated, student, logout } = useStudent();
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const themeHint =
    !mounted || resolvedTheme === undefined
      ? t.header.themeLightHint
      : resolvedTheme === "dark"
        ? t.header.themeDarkHint
        : t.header.themeLightHint;

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-expanded={open}
        aria-haspopup="dialog"
        className="group relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 border-[#fec7b4]/55 bg-[#234c6a]/90 shadow-md ring-0 transition hover:border-[#fec7b4] hover:bg-[#456882]/40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#fec7b4] md:h-11 md:w-11"
        aria-label={t.header.openAccountMenu}
      >
        <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full bg-[#fec7b4] ring-2 ring-[#1b3c53] md:h-3 md:w-3" aria-hidden />
        <Image
          src="/gopher-lab-mark.png"
          alt=""
          width={48}
          height={48}
          className="h-[70%] w-[70%] object-contain opacity-95 transition group-hover:opacity-100"
          sizes="44px"
        />
      </button>

      {mounted && open
        ? createPortal(
            <>
              <button
                type="button"
                className="fixed inset-0 z-[120] bg-slate-950/55 backdrop-blur-[2px]"
                style={{ WebkitTapHighlightColor: "transparent" }}
                aria-label={t.header.closeAccountMenu}
                onClick={() => setOpen(false)}
              />
              <aside
                role="dialog"
                aria-modal="true"
                aria-labelledby="header-account-panel-title"
                className="fixed inset-y-0 right-0 z-[130] flex w-[min(100vw-0.75rem,20.5rem)] flex-col border-l border-[#456882]/55 bg-gradient-to-b from-[#1b3c53] via-[#234c6a] to-[#1b3c53] shadow-[-12px_0_40px_rgba(0,0,0,0.35)] dark:border-[#456882]/40"
              >
                <div className="flex shrink-0 items-center gap-3 border-b border-[#456882]/45 px-4 py-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full border-2 border-[#fec7b4]/50 bg-[#234c6a]/80">
                    <Image src="/gopher-lab-mark.png" alt="" width={48} height={48} className="h-[72%] w-[72%] object-contain" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p id="header-account-panel-title" className="text-sm font-semibold text-[#f4eee6]">
                      {t.header.accountPanelTitle}
                    </p>
                    <p className="truncate text-xs text-[#d2c1b6]/90">Gopher Lab</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setOpen(false)}
                    className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#456882]/55 bg-[#234c6a]/50 text-[#f4eee6] transition hover:bg-[#456882]/35"
                    aria-label={t.header.closeAccountMenu}
                  >
                    <CloseIcon className="h-5 w-5" />
                  </button>
                </div>

                <div className="flex flex-1 flex-col gap-6 overflow-y-auto p-4">
                  <section aria-labelledby="appear-label">
                    <p id="appear-label" className="text-[0.65rem] font-bold uppercase tracking-[0.16em] text-[#fec7b4]/90">
                      {t.header.appearanceLabel}
                    </p>
                    <div className="mt-3 flex items-center justify-between gap-3 rounded-xl border border-[#456882]/40 bg-[#234c6a]/35 px-3 py-3">
                      <div>
                        <p className="text-sm font-medium text-[#f4eee6]">{themeHint} mode</p>
                        <p className="text-xs text-[#d2c1b6]/85">{t.header.themeToggleHelp}</p>
                      </div>
                      <ThemeToggle />
                    </div>
                  </section>

                  {isAuthenticated && student ? (
                    <>
                      <section>
                        <p className="text-[0.65rem] font-bold uppercase tracking-[0.16em] text-[#fec7b4]/90">
                          {t.header.accountPanelTitle}
                        </p>
                        <div className="mt-3 rounded-xl border border-[#456882]/40 bg-[#234c6a]/35 px-4 py-3">
                          <p className="text-sm font-medium text-[#f4eee6]">
                            {student.first_name} {student.last_name}
                          </p>
                          <p className="text-xs text-[#d2c1b6]/85 truncate">{student.email}</p>
                          <p className="text-xs text-[#d2c1b6]/75 mt-1">ID: {student.user_id}</p>
                        </div>
                      </section>

                      <section>
                        <p className="text-[0.65rem] font-bold uppercase tracking-[0.16em] text-[#fec7b4]/90">
                          {t.header.adminPortalNav}
                        </p>
                        <p className="mt-1 text-xs text-[#d2c1b6]/85">{t.header.adminPortalNavHint}</p>
                        <Link
                          href="/admin"
                          onClick={() => setOpen(false)}
                          className="btn-accent-sm mt-4 flex w-full items-center justify-center gap-2 text-center"
                        >
                          <ShieldIcon className="h-4 w-4" />
                          {t.header.adminPortalNav}
                        </Link>
                      </section>

                      <button
                        onClick={() => {
                          logout();
                          setOpen(false);
                          router.push('/');
                        }}
                        className="mt-auto rounded-lg bg-red-600/20 px-4 py-2 text-sm font-medium text-red-200 transition hover:bg-red-600/30"
                      >
                        Logout
                      </button>
                    </>
                  ) : (
                    <section>
                      <p className="text-[0.65rem] font-bold uppercase tracking-[0.16em] text-[#fec7b4]/90">
                        Get Started
                      </p>
                      <p className="mt-1 text-xs text-[#d2c1b6]/85">Join our bootcamp to access courses, mentorship, and career support</p>
                      <div className="mt-4 space-y-2">
                        <Link
                          href="/signup"
                          onClick={() => setOpen(false)}
                          className="btn-accent-sm flex w-full items-center justify-center"
                        >
                          Sign Up
                        </Link>
                        <Link
                          href="/login"
                          onClick={() => setOpen(false)}
                          className="flex w-full items-center justify-center rounded-lg bg-[#456882]/35 px-4 py-2 text-sm font-medium text-[#f4eee6] transition hover:bg-[#456882]/50 dark:bg-[#234c6a]/50 dark:hover:bg-[#456882]/40"
                        >
                          Login
                        </Link>
                      </div>
                    </section>
                  )}
                </div>
              </aside>
            </>,
            document.body,
          )
        : null}
    </>
  );
}

function ShieldIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
