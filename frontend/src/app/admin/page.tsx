"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { GlassCard } from "@/components/glass-card";
import { SiteHeader } from "@/components/site-header";
import { useLanguage } from "@/contexts/language-context";
import { clearToken, login, setToken } from "@/lib/api";
import {
  DUMMY_ADMIN_PASSWORD,
  DUMMY_ADMIN_TOKEN,
  DUMMY_ADMIN_USERNAME,
} from "@/lib/dummy-auth";

export default function AdminLoginPage() {
  const { t } = useLanguage();
  const router = useRouter();
  const [username, setUsername] = useState("gowithvikash@gmail.com");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    clearToken();
    setLoading(true);
    try {
      const { token } = await login(username, password);
      setToken(token);
      router.push("/dashboard");
    } catch (e: unknown) {
      if (username === DUMMY_ADMIN_USERNAME && password === DUMMY_ADMIN_PASSWORD) {
        setToken(DUMMY_ADMIN_TOKEN);
        router.push("/dashboard");
        return;
      }
      setErr(e instanceof Error ? e.message : t.admin.loginFailed);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="noise min-h-screen bg-background bg-hero-radial dark:bg-hero-radial-dark">
      <SiteHeader />
      <div className="border-b border-[#456882]/50 bg-gradient-to-b from-[#1b3c53] via-[#234c6a] to-[#1b3c53]">
        <div className="page-shell py-3">
          <p className="section-eyebrow mx-auto block w-fit text-center tracking-[0.2em]">
            Admin portal
          </p>
          <p className="mt-1 text-center text-xs text-[#d2c1b6]/85">
            Team sign-in — not the public marketing site.
          </p>
        </div>
      </div>
      <main className="page-shell py-14 sm:py-20">
        <GlassCard className="mx-auto max-w-md">
          <h1 className="text-xl font-semibold text-slate-900 dark:text-slate-50">{t.admin.title}</h1>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-500">{t.admin.subtitle}</p>
          <p className="mt-3 rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-xs leading-relaxed text-amber-950 dark:text-amber-100/90">
            <span className="font-medium">{t.admin.previewTitle}</span> {t.admin.previewBody}{" "}
            <code className="rounded bg-black/10 px-1 dark:bg-white/10">{DUMMY_ADMIN_USERNAME}</code> /{" "}
            <code className="rounded bg-black/10 px-1 dark:bg-white/10">{DUMMY_ADMIN_PASSWORD}</code>
            <span className="block pt-1 text-amber-900/85 dark:text-amber-200/75">{t.admin.previewFoot}</span>
          </p>
          {process.env.NODE_ENV === "development" ? (
            <p className="mt-2 rounded-lg border border-brand-sunset/25 bg-brand-sunset/10 px-3 py-2 text-xs leading-relaxed text-brand-berry dark:text-brand-onDarkStrong/90">
              <span className="font-medium">{t.admin.devTitle}</span> email{" "}
              <code className="rounded bg-black/10 px-1 dark:bg-white/10">gowithvikash@gmail.com</code> · password{" "}
              <code className="rounded bg-black/10 px-1 dark:bg-white/10">Vikash@9966</code>
              <span className="block pt-1 text-brand-berry/80 dark:text-brand-onDarkStrong/70">
                Optional env fallback: <code className="rounded bg-black/10 px-1 dark:bg-white/10">admin</code> /{" "}
                <code className="rounded bg-black/10 px-1 dark:bg-white/10">admin123</code> if set in <code className="rounded bg-black/10 px-1 dark:bg-white/10">.env</code>.
              </span>
            </p>
          ) : null}
          <form onSubmit={onSubmit} className="mt-8 space-y-4">
            <div>
              <label className="text-xs uppercase text-slate-600 dark:text-slate-500">{t.admin.username}</label>
              <input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 dark:border-white/10 dark:bg-slate-900/60 dark:text-slate-100"
              />
            </div>
            <div>
              <label className="text-xs uppercase text-slate-600 dark:text-slate-500">{t.admin.password}</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 dark:border-white/10 dark:bg-slate-900/60 dark:text-slate-100"
              />
            </div>
            {err ? <p className="text-sm text-red-400">{err}</p> : null}
            <button type="submit" disabled={loading} className="btn-accent w-full disabled:opacity-50">
              {loading ? t.admin.signingIn : t.admin.signIn}
            </button>
          </form>
          <Link href="/" className="mt-6 inline-block text-sm text-slate-600 hover:text-slate-900 dark:text-slate-500 dark:hover:text-slate-300">
            ← {t.admin.backSite}
          </Link>
        </GlassCard>
      </main>
    </div>
  );
}
