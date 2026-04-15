#!/usr/bin/env bash
# Smoke-test Gopher Lab API (run server separately or use short-lived server).
set -euo pipefail

BASE="${BASE_URL:-http://127.0.0.1:8080}"
# Use GLAB_* so generic ADMIN_EMAIL / ADMIN_PASSWORD in your shell do not override by accident.
ADMIN_USER="${GLAB_ADMIN_EMAIL:-gowithvikash@gmail.com}"
ADMIN_PASS="${GLAB_ADMIN_PASSWORD:-Vikash@9966}"

echo "== Health"
curl -sS "$BASE/health" | jq .

echo "== Announcements"
curl -sS "$BASE/api/public/announcements" | jq .

echo "== Consultation config"
curl -sS "$BASE/api/public/consultation/config" | jq .

echo "== Consultation availability (14 days)"
curl -sS "$BASE/api/public/consultation/availability" | jq '.slots | length'

echo "== Login"
TOKEN_JSON=$(curl -sS -X POST "$BASE/api/auth/login" \
  -H "Content-Type: application/json" \
  -d "{\"username\":\"$ADMIN_USER\",\"password\":\"$ADMIN_PASS\"}")
echo "$TOKEN_JSON" | jq .
TOKEN=$(echo "$TOKEN_JSON" | jq -r .token)

if [[ -z "$TOKEN" || "$TOKEN" == "null" ]]; then
  echo "Login failed; set GLAB_ADMIN_EMAIL / GLAB_ADMIN_PASSWORD or ensure DB seed + DATABASE_URL" >&2
  exit 1
fi

AUTH=( -H "Authorization: Bearer $TOKEN" )

echo "== Admin leads"
curl -sS "${AUTH[@]}" "$BASE/api/leads" | jq .

echo "== Admin appointments"
curl -sS "${AUTH[@]}" "$BASE/api/admin/appointments" | jq .

echo "== Admin proofs"
curl -sS "${AUTH[@]}" "$BASE/api/admin/proofs" | jq .

echo "== Admin payments"
curl -sS "${AUTH[@]}" "$BASE/api/admin/payments" | jq .

echo "== Admin employees"
curl -sS "${AUTH[@]}" "$BASE/api/admin/employees" | jq .

echo "== Public proofs"
curl -sS "$BASE/api/proofs" | jq .

echo "== Create lead (application form)"
LEAD_JSON=$(curl -sS -X POST "$BASE/api/leads" \
  -H "Content-Type: application/json" \
  -d '{
    "name":"Smoke Test User",
    "phone":"+91 9876543210",
    "email":"smoke.test@example.com",
    "experience":"5 years backend",
    "salary":"20 LPA",
    "goal":"US remote",
    "terms_accepted": true
  }')
echo "$LEAD_JSON" | jq .
LEAD_ID=$(echo "$LEAD_JSON" | jq -r .id)

echo "== Create appointment"
curl -sS -X POST "$BASE/api/appointments" \
  -H "Content-Type: application/json" \
  -d "{\"lead_id\":$LEAD_ID,\"datetime\":\"2099-01-15T10:30:00Z\"}" | jq .

echo "Smoke tests finished OK"
