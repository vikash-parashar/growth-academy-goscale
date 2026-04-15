import { isApplyEligible } from "@/lib/eligibility-storage";

const MOCK_COMPLETED_KEY = "goscale_mock_test_completed_v1";
const LEGACY_ATTEMPTS_KEY = "goscale_mock_attempt_counts";

/** Call when the user submits a completed mock test (any track). */
export function setMockTestCompleted(): void {
  try {
    window.localStorage.setItem(MOCK_COMPLETED_KEY, "1");
  } catch {
    /* ignore */
  }
}

/** True if they finished at least one mock attempt (new flag or legacy attempt counts). */
export function hasCompletedMockTest(): boolean {
  if (typeof window === "undefined") return false;
  try {
    if (window.localStorage.getItem(MOCK_COMPLETED_KEY) === "1") return true;
    const raw = window.localStorage.getItem(LEGACY_ATTEMPTS_KEY);
    if (!raw) return false;
    const j = JSON.parse(raw) as { nonTechnical?: number; technical?: number };
    return (j.nonTechnical ?? 0) > 0 || (j.technical ?? 0) > 0;
  } catch {
    return false;
  }
}

/** Investment amounts may be shown only after eligibility + at least one mock test. */
export function canViewPricingFees(): boolean {
  return isApplyEligible() && hasCompletedMockTest();
}
