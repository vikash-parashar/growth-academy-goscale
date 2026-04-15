/**
 * In-app learning doc: how this monorepo goes live (domain, DNS, hosting, CI/CD).
 * Content is English-only; shell strings live in messages.ts.
 */

export type GuideCalloutVariant = "info" | "tip" | "caution";

export type GuideBlock =
  | { type: "p"; text: string }
  | { type: "h3"; text: string }
  | { type: "ul"; items: string[] }
  | { type: "ol"; items: string[] }
  | { type: "callout"; variant: GuideCalloutVariant; title: string; body: string }
  | { type: "code"; text: string };

export type GuideSection = {
  id: string;
  eyebrow?: string;
  title: string;
  blocks: GuideBlock[];
};

export const DEPLOYMENT_GUIDE_SECTIONS: GuideSection[] = [
  {
    id: "mental-model",
    eyebrow: "Start here",
    title: "What it means to put a site “on the internet”",
    blocks: [
      {
        type: "p",
        text:
          "Your app is code until it runs on a machine that is reachable from the public internet, with a domain name that points to that machine. “Publicly accessible” means: DNS resolves your hostname to an IP address; something on that IP accepts HTTPS on port 443; and your firewall and app are configured to answer safely.",
      },
      {
        type: "p",
        text:
          "This project is split in two on purpose: a Next.js frontend (pages users see in the browser) and a Go API (business logic, database, auth, payments). They can run in the same data centre or on different providers — what matters is that the browser knows the API’s URL (via NEXT_PUBLIC_API_URL) and the API trusts your site’s origin (via CORS_ORIGINS).",
      },
      {
        type: "callout",
        variant: "info",
        title: "Problem this solves",
        body:
          "Without hosting, only you can open localhost. Deploying gives you a stable URL, TLS (the padlock), backups for your database, and a place to store secrets — so real users can apply, pay, and use the admin dashboard.",
      },
    ],
  },
  {
    id: "domain-dns-email",
    eyebrow: "Your purchase",
    title: "Domain, website, and email are related but not the same",
    blocks: [
      {
        type: "p",
        text:
          "When you buy a domain from any registrar (the shop where you bought the name), you control DNS records. DNS is a phone book: it maps names like www.example.com to IPs, mail servers, verification tokens, and more.",
      },
      {
        type: "h3",
        text: "Typical records",
      },
      {
        type: "ul",
        items: [
          "A / AAAA — point the root domain or subdomain to a server’s IPv4 / IPv6 address (common for VPS or some CDNs).",
          "CNAME — point a hostname to another hostname (very common for Vercel, Netlify, or a load balancer).",
          "MX — where inbound email should be delivered; required if you want hello@yourdomain.com inboxes at Google Workspace, Zoho, etc.",
          "TXT — often used for SPF, DKIM, DMARC (email authenticity) or domain verification for SSL and SaaS.",
        ],
      },
      {
        type: "callout",
        variant: "tip",
        title: "Email you bought with the domain",
        body:
          "If your registrar bundled “email”, they usually expect you to set MX (and often TXT) to their mail service. That does not deploy your website — it only routes mail. Your Next.js and Go deploy still need their own DNS entries (usually CNAME to Vercel and A/CNAME or host-specific instructions for the API).",
      },
      {
        type: "callout",
        variant: "caution",
        title: "Propagation and mistakes",
        body:
          "DNS changes can take minutes to hours. Avoid duplicate conflicting records (two A records meaning different things). Use your host’s documented values exactly — one typo and visitors hit the wrong server or get certificate errors.",
      },
    ],
  },
  {
    id: "this-repo",
    eyebrow: "This codebase",
    title: "What Gopher Lab’s monorepo contains",
    blocks: [
      {
        type: "p",
        text:
          "frontend/ — Next.js App Router UI. At build time, NEXT_PUBLIC_* variables are baked in; they must match your production API URL.",
      },
      {
        type: "p",
        text:
          "backend/ — Go Gin API, PostgreSQL, JWT admin auth, file uploads, Razorpay hooks. Production needs DATABASE_URL, strong secrets, CORS_ORIGINS, and (in release mode) a bcrypt-hashed ADMIN_PASSWORD per README.",
      },
      {
        type: "p",
        text:
          "render.yaml — optional Blueprint for Render.com: Docker-built API, health check on /health, env placeholders you fill in the dashboard.",
      },
      {
        type: "p",
        text:
          ".github/workflows/vercel-frontend.yml — optional CI that installs Node, runs npm ci && npm run build, and can deploy with Vercel tokens if you configure secrets.",
      },
    ],
  },
  {
    id: "docker-explained",
    eyebrow: "Containers",
    title: "Docker in this project — two different ideas",
    blocks: [
      {
        type: "p",
        text:
          "docker-compose.yml at the repo root runs PostgreSQL locally so developers don’t install Postgres on the laptop. It is not a full “production stack” for the whole app unless you extend it yourself.",
      },
      {
        type: "p",
        text:
          "backend/Dockerfile builds a small Linux image with only the Go binary. Platforms like Render, Railway, Fly.io, or Kubernetes use that pattern: repeatable builds, same binary everywhere, easy scaling.",
      },
      {
        type: "callout",
        variant: "info",
        title: "Why Docker helps",
        body:
          "You declare the environment once; the image runs the same on your laptop, in CI, and in production. Without it, “works on my machine” drift is common.",
      },
      {
        type: "callout",
        variant: "caution",
        title: "Ephemeral disks",
        body:
          "Many PaaS free tiers store uploaded files on disposable disk — redeploy can wipe /tmp. For proof uploads you either pay for persistent volume, use object storage (S3, R2), or accept that files may vanish on redeploy.",
      },
    ],
  },
  {
    id: "patterns",
    eyebrow: "Architecture choices",
    title: "Ways to host a Next.js + Go stack",
    blocks: [
      {
        type: "h3",
        text: "Pattern A — Frontend on Vercel, API on a container host (common)",
      },
      {
        type: "p",
        text:
          "Vercel builds and serves the Next.js app globally. You deploy the Go API to Render, Railway, Fly.io, or a VPS. You set NEXT_PUBLIC_API_URL to the API origin and CORS_ORIGINS to your Vercel domain(s). Good balance of ergonomics and control.",
      },
      {
        type: "h3",
        text: "Pattern B — Everything on one VPS",
      },
      {
        type: "p",
        text:
          "A single Linux server runs Postgres (or you use managed RDS), Caddy/nginx for TLS, systemd for the Go binary, and either Node for next start or a static export if applicable. Cheapest at small scale; you own updates, security patches, and backups.",
      },
      {
        type: "h3",
        text: "Pattern C — All-in PaaS",
      },
      {
        type: "p",
        text:
          "Some teams run both on a single vendor with two services. Fewer moving parts in billing; watch for cold starts, egress costs, and vendor lock-in.",
      },
      {
        type: "callout",
        variant: "tip",
        title: "AWS specifically",
        body:
          "EC2 + RDS + ALB is the classic “full control” AWS pattern. ECS Fargate or EKS add orchestration. S3 + CloudFront can front a static site; Next.js with SSR often needs Amplify, Lambda@Edge complexity, or to stay on Vercel. There is no single “AWS button” — you choose primitives to match your ops comfort.",
      },
    ],
  },
  {
    id: "steps",
    eyebrow: "Practical path",
    title: "A sensible first production path for this repo",
    blocks: [
      {
        type: "ol",
        items: [
          "Create a managed PostgreSQL database (Supabase, Neon, RDS, Render Postgres, etc.) and note the connection string for DATABASE_URL.",
          "Deploy the API: connect your GitHub repo, use backend/Dockerfile context (see render.yaml), set env vars (GIN_MODE=release, JWT_SECRET, DATABASE_URL, ADMIN_* hash, CORS_ORIGINS, PUBLIC_BASE_URL, payment keys if used). Confirm GET /health returns 200.",
          "Deploy the frontend to Vercel. In Project → Settings → General, set Root Directory to frontend (recommended), or keep the repo root and rely on npm workspaces (npm ci && npm run build at repo root). Set NEXT_PUBLIC_API_URL to the API public URL and NEXT_PUBLIC_SITE_URL to your marketing site URL. Redeploy after any API URL change.",
          "In your DNS panel, point www (CNAME to Vercel) and apex as your registrar recommends (often ALIAS/ANAME or A to Vercel). Add the custom domain in Vercel and wait for TLS provisioning.",
          "Point api.yourdomain.com (or your chosen API host) to the API service per your API host’s docs; enable HTTPS there.",
          "Smoke-test: home page loads, apply form hits API, admin login works, CORS errors in the browser console are zero.",
        ],
      },
      {
        type: "code",
        text:
          "# Example only — your values differ\n# Frontend (Vercel env)\nNEXT_PUBLIC_API_URL=https://api.yourdomain.com\n\n# Backend (API host env)\nCORS_ORIGINS=https://yourdomain.com,https://www.yourdomain.com\nDATABASE_URL=postgres://...\nGIN_MODE=release",
      },
    ],
  },
  {
    id: "cicd",
    eyebrow: "Automation",
    title: "CI/CD — what it is and what this repo already has",
    blocks: [
      {
        type: "p",
        text:
          "Continuous Integration (CI) runs tests and builds on every push so broken code is caught early. Continuous Delivery/Deployment (CD) pushes passing builds to staging or production automatically or with one approval.",
      },
      {
        type: "p",
        text:
          "Vercel’s Git integration is CD by default: merge to main triggers a production deploy. The GitHub Action in this repo duplicates a build check and can call the Vercel CLI if you add VERCEL_TOKEN, VERCEL_ORG_ID, and VERCEL_PROJECT_ID secrets.",
      },
      {
        type: "callout",
        variant: "info",
        title: "Alternatives to GitHub Actions",
        body:
          "GitLab CI, CircleCI, Buildkite, or the built-in builders on Railway/Render. The idea is the same: checkout → install → build → deploy artifact.",
      },
      {
        type: "callout",
        variant: "caution",
        title: "Secrets in CI",
        body:
          "Never echo secrets in logs. Store tokens in the platform’s secret manager. Rotate if leaked.",
      },
    ],
  },
  {
    id: "env-security",
    eyebrow: "Configuration",
    title: "Environment variables, TLS, and CORS",
    blocks: [
      {
        type: "p",
        text:
          "NEXT_PUBLIC_* is visible to anyone in the browser — never put private keys there. API keys for Razorpay, JWT signing secrets, and DB passwords belong only on the server (backend env).",
      },
      {
        type: "p",
        text:
          "CORS_ORIGINS must list the exact browser origins that may call your API. Omit a scheme mismatch (http vs https) and the browser blocks requests. Wildcards are limited; prefer explicit production domains.",
      },
      {
        type: "p",
        text:
          "TLS (HTTPS) terminates at the edge (Vercel, load balancer, or Caddy). Your Go app may still see HTTP internally — that is normal behind a reverse proxy; configure trusted headers only if you terminate TLS yourself.",
      },
    ],
  },
  {
    id: "tradeoffs",
    eyebrow: "Decisions",
    title: "Good vs bad aspects of common choices",
    blocks: [
      {
        type: "h3",
        text: "Vercel for Next.js",
      },
      {
        type: "ul",
        items: [
          "Good: fast global CDN, automatic HTTPS, preview deployments per PR, minimal ops.",
          "Bad: long-running tasks and some Node-only patterns need workarounds; pricing scales with traffic.",
        ],
      },
      {
        type: "h3",
        text: "Managed PostgreSQL",
      },
      {
        type: "ul",
        items: [
          "Good: automated backups, patching, observability.",
          "Bad: cost at scale; connection limits require pooling for many API instances.",
        ],
      },
      {
        type: "h3",
        text: "Single VPS",
      },
      {
        type: "ul",
        items: [
          "Good: predictable cheap bill; full SSH control.",
          "Bad: you are on-call for OS patches, disk fills, DDoS mitigation, and disaster recovery.",
        ],
      },
    ],
  },
  {
    id: "pitfalls",
    eyebrow: "Avoid pain",
    title: "Common production mistakes",
    blocks: [
      {
        type: "ul",
        items: [
          "Shipping plain-text ADMIN_PASSWORD in release mode — the API rejects it; use a bcrypt hash.",
          "Forgetting CORS after changing the frontend domain.",
          "Pointing NEXT_PUBLIC_API_URL at localhost in production builds.",
          "Relying on ephemeral disk for uploads you care about.",
          "Opening Postgres port 5432 to the world instead of private network + strong password.",
          "Mixing test and live Razorpay keys without noticing.",
        ],
      },
      {
        type: "callout",
        variant: "tip",
        title: "Monitoring",
        body:
          "At minimum, log errors and set uptime checks on /health and your home page. As you grow, add request tracing and alerting.",
      },
    ],
  },
  {
    id: "glossary",
    eyebrow: "Reference",
    title: "Short glossary",
    blocks: [
      {
        type: "ul",
        items: [
          "DNS — maps hostnames to IPs and mail/config records.",
          "TLS/HTTPS — encrypted HTTP; requires a certificate (usually free via Let’s Encrypt).",
          "Reverse proxy — nginx/Caddy/Vercel edge that forwards public traffic to your app process.",
          "PaaS — Platform as a Service; you bring code, they run containers or runtimes.",
          "IaaS — Infrastructure as a Service; raw VMs and networking (EC2 style).",
          "Blueprint / IaC — YAML (e.g. render.yaml) describing services so environments are reproducible.",
        ],
      },
    ],
  },
];
