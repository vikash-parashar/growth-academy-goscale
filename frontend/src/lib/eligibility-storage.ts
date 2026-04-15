/** Client-only: user passed eligibility before accessing /apply form. */
const KEY = "goscale_apply_eligible_v1";

export function isApplyEligible(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return window.localStorage.getItem(KEY) === "1";
  } catch {
    return false;
  }
}

export function setApplyEligible(): void {
  try {
    window.localStorage.setItem(KEY, "1");
  } catch {
    /* ignore quota / private mode */
  }
}

export function clearApplyEligible(): void {
  try {
    window.localStorage.removeItem(KEY);
    window.localStorage.removeItem(SITUATION_PREFILL_KEY);
  } catch {
    /* ignore */
  }
}

const SITUATION_PREFILL_KEY = "goscale_situation_prefill_v1";

export function setSituationPrefill(value: string): void {
  try {
    window.localStorage.setItem(SITUATION_PREFILL_KEY, value);
  } catch {
    /* ignore */
  }
}

export function getSituationPrefill(): string {
  if (typeof window === "undefined") return "";
  try {
    return window.localStorage.getItem(SITUATION_PREFILL_KEY) ?? "";
  } catch {
    return "";
  }
}
