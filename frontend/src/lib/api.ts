import { API_BASE, apiRequest, getToken } from "@/lib/http";

export { getToken, API_BASE };
export { setToken, clearToken } from "./auth-token";

export type Appointment = {
  id: number;
  lead_id: number;
  datetime: string;
  status: string;
  created_at: string;
};

export type PublicProof = {
  id: number;
  type: string;
  preview_url: string;
  unlocked: boolean;
  url?: string;
  created_at: string;
};

export async function login(username: string, password: string) {
  return apiRequest<{ token: string }>("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({ username, password }),
    token: "",
  });
}

export async function listAppointments() {
  return apiRequest<{ items: Appointment[] }>("/api/admin/appointments", {
    token: getToken(),
  });
}

export async function createAppointment(body: { lead_id: number; datetime: string }) {
  return apiRequest<Appointment>("/api/appointments", {
    method: "POST",
    body: JSON.stringify(body),
  });
}

export type ConsultationConfig = {
  fee_rupees: string;
  timezone: string;
  slot_minutes: number;
  weekdays: string;
  window_start_hm: number[];
  window_end_hm: number[];
  currency: string;
  call_description: string;
};

export type ConsultationSlot = { start_utc: string };

export async function getConsultationConfig() {
  return apiRequest<ConsultationConfig>("/api/public/consultation/config");
}

export async function getConsultationAvailability(days = 14) {
  return apiRequest<{ slots: ConsultationSlot[] }>(`/api/public/consultation/availability?days=${days}`);
}

export type ReserveConsultationResult = {
  lead_id: number;
  order_id: string;
  amount_paise: number;
  key_id: string;
  slot_utc: string;
  fee_rupees: string;
};

export async function reserveConsultation(body: {
  name: string;
  phone: string;
  email: string;
  slot_utc: string;
}) {
  return apiRequest<ReserveConsultationResult>("/api/public/consultation/reserve", {
    method: "POST",
    body: JSON.stringify(body),
  });
}

export async function patchAppointment(id: number, status: string) {
  return apiRequest<{ ok: boolean }>(`/api/admin/appointments/${id}`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
    token: getToken(),
  });
}

export async function listProofsPublic() {
  const res = await fetch(`${API_BASE}/api/proofs`, {
    headers: { Accept: "application/json" },
    cache: "no-store",
  });
  if (!res.ok) throw new Error(await res.text());
  return (await res.json()) as { items: PublicProof[] };
}

export type AdminProof = PublicProof & { url: string; preview_url: string };

export async function listProofsAdmin() {
  return apiRequest<{ items: AdminProof[] }>("/api/admin/proofs", { token: getToken() });
}

export async function uploadProof(type: string, file: File, preview?: File) {
  const fd = new FormData();
  fd.set("type", type);
  fd.set("file", file);
  if (preview) fd.set("preview", preview);
  return apiRequest<AdminProof>("/api/admin/proofs", {
    method: "POST",
    body: fd,
    token: getToken(),
  });
}

export async function unlockProof(id: number, unlocked: boolean) {
  return apiRequest<{ ok: boolean }>(`/api/admin/proofs/${id}/unlock`, {
    method: "PATCH",
    body: JSON.stringify({ unlocked }),
    token: getToken(),
  });
}

export async function createPaymentOrder(lead_id: number, amount_rupees?: string) {
  return apiRequest<{ order_id: string; amount_paise: number; key_id: string }>(
    "/api/payments/order",
    {
      method: "POST",
      body: JSON.stringify({ lead_id, amount_rupees }),
    },
  );
}

export async function verifyPayment(payload: {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}) {
  return apiRequest<{ ok: boolean }>("/api/payments/verify", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export type AdminPayment = {
  id: number;
  lead_id: number;
  amount: number;
  status: string;
  payment_id: string;
  order_id: string;
  created_at: string;
};

export async function listPaymentsAdmin() {
  return apiRequest<{ items: AdminPayment[] }>("/api/admin/payments", {
    token: getToken(),
  });
}

declare global {
  interface Window {
    Razorpay?: new (opts: Record<string, unknown>) => { open: () => void };
  }
}

export function loadRazorpay(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (window.Razorpay) {
      resolve();
      return;
    }
    const s = document.createElement("script");
    s.src = "https://checkout.razorpay.com/v1/checkout.js";
    s.onload = () => resolve();
    s.onerror = () => reject(new Error("Failed to load Razorpay"));
    document.body.appendChild(s);
  });
}
