"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useLanguage } from "@/contexts/language-context";
import { PODCAST_YOUTUBE_COMMENTS } from "@/data/podcast-youtube-comments";
import type { PodcastYoutubeComment } from "@/data/podcast-youtube-comments";

/** YouTube embed — loaded only after user clicks (no autoplay, no loop). */
const VIDEO_ID = "S01YvWZVdHE";
const EMBED_BASE = `https://www.youtube.com/embed/${VIDEO_ID}`;

export function PodcastFeature() {
  const [showPlayer, setShowPlayer] = useState(false);
  const [comments, setComments] = useState<PodcastYoutubeComment[]>([]);
  const [commentsSource, setCommentsSource] = useState<"live" | "static" | "loading">("loading");
  const { t } = useLanguage();

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(`/api/youtube/comments?videoId=${VIDEO_ID}&top=20&maxPages=10`);
        if (!res.ok) throw new Error("comments fetch failed");
        const data = (await res.json()) as { source: "live" | "static"; comments: PodcastYoutubeComment[] };
        if (cancelled) return;
        setComments(data.comments?.length ? data.comments : PODCAST_YOUTUBE_COMMENTS);
        setCommentsSource(data.source === "live" ? "live" : "static");
      } catch {
        if (!cancelled) {
          setComments(PODCAST_YOUTUBE_COMMENTS);
          setCommentsSource("static");
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="space-y-8">
      <p className="text-[0.9375rem] leading-relaxed text-slate-700 dark:text-slate-300">{t.podcastFeature.p1}</p>
      <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">{t.podcastFeature.p2}</p>

      {/* Video (~1/5 width on lg+) | Scrollable comments */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-5 lg:items-start lg:gap-6">
        {/* Left: compact video — one column ≈ 20% on large screens */}
        <div className="flex flex-col gap-3 lg:col-span-1">
          <div className="relative mx-auto w-full max-w-sm overflow-hidden rounded-2xl border border-slate-200 bg-slate-950 shadow-lg dark:border-white/10 lg:mx-0 lg:max-w-none">
            <div className="aspect-video w-full">
              {!showPlayer ? (
                <button
                  type="button"
                  onClick={() => setShowPlayer(true)}
                  className="group relative flex h-full w-full items-center justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-sunset focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-950"
                >
                  <Image
                    src={`https://img.youtube.com/vi/${VIDEO_ID}/hqdefault.jpg`}
                    alt=""
                    fill
                    className="object-cover opacity-90 transition group-hover:opacity-100"
                    sizes="(max-width: 1024px) min(100vw, 24rem), 20vw"
                  />
                  <span className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" aria-hidden />
                  <span className="relative z-10 flex flex-col items-center gap-2 px-2 text-center">
                    <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-[#ff0000] text-white shadow-xl ring-4 ring-white/40 transition group-hover:scale-105 dark:ring-red-500/30">
                      <PlayIcon className="ml-0.5 h-6 w-6" />
                    </span>
                    <span className="max-w-[10rem] text-[0.7rem] font-semibold leading-tight text-white drop-shadow-md sm:max-w-none sm:text-xs">
                      {t.podcastFeature.playLabel}
                    </span>
                  </span>
                </button>
              ) : (
                <iframe
                  title={t.podcastFeature.iframeTitle}
                  src={`${EMBED_BASE}?rel=0&modestbranding=1`}
                  className="h-full w-full"
                  allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="strict-origin-when-cross-origin"
                />
              )}
            </div>
          </div>
          <p className="text-xs leading-relaxed text-slate-500 dark:text-slate-500">{t.podcastFeature.footer}</p>
        </div>

        {/* Right: comments in a scrollable panel */}
        <div className="flex min-h-0 flex-col gap-3 lg:col-span-4">
          <div className="flex flex-wrap items-center gap-3">
            <h3 className="text-lg font-semibold tracking-tight text-slate-900 dark:text-slate-50">
              {t.podcastFeature.viewerCommentsTitle}
            </h3>
            {commentsSource === "live" ? (
              <span className="section-eyebrow-pill tracking-wide">
                {t.podcastFeature.commentsLiveBadge}
              </span>
            ) : null}
          </div>
          <p className="max-w-xl text-sm leading-relaxed text-slate-600 dark:text-slate-400">{t.podcastFeature.viewerCommentsNote}</p>

          <div
            className="flex min-h-0 flex-col rounded-2xl border border-slate-200/90 bg-slate-50/50 shadow-inner dark:border-white/10 dark:bg-slate-900/30"
            role="region"
            aria-label={t.podcastFeature.viewerCommentsTitle}
          >
            <div
              className="max-h-[min(70vh,560px)] overflow-y-auto overscroll-contain px-3 py-3 sm:px-4 sm:py-4 [scrollbar-gutter:stable]"
              tabIndex={0}
              aria-busy={commentsSource === "loading"}
              aria-live="polite"
            >
              {commentsSource === "loading" ? (
                <ul className="space-y-3">
                  <li className="sr-only">{t.podcastFeature.commentsLoading}</li>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <li key={i} className="h-28 animate-pulse rounded-xl border border-slate-200 bg-slate-100/80 dark:border-white/10 dark:bg-slate-800/50" />
                  ))}
                </ul>
              ) : (
                <ul className="space-y-3 pr-1">
                  {comments.map((c, idx) => (
                    <li key={`${c.author}-${idx}-${c.text.slice(0, 40)}`}>
                      <figure className="rounded-xl border border-slate-200/90 bg-white/90 p-3 shadow-sm dark:border-white/10 dark:bg-slate-900/50">
                        <blockquote className="text-[0.875rem] leading-relaxed text-slate-800 dark:text-slate-200">
                          <p className="whitespace-pre-wrap">{c.text}</p>
                        </blockquote>
                        <figcaption className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-1 border-t border-slate-200/80 pt-2.5 text-xs dark:border-white/10">
                          <span className="font-semibold text-slate-900 dark:text-slate-100">{c.author}</span>
                          <span className="text-slate-500 dark:text-slate-500" aria-hidden>
                            ·
                          </span>
                          <time className="text-slate-600 dark:text-slate-400">{c.time}</time>
                          <span className="ml-auto rounded-full bg-brand-sunset/15 px-2 py-0.5 text-[0.65rem] font-medium text-brand-berry dark:bg-brand-berry/30 dark:text-brand-onDarkStrong">
                            {c.likes.toLocaleString()} {t.podcastFeature.likesOnYoutube}
                          </span>
                        </figcaption>
                      </figure>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          <p className="text-xs text-slate-500 dark:text-slate-500">
            <a
              href={`https://www.youtube.com/watch?v=${VIDEO_ID}`}
              className="btn-social-youtube btn-social-pill-sm inline-flex font-medium no-underline"
              target="_blank"
              rel="noreferrer"
            >
              {t.podcastFeature.viewerCommentsFooterBeforeLink}
            </a>{" "}
            {t.podcastFeature.viewerCommentsFooterAfterLink}
          </p>
        </div>
      </div>
    </div>
  );
}

function PlayIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M8 5v14l11-7L8 5z" />
    </svg>
  );
}
