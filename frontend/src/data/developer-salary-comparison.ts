/**
 * Developer salary comparison data
 * Note: These are illustrative ranges based on market research (2024-2025).
 * Actual salaries vary significantly by:
 * - Years of experience (YOE)
 * - Company size and stage
 * - Location within country
 * - Stock options and benefits
 * - Negotiation skills
 * - Specialization and demand
 *
 * Use these as directional guidance, not absolute figures.
 */

export interface SalaryRange {
  min: number;
  max: number;
  mid: number;
}

export interface DeveloperSalaryData {
  language: string;
  india: SalaryRange;
  usa: SalaryRange;
  demand: number; // 1-10 scale
}

/**
 * Annual salaries in base currency (₹ for India, $ for USA)
 * Breakdown:
 * - min: Entry level (0-2 YOE)
 * - max: Senior/Lead level (5+ YOE)
 * - mid: Mid-level (2-5 YOE)
 */
export const developerSalaryComparison: DeveloperSalaryData[] = [
  {
    language: "Go (Golang)",
    india: { min: 800000, max: 3500000, mid: 1800000 },
    usa: { min: 130000, max: 280000, mid: 200000 },
    demand: 8.5,
  },
  {
    language: "Python",
    india: { min: 700000, max: 3200000, mid: 1700000 },
    usa: { min: 120000, max: 260000, mid: 190000 },
    demand: 9.0,
  },
  {
    language: "Java",
    india: { min: 750000, max: 3400000, mid: 1900000 },
    usa: { min: 125000, max: 270000, mid: 200000 },
    demand: 8.2,
  },
  {
    language: "Node.js",
    india: { min: 700000, max: 3000000, mid: 1600000 },
    usa: { min: 120000, max: 250000, mid: 185000 },
    demand: 8.0,
  },
  {
    language: "C++",
    india: { min: 900000, max: 3600000, mid: 2000000 },
    usa: { min: 135000, max: 290000, mid: 210000 },
    demand: 7.5,
  },
  {
    language: "Rust",
    india: { min: 1000000, max: 3800000, mid: 2100000 },
    usa: { min: 140000, max: 300000, mid: 220000 },
    demand: 7.2,
  },
];

/**
 * Salary impact factors for different scenarios
 */
export const salaryFactors = [
  {
    factor: "Startup vs MNC",
    impact: "Startups: Salary + equity (high risk/upside). MNC: Stable salary + benefits.",
    range: "-20% to +25% variance",
  },
  {
    factor: "Remote vs Onsite",
    impact: 'Remote USA companies: Can pay 60-80% of on-site rate but with global talent. India remote: Premium 10-15%.',
    range: "±15% typical range",
  },
  {
    factor: "City/Location",
    impact: "Bangalore/Hyderabad > Pune > Tier 2 cities. San Francisco > NYC > Austin > other US cities.",
    range: "±20% within country",
  },
  {
    factor: "Stock & Equity",
    impact: "Tech companies often add 10-40% in stock. Can become significant in high-growth or IPO scenarios.",
    range: "+10% to +40% annually",
  },
  {
    factor: "Specialization",
    impact: "System design, ML, Security, DevOps: +15-30%. Niche domains (embedded, blockchain): +20-35%.",
    range: "+15% to +35% premium",
  },
];

/**
 * Career progression salary multiplier
 * Based on typical YOE (Years of Experience)
 */
export const careerProgression = [
  { label: "Entry (0-2 YOE)", multiplier: 1.0 },
  { label: "Mid (2-5 YOE)", multiplier: 2.0 },
  { label: "Senior (5-8 YOE)", multiplier: 2.8 },
  { label: "Lead/Principal (8+ YOE)", multiplier: 3.8 },
];

/**
 * Remote salary multiplier by country/region hiring
 * Shows what remote roles typically pay relative to local market
 */
export const remoteSalaryMultipliers = [
  { market: "India remote (US companies)", multiplier: 1.4 },
  { market: "India remote (EU companies)", multiplier: 1.2 },
  { market: "India remote (India companies)", multiplier: 1.1 },
  { market: "Global distributed", multiplier: 1.3 },
];

/**
 * Why Go developers earn premium (qualitative factors)
 */
export const goSalaryPremiumReasons = [
  "Cloud-native infrastructure demand (Kubernetes, Docker, container orchestration)",
  "System design expertise requirement (higher barrier to entry)",
  "Smaller talent pool compared to Python/Java (supply-demand)",
  "High-scale production systems (fintech, SaaS, DevOps tools)",
  "DevOps & infrastructure focus (premium domains)",
];
