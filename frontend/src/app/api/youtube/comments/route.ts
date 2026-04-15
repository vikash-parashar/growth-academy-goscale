import { NextRequest, NextResponse } from "next/server";
import { PODCAST_YOUTUBE_COMMENTS } from "@/data/podcast-youtube-comments";
import type { PodcastYoutubeComment } from "@/data/podcast-youtube-comments";
import { formatYoutubeCommentTimeEn, stripYoutubeCommentHtml } from "@/lib/youtube-comments";
import { pickTopPositiveComments } from "@/lib/youtube-positive-rank";

type CommentSnippet = {
  authorDisplayName?: string;
  textDisplay?: string;
  textOriginal?: string;
  likeCount?: number;
  publishedAt?: string;
};

type CommentThreadItem = {
  snippet?: {
    topLevelComment?: {
      snippet?: CommentSnippet;
    };
  };
};

type ThreadsResponse = {
  items?: CommentThreadItem[];
  nextPageToken?: string;
};

function mapThreadsToComments(items: CommentThreadItem[]): PodcastYoutubeComment[] {
  const out: PodcastYoutubeComment[] = [];
  for (const item of items) {
    const s = item.snippet?.topLevelComment?.snippet;
    if (!s?.publishedAt) continue;
    const rawText = (s.textOriginal ?? stripYoutubeCommentHtml(s.textDisplay ?? "")).trim();
    if (!rawText) continue;
    const author = (s.authorDisplayName ?? "Viewer").trim();
    out.push({
      author,
      time: formatYoutubeCommentTimeEn(s.publishedAt),
      likes: typeof s.likeCount === "number" ? s.likeCount : 0,
      text: rawText,
    });
  }
  return out;
}

/**
 * Paginate official YouTube Data API `commentThreads` (top-level only).
 * Uses `order=time` so pagination can walk a large portion of the thread.
 * Internal youtubei/next + SAPISIDHASH is not used — it requires user session secrets and breaks often.
 */
async function fetchCommentThreadsPages(
  videoId: string,
  apiKey: string,
  maxPages: number
): Promise<CommentThreadItem[]> {
  const all: CommentThreadItem[] = [];
  let pageToken: string | undefined;

  for (let page = 0; page < maxPages; page++) {
    const url = new URL("https://www.googleapis.com/youtube/v3/commentThreads");
    url.searchParams.set("part", "snippet");
    url.searchParams.set("videoId", videoId);
    url.searchParams.set("maxResults", "100");
    url.searchParams.set("order", "time");
    url.searchParams.set("key", apiKey);
    if (pageToken) url.searchParams.set("pageToken", pageToken);

    const res = await fetch(url.toString(), {
      next: { revalidate: 3600 },
    });

    if (!res.ok) {
      if (page === 0) throw new Error(`YouTube API ${res.status}`);
      break;
    }

    const data = (await res.json()) as ThreadsResponse;
    const items = data.items ?? [];
    all.push(...items);
    pageToken = data.nextPageToken;
    if (!pageToken || items.length === 0) break;
  }

  return all;
}

export async function GET(request: NextRequest) {
  const videoId = request.nextUrl.searchParams.get("videoId")?.trim() || "S01YvWZVdHE";
  const top = Math.min(
    Math.max(parseInt(request.nextUrl.searchParams.get("top") ?? "20", 10) || 20, 1),
    50
  );
  const maxPages = Math.min(
    Math.max(parseInt(request.nextUrl.searchParams.get("maxPages") ?? "10", 10) || 10, 1),
    50
  );

  const apiKey = process.env.YOUTUBE_API_KEY?.trim();
  if (!apiKey) {
    return NextResponse.json({
      source: "static" as const,
      comments: PODCAST_YOUTUBE_COMMENTS.slice(0, top),
    });
  }

  try {
    const threads = await fetchCommentThreadsPages(videoId, apiKey, maxPages);
    const allMapped = mapThreadsToComments(threads);

    if (allMapped.length === 0) {
      return NextResponse.json({
        source: "static" as const,
        comments: PODCAST_YOUTUBE_COMMENTS.slice(0, top),
      });
    }

    const comments = pickTopPositiveComments(allMapped, top);

    return NextResponse.json({
      source: "live" as const,
      comments,
      meta: {
        scanned: allMapped.length,
        returned: comments.length,
      },
    });
  } catch (e) {
    console.error("YouTube comments fetch failed:", e);
    return NextResponse.json({
      source: "static" as const,
      comments: PODCAST_YOUTUBE_COMMENTS.slice(0, top),
    });
  }
}
