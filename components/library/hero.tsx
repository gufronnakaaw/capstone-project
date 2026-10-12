"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowDownRight, ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";
import type { Photo } from "@/lib/mock-data/types";

export function LibraryHero({ photos }: { photos: Photo[] }) {
  const [active, setActive] = useState(0);
  useEffect(() => {
    const timer = window.setInterval(
      () => setActive((value) => (value + 1) % Math.min(photos.length, 4)),
      5500,
    );
    return () => window.clearInterval(timer);
  }, [photos.length]);
  const current = photos[active];
  return (
    <section className="paper-grain overflow-hidden border-b ink-rule">
      <div className="mx-auto grid max-w-7xl lg:min-h-[640px] lg:grid-cols-[1.02fr_.98fr]">
        <div className="flex flex-col justify-between px-5 py-12 sm:px-8 lg:px-12 lg:py-16">
          <div>
            <p className="eyebrow">Perpustakaan Desa Pusakanagara</p>
            <h1 className="display-title mt-5 max-w-2xl text-5xl text-primary sm:text-6xl lg:text-7xl">
              Tempat cerita pulang dan tumbuh.
            </h1>
            <p className="mt-6 max-w-md text-base leading-7 text-muted-foreground">
              Lebih dari sekadar rak buku: ruang kecil untuk belajar, bertemu,
              dan saling menguatkan di desa.
            </p>
          </div>
          <div className="mt-9 flex flex-wrap gap-3">
            <Link
              href="/buku"
              className="inline-flex min-h-11 items-center gap-2 bg-primary px-5 text-sm font-extrabold text-primary-foreground"
            >
              Jelajahi koleksi <ArrowRight size={16} />
            </Link>
            <Link
              href="/dashboard"
              className="inline-flex min-h-11 items-center gap-2 border border-primary px-5 text-sm font-extrabold text-primary"
            >
              Masuk sebagai anggota <ArrowDownRight size={16} />
            </Link>
          </div>
        </div>
        <div className="relative min-h-[360px] overflow-hidden bg-primary">
          {photos.slice(0, 4).map((photo, index) => (
            <Image
              key={photo.id}
              src={photo.url}
              alt={photo.caption}
              fill
              loading={index === 0 ? "eager" : "lazy"}
              sizes="(max-width: 1024px) 100vw, 50vw"
              className={`object-cover transition-opacity duration-700 ${active === index ? "opacity-100" : "opacity-0"}`}
            />
          ))}
          <div className="absolute inset-0 bg-primary/25 mix-blend-multiply" />
          <div className="absolute inset-x-5 bottom-5 flex items-end justify-between text-primary-foreground sm:inset-x-7 sm:bottom-7">
            <p className="max-w-[200px] text-sm font-bold leading-5">
              {current?.caption}
            </p>
            <div className="flex gap-1.5">
              {photos.slice(0, 4).map((photo, index) => (
                <button
                  aria-label={`Tampilkan foto ${index + 1}`}
                  onClick={() => setActive(index)}
                  key={photo.id}
                  className={`h-1.5 w-8 ${active === index ? "bg-accent" : "bg-primary-foreground/60"}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
