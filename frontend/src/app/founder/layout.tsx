import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Founder snapshot",
  description: "Direction, discipline, and execution — a short snapshot before the full founder story.",
};

export default function FounderLayout({ children }: { children: React.ReactNode }) {
  return children;
}
