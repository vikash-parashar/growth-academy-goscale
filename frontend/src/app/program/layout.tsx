import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Program — Free vs paid mentorship",
  description: "Why paid mentorship, what you get, and language of delivery — Gopher Lab.",
};

export default function ProgramLayout({ children }: { children: React.ReactNode }) {
  return children;
}
