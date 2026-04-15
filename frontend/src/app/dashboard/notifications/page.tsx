"use client";

import { useState } from "react";
import { FieldLabel, TextInput } from "@/components/admin/form-controls";
import { PageHeader } from "@/components/admin/page-header";
import { broadcastNotifications } from "@/services/api";

const CHANNELS = [
  { id: "email", label: "Email (SMTP)" },
  { id: "sms", label: "SMS (Twilio)" },
  { id: "whatsapp", label: "WhatsApp (Twilio)" },
] as const;

const AUDIENCES = [
  { value: "all", label: "All leads" },
  { value: "new", label: "Status: new" },
  { value: "contacted", label: "Status: contacted" },
  { value: "converted", label: "Status: converted" },
  { value: "rejected", label: "Status: rejected" },
] as const;

export default function NotificationsPage() {
  const [subject, setSubject] = useState("Gopher Lab — important update");
  const [message, setMessage] = useState("");
  const [audience, setAudience] = useState("all");
  const [email, setEmail] = useState(true);
  const [sms, setSms] = useState(false);
  const [wa, setWa] = useState(false);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);

  async function send() {
    const channels: string[] = [];
    if (email) channels.push("email");
    if (sms) channels.push("sms");
    if (wa) channels.push("whatsapp");
    if (channels.length === 0) {
      setErr("Select at least one channel.");
      return;
    }
    if (!message.trim()) {
      setErr("Message is required.");
      return;
    }
    setBusy(true);
    setErr(null);
    setResult(null);
    try {
      const res = await broadcastNotifications({
        subject: subject.trim(),
        message: message.trim(),
        channels,
        audience,
      });
      const parts = [
        `Email: ${res.email_sent}`,
        `SMS: ${res.sms_sent}`,
        `WhatsApp: ${res.whatsapp_sent}`,
      ];
      if (res.errors?.length) parts.push(`Warnings: ${res.errors.length}`);
      setResult(parts.join(" · "));
      if (res.errors?.length) setErr(res.errors.slice(0, 5).join(" | "));
    } catch (e: unknown) {
      setErr(e instanceof Error ? e.message : "Send failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <PageHeader
        title="Broadcast notifications"
        subtitle="Email, SMS, and WhatsApp to leads in your CRM. Configure SMTP and Twilio on the server."
      />

      <div className="admin-surface p-5 text-sm text-slate-600 dark:text-slate-400">
        <p className="font-medium text-slate-800 dark:text-slate-200">Server setup</p>
        <ul className="mt-2 list-inside list-disc space-y-1">
          <li>
            <strong className="text-slate-800 dark:text-slate-300">Email:</strong> SMTP_* and FROM_EMAIL in the API env.
          </li>
          <li>
            <strong className="text-slate-800 dark:text-slate-300">SMS / WhatsApp:</strong> TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_SMS_FROM,
            TWILIO_WHATSAPP_FROM (e.g. whatsapp:+14155238886).
          </li>
          <li>Applicants receive automatic SMS/WhatsApp acknowledgement when Twilio is configured.</li>
          <li>Booking create/update sends email + SMS + WhatsApp to the lead.</li>
        </ul>
      </div>

      {err ? <p className="text-sm text-red-600 dark:text-red-400">{err}</p> : null}
      {result ? (
        <p className="text-sm font-medium text-brand-berry dark:text-brand-onDark">{result}</p>
      ) : null}

      <div className="space-y-4">
        <div>
          <FieldLabel>Email subject</FieldLabel>
          <TextInput value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="Subject line" />
        </div>
        <div>
          <FieldLabel>Message</FieldLabel>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={6}
            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-brand-sunset/40 dark:border-white/[0.1] dark:bg-slate-950 dark:text-slate-100"
            placeholder="Live class start time, fee change, course duration…"
          />
        </div>
        <div>
          <FieldLabel>Audience</FieldLabel>
          <select
            value={audience}
            onChange={(e) => setAudience(e.target.value)}
            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 dark:border-white/[0.1] dark:bg-slate-950 dark:text-slate-100"
          >
            {AUDIENCES.map((a) => (
              <option key={a.value} value={a.value}>
                {a.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Channels</p>
          <div className="mt-2 flex flex-wrap gap-4">
            {CHANNELS.map((c) => (
              <label key={c.id} className="flex cursor-pointer items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
                <input
                  type="checkbox"
                  checked={c.id === "email" ? email : c.id === "sms" ? sms : wa}
                  onChange={(e) => {
                    if (c.id === "email") setEmail(e.target.checked);
                    if (c.id === "sms") setSms(e.target.checked);
                    if (c.id === "whatsapp") setWa(e.target.checked);
                  }}
                  className="rounded border-slate-300 text-brand-sunset focus:ring-brand-sunset dark:border-white/20"
                />
                {c.label}
              </label>
            ))}
          </div>
        </div>
        <button
          type="button"
          disabled={busy}
          onClick={() => void send()}
          className="btn-accent px-5 py-2.5 text-sm disabled:opacity-50"
        >
          {busy ? "Sending…" : "Send broadcast"}
        </button>
      </div>
    </div>
  );
}
