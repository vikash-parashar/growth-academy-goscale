import Link from "next/link";

export function ProofHero() {
  return (
    <section className="relative mx-auto max-w-6xl px-4 pb-20 pt-14 sm:px-6 sm:pb-28 sm:pt-20">
      <div className="pointer-events-none absolute left-1/2 top-0 h-[480px] w-[min(100%,720px)] -translate-x-1/2 bg-hero-radial opacity-90 dark:bg-hero-radial-dark dark:opacity-100" aria-hidden />
      <div className="relative text-center">
        <p className="section-eyebrow tracking-[0.3em]">Gopher Lab · Proof & transparency</p>
        <h1 className="mx-auto mt-6 max-w-3xl text-4xl font-semibold leading-[1.08] tracking-tight sm:text-5xl lg:text-6xl">
          <span className="text-gradient">Proof Over Words</span>
        </h1>
        <p className="mx-auto mt-6 max-w-xl text-lg text-slate-600 dark:text-slate-400">I believe in transparency</p>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <a
            href="#categories"
            className="rounded-full border border-slate-300 bg-white px-6 py-2.5 text-sm font-medium text-slate-800 shadow-sm transition hover:border-brand-sunset/50 hover:bg-brand-sunset/10 dark:border-white/15 dark:bg-white/5 dark:text-slate-100 dark:hover:border-brand-sunset/40 dark:hover:bg-white/10"
          >
            Explore proof categories
          </a>
          <Link href="/eligibility" className="btn-accent px-6 py-2.5 text-sm">
            Request proof on call
          </Link>
        </div>
      </div>
    </section>
  );
}
