"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { GlassCard } from "@/components/glass-card";
import { SiteHeader } from "@/components/site-header";
import { useLanguage } from "@/contexts/language-context";
import { APPLY_SITUATION_VALUES } from "@/lib/apply-situations";
import { getSituationPrefill, isApplyEligible } from "@/lib/eligibility-storage";
import { situationLabel } from "@/lib/i18n/situations";
import { buildWhatsAppLink } from "@/lib/whatsapp";
import { createLead } from "@/services/api";

const initial = {
  name: "",
  phone: "",
  email: "",
  situation: "",
  background: "",
  salary: "",
  goal: "",
  terms: false,
};

export default function ApplyPage() {
  const { t } = useLanguage();
  const router = useRouter();
  const [form, setForm] = useState(initial);
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [created, setCreated] = useState<{ id: number; wa?: string } | null>(null);
  const [gateReady, setGateReady] = useState(false);

  const waFromEnv = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "";

  useEffect(() => {
    if (!isApplyEligible()) {
      router.replace("/eligibility?from=apply");
      return;
    }
    const pre = getSituationPrefill();
    if (pre) {
      setForm((f) => ({ ...f, situation: pre }));
    }
    setGateReady(true);
  }, [router]);

  const experiencePayload = useMemo(() => {
    const sit = form.situation ? situationLabel(form.situation, t) : "";
    const bg = form.background.trim();
    const prefix = t.applyPayload.situationPrefix;
    return [`${prefix} ${sit}`.trim(), bg].filter(Boolean).join("\n\n");
  }, [form.situation, form.background, t]);

  const clientWa = useMemo(() => {
    if (!form.name || !form.phone) return "";
    const snippet = experiencePayload.slice(0, 120) || "—";
    return buildWhatsAppLink(form.phone, form.name, snippet);
  }, [form.name, form.phone, experiencePayload]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    setLoading(true);
    try {
      if (!form.terms) {
        setErr(t.apply.errTerms);
        setLoading(false);
        return;
      }
      if (!form.situation) {
        setErr(t.apply.errSituation);
        setLoading(false);
        return;
      }
      const lead = await createLead({
        name: form.name,
        phone: form.phone,
        email: form.email,
        experience: experiencePayload,
        salary: form.salary.trim(),
        goal: form.goal,
        terms_accepted: form.terms,
      });
      setCreated({ id: lead.id, wa: lead.whatsapp_link });
    } catch (e: unknown) {
      setErr(e instanceof Error ? e.message : t.apply.errSubmit);
    } finally {
      setLoading(false);
    }
  }

  const wa =
    created?.wa ||
    (waFromEnv ? buildWhatsAppLink(waFromEnv, form.name || t.apply.studentPlaceholder, experiencePayload.slice(0, 80) || "—") : clientWa);

  const salaryHelper =
    form.situation === "employed" || form.situation === "freelance"
      ? t.apply.salaryHelperEmployed
      : t.apply.salaryHelperOther;

  if (!gateReady) {
    return (
      <div className="noise min-h-screen bg-background bg-hero-radial dark:bg-hero-radial-dark">
        <SiteHeader />
        <main className="mx-auto max-w-3xl px-4 py-24 sm:px-6">
          <p className="text-sm text-slate-500 dark:text-slate-400">{t.apply.checking}</p>
        </main>
      </div>
    );
  }

  return (
    <div className="noise min-h-screen bg-background bg-hero-radial dark:bg-hero-radial-dark">
      <SiteHeader />
      <main className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
        <p className="section-eyebrow tracking-wider">{t.apply.badge}</p>
        <h1 className="mt-2 text-3xl font-semibold text-slate-900 dark:text-slate-50">{t.apply.title}</h1>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">{t.apply.subtitle}</p>

        {created ? (
          <GlassCard className="mt-10">
            <p className="text-sm text-slate-700 dark:text-slate-300">
              {t.apply.saved}{" "}
              <span className="font-mono text-brand-sunset dark:text-brand-onDark">#{created.id}</span>
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row" id="whatsapp">
              {wa ? (
                <a href={wa} target="_blank" rel="noreferrer" className="btn-social-whatsapp flex-1 text-center sm:flex-initial sm:min-w-[12rem]">
                  {t.apply.whatsappCta}
                </a>
              ) : (
                <p className="text-sm text-amber-800 dark:text-amber-200/90">{t.apply.waConfigHint}</p>
              )}
              <Link
                href="/book"
                className="inline-flex flex-1 items-center justify-center rounded-full border border-slate-300 px-6 py-3 text-sm text-slate-800 hover:bg-slate-50 dark:border-white/15 dark:text-slate-100 dark:hover:bg-white/5"
              >
                {t.apply.bookCall}
              </Link>
              <Link
                href={`/pay?lead_id=${created.id}`}
                className="inline-flex flex-1 items-center justify-center rounded-full border border-brand-sunset/40 px-6 py-3 text-sm font-medium text-brand-berry hover:bg-brand-sunset/10 dark:border-brand-sunset/35 dark:text-brand-onDarkStrong dark:hover:bg-brand-sunsetBright/10"
              >
                {t.apply.payFee}
              </Link>
            </div>
          </GlassCard>
        ) : (
          <GlassCard className="mt-10">
            <form onSubmit={onSubmit} className="space-y-5">
              <Field
                label={t.apply.fieldFullName}
                value={form.name}
                onChange={(v) => setForm((f) => ({ ...f, name: v }))}
                required
              />
              <Field
                label={t.apply.fieldPhone}
                value={form.phone}
                onChange={(v) => setForm((f) => ({ ...f, phone: v }))}
                required
                inputMode="tel"
              />
              <Field
                label={t.apply.fieldEmail}
                type="email"
                value={form.email}
                onChange={(v) => setForm((f) => ({ ...f, email: v }))}
                required
              />

              <div>
                <label className="block text-xs font-medium uppercase tracking-wider text-slate-600 dark:text-slate-500">
                  {t.apply.situationLabel}
                </label>
                <select
                  required
                  value={form.situation}
                  onChange={(e) => setForm((f) => ({ ...f, situation: e.target.value }))}
                  className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none ring-brand-sunset/25 focus:ring-2 dark:border-white/10 dark:bg-slate-900/60 dark:text-slate-100"
                >
                  <option value="">{t.apply.selectPlaceholder}</option>
                  {APPLY_SITUATION_VALUES.map((value) => (
                    <option key={value} value={value}>
                      {situationLabel(value, t)}
                    </option>
                  ))}
                </select>
              </div>

              <Field label={t.apply.backgroundLabel} value={form.background} onChange={(v) => setForm((f) => ({ ...f, background: v }))} required multiline />
              <div>
                <Field
                  label={
                    form.situation === "employed" || form.situation === "freelance"
                      ? t.apply.incomeLabelEmployed
                      : t.apply.incomeLabelOther
                  }
                  value={form.salary}
                  onChange={(v) => setForm((f) => ({ ...f, salary: v }))}
                  required
                />
                <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-500">{salaryHelper}</p>
              </div>
              <Field label={t.apply.goalLabel} value={form.goal} onChange={(v) => setForm((f) => ({ ...f, goal: v }))} required multiline />
              <label className="flex cursor-pointer items-start gap-3 text-sm text-slate-700 dark:text-slate-300">
                <input
                  type="checkbox"
                  className="mt-1 h-4 w-4 rounded border-slate-300 bg-white dark:border-white/20 dark:bg-slate-900"
                  checked={form.terms}
                  onChange={(e) => setForm((f) => ({ ...f, terms: e.target.checked }))}
                />
                <span>
                  {t.apply.termsLabelPrefix}{" "}
                  <Link href="/terms" className="text-brand-sunset hover:underline dark:text-brand-onDark">
                    {t.apply.termsRead}
                  </Link>
                </span>
              </label>
              {err ? <p className="text-sm text-red-400">{err}</p> : null}
              <button type="submit" disabled={loading} className="btn-accent w-full disabled:opacity-60">
                {loading ? t.apply.submitting : t.apply.submit}
              </button>
            </form>
          </GlassCard>
        )}
      </main>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  required,
  type = "text",
  multiline,
  inputMode,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
  type?: string;
  multiline?: boolean;
  inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"];
}) {
  return (
    <div>
      <label className="block text-xs font-medium uppercase tracking-wider text-slate-600 dark:text-slate-500">{label}</label>
      {multiline ? (
        <textarea
          required={required}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={5}
          className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none ring-brand-sunset/25 focus:ring-2 dark:border-white/10 dark:bg-slate-900/60 dark:text-slate-100"
        />
      ) : (
        <input
          required={required}
          type={type}
          inputMode={inputMode}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none ring-brand-sunset/25 focus:ring-2 dark:border-white/10 dark:bg-slate-900/60 dark:text-slate-100"
        />
      )}
    </div>
  );
}
