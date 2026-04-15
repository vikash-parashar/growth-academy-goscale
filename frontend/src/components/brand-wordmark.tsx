import type { ReactNode } from "react";

/** Visual lockup — all caps. */
const WORDMARK_DISPLAY = "GOPHER LAB";

/** Spoken / accessible label (natural casing). */
const WORDMARK_ACCESSIBLE = "Gopher Lab";

/** Rotating brand palette per glyph (coral → magenta → rose). */
const LETTER_CLASSES = [
  "text-brand-sunset dark:text-brand-sunsetBright",
  "text-brand-berry dark:text-brand-berryBright",
  "text-brand-label dark:text-brand-onDark",
] as const;

const SIZE_CLASSES = {
  sm: "text-sm font-normal tracking-[0.14em] sm:text-base",
  md: "text-lg font-normal tracking-[0.12em] sm:text-xl",
  lg: "text-xl font-normal tracking-[0.11em] sm:text-2xl",
} as const;

type BrandWordmarkProps = {
  /** Layout size preset */
  size?: keyof typeof SIZE_CLASSES;
  className?: string;
};

/**
 * All-caps display wordmark with per-glyph color rhythm (Bebas Neue via `font-brandDisplay`).
 * Screen readers get natural “Gopher Lab”, not letter-by-letter spelling.
 */
export function BrandWordmark({ size = "md", className = "" }: BrandWordmarkProps) {
  let colorIndex = 0;
  const parts: ReactNode[] = [];
  for (let i = 0; i < WORDMARK_DISPLAY.length; i++) {
    const ch = WORDMARK_DISPLAY[i]!;
    if (ch === " ") {
      parts.push(
        <span key={`sp-${i}`} className="mx-0.5 inline-block sm:mx-1" aria-hidden>
          {"\u00a0"}
        </span>,
      );
      continue;
    }
    const cls = LETTER_CLASSES[colorIndex % LETTER_CLASSES.length]!;
    colorIndex++;
    parts.push(
      <span key={`${i}-${ch}`} className={cls} aria-hidden>
        {ch}
      </span>,
    );
  }

  const merged = [SIZE_CLASSES[size], className].filter(Boolean).join(" ");

  return (
    <span
      className={`brand-wordmark inline-flex flex-wrap items-baseline font-brandDisplay uppercase leading-none drop-shadow-[0_1px_0_rgba(0,0,0,0.18)] dark:drop-shadow-[0_1px_0_rgba(0,0,0,0.35)] ${merged}`}
    >
      <span className="sr-only">{WORDMARK_ACCESSIBLE}</span>
      <span className="inline-flex flex-wrap items-baseline" aria-hidden>
        {parts}
      </span>
    </span>
  );
}

type BrandTaglineProps = {
  children: React.ReactNode;
  className?: string;
};

/**
 * Slogan under the wordmark — Outfit, italic, wider tracking, dusty rose (day / night).
 */
export function BrandTagline({ children, className = "" }: BrandTaglineProps) {
  return (
    <p
      className={`font-brandTagline text-[0.65rem] font-semibold not-italic leading-snug tracking-[0.12em] text-[#f4eee6]/85 antialiased dark:text-brand-onDark/90 sm:text-[0.7rem] ${className}`.trim()}
    >
      {children}
    </p>
  );
}
