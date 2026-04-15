import type { Metadata } from "next";
import { getSiteUrl } from "@/lib/site";

const url = `${getSiteUrl()}/content`;

export const metadata: Metadata = {
  title: "Content & courses",
  description:
    "Curriculum pillars — Go basics and advanced, AI for speed, interview and life skills. Videos and docs coming soon; links listed here.",
  openGraph: { url, title: "Content & courses · Gopher Lab" },
};

export default function ContentLayout({ children }: { children: React.ReactNode }) {
  return children;
}
