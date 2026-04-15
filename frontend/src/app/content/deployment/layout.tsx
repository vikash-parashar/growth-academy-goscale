import type { Metadata } from "next";
import { getSiteUrl } from "@/lib/site";

const url = `${getSiteUrl()}/content/deployment`;

export const metadata: Metadata = {
  title: "Hosting & deployment guide",
  description:
    "Learn how to put the Gopher Lab stack live: domain and DNS, Next.js and Go hosting, Docker, CI/CD, env vars, tradeoffs, and common mistakes.",
  openGraph: { url, title: "Hosting & deployment guide · Gopher Lab" },
};

export default function DeploymentGuideLayout({ children }: { children: React.ReactNode }) {
  return children;
}
