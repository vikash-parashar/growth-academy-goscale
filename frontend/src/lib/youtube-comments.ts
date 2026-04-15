/** Strip HTML from YouTube API `textDisplay` when `textOriginal` is missing. */
export function stripYoutubeCommentHtml(html: string): string {
  return html
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .trim();
}

/** English relative time for comment `publishedAt` (ISO 8601). */
export function formatYoutubeCommentTimeEn(iso: string): string {
  const then = Date.parse(iso);
  if (Number.isNaN(then)) return "";
  const diffSec = Math.round((Date.now() - then) / 1000);
  const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });
  if (Math.abs(diffSec) < 60) return rtf.format(-diffSec, "second");
  const diffMin = Math.round(diffSec / 60);
  if (Math.abs(diffMin) < 60) return rtf.format(-diffMin, "minute");
  const diffHr = Math.round(diffMin / 60);
  if (Math.abs(diffHr) < 24) return rtf.format(-diffHr, "hour");
  const diffDay = Math.round(diffHr / 24);
  if (Math.abs(diffDay) < 7) return rtf.format(-diffDay, "day");
  const diffWeek = Math.round(diffDay / 7);
  if (Math.abs(diffWeek) < 5) return rtf.format(-diffWeek, "week");
  const diffMonth = Math.round(diffDay / 30);
  if (Math.abs(diffMonth) < 12) return rtf.format(-diffMonth, "month");
  const diffYear = Math.round(diffDay / 365);
  return rtf.format(-diffYear, "year");
}
