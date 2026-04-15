"use client";

import { useEffect, useState } from "react";
import { API_BASE } from "@/lib/http";
import type { PublicAnnouncements } from "@/services/api";

function messageFromEnv(): string | null {
  const p = process.env.NEXT_PUBLIC_FEE_INCREASE_PERCENT;
  const d = process.env.NEXT_PUBLIC_FEE_INCREASE_DAYS;
  if (!p || !d) return null;
  return `Program fee will increase by ${p}% in the next ${d} days. Lock in current pricing by completing your application.`;
}

export function FeeBanner() {
  const [text, setText] = useState<string | null>(() => messageFromEnv());

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const res = await fetch(`${API_BASE}/api/public/announcements`, { cache: "no-store" });
        if (!res.ok) return;
        const j = (await res.json()) as PublicAnnouncements;
        if (!cancelled && j.message?.trim()) setText(j.message.trim());
      } catch {
        if (!cancelled) setText((t) => t ?? messageFromEnv());
      }
    }
    void load();
    return () => {
      cancelled = true;
    };
  }, []);

  if (!text) return null;

  return (
    <div className="border-b border-amber-200/80 bg-amber-50 px-4 py-3 text-center text-sm text-amber-950 dark:border-amber-500/30 dark:bg-amber-950/40 dark:text-amber-100">
      <span className="font-semibold">Fee update: </span>
      {text}
    </div>
  );
}
