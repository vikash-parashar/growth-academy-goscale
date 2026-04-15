"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { BrandTagline, BrandWordmark } from "@/components/brand-wordmark";
import { LogoMark } from "@/components/logo-mark";
import { useLanguage } from "@/contexts/language-context";
import { FOUNDER_FACEBOOK_URL, FOUNDER_INSTAGRAM_URL, FOUNDER_LINKEDIN_URL } from "@/lib/site-links";

type SiteFooterProps = {
  /** Story / long-form pages: show “Back to home” next to copyright */
  showBackToHome?: boolean;
};

/** High-contrast links on the dark footer (avoid inheriting body foreground in light mode). */
function FooterNavLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link
      href={href}
      className="rounded-sm text-[#fffef7] underline-offset-4 transition hover:text-[#fff59d] hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#fff59d]/80"
    >
      {children}
    </Link>
  );
}

export function SiteFooter({ showBackToHome = false }: SiteFooterProps) {
  const { t } = useLanguage();
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-[#456882]/50 bg-gradient-to-b from-[#1b3c53] via-[#234c6a] to-[#1b3c53] backdrop-blur-sm dark:border-[#456882]/45 dark:from-[#142a38] dark:via-[#1b3c53] dark:to-[#234c6a]">
      <div className="page-shell py-12 sm:py-14">
        <div className="grid gap-10 sm:grid-cols-[1fr_auto] sm:items-start sm:gap-12">
          <div className="max-w-xl">
            <div className="flex items-start gap-3">
              <LogoMark className="h-10 w-auto max-w-[200px] shrink-0 sm:h-11 sm:max-w-[220px]" />
              <div className="min-w-0 pt-0.5 leading-tight">
                <BrandWordmark size="lg" />
                <BrandTagline className="mt-1">{t.header.brandSub}</BrandTagline>
              </div>
            </div>
            <p className="mt-2 text-sm leading-relaxed text-[#d2c1b6]/90">{t.footer.tagline}</p>
            <p className="mt-4 text-xs leading-relaxed text-[#d2c1b6]/85">
              <span className="font-semibold text-white">Vikash Parashar</span>
              <span className="text-[#456882]"> — </span>
              {t.footer.vikashLine}
            </p>
            <nav
              className="mt-4 flex flex-wrap items-center gap-2"
              aria-label={t.footer.socialNavLabel}
            >
              <a
                href={FOUNDER_LINKEDIN_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-social-linkedin btn-social-pill-sm"
              >
                {t.footer.linkedin}
              </a>
              <a
                href={FOUNDER_INSTAGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-social-instagram btn-social-pill-sm"
              >
                {t.footer.instagram}
              </a>
              {FOUNDER_FACEBOOK_URL ? (
                <a
                  href={FOUNDER_FACEBOOK_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-social-facebook btn-social-pill-sm"
                >
                  {t.footer.facebook}
                </a>
              ) : null}
            </nav>
          </div>
          <nav
            className="flex flex-col gap-2.5 text-sm sm:items-end sm:text-right"
            aria-label="Footer"
          >
            <FooterNavLink href="/story">{t.footer.founderStory}</FooterNavLink>
            <FooterNavLink href="/founder">{t.footer.founderSnapshot}</FooterNavLink>
            <FooterNavLink href="/program">{t.footer.program}</FooterNavLink>
            <FooterNavLink href="/content">{t.footer.content}</FooterNavLink>
            <FooterNavLink href="/learning">{t.footer.learning}</FooterNavLink>
            <FooterNavLink href="/connect">{t.footer.connect}</FooterNavLink>
            <FooterNavLink href="/podcast">{t.footer.podcast}</FooterNavLink>
            <FooterNavLink href="/proof">{t.footer.proof}</FooterNavLink>
            <FooterNavLink href="/pricing">{t.footer.investment}</FooterNavLink>
            <FooterNavLink href="/eligibility">{t.footer.apply}</FooterNavLink>
            <FooterNavLink href="/mock-test">{t.footer.mockTest}</FooterNavLink>
            <FooterNavLink href="/career-comparison">{t.footer.careersCompare}</FooterNavLink>
            <FooterNavLink href="/jobs">{t.footer.jobsBoard}</FooterNavLink>
            <FooterNavLink href="/book">{t.footer.bookConsult}</FooterNavLink>
            <FooterNavLink href="/terms">{t.footer.terms}</FooterNavLink>
            <FooterNavLink href="/changelog">{t.footer.whatsNew}</FooterNavLink>
          </nav>
        </div>
        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-[#456882]/45 pt-8 text-center text-xs text-[#d2c1b6]/75 sm:flex-row sm:text-left">
          <p>
            © {year} Gopher Lab. {t.footer.copyright}
            {showBackToHome ? (
              <>
                {" "}
                <Link
                  href="/"
                  className="text-[#fffef7] underline-offset-4 transition hover:text-[#fff59d] hover:underline"
                >
                  {t.footer.backToHome}
                </Link>
              </>
            ) : null}
            <span className="mx-2 text-[#456882]" aria-hidden>
              ·
            </span>
            <Link
              href="/admin"
              className="text-[#fffef7] underline-offset-4 transition hover:text-[#fff59d] hover:underline"
            >
              {t.footer.adminPortal}
            </Link>
          </p>
          <p className="text-[0.7rem] uppercase tracking-widest text-[#c5d4e0]">{t.footer.builtWith}</p>
        </div>
      </div>
    </footer>
  );
}
