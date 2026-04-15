/**
 * Private YouTube lesson links — add rows as you publish.
 * Example: { id: "1", label: "Module 1 — Intro", url: "https://www.youtube.com/watch?v=..." }
 */
export type ContentYoutubeLink = {
  id: string;
  label: string;
  url: string;
};

export const CONTENT_YOUTUBE_LINKS: ContentYoutubeLink[] = [];
