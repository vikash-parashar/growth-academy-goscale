export type ChangelogEntry = {
  date: string;
  title: string;
  bullets: string[];
};

/** In-app product changelog — edit this list when you ship. */
export const CHANGELOG: ChangelogEntry[] = [
  {
    date: "2026-03-26",
    title: "Gopher Lab identity refresh",
    bullets: [
      "New wordmark typography (Syne) + body font (Space Grotesk); refreshed tagline styling",
      "Custom Gopher Lab mark (lab + teal accents): /gopher-lab-mark.png, app icon, social previews — PNG with transparent background (white + navy card removed)",
      "Header brand cluster: logo ring, hover glow, tighter mobile layout",
    ],
  },
  {
    date: "2026-03-26",
    title: "Go + AI on career comparison",
    bullets: [
      "Charts (Recharts): demand index India vs remote, Go use-case mix, skill pairing",
      "Prose: why Go pays well, AI benefits, India vs abroad scope — with disclaimers",
    ],
  },
  {
    date: "2026-03-26",
    title: "Career comparison page",
    bullets: [
      "/career-comparison — business vs private IT vs government (costs, merit, honest note on bribery)",
      "Mock test: richer motivation when score is below 50%",
    ],
  },
  {
    date: "2026-03-26",
    title: "Mock test (20 MCQs)",
    bullets: [
      "/mock-test — non-technical vs technical tracks, Easy/Medium/Hard, 50% pass, 3 attempts per track (local)",
      "12th-pass eligibility gate; optional background step",
    ],
  },
  {
    date: "2026-03-26",
    title: "Notifications & announcements",
    bullets: [
      "SMTP email + Twilio SMS/WhatsApp: apply acknowledgement, booking updates, admin broadcast",
      "GET /api/public/announcements + home fee banner; pricing section fee-increase notice",
      "Dashboard /notifications — message leads by status and channel",
    ],
  },
  {
    date: "2026-03-26",
    title: "Brand, ops, and polish",
    bullets: [
      "Transparent Gopher Lab logo site-wide; PNG favicon",
      "API request IDs + structured JSON access logs; DB-aware /health",
      "Login rate limiting per IP; CORS exposes X-Request-Id",
      "Open Graph / Twitter cards, sitemap + robots, branded error pages",
      "Dashboard “next step” card; CSV export for leads and employees",
    ],
  },
];
