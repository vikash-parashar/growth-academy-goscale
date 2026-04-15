/**
 * Preview login when the Go API is unavailable (e.g. not deployed).
 * Not for production secrets — rotate if you ever expose this build publicly.
 */
export const DUMMY_ADMIN_USERNAME = "goscale_admin";
export const DUMMY_ADMIN_PASSWORD = "GoscalePreview2026!";

/** Stored in localStorage; apiRequest returns empty stubs when this token is set. */
export const DUMMY_ADMIN_TOKEN = "goscale_dummy_preview_v1";

export function isDummyToken(token: string | null | undefined): boolean {
  return token === DUMMY_ADMIN_TOKEN;
}
