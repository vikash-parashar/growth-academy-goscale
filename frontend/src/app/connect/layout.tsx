import type { Metadata } from "next";
import { getSiteUrl } from "@/lib/site";

const url = `${getSiteUrl()}/connect`;

export const metadata: Metadata = {
  title: "Connect",
  description: "Connect with Gopher Lab — WhatsApp, social profiles, book a call, and eligibility.",
  openGraph: { url, title: "Connect · Gopher Lab" },
};

export default function ConnectLayout({ children }: { children: React.ReactNode }) {
  return children;
}
