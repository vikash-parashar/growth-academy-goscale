"use client";

import { useCallback, useEffect, useId, useState } from "react";
import { IconLock } from "./icons";

type PreviewItem = {
  id: string;
  label: string;
  hint: string;
};

const PREVIEW_ITEMS: PreviewItem[] = [
  { id: "offer", label: "Offer documentation", hint: "Redacted headline + structure only on call" },
  { id: "comp", label: "Compensation trail", hint: "Slips & credits discussed in session" },
  { id: "project", label: "Production systems", hint: "EHR & payments — architecture, not dumps" },
  { id: "interview", label: "Interview artifacts", hint: "Clips & debriefs shared live, not exported" },
];

function BlurredPlaceholder({ dense = false }: { dense?: boolean }) {
  return (
    <div
      className={`relative overflow-hidden rounded-xl border border-slate-200 bg-slate-100 dark:border-white/10 dark:bg-slate-950 ${dense ? "aspect-[4/3]" : "min-h-[200px] sm:min-h-[220px]"}`}
    >
      <div
        className="absolute inset-0 scale-110 bg-[linear-gradient(125deg,rgba(5,150,105,0.22)_0%,rgba(24,24,27,0.85)_45%,rgba(20,184,166,0.2)_100%)] blur-2xl dark:bg-[linear-gradient(125deg,rgba(16,185,129,0.35)_0%,rgba(24,24,27,0.9)_45%,rgba(34,211,238,0.25)_100%)]"
        aria-hidden
      />
      <div className="absolute inset-0 bg-[repeating-linear-gradient(90deg,transparent,transparent_12px,rgba(255,255,255,0.03)_12px,rgba(255,255,255,0.03)_13px)] opacity-80" aria-hidden />
      <div className="absolute inset-0 flex items-center justify-center bg-white/50 backdrop-blur-md dark:bg-slate-950/55">
        <div className="flex flex-col items-center gap-2 px-4 text-center">
          <IconLock className="h-8 w-8 text-slate-500" />
          <p className="text-xs font-medium uppercase tracking-widest text-slate-600 dark:text-slate-500">Preview locked</p>
        </div>
      </div>
    </div>
  );
}

export function ProofPreviewSection() {
  const [openId, setOpenId] = useState<string | null>(null);
  const titleId = useId();
  const openItem = openId ? PREVIEW_ITEMS.find((i) => i.id === openId) : null;

  const close = useCallback(() => setOpenId(null), []);

  useEffect(() => {
    if (!openId) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [openId, close]);

  return (
    <>
      <section className="mx-auto max-w-6xl scroll-mt-28 px-4 py-16 sm:px-6 sm:py-24">
        <div className="mb-10 max-w-2xl">
          <p className="section-eyebrow">Preview</p>
          <h2 className="text-3xl font-semibold tracking-tight text-slate-900 dark:text-slate-50 sm:text-4xl">
            What proof looks like — without exposing anyone
          </h2>
        </div>
        <p className="-mt-4 mb-10 max-w-2xl text-sm text-slate-600 dark:text-slate-400">
          Placeholders below are intentionally blurred. Real artifacts are walked through live so serious candidates can verify authenticity without
          creating leakage risk.
        </p>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {PREVIEW_ITEMS.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setOpenId(item.id)}
              className="group text-left transition-transform duration-300 hover:scale-[1.02] focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-sunset/50 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-slate-950"
            >
              <BlurredPlaceholder dense />
              <p className="mt-3 text-sm font-medium text-slate-800 transition-colors group-hover:text-brand-sunset dark:text-slate-200 dark:group-hover:text-brand-onDarkStrong">
                {item.label}
              </p>
              <p className="mt-1 text-xs text-slate-500">Tap to open — still locked</p>
            </button>
          ))}
        </div>
      </section>

      {openItem ? (
        <div
          className="fixed inset-0 z-[100] flex items-end justify-center p-4 sm:items-center sm:p-6"
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
        >
          <button
            type="button"
            className="absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
            aria-label="Close preview dialog"
            onClick={close}
          />
          <div className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-white/10 bg-slate-900/95 shadow-2xl shadow-black/50 backdrop-blur-xl transition-transform duration-200 ease-out sm:scale-100">
            <div className="border-b border-white/5 px-6 py-4">
              <h3 id={titleId} className="text-lg font-semibold text-slate-50">
                {openItem.label}
              </h3>
              <p className="mt-1 text-sm text-slate-400">{openItem.hint}</p>
            </div>
            <div className="p-6">
              <BlurredPlaceholder />
              <div className="mt-6 rounded-xl border border-white/10 bg-white/[0.03] p-4 text-center">
                <p className="text-sm font-semibold text-slate-100">Preview locked</p>
                <p className="mt-1 text-sm text-slate-400">Available after discussion on a fit call.</p>
              </div>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={close}
                  className="rounded-full border border-white/15 bg-white/5 px-5 py-2.5 text-sm font-medium text-slate-200 hover:bg-white/10"
                >
                  Close
                </button>
                <a href="/eligibility" className="btn-accent px-5 py-2.5 text-sm">
                  Request proof on call
                </a>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
