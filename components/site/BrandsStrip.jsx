'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const AUTOPLAY_MS = 3500;

export default function BrandsStrip({ brands = [] }) {
  const trackRef = useRef(null);
  const [paused, setPaused] = useState(false);

  const scrollPage = useCallback((dir) => {
    const el = trackRef.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    if (max <= 4) return;
    if (dir > 0 && el.scrollLeft >= max - 4) {
      el.scrollTo({ left: 0, behavior: 'smooth' });
      return;
    }
    if (dir < 0 && el.scrollLeft <= 4) {
      el.scrollTo({ left: max, behavior: 'smooth' });
      return;
    }
    el.scrollBy({ left: dir * el.clientWidth * 0.6, behavior: 'smooth' });
  }, []);

  useEffect(() => {
    if (paused || brands.length < 2) return undefined;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;
    const timer = setInterval(() => scrollPage(1), AUTOPLAY_MS);
    return () => clearInterval(timer);
  }, [paused, brands.length, scrollPage]);

  if (brands.length === 0) return null;

  return (
    <section
      className="bg-white py-10 border-b border-slate-100"
      aria-label="Trusted brands we supply"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget)) setPaused(false);
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
        <p className="text-center text-xs font-bold uppercase tracking-[0.25em] text-brand mb-6">
          Trusted Brands We Supply
        </p>

        <div className="flex items-center gap-2 sm:gap-4">
          <button
            type="button"
            aria-label="Previous brands"
            onClick={() => scrollPage(-1)}
            className="w-9 h-9 shrink-0 rounded-full border border-slate-200 bg-white flex items-center justify-center text-brand-navy shadow-sm hover:bg-brand hover:text-white hover:border-brand transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <div ref={trackRef} className="no-scrollbar flex flex-1 min-w-0 overflow-x-auto snap-x snap-mandatory">
            {brands.map((brand) => (
              <div
                key={brand.id}
                className="shrink-0 basis-1/2 sm:basis-1/3 lg:basis-1/6 snap-start px-4 border-r border-slate-200 last:border-r-0"
              >
                <Link href={`/brands/${brand.slug}`} aria-label={brand.name} className="relative block h-12 w-full">
                  <Image
                    src={brand.logo}
                    alt={`${brand.name} logo`}
                    fill
                    sizes="(min-width: 1024px) 160px, 50vw"
                    className="object-contain"
                  />
                </Link>
              </div>
            ))}
          </div>

          <button
            type="button"
            aria-label="Next brands"
            onClick={() => scrollPage(1)}
            className="w-9 h-9 shrink-0 rounded-full border border-slate-200 bg-white flex items-center justify-center text-brand-navy shadow-sm hover:bg-brand hover:text-white hover:border-brand transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </section>
  );
}
