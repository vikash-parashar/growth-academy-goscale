import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { MockTestFlow } from "@/components/mock-test/mock-test-flow";

export default function MockTestPage() {
  return (
    <div className="noise min-h-screen bg-background bg-hero-radial dark:bg-hero-radial-dark">
      <SiteHeader />
      <main className="page-shell">
        <MockTestFlow />
      </main>
      <SiteFooter showBackToHome />
    </div>
  );
}
