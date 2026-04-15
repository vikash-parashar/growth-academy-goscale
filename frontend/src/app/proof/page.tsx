import type { Metadata } from "next";
import { Section } from "@/components/section";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import {
  IconBankStatement,
  IconChatScreenshots,
  IconInterviewRecording,
  IconOfferLetter,
  IconRealProjects,
  IconSalarySlip,
} from "@/components/proof-transparency/icons";
import { ProofCategoryCard } from "@/components/proof-transparency/proof-category-card";
import { ProofCtaSection } from "@/components/proof-transparency/proof-cta-section";
import { ProofHero } from "@/components/proof-transparency/proof-hero";
import { ProofPreviewSection } from "@/components/proof-transparency/proof-preview-section";
import { SecurityNotice } from "@/components/proof-transparency/security-notice";

export const metadata: Metadata = {
  title: "Proof & Transparency — Gopher Lab",
  description:
    "Trust, authenticity, and conversion — how we share proof with serious candidates at Gopher Lab. Offer letters, salary slips, bank statements, and real project context.",
};

const PROOF_CATEGORIES = [
  {
    title: "Offer Letter",
    description: "Verifiable offer context and structure — discussed live, never dumped as public collateral.",
    icon: <IconOfferLetter className="h-6 w-6" />,
  },
  {
    title: "Salary Slips",
    description: "Compensation trail that matches the story we tell — shown when you’re evaluating fit seriously.",
    icon: <IconSalarySlip className="h-6 w-6" />,
  },
  {
    title: "Bank Statements",
    description: "Financial corroboration where appropriate — selective, explained, and always consented.",
    icon: <IconBankStatement className="h-6 w-6" />,
  },
  {
    title: "Interview Recordings",
    description: "Debriefs and clips that demonstrate how we prepare for high-stakes loops — shared on call only.",
    icon: <IconInterviewRecording className="h-6 w-6" />,
  },
  {
    title: "Chat Screenshots",
    description: "Real coordination patterns with teams and stakeholders — redacted and contextualized.",
    icon: <IconChatScreenshots className="h-6 w-6" />,
  },
  {
    title: "Real Projects (EHR, Payments)",
    description: "Production-grade work in healthcare records and payments — architecture and outcomes, not scraped repos.",
    icon: <IconRealProjects className="h-6 w-6" />,
  },
];

export default function ProofTransparencyPage() {
  return (
    <div className="noise min-h-screen bg-background bg-hero-radial dark:bg-hero-radial-dark">
      <SiteHeader />
      <main>
        <ProofHero />

        <Section id="categories" eyebrow="CATEGORIES" title="Proof you can feel — without the circus">
          <p className="-mt-4 mb-12 max-w-2xl text-sm text-slate-600 dark:text-slate-400">
            Every card below maps to artifacts we can walk through with sincere candidates. Nothing here is performative marketing — it’s operational
            evidence, handled responsibly.
          </p>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {PROOF_CATEGORIES.map((c) => (
              <ProofCategoryCard key={c.title} icon={c.icon} title={c.title} description={c.description} />
            ))}
          </div>
        </Section>

        <section className="mx-auto max-w-6xl px-4 pb-16 sm:px-6">
          <SecurityNotice />
        </section>

        <ProofPreviewSection />
        <ProofCtaSection />
      </main>

      <SiteFooter />
    </div>
  );
}
