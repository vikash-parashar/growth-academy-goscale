import type { Metadata } from "next";
import { getSiteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "Mock test",
  description:
    "20-question MCQ aptitude test: non-technical and technical tracks. Easy, medium, hard. 50% pass. Up to 3 attempts per track.",
  openGraph: {
    title: "Eligibility mock test · Gopher Lab",
    url: `${getSiteUrl()}/mock-test`,
  },
};

export default function MockTestLayout({ children }: { children: React.ReactNode }) {
  return children;
}
