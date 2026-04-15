# Gopher Lab — Mentorship CRM

Production-oriented monorepo: **Next.js (App Router)** marketing + apply flows, **Golang (Gin)** API with **clean architecture**, **PostgreSQL** via `database/sql` + [`github.com/lib/pq`](https://github.com/lib/pq).

## Architecture

```
Visitor → Landing / Apply → Lead (POST /api/leads) → WhatsApp → Booking → Razorpay → Student
```

- **backend/** — `handler` → `service` → `repository` → `model`, JWT admin auth, Razorpay order + signature verify, SMTP notifications (mock/logs if unset), proof uploads on disk.
- **frontend/** — premium dark UI, `/apply`, `/book`, `/pay`, `/admin`, `/dashboard`.

## Prerequisites

- Go **1.22+**
- Node **18+** / npm

## Backend setup

**Local PostgreSQL** (example with Docker):

```bash
docker run --name gopherlab-pg -e POSTGRES_USER=goscale -e POSTGRES_PASSWORD=goscale -e POSTGRES_DB=gopher_lab -p 5432:5432 -d postgres:16-alpine
```

**API**

```bash
cd backend
cp .env.example .env
# Set DATABASE_URL, JWT_SECRET, optional Razorpay / SMTP / WhatsApp
go run ./cmd/server
```

API listens on `http://localhost:8080` by default. Tables are created automatically on startup (`internal/database/postgres.go`).

### Admin password (production)

When `GIN_MODE=release`, `ADMIN_PASSWORD` **must** be a bcrypt hash (plain text is rejected at config load). In development you may use a plain password.

## Frontend setup

```bash
cd frontend
cp .env.example .env.local
# NEXT_PUBLIC_API_URL must point to your API (Vercel → your VPS URL)
npm install
npm run dev
```

Open `http://localhost:3000`.

## Key HTTP routes (API)

| Method | Path | Auth |
|--------|------|------|
| POST | `/api/leads` | Public — terms required |
| POST | `/api/appointments` | Public |
| GET | `/api/proofs` | Public — locked proofs hide full URL |
| POST | `/api/auth/login` | Public |
| POST | `/api/payments/order` | Public — needs Razorpay env |
| POST | `/api/payments/verify` | Public |
| GET | `/api/leads` | JWT — list + `?status=` / `?q=` |
| PATCH | `/api/leads/:id` | JWT — body: `{ "status", "notes" }` |
| GET | `/api/admin/appointments` | JWT |
| PATCH | `/api/admin/appointments/:id` | JWT |
| GET/POST/PATCH | `/api/admin/proofs`, `/api/admin/proofs/:id/unlock` | JWT |

Legacy: `GET /appointments` (admin JWT) matches the original spec.

## Database

`DATABASE_URL` must be a PostgreSQL DSN (see `backend/.env.example`). Schema: `leads` matches the CRM spec; `appointments`, `payments`, and `proofs` use PostgreSQL types (`TIMESTAMPTZ`, `SERIAL`, etc.).

The dashboard loads leads through **`frontend/src/services/api.ts`** (`fetchLeads` → `GET /api/leads`, `updateLead` → `PATCH /api/leads/:id`).

## Deployment notes

- **Frontend:** Vercel — in the project settings set **Root Directory** to `frontend` (or connect the repo root and use `npm ci && npm run build`, which runs the workspace build). Set `NEXT_PUBLIC_API_URL` to your public API origin and `NEXT_PUBLIC_SITE_URL` to your production site URL (no trailing slash).
- **Backend:** Render/Railway/Fly (see `render.yaml`) or an Ubuntu VPS — run the Go binary or container behind TLS, point `DATABASE_URL` at managed PostgreSQL, persist `uploads/` or use object storage on ephemeral hosts, set `CORS_ORIGINS` to your frontend origin(s).
- **CI:** Pushes that touch `backend/**` run `.github/workflows/backend-ci.yml` (vet, build, Docker). Frontend workflow runs when `frontend/**` or root lockfile changes.
- **Secrets:** never commit `.env`; use platform secret managers in production.
- **In-app guide:** after deploy, open `/content/deployment` on the live site for a full hosting walkthrough.

## Razorpay

1. Create orders with test/live keys in `.env`.
2. Checkout uses `checkout.js` on `/pay?lead_id=`.
3. Server verifies `razorpay_signature` with HMAC-SHA256 **hex** (per Razorpay docs).

## License

Proprietary — Gopher Lab / Vikash Parashar.
