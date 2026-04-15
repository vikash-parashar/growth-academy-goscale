"use client";

import Image from "next/image";

/** Raster mark (`public/gopher-lab-mark.png`) — square brand icon. Scales by height + max-width. */
const W = 1024;
const H = 1024;

export function LogoMark({ className }: { className?: string }) {
  const merged =
    className != null && String(className).trim() !== ""
      ? `object-contain object-left ${className}`
      : "h-9 w-auto max-w-[140px] object-contain object-left sm:h-10 sm:max-w-[160px]";

  return (
    <Image
      src="/gopher-lab-mark.png"
      alt="Gopher Lab"
      width={W}
      height={H}
      className={merged}
      sizes="(max-width: 640px) 96px, 128px"
      priority
    />
  );
}
