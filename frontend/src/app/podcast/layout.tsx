import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Podcast — Fix Your Finance",
  description: "Featured on Fix Your Finance — real money, real story.",
};

export default function PodcastLayout({ children }: { children: React.ReactNode }) {
  return children;
}
