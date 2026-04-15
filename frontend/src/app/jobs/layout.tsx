import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI, Golang & remote tech jobs",
  description:
    "Curated remote-friendly roles in AI, machine learning, Golang, and related engineering — aggregated from free public job APIs.",
};

export default function JobsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
