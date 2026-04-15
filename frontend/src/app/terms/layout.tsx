import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms (summary)",
  description: "High-level terms for Gopher Lab mentorship — detailed agreement after fit call.",
};

export default function TermsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
