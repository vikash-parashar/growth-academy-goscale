import type { PodcastYoutubeComment } from "@/data/podcast-youtube-comments";

/** Lowercase tokens that usually indicate appreciation (English + common Roman Hindi). */
const POSITIVE_HINTS: string[] = [
  "inspiring",
  "inspiration",
  "amazing",
  "awesome",
  "great",
  "proud",
  "respect",
  "love",
  "best",
  "honest",
  "legend",
  "warrior",
  "hustle",
  "fighter",
  "rooting",
  "bless",
  "god bless",
  "commend",
  "motivat",
  "true man",
  "hats off",
  "salute",
  "keep it up",
  "waiting for part",
  "part 2",
  "opened my eyes",
  "truly",
  "super",
  "hero",
  "beacon",
  "hope",
  "grit",
  "resilien",
  "achieve",
  "congrat",
  "well done",
  "good man",
  "great man",
  "bhagwan",
  "kripa",
  "shandar",
  "bahut ach",
  "bhot ach",
  "lajawab",
  "dil se",
  "🙏",
  "❤",
  "👏",
  "🔥",
];

/** Phrases that often signal hostility toward the guest or the video (avoid penalizing “got scammed” story). */
const NEGATIVE_PHRASES: string[] = [
  "fake story",
  "paid actor",
  "this is fake",
  "totally fake",
  "scripted",
  "clickbait",
  "worst video",
  "hate this",
];

function scoreComment(c: PodcastYoutubeComment): number {
  const text = c.text.toLowerCase();
  let score = 0;

  // Engagement: likes dominate so highly-voted praise rises to the top.
  score += Math.min(c.likes, 500) * 3;

  for (const hint of POSITIVE_HINTS) {
    if (text.includes(hint)) score += 14;
  }

  for (const bad of NEGATIVE_PHRASES) {
    if (text.includes(bad)) score -= 120;
  }

  // Slight preference for substantive comments.
  const len = c.text.trim().length;
  if (len >= 80) score += 8;
  else if (len < 12) score -= 15;

  return score;
}

/**
 * Pick the top N comments by positivity + engagement score.
 * Filters out strongly negative scores unless nothing remains (caller may widen pool).
 */
export function pickTopPositiveComments(
  comments: PodcastYoutubeComment[],
  limit: number
): PodcastYoutubeComment[] {
  if (comments.length === 0) return [];

  const ranked = comments
    .map((c) => ({ c, score: scoreComment(c) }))
    .sort((a, b) => b.score - a.score);

  const positiveEnough = ranked.filter((r) => r.score > 0);
  const pool = positiveEnough.length >= limit ? positiveEnough : ranked;

  return pool.slice(0, limit).map((r) => r.c);
}
