"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import type { Photo } from "@/lib/mock-data/types";

const INTERVAL_MS = 5500;

export function HomeHeroCarousel({ photos }: { photos: Photo[] }) {
  const [active, setActive] = useState(0);
  const total = photos.length;

  useEffect(() => {
    if (total < 2) return;
    const timer = window.setInterval(
      () => setActive((value) => (value + 1) % total),
      INTERVAL_MS,
    );
    return () => window.clearInterval(timer);
  }, [total]);

  const current = photos[active];

  return (
    <div className="relative min-h-[360px] overflow-hidden bg-secondary sm:min-h-[450px] lg:min-h-0">
      {photos.map((photo, index) => (
        <Image
          key={photo.id}
          src={photo.url}
          alt={photo.caption}
          fill
          loading={index === 0 ? "eager" : "lazy"}
          sizes="(max-width: 1024px) 100vw, 50vw"
          className={`object-cover object-center transition-opacity duration-700 ${index === active ? "opacity-100" : "opacity-0"}`}
        />
      ))}
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#17342f]/80 to-transparent" />
      {current && (
        <div className="absolute inset-x-6 bottom-6 flex items-end justify-between gap-4 text-white sm:inset-x-9 sm:bottom-9">
          <p className="max-w-52 text-sm font-semibold leading-6">{current.caption}</p>
          <div className="flex items-center gap-3">
            {total > 1 && (
              <div className="flex gap-1.5">
                {photos.map((photo, index) => (
                  <button
                    key={photo.id}
                    type="button"
                    aria-label={`Tampilkan foto ${index + 1}`}
                    onClick={() => setActive(index)}
                    className={`h-1.5 w-5 ${index === active ? "bg-accent" : "bg-white/60"}`}
                  />
                ))}
              </div>
            )}
            <span className="rounded-full border border-white/60 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[.12em] tabular-nums">
              {String(active + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
