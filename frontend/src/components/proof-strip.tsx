import { listProofsPublic } from "@/lib/api";

export const revalidate = 0;

export async function ProofStrip() {
  let items: Awaited<ReturnType<typeof listProofsPublic>>["items"] = [];
  try {
    const res = await listProofsPublic();
    items = res.items ?? [];
  } catch {
    items = [];
  }

  if (!items.length) {
    return (
      <GlassFallback
        title="Proof wall unlocks as we onboard cohorts"
        subtitle="Admin can upload salary screenshots, offer letters, and more — visitors see previews until unlocked."
      />
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((p) => (
        <figure key={p.id} className="glass glass-hover overflow-hidden rounded-2xl">
          <div className="relative aspect-video bg-slate-100 dark:bg-slate-950">
            {p.preview_url && (p.preview_url.endsWith(".mp4") || p.preview_url.endsWith(".webm")) ? (
              <video
                src={p.preview_url}
                className="h-full w-full object-cover opacity-95"
                muted
                playsInline
                loop
                preload="metadata"
              />
            ) : p.preview_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={p.preview_url} alt={p.type} className="h-full w-full object-cover opacity-95" />
            ) : (
              <div className="flex h-full items-center justify-center text-xs text-slate-500">No preview</div>
            )}
            {!p.unlocked ? (
              <div className="absolute inset-0 flex items-center justify-center bg-white/65 backdrop-blur-[2px] dark:bg-black/50">
                <span className="rounded-full border border-slate-200 bg-white/90 px-3 py-1.5 text-xs font-medium text-slate-700 shadow-sm dark:border-slate-600 dark:bg-slate-900/90 dark:text-slate-200">
                  Locked — full proof after unlock
                </span>
              </div>
            ) : null}
          </div>
          <figcaption className="px-4 py-3 text-sm text-slate-600 dark:text-slate-400">
            <span className="section-eyebrow block tracking-widest">
              {p.type}
            </span>
            {p.unlocked && p.url ? (
              <a
                href={p.url}
                className="mt-2 block font-medium text-brand-sunset hover:underline dark:text-brand-onDark"
                target="_blank"
                rel="noreferrer"
              >
                View full proof
              </a>
            ) : null}
          </figcaption>
        </figure>
      ))}
    </div>
  );
}

function GlassFallback({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="glass rounded-2xl p-8">
      <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{title}</p>
      <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">{subtitle}</p>
    </div>
  );
}
