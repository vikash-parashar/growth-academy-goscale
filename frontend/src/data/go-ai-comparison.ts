/**
 * Illustrative indices for charts — NOT guaranteed salaries or job offers.
 * Real compensation varies by city, company, stock, YOE, and negotiation.
 */

/** Relative demand signal for Go backend roles (1–10 scale, qualitative). */
export const goDemandByRegion = [
  { region: "India — product & startups", index: 8.2 },
  { region: "India — IT services / MNC", index: 7.4 },
  { region: "Remote — US/EU global teams", index: 9.1 },
  { region: "GCC / Singapore hubs", index: 7.8 },
];

/** Where Go shines in production (share of typical Go job descriptions, illustrative %). */
export const goUseCaseMix = [
  { name: "APIs / microservices", pct: 38 },
  { name: "Cloud / infra / platform", pct: 28 },
  { name: "DevOps & tooling", pct: 18 },
  { name: "Data / streaming", pct: 16 },
];

/** Pairing skills with Go + AI trajectory (importance index 1–10). */
export const skillPairingIndex = [
  { skill: "REST / gRPC APIs", value: 9 },
  { skill: "Containers (Docker) & K8s", value: 8 },
  { skill: "AI/LLM APIs & prompts", value: 8 },
  { skill: "Observability (logs/metrics)", value: 7 },
  { skill: "PostgreSQL / data stores", value: 8 },
];
