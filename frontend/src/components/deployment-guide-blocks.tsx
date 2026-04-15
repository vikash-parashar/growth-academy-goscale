"use client";

import type { GuideBlock, GuideCalloutVariant } from "@/data/deployment-guide-sections";

const calloutClass: Record<GuideCalloutVariant, string> = {
  info: "border-sky-300/80 bg-sky-50/90 text-slate-800 dark:border-sky-500/40 dark:bg-sky-950/35 dark:text-sky-100",
  tip: "border-emerald-300/80 bg-emerald-50/90 text-slate-800 dark:border-emerald-500/40 dark:bg-emerald-950/35 dark:text-emerald-100",
  caution: "border-amber-400/90 bg-amber-50/90 text-slate-900 dark:border-amber-500/45 dark:bg-amber-950/40 dark:text-amber-100",
};

function Block({ block }: { block: GuideBlock }) {
  switch (block.type) {
    case "p":
      return <p className="text-[0.9375rem] leading-relaxed text-slate-700 dark:text-slate-300">{block.text}</p>;
    case "h3":
      return (
        <h3 className="mt-6 text-base font-semibold tracking-tight text-slate-900 first:mt-0 dark:text-slate-100">
          {block.text}
        </h3>
      );
    case "ul":
      return (
        <ul className="list-disc space-y-2 pl-5 text-[0.9375rem] leading-relaxed text-slate-700 dark:text-slate-300">
          {block.items.map((item, idx) => (
            <li key={`${idx}-${item}`}>{item}</li>
          ))}
        </ul>
      );
    case "ol":
      return (
        <ol className="list-decimal space-y-2.5 pl-5 text-[0.9375rem] leading-relaxed text-slate-700 dark:text-slate-300">
          {block.items.map((item, idx) => (
            <li key={`${idx}-${item}`} className="pl-1">
              {item}
            </li>
          ))}
        </ol>
      );
    case "callout":
      return (
        <aside
          className={`rounded-xl border px-4 py-3 text-[0.9375rem] leading-relaxed shadow-sm ${calloutClass[block.variant]}`}
        >
          <p className="font-semibold text-slate-900 dark:text-white">{block.title}</p>
          <p className="mt-1.5 text-slate-700 dark:text-slate-200">{block.body}</p>
        </aside>
      );
    case "code":
      return (
        <pre className="overflow-x-auto rounded-xl border border-slate-200 bg-slate-950 px-4 py-3 text-left text-[0.8125rem] leading-relaxed text-slate-100 shadow-inner dark:border-slate-700">
          <code className="font-mono">{block.text}</code>
        </pre>
      );
    default: {
      const _never: never = block;
      return _never;
    }
  }
}

export function DeploymentGuideBlocks({ blocks }: { blocks: GuideBlock[] }) {
  return (
    <div className="space-y-4">
      {blocks.map((block, i) => (
        <Block key={i} block={block} />
      ))}
    </div>
  );
}
