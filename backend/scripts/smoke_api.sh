#!/usr/bin/env bash
# Exercise public + admin endpoints against a running API (default http://localhost:8080).
# Requires: curl, jq, PostgreSQL reachable (server must already be running with valid JWT_SECRET / admin creds).
set -euo pipefail

BASE="${API_BASE:-http://localhost:8080}"
USER="${ADMIN_USERNAME:-admin}"
PASS="${ADMIN_PASSWORD:-admin123}"

echo "== health"
curl -fsS "$BASE/health" | jq .

echo "== announcements"
curl -fsS "$BASE/api/public/announcements" | jq .

echo "== consultation config"
curl -fsS "$BASE/api/public/consultation/config" | jq .

echo "== consultation availability"
curl -fsS "$BASE/api/public/consultation/availability?days=3" | jq .

echo "== login"
TOKEN="$(curl -fsS -X POST "$BASE/api/auth/login" \
  -H 'Content-Type: application/json' \
  -d "{\"username\":\"$USER\",\"password\":\"$PASS\"}" | jq -r .token)"
if [[ -z "$TOKEN" || "$TOKEN" == "null" ]]; then
  echo "login failed" >&2
  exit 1
fi

echo "== leads list (admin)"
curl -fsS "$BASE/api/leads" -H "Authorization: Bearer $TOKEN" | jq .

echo "== create lead (public)"
LEAD_JSON="$(curl -fsS -X POST "$BASE/api/leads" \
  -H 'Content-Type: application/json' \
  -d '{
    "name":"Smoke Test User",
    "phone":"919876543210",
    "email":"smoke@example.com",
    "experience":"5 years backend",
    "salary":"20 LPA",
    "goal":"Switch to Go",
    "terms_accepted":true
  }')"
echo "$LEAD_JSON" | jq .
LEAD_ID="$(echo "$LEAD_JSON" | jq -r .id)"

echo "== appointments list (admin)"
curl -fsS "$BASE/api/admin/appointments" -H "Authorization: Bearer $TOKEN" | jq .

echo "== proofs public"
curl -fsS "$BASE/api/proofs" | jq .

echo "== proofs admin"
curl -fsS "$BASE/api/admin/proofs" -H "Authorization: Bearer $TOKEN" | jq .

echo "== payments admin"
curl -fsS "$BASE/api/admin/payments" -H "Authorization: Bearer $TOKEN" | jq .

echo "== employees list"
curl -fsS "$BASE/api/admin/employees" -H "Authorization: Bearer $TOKEN" | jq .

echo "== create employee"
EMP_JSON="$(curl -fsS -X POST "$BASE/api/admin/employees" \
  -H "Authorization: Bearer $TOKEN" \
  -H 'Content-Type: application/json' \
  -d '{
    "name":"Smoke Employee",
    "email":"emp@example.com",
    "phone":"919811122233",
    "role_title":"Engineer",
    "department":"Engineering",
    "monthly_salary_paise": 5000000,
    "start_date":"2025-01-15",
    "status":"active"
  }')"
echo "$EMP_JSON" | jq .
EMP_ID="$(echo "$EMP_JSON" | jq -r .id)"

echo "== get employee"
curl -fsS "$BASE/api/admin/employees/$EMP_ID" -H "Authorization: Bearer $TOKEN" | jq .

echo "== patch employee"
curl -fsS -X PATCH "$BASE/api/admin/employees/$EMP_ID" \
  -H "Authorization: Bearer $TOKEN" \
  -H 'Content-Type: application/json' \
  -d '{"incentives_notes":"smoke test"}' | jq .

echo "== employee payments list"
curl -fsS "$BASE/api/admin/employees/$EMP_ID/payments" -H "Authorization: Bearer $TOKEN" | jq .

echo "== record salary payment"
curl -fsS -X POST "$BASE/api/admin/employees/$EMP_ID/payments" \
  -H "Authorization: Bearer $TOKEN" \
  -H 'Content-Type: application/json' \
  -d '{"period_month":"2025-03-01","amount_paise":5000000,"incentive_paise":0,"notes":"March"}' | jq .

echo "== notifications broadcast (no SMTP/Twilio required — counts may be 0)"
curl -fsS -X POST "$BASE/api/admin/notifications/broadcast" \
  -H "Authorization: Bearer $TOKEN" \
  -H 'Content-Type: application/json' \
  -d '{"subject":"Smoke","message":"Hello from smoke test","channels":["email"],"audience":"new"}' | jq .

echo "== patch lead $LEAD_ID"
curl -fsS -X PATCH "$BASE/api/leads/$LEAD_ID" \
  -H "Authorization: Bearer $TOKEN" \
  -H 'Content-Type: application/json' \
  -d '{"status":"contacted","notes":"smoke"}' | jq .

echo "== create appointment (lead $LEAD_ID)"
SLOT="$(python3 -c 'from datetime import datetime, timedelta, timezone; print((datetime.now(timezone.utc)+timedelta(days=7)).strftime("%Y-%m-%dT%H:%M:%SZ"))')"
# RFC3339 UTC; Go time.Parse accepts trailing Z.
APPT_JSON="$(curl -fsS -X POST "$BASE/api/appointments" \
  -H 'Content-Type: application/json' \
  -d "{\"lead_id\":$LEAD_ID,\"datetime\":\"$SLOT\"}")"
echo "$APPT_JSON" | jq .
APPT_ID="$(echo "$APPT_JSON" | jq -r .id)"

echo "== patch appointment"
curl -fsS -X PATCH "$BASE/api/admin/appointments/$APPT_ID" \
  -H "Authorization: Bearer $TOKEN" \
  -H 'Content-Type: application/json' \
  -d '{"status":"accepted"}' | jq .

echo "== payments order (expects 400 if Razorpay not configured — OK for local)"
set +e
ORDER_RES="$(curl -sS -X POST "$BASE/api/payments/order" \
  -H 'Content-Type: application/json' \
  -d "{\"lead_id\":$LEAD_ID}")"
set -e
echo "$ORDER_RES" | jq . 2>/dev/null || echo "$ORDER_RES"

echo "OK — smoke script finished (check payment order line if Razorpay keys missing)."
