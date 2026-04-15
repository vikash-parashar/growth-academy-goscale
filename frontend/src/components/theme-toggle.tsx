"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <span
        className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-slate-100 dark:border-slate-600 dark:bg-slate-800"
        aria-hidden
      />
    );
  }

  const isDark = resolvedTheme === "dark";

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="group inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#fec7b4]/45 bg-[#234c6a]/50 text-[#fff3c7] shadow-sm transition hover:border-[#fec7b4] hover:bg-[#456882]/40 hover:text-white dark:border-[#456882]/55 dark:bg-[#234c6a]/65 dark:text-[#f4eee6] dark:hover:border-[#d2c1b6]/45 dark:hover:bg-[#456882]/35 dark:hover:text-[#fff3c7]"
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
    >
      {isDark ? (
        <SunIcon className="h-[1.15rem] w-[1.15rem] transition group-hover:scale-105" />
      ) : (
        <MoonIcon className="h-[1.15rem] w-[1.15rem] transition group-hover:scale-105" />
      )}
    </button>
  );
}

function SunIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" strokeLinecap="round" />
    </svg>
  );
}

function MoonIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
