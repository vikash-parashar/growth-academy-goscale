"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { BrandTagline, BrandWordmark } from "@/components/brand-wordmark";
import { HeaderAccountDrawer } from "@/components/header-account-drawer";
import { LogoMark } from "@/components/logo-mark";
import { useLanguage } from "@/contexts/language-context";

export function SiteHeader() {
  const { t } = useLanguage();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  function close() {
    setMobileOpen(false);
  }

  /** High-contrast on navy header bar (WCAG-friendly vs muted beige). */
  const navItemClass =
    "shrink-0 text-[#f4eee6] transition-colors hover:text-white hover:underline hover:underline-offset-4";

  return (
    <header className="sticky top-0 z-50 border-b border-[#456882]/55 bg-gradient-to-b from-[#1b3c53] via-[#234c6a] to-[#1b3c53] shadow-[0_1px_0_rgba(0,0,0,0.18)] backdrop-blur-md dark:border-[#456882]/50 dark:from-[#142a38] dark:via-[#1b3c53] dark:to-[#234c6a] dark:shadow-[0_1px_0_rgba(0,0,0,0.35)]">
      <div className="page-shell py-3.5 sm:py-4">
        {/* Mobile: menu left · brand + theme right */}
        <div className="flex items-center md:hidden">
          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            aria-expanded={mobileOpen}
            aria-controls="mobile-nav-drawer"
            className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-[#456882]/65 bg-[#234c6a]/40 text-[#d2c1b6] shadow-sm ring-1 ring-[#456882]/25 transition hover:border-[#d2c1b6]/35 hover:bg-[#234c6a]/65 dark:border-[#456882]/55 dark:bg-[#234c6a]/35 dark:text-[#d2c1b6] dark:ring-[#456882]/20 dark:hover:bg-[#456882]/25"
          >
            <MenuIcon className="h-5 w-5" />
            <span className="sr-only">{t.header.openMenu}</span>
          </button>

          <div className="flex min-w-0 flex-1 items-center justify-end gap-2.5 pl-3">
            <Link
              href="/"
              className="flex min-w-0 items-center gap-2.5 rounded-xl bg-[#234c6a]/45 px-2 py-1.5 shadow-sm ring-1 ring-[#fec7b4]/25 shadow-[0_0_24px_-8px_rgba(0,173,216,0.35)] dark:bg-[#234c6a]/35 dark:ring-[#456882]/35"
              onClick={close}
            >
              <LogoMark className="h-9 w-auto max-w-[52px] shrink-0 rounded-lg ring-1 ring-white/15 sm:h-10 sm:max-w-[56px]" />
              <div className="min-w-0 flex-1 text-left leading-tight">
                <BrandWordmark size="md" className="block max-w-full" />
                <BrandTagline className="mt-0.5 max-w-[11rem] truncate sm:max-w-none">{t.header.brandSub}</BrandTagline>
              </div>
            </Link>
            <HeaderAccountDrawer />
          </div>
        </div>

        {/* Desktop: full bar */}
        <div className="hidden items-center justify-between gap-3 md:flex">
          <Link
            href="/"
            className="group flex min-w-0 items-center gap-3 rounded-xl py-0.5 pl-0.5 pr-2 transition hover:bg-white/5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#fec7b4]/80"
          >
            <LogoMark className="h-10 w-auto max-w-[56px] shrink-0 rounded-lg ring-1 ring-[#fec7b4]/30 transition group-hover:ring-[#00ADD8]/50 sm:h-11 sm:max-w-[60px]" />
            <div className="min-w-0 leading-tight">
              <BrandWordmark size="md" />
              <BrandTagline className="mt-0.5">{t.header.brandSub}</BrandTagline>
            </div>
          </Link>
          <div className="flex min-w-0 max-w-[min(100%,72rem)] flex-wrap items-center justify-end gap-x-4 gap-y-2 sm:gap-x-5 lg:max-w-none">
            <nav
              className="flex flex-wrap items-center justify-end gap-x-4 gap-y-2 text-[0.9375rem] font-medium sm:gap-x-5 lg:gap-x-6"
              aria-label="Primary"
            >
              <Link href="/story" className={navItemClass}>
                {t.header.story}
              </Link>
              <Link href="/program" className={navItemClass}>
                {t.header.program}
              </Link>
              <Link href="/content" className={navItemClass}>
                {t.header.content}
              </Link>
              <Link href="/learning" className={navItemClass}>
                {t.header.learning}
              </Link>
              <Link href="/podcast" className={navItemClass}>
                {t.header.podcast}
              </Link>
              <Link href="/proof" className={navItemClass}>
                {t.header.proof}
              </Link>
              <Link href="/pricing" className={navItemClass}>
                {t.header.pricing}
              </Link>
              <Link href="/mock-test" className={navItemClass}>
                {t.header.mockTest}
              </Link>
              <Link href="/career-comparison" className={navItemClass}>
                {t.header.careers}
              </Link>
              <Link href="/jobs" className={navItemClass}>
                {t.header.jobs}
              </Link>
              <Link href="/book" className={navItemClass}>
                {t.header.bookConsult}
              </Link>
              <Link href="/connect" className={navItemClass}>
                {t.header.connect}
              </Link>
              <Link
                href="/eligibility"
                className="shrink-0 rounded-full border border-[#fec7b4]/55 bg-[#234c6a]/70 px-4 py-2 text-[#f4eee6] shadow-sm transition hover:border-[#fec7b4] hover:bg-[#456882]/45 hover:text-white"
              >
                {t.header.apply}
              </Link>
            </nav>
            <HeaderAccountDrawer />
          </div>
        </div>
      </div>

      {/* Mobile drawer: portal to body so it sits above all content with solid layers */}
      {mounted && mobileOpen
        ? createPortal(
            <>
              <button
                type="button"
                className="fixed inset-0 z-[100] bg-slate-950/75 md:hidden"
                style={{ WebkitTapHighlightColor: "transparent" }}
                aria-label={t.header.closeOverlay}
                onClick={close}
              />
              <aside
                id="mobile-nav-drawer"
                role="dialog"
                aria-modal="true"
                aria-labelledby="mobile-nav-title"
                className="fixed inset-y-0 left-0 z-[110] flex w-[min(100vw-2.5rem,18.5rem)] flex-col border-r border-slate-200 bg-white shadow-[4px_0_24px_rgba(0,0,0,0.12)] md:hidden dark:border-slate-700 dark:bg-slate-950 dark:shadow-[4px_0_32px_rgba(0,0,0,0.5)]"
              >
                <div className="flex shrink-0 items-center justify-between border-b border-slate-200 bg-white px-4 py-3.5 dark:border-slate-800 dark:bg-slate-950">
                  <p id="mobile-nav-title" className="text-sm font-semibold text-slate-900 dark:text-slate-50">
                    {t.header.menu}
                  </p>
                  <button
                    type="button"
                    onClick={close}
                    className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-300 bg-slate-50 text-slate-800 transition hover:bg-slate-100 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700"
                    aria-label={t.header.closeMenu}
                  >
                    <CloseIcon className="h-5 w-5" />
                  </button>
                </div>
                <nav className="flex min-h-0 flex-1 flex-col gap-0.5 overflow-y-auto bg-slate-50 p-3 dark:bg-slate-950" aria-label="Primary">
                  <MobileNavLink href="/story" onNavigate={close}>
                    {t.header.story}
                  </MobileNavLink>
                  <MobileNavLink href="/program" onNavigate={close}>
                    {t.header.program}
                  </MobileNavLink>
                  <MobileNavLink href="/content" onNavigate={close}>
                    {t.header.content}
                  </MobileNavLink>
                  <MobileNavLink href="/learning" onNavigate={close}>
                    {t.header.learning}
                  </MobileNavLink>
                  <MobileNavLink href="/podcast" onNavigate={close}>
                    {t.header.podcast}
                  </MobileNavLink>
                  <MobileNavLink href="/proof" onNavigate={close}>
                    {t.header.proof}
                  </MobileNavLink>
                  <MobileNavLink href="/pricing" onNavigate={close}>
                    {t.header.pricing}
                  </MobileNavLink>
                  <MobileNavLink href="/mock-test" onNavigate={close}>
                    {t.header.mockTest}
                  </MobileNavLink>
                  <MobileNavLink href="/career-comparison" onNavigate={close}>
                    {t.header.careers}
                  </MobileNavLink>
                  <MobileNavLink href="/jobs" onNavigate={close}>
                    {t.header.jobs}
                  </MobileNavLink>
                  <MobileNavLink href="/book" onNavigate={close}>
                    {t.header.bookConsult}
                  </MobileNavLink>
                  <MobileNavLink href="/connect" onNavigate={close}>
                    {t.header.connect}
                  </MobileNavLink>
                  <Link
                    href="/eligibility"
                    onClick={close}
                    className="mt-3 rounded-xl bg-brand-sunset px-4 py-3 text-center text-sm font-semibold text-white shadow-md shadow-brand-md transition hover:bg-brand-hover dark:bg-brand-sunsetBright dark:hover:bg-brand-onDark"
                  >
                    {t.header.apply}
                  </Link>
                </nav>
              </aside>
            </>,
            document.body,
          )
        : null}
    </header>
  );
}

function MobileNavLink({
  href,
  children,
  onNavigate,
}: {
  href: string;
  children: React.ReactNode;
  onNavigate: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onNavigate}
      className="rounded-xl px-3 py-3 text-[0.9375rem] font-medium text-slate-800 transition hover:bg-white hover:shadow-sm dark:text-slate-100 dark:hover:bg-slate-800"
    >
      {children}
    </Link>
  );
}

function MenuIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
    </svg>
  );
}

function CloseIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" />
    </svg>
  );
}
