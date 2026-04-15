"use client";

import { usePathname } from "next/navigation";
import { useCallback, useEffect } from "react";

/**
 * Next.js App Router does not reliably scroll to #anchors on load or after <Link href="/#id"> navigation.
 * This restores native hash behavior for in-page sections.
 */
export function ScrollToHash() {
  const pathname = usePathname();

  const scrollToFragment = useCallback(() => {
    const hash = typeof window !== "undefined" ? window.location.hash : "";
    if (!hash) return;
    const id = decodeURIComponent(hash.replace(/^#/, ""));
    if (!id) return;
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, []);

  useEffect(() => {
    scrollToFragment();
    const t = window.setTimeout(scrollToFragment, 0);
    const t2 = window.setTimeout(scrollToFragment, 100);
    return () => {
      window.clearTimeout(t);
      window.clearTimeout(t2);
    };
  }, [pathname, scrollToFragment]);

  useEffect(() => {
    window.addEventListener("hashchange", scrollToFragment);
    window.addEventListener("popstate", scrollToFragment);
    return () => {
      window.removeEventListener("hashchange", scrollToFragment);
      window.removeEventListener("popstate", scrollToFragment);
    };
  }, [scrollToFragment]);

  useEffect(() => {
    const onClickCapture = (e: MouseEvent) => {
      const t = e.target;
      if (!(t instanceof Element)) return;
      const a = t.closest("a[href*='#']");
      if (!(a instanceof HTMLAnchorElement)) return;
      const href = a.getAttribute("href");
      if (!href || !href.startsWith("/") || !href.includes("#")) return;
      const hashIdx = href.indexOf("#");
      const frag = href.slice(hashIdx + 1);
      if (!frag) return;
      window.setTimeout(() => {
        const el = document.getElementById(decodeURIComponent(frag));
        el?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 50);
    };
    document.addEventListener("click", onClickCapture, true);
    return () => document.removeEventListener("click", onClickCapture, true);
  }, []);

  return null;
}
