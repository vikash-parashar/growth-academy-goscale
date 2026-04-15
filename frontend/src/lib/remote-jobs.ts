/**
 * Aggregates remote-friendly AI / Golang / ML roles from free public APIs.
 * Remotive: https://remotive.com/api-documentation (link back + attribution required)
 * Arbeitnow: https://www.arbeitnow.com/api/job-board-api
 */

export type UnifiedJob = {
  id: string;
  source: "remotive" | "arbeitnow";
  title: string;
  company: string;
  url: string;
  remote: boolean;
  location?: string;
  category?: string;
  jobType?: string;
  tags: string[];
  descriptionText: string;
  postedAt?: string;
  logoUrl?: string;
};

const FETCH_HEADERS: HeadersInit = {
  Accept: "application/json",
  "User-Agent": "GopherLab/1.0 (job-board)",
};

/** Coerce API date fields to ISO strings for sorting/display. */
function normalizePostedAt(v: unknown): string | undefined {
  if (v == null || v === "") return undefined;
  if (typeof v === "string") return v;
  if (typeof v === "number" && Number.isFinite(v)) {
    const d = new Date(v);
    return Number.isNaN(d.getTime()) ? undefined : d.toISOString();
  }
  return undefined;
}

function stripHtml(html: string): string {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

const AI_ML_RE =
  /\b(ai|artificial intelligence|machine learning|deep learning|llm|mlops|generative|genai|openai|anthropic|nlp|computer vision|pytorch|tensorflow|langchain|prompt engineer|ai engineer|ai specialist|ml engineer|data scientist)\b/i;
const GO_RE =
  /\b(golang|go lang|gopher|\bgo developer\b|\bgo engineer\b|\bgo programmer\b|kubernetes.*go|backend.*\bgo\b)\b/i;

export function jobMatchesFocus(title: string, tags: string[], extra = ""): boolean {
  const blob = `${title} ${tags.join(" ")} ${extra}`;
  return AI_ML_RE.test(blob) || GO_RE.test(blob);
}

type RemotiveResponse = {
  jobs?: Array<{
    id: number;
    url: string;
    title: string;
    company_name: string;
    company_logo?: string;
    category: string;
    job_type: string;
    publication_date: string;
    candidate_required_location?: string;
    description?: string;
    tags?: string[];
  }>;
};

type ArbeitnowResponse = {
  data?: Array<{
    slug: string;
    company_name: string;
    title: string;
    description: string;
    remote: boolean;
    url: string;
    tags: string[];
    job_types?: string[];
    location?: string;
    created_at?: string | number;
  }>;
};

async function fetchJson<T>(url: string): Promise<T | null> {
  try {
    const res = await fetch(url, {
      headers: FETCH_HEADERS,
      next: { revalidate: 3600 },
    });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

export async function fetchRemotiveJobs(): Promise<UnifiedJob[]> {
  const data = await fetchJson<RemotiveResponse>("https://remotive.com/api/remote-jobs?limit=100");
  if (!data?.jobs?.length) return [];

  const out: UnifiedJob[] = [];
  for (const j of data.jobs) {
    const tags = j.tags ?? [];
    const desc = stripHtml(j.description ?? "");
    if (!jobMatchesFocus(j.title, tags, desc)) continue;

    out.push({
      id: `remotive-${j.id}`,
      source: "remotive",
      title: j.title,
      company: j.company_name,
      url: j.url,
      remote: true,
      location: j.candidate_required_location || "Remote",
      category: j.category,
      jobType: j.job_type,
      tags,
      descriptionText: desc.slice(0, 1200),
      postedAt: normalizePostedAt(j.publication_date),
      logoUrl: j.company_logo,
    });
  }
  return out;
}

export async function fetchArbeitnowJobs(): Promise<UnifiedJob[]> {
  const data = await fetchJson<ArbeitnowResponse>("https://www.arbeitnow.com/api/job-board-api");
  if (!data?.data?.length) return [];

  const out: UnifiedJob[] = [];
  for (const j of data.data) {
    const tags = j.tags ?? [];
    const desc = stripHtml(j.description ?? "");
    if (!jobMatchesFocus(j.title, tags, desc)) continue;
    if (!j.remote && !/\bremote\b/i.test(j.title + desc)) continue;

    out.push({
      id: `arbeitnow-${j.slug}`,
      source: "arbeitnow",
      title: j.title,
      company: j.company_name,
      url: j.url,
      remote: j.remote,
      location: j.location,
      tags,
      jobType: j.job_types?.join(", "),
      descriptionText: desc.slice(0, 1200),
      postedAt: normalizePostedAt(j.created_at),
    });
  }
  return out;
}

export async function fetchAggregatedJobs(): Promise<UnifiedJob[]> {
  const [r, a] = await Promise.all([fetchRemotiveJobs(), fetchArbeitnowJobs()]);
  const map = new Map<string, UnifiedJob>();

  const keyOf = (j: UnifiedJob) => `${j.company.toLowerCase()}|${j.title.toLowerCase()}`;

  for (const j of [...r, ...a]) {
    const k = keyOf(j);
    if (!map.has(k)) map.set(k, j);
  }

  const list = Array.from(map.values());
  list.sort((x, y) => {
    const ax = String(x.postedAt ?? "");
    const bx = String(y.postedAt ?? "");
    return bx.localeCompare(ax);
  });
  return list;
}

export function filterJobs(
  jobs: UnifiedJob[],
  q: string,
  chip: "all" | "remote" | "ai" | "golang",
): UnifiedJob[] {
  let list = jobs;
  if (chip === "remote") list = list.filter((j) => j.remote);
  if (chip === "ai") list = list.filter((j) => AI_ML_RE.test(`${j.title} ${j.tags.join(" ")} ${j.descriptionText}`));
  if (chip === "golang") list = list.filter((j) => GO_RE.test(`${j.title} ${j.tags.join(" ")} ${j.descriptionText}`));

  const s = q.trim().toLowerCase();
  if (!s) return list;
  return list.filter(
    (j) =>
      j.title.toLowerCase().includes(s) ||
      j.company.toLowerCase().includes(s) ||
      j.tags.some((t) => t.toLowerCase().includes(s)) ||
      j.descriptionText.toLowerCase().includes(s),
  );
}
