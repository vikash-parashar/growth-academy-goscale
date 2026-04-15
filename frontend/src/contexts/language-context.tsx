"use client";

import { createContext, useContext, useMemo, type ReactNode } from "react";
import { messages, type MessageTree } from "@/lib/i18n/messages";

type LanguageContextValue = {
  t: MessageTree;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const value = useMemo(() => ({ t: messages }), []);
  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage(): LanguageContextValue {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error("useLanguage must be used within LanguageProvider");
  }
  return ctx;
}

/** Safe for components that may render outside provider (should not happen); falls back to English. */
export function useOptionalLanguage(): LanguageContextValue | null {
  return useContext(LanguageContext);
}
