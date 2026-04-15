import type { Metadata } from "next";
import { getSiteUrl } from "@/lib/site";

const url = `${getSiteUrl()}/learning`;

export const metadata: Metadata = {
  title: "Learning hub",
  description:
    "Developer tutorials with examples: Go basics and advanced topics, linting and testing, HTTP and how the internet works, Docker, CI/CD, and AWS essentials.",
  openGraph: { url, title: "Learning hub · Gopher Lab" },
};

export default function LearningLayout({ children }: { children: React.ReactNode }) {
  return children;
}
