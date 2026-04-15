/** Canonical site URL for metadata, sitemap, and OG tags (no trailing slash). */
export function getSiteUrl(): string {
  const raw = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  return raw.replace(/\/$/, "");
}
