"use client";

import { ThemeProvider } from "next-themes";
import type { ReactNode } from "react";
import { ScrollToHash } from "@/components/scroll-to-hash";
import { LanguageProvider } from "@/contexts/language-context";
import { StudentProvider } from "@/contexts/StudentContext";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
      <LanguageProvider>
        <StudentProvider>
          <ScrollToHash />
          {children}
        </StudentProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}
