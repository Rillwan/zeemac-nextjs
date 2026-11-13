'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const AUTOPLAY_MS = 5000;

function Picture({ banner, eager, mobileFrame }) {
  const mobileSrc = banner.mobileImage || banner.image;
  // In a 4:3 phone frame a banner without a phone picture is shown whole instead of being cropped
  const fit = mobileFrame && !banner.mobileImage ? 'object-contain md:object-cover' : 'object-cover';

  return (
    <picture>
      <source media="(min-width: 768px)" srcSet={banner.image} />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={mobileSrc}
        alt={banner.alt}
        loading={eager ? 'eager' : 'lazy'}
        decoding="async"
        className={fit}
      />
    </picture>
  );
}

export default function BannerSlider({ banners, mobileFrame }) {
  const count = banners.length;
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const touchStartX = useRef(null);

  const goTo = useCallback((target) => setIndex(((target % count) + count) % count), [count]);

  // Auto-slide: restarts after every change; stops while hovered, touched or focused, or for visitors who prefer reduced motion
  useEffect(() => {
    if (count < 2 || paused) return undefined;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;
    const timer = setTimeout(() => goTo(index + 1), AUTOPLAY_MS);
    return () => clearTimeout(timer);
  }, [count, paused, index, goTo]);

  function handleTouchStart(e) {
    touchStartX.current = e.touches[0].clientX;
    setPaused(true);
  }

  function handleTouchEnd(e) {
    setPaused(false);
    if (touchStartX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    touchStartX.current = null;
    if (Math.abs(dx) < 50) return;
    goTo(dx < 0 ? index + 1 : index - 1);
  }

  return (
    <div
      className="banner-slider relative mx-auto w-full max-w-[1920px]"
      role="region"
      aria-roledescription="carousel"
      aria-label="Featured banners"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget)) setPaused(false);
      }}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div className="banner-frame" style={{ '--banner-ratio-sm': mobileFrame ? '4 / 3' : '3 / 1' }}>
        {banners.map((banner, i) => {
          const active = i === index;
          const external = /^https?:\/\//i.test(banner.link || '');
          return (
            <div
              key={banner.id}
              className={`banner-slide ${active ? 'is-active' : ''}`}
              role="group"
              aria-roledescription="slide"
              aria-label={`${i + 1} of ${count}`}
              aria-hidden={active ? undefined : true}
              inert={!active}
            >
              {banner.link ? (
                <a
                  href={banner.link}
                  {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                >
                  <Picture banner={banner} eager={i === 0} mobileFrame={mobileFrame} />
                </a>
              ) : (
                <Picture banner={banner} eager={i === 0} mobileFrame={mobileFrame} />
              )}
            </div>
          );
        })}
      </div>

      {count > 1 && (
        <>
          <button type="button" className="banner-arrow" style={{ left: 16 }} aria-label="Previous banner" onClick={() => goTo(index - 1)}>
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button type="button" className="banner-arrow" style={{ right: 16 }} aria-label="Next banner" onClick={() => goTo(index + 1)}>
            <ChevronRight className="w-5 h-5" />
          </button>

          <div className="banner-dots">
            {banners.map((banner, i) => (
              <button
                key={banner.id}
                type="button"
                aria-label={`Show banner ${i + 1}`}
                aria-current={i === index ? 'true' : undefined}
                onClick={() => goTo(i)}
                className={`h-2 rounded-full transition-all duration-300 ${i === index ? 'w-7 bg-brand' : 'w-2 bg-brand/35 hover:bg-brand/60'}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
