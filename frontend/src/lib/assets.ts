const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080";

/** Backend serves `/uploads/...` from the API origin. */
export function uploadAssetUrl(relativePath: string): string {
  if (!relativePath) return "";
  if (relativePath.startsWith("http://") || relativePath.startsWith("https://")) return relativePath;
  return `${API_BASE.replace(/\/$/, "")}${relativePath.startsWith("/") ? "" : "/"}${relativePath}`;
}
