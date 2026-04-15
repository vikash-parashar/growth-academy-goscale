import { JobsPageContent } from "./jobs-page-content";
import { fetchAggregatedJobs } from "@/lib/remote-jobs";

export const revalidate = 3600;

export default async function JobsPage() {
  const jobs = await fetchAggregatedJobs();
  return <JobsPageContent initialJobs={jobs} />;
}
