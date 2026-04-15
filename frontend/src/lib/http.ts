/** Shared HTTP helpers for the Go API (used by `lib/api` and `services/api`). */

import { isDummyToken } from "./dummy-auth";

export const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080";

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem("gsl_admin_token");
}

export type ApiRequestInit = RequestInit & { token?: string | null };

/** When using dummy admin token, return empty/success stubs so the dashboard UI loads without a backend. */
function dummyApiResponse<T>(path: string, method: string): T {
  const p = path.split("?")[0];

  if (method === "GET") {
    if (p.startsWith("/api/leads")) return { items: [] } as T;
    if (p.includes("/api/admin/appointments")) return { items: [] } as T;
    if (p.includes("/api/admin/proofs")) return { items: [] } as T;
    if (p.includes("/api/admin/payments")) return { items: [] } as T;
    if (p === "/api/admin/employees" || p.startsWith("/api/admin/employees?")) return { items: [] } as T;
    const empMatch = p.match(/^\/api\/admin\/employees\/(\d+)$/);
    if (empMatch) {
      const id = Number(empMatch[1]);
      return {
        id,
        employee_code: `GL-2025-${String(id).padStart(5, "0")}`,
        name: "Preview (dummy)",
        email: "preview@goscale.local",
        phone: "",
        role_title: "—",
        department: "—",
        experience: "",
        resume_url: "",
        monthly_salary_paise: 0,
        incentives_notes: "",
        start_date: new Date().toISOString(),
        end_date: null,
        status: "active",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      } as T;
    }
    const payList = p.match(/^\/api\/admin\/employees\/(\d+)\/payments$/);
    if (payList) return { items: [] } as T;
    if (p.includes("/api/public/announcements")) {
      return { fee_increase_percent: 0, fee_increase_days: 0, message: "" } as T;
    }
    if (p === "/api/public/consultation/config") {
      return {
        fee_rupees: "10000",
        timezone: "Asia/Kolkata",
        slot_minutes: 30,
        weekdays: "1,2,3,4,5",
        window_start_hm: [10, 0],
        window_end_hm: [18, 0],
        currency: "INR",
        call_description: "Dummy preview",
      } as T;
    }
    if (p.includes("/api/public/consultation/availability")) {
      return { slots: [] } as T;
    }
  }

  if (method === "PATCH" || method === "POST" || method === "DELETE") {
    if (p === "/api/public/consultation/reserve") {
      return {
        lead_id: 1,
        order_id: "dummy_order",
        amount_paise: 1000000,
        key_id: "dummy",
        slot_utc: new Date().toISOString(),
        fee_rupees: "10000",
      } as T;
    }
    if (p.includes("/api/leads")) return { ok: true } as T;
    if (p.includes("/api/admin/appointments")) return { ok: true } as T;
    if (p.includes("/api/admin/proofs")) {
      if (method === "POST") {
        return {
          id: 0,
          type: "preview",
          url: "",
          preview_url: "",
          unlocked: false,
          created_at: new Date().toISOString(),
        } as T;
      }
      return { ok: true } as T;
    }
    if (p.includes("/api/payments/verify")) return { ok: true } as T;
    if (p.includes("/api/payments/order")) {
      return { order_id: "dummy_order", amount_paise: 0, key_id: "dummy" } as T;
    }
    if (p.includes("/api/admin/employees")) {
      if (method === "POST" && p.endsWith("/employees")) {
        return {
          id: 0,
          employee_code: "PREVIEW",
          name: "Preview",
          email: "",
          phone: "",
          role_title: "",
          department: "",
          experience: "",
          resume_url: "",
          monthly_salary_paise: 0,
          incentives_notes: "",
          start_date: new Date().toISOString(),
          end_date: null,
          status: "active",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        } as T;
      }
      if (p.includes("/payments") && method === "POST") {
        return {
          id: 0,
          employee_id: 0,
          period_month: new Date().toISOString(),
          amount_paise: 0,
          incentive_paise: 0,
          notes: "",
          created_at: new Date().toISOString(),
        } as T;
      }
      if (p.includes("/resume")) {
        return {
          id: 0,
          employee_code: "PREVIEW",
          name: "Preview",
          email: "",
          phone: "",
          role_title: "",
          department: "",
          experience: "",
          resume_url: "/dummy",
          monthly_salary_paise: 0,
          incentives_notes: "",
          start_date: new Date().toISOString(),
          end_date: null,
          status: "active",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        } as T;
      }
      return { ok: true } as T;
    }
    if (p.includes("/api/admin/notifications/broadcast")) {
      return { email_sent: 0, sms_sent: 0, whatsapp_sent: 0, errors: [] } as T;
    }
    return { ok: true } as T;
  }

  throw new Error(`Dummy mode: unhandled ${method} ${path}`);
}

export async function apiRequest<T>(path: string, init?: ApiRequestInit): Promise<T> {
  const method = (init?.method ?? "GET").toUpperCase();
  const t = init?.token === undefined ? getToken() : init.token;
  if (isDummyToken(t)) {
    return dummyApiResponse<T>(path, method);
  }

  const headers: HeadersInit = {
    Accept: "application/json",
    ...(init?.headers ?? {}),
  };
  if (t) {
    (headers as Record<string, string>)["Authorization"] = `Bearer ${t}`;
  }
  if (init?.body && typeof init.body === "string" && !("Content-Type" in (init.headers ?? {}))) {
    (headers as Record<string, string>)["Content-Type"] = "application/json";
  }

  const res = await fetch(`${API_BASE}${path}`, { ...init, headers });
  const reqId = res.headers.get("x-request-id");
  const text = await res.text();
  let data: unknown = null;
  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = { raw: text };
    }
  }
  if (!res.ok) {
    const err = (data as { error?: string })?.error ?? res.statusText;
    const base = typeof err === "string" ? err : res.statusText;
    const msg = reqId ? `${base} (request ${reqId})` : base;
    throw new Error(msg);
  }
  return data as T;
}
