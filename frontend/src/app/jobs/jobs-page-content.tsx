"use client";

import { JobBoard } from "@/components/jobs/job-board";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { useLanguage } from "@/contexts/language-context";
import type { UnifiedJob } from "@/lib/remote-jobs";

export function JobsPageContent({ initialJobs }: { initialJobs: UnifiedJob[] }) {
  const { t } = useLanguage();
  return (
    <div className="noise min-h-screen bg-background bg-hero-radial dark:bg-hero-radial-dark">
      <SiteHeader />
      <main>
        <JobBoard jobs={initialJobs} t={t.jobsPage} />
      </main>
      <SiteFooter />
    </div>
  );
}
