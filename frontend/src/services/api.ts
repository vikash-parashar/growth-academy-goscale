/**
 * Dashboard / CRM integration with the Go backend (PostgreSQL-backed leads API).
 */
import { apiRequest, getToken } from "@/lib/http";

export type Lead = {
  id: number;
  name: string;
  phone: string;
  email: string;
  experience: string;
  salary: string;
  goal: string;
  status: string;
  notes: string;
  created_at: string;
  whatsapp_link?: string;
};

export type CreateLeadBody = {
  name: string;
  phone: string;
  email: string;
  experience: string;
  salary: string;
  goal: string;
  terms_accepted: boolean;
};

/** GET /api/leads — requires admin JWT (cookie/localStorage token). */
export async function fetchLeads(params: { status?: string; q?: string }): Promise<{ items: Lead[] }> {
  const q = new URLSearchParams();
  if (params.status && params.status !== "all") q.set("status", params.status);
  if (params.q) q.set("q", params.q);
  const suffix = q.toString() ? `?${q}` : "";
  return apiRequest<{ items: Lead[] }>(`/api/leads${suffix}`, { token: getToken() });
}

/** PATCH /api/leads/:id */
export async function updateLead(
  id: number,
  body: { status?: string; notes?: string },
): Promise<{ ok: boolean }> {
  return apiRequest<{ ok: boolean }>(`/api/leads/${id}`, {
    method: "PATCH",
    body: JSON.stringify(body),
    token: getToken(),
  });
}

/** POST /api/leads — public application form. */
export async function createLead(body: CreateLeadBody): Promise<Lead> {
  return apiRequest<Lead>("/api/leads", {
    method: "POST",
    body: JSON.stringify(body),
    token: "",
  });
}

/** --- Employees (HR / payroll) --- */

export type Employee = {
  id: number;
  employee_code: string;
  name: string;
  email: string;
  phone: string;
  role_title: string;
  department: string;
  experience: string;
  resume_url: string;
  monthly_salary_paise: number;
  incentives_notes: string;
  start_date: string;
  end_date?: string | null;
  status: string;
  created_at: string;
  updated_at: string;
};

export type EmployeeSalaryPayment = {
  id: number;
  employee_id: number;
  period_month: string;
  amount_paise: number;
  incentive_paise: number;
  notes: string;
  created_at: string;
};

export type CreateEmployeeBody = {
  name: string;
  email?: string;
  phone?: string;
  role_title?: string;
  department?: string;
  experience?: string;
  monthly_salary_paise: number;
  incentives_notes?: string;
  start_date: string;
  end_date?: string | null;
  status?: string;
};

export async function fetchEmployees(q?: string): Promise<{ items: Employee[] }> {
  const suffix = q ? `?q=${encodeURIComponent(q)}` : "";
  return apiRequest<{ items: Employee[] }>(`/api/admin/employees${suffix}`, { token: getToken() });
}

export async function createEmployee(body: CreateEmployeeBody): Promise<Employee> {
  return apiRequest<Employee>("/api/admin/employees", {
    method: "POST",
    body: JSON.stringify(body),
    token: getToken(),
  });
}

export async function getEmployee(id: number): Promise<Employee> {
  return apiRequest<Employee>(`/api/admin/employees/${id}`, { token: getToken() });
}

export async function patchEmployee(
  id: number,
  body: Record<string, unknown>,
): Promise<{ ok: boolean }> {
  return apiRequest<{ ok: boolean }>(`/api/admin/employees/${id}`, {
    method: "PATCH",
    body: JSON.stringify(body),
    token: getToken(),
  });
}

export async function uploadEmployeeResume(id: number, file: File): Promise<Employee> {
  const fd = new FormData();
  fd.set("file", file);
  return apiRequest<Employee>(`/api/admin/employees/${id}/resume`, {
    method: "POST",
    body: fd,
    token: getToken(),
  });
}

export async function listEmployeePayments(id: number): Promise<{ items: EmployeeSalaryPayment[] }> {
  return apiRequest<{ items: EmployeeSalaryPayment[] }>(`/api/admin/employees/${id}/payments`, {
    token: getToken(),
  });
}

export async function recordEmployeePayment(
  id: number,
  body: {
    period_month: string;
    amount_paise: number;
    incentive_paise?: number;
    notes?: string;
  },
): Promise<EmployeeSalaryPayment> {
  return apiRequest<EmployeeSalaryPayment>(`/api/admin/employees/${id}/payments`, {
    method: "POST",
    body: JSON.stringify(body),
    token: getToken(),
  });
}

/** GET /api/public/announcements — no auth */
export type PublicAnnouncements = {
  fee_increase_percent: number;
  fee_increase_days: number;
  message: string;
};

export async function fetchPublicAnnouncements(): Promise<PublicAnnouncements> {
  return apiRequest<PublicAnnouncements>("/api/public/announcements", { token: "" });
}

/** POST /api/admin/notifications/broadcast — email, sms, whatsapp to leads by audience */
export async function broadcastNotifications(body: {
  subject?: string;
  message: string;
  channels: string[];
  audience: string;
}): Promise<{ email_sent: number; sms_sent: number; whatsapp_sent: number; errors?: string[] }> {
  return apiRequest("/api/admin/notifications/broadcast", {
    method: "POST",
    body: JSON.stringify(body),
    token: getToken(),
  });
}
