import type { Metadata } from "next";
import { Bebas_Neue, JetBrains_Mono, Outfit, Space_Grotesk } from "next/font/google";
import { Providers } from "@/components/providers";
import { getSiteUrl } from "@/lib/site";
import "./globals.css";

/** Body & UI — geometric, technical, readable at small sizes. */
const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

/** Logo wordmark — tall condensed caps, distinct from Space Grotesk body. */
const bebasDisplay = Bebas_Neue({
  subsets: ["latin"],
  variable: "--font-brand-display",
  display: "swap",
  weight: "400",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

/** Tagline under “Gopher Lab” — distinct from body sans */
const outfitTagline = Outfit({
  subsets: ["latin"],
  variable: "--font-brand-tagline",
  display: "swap",
  weight: ["400", "500", "600"],
});

const siteUrl = getSiteUrl();

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Gopher Lab — Premium US-Aligned Tech Mentorship",
    template: "%s · Gopher Lab",
  },
  description:
    "Gopher Lab — US-aligned tech mentorship for serious builders: Go, systems, interviews, and offers. By Vikash Parashar (Founder, CEO, teacher & host), backend engineer working with US teams.",
  applicationName: "Gopher Lab",
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: siteUrl,
    siteName: "Gopher Lab",
    title: "Gopher Lab — Premium US-Aligned Tech Mentorship",
    description:
      "A lab for disciplined builders — US-aligned mentorship: systems, interviews, offers, founder-led accountability.",
    images: [
      {
        url: "/gopher-lab-mark.png",
        width: 1024,
        height: 1024,
        alt: "Gopher Lab — brand mark",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Gopher Lab — US-Aligned Tech Mentorship",
    description: "US-aligned tech mentorship by Vikash Parashar — Gopher Lab.",
    images: ["/gopher-lab-mark.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${spaceGrotesk.variable} ${bebasDisplay.variable} ${jetbrains.variable} ${outfitTagline.variable} min-h-screen bg-background bg-mesh-light font-sans text-foreground antialiased dark:bg-mesh-dark`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
