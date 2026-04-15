import Link from "next/link";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export default function NotFound() {
  return (
    <div className="noise min-h-screen bg-background bg-hero-radial dark:bg-hero-radial-dark">
      <SiteHeader />
      <main className="page-shell flex min-h-[60vh] flex-col items-center justify-center py-20 text-center">
        <p className="section-eyebrow tracking-[0.25em]">404</p>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight text-slate-900 dark:text-slate-50 sm:text-4xl">
          Page not found
        </h1>
        <p className="mt-3 max-w-md text-slate-600 dark:text-slate-400">
          That URL does not exist or was moved. Head back home or open the apply flow.
        </p>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <Link href="/" className="btn-accent text-sm">
            Back to home
          </Link>
          <Link href="/eligibility" className="btn-secondary text-sm">
            Apply
          </Link>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
