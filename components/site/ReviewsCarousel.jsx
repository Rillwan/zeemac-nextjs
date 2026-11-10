'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, ExternalLink, Star } from 'lucide-react';
import GoogleIcon from '@/components/site/GoogleIcon';

const AUTOPLAY_MS = 5000;

function Stars({ rating }) {
  return (
    <span className="inline-flex items-center gap-0.5" role="img" aria-label={`${rating} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <Star
          key={n}
          className={`w-4 h-4 ${n <= rating ? 'fill-amber-400 text-amber-400' : 'fill-slate-200 text-slate-200'}`}
        />
      ))}
    </span>
  );
}

function ReviewCard({ review, href }) {
  const Tag = href ? 'a' : 'div';
  const linkProps = href
    ? {
        href,
        target: '_blank',
        rel: 'noopener noreferrer',
        'aria-label': `Read ${review.authorName}'s review on Google (opens in a new tab)`
      }
    : {};

  return (
    <Tag className="review-card" {...linkProps}>
      <div className="flex items-center justify-between">
        <Stars rating={review.rating} />
        <GoogleIcon className="w-5 h-5" />
      </div>

      {review.text && <p className="review-text">{review.text}</p>}

      <div className="review-card-footer">
        <span className="review-avatar">
          {review.authorPhoto ? (
            <Image src={review.authorPhoto} alt="" fill sizes="44px" className="object-cover" />
          ) : (
            review.authorName.charAt(0).toUpperCase()
          )}
        </span>
        <span className="min-w-0 flex-1">
          <span className="block truncate text-sm font-semibold text-brand-navy">{review.authorName}</span>
          {review.dateLabel && <span className="block text-xs text-slate-500">{review.dateLabel}</span>}
        </span>
        {href && <ExternalLink className="w-4 h-4 shrink-0 text-slate-300" />}
      </div>
    </Tag>
  );
}

export default function ReviewsCarousel({ reviews, fallbackUrl }) {
  const trackRef = useRef(null);
  const [perView, setPerView] = useState(1);
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  const maxIndex = Math.max(0, reviews.length - perView);

  useEffect(() => {
    const lg = window.matchMedia('(min-width: 1024px)');
    const sm = window.matchMedia('(min-width: 640px)');
    const update = () => setPerView(lg.matches ? 3 : sm.matches ? 2 : 1);
    update();
    lg.addEventListener('change', update);
    sm.addEventListener('change', update);
    return () => {
      lg.removeEventListener('change', update);
      sm.removeEventListener('change', update);
    };
  }, []);

  const stepWidth = () => {
    const first = trackRef.current ? trackRef.current.firstElementChild : null;
    return first ? first.getBoundingClientRect().width : 0;
  };

  const goTo = useCallback(
    (target) => {
      const el = trackRef.current;
      if (!el) return;
      const next = Math.min(Math.max(target, 0), maxIndex);
      el.scrollTo({ left: next * stepWidth(), behavior: 'smooth' });
      setIndex(next);
    },
    [maxIndex]
  );

  function handleScroll() {
    const el = trackRef.current;
    const step = stepWidth();
    if (!el || !step) return;
    setIndex(Math.min(maxIndex, Math.round(el.scrollLeft / step)));
  }

  // Auto-slide: moves on every few seconds, goes back to the first review at the end,
  // stops while the visitor hovers, touches or focuses the slider, or prefers reduced motion
  useEffect(() => {
    if (paused || maxIndex === 0) return undefined;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;

    const timer = setTimeout(() => goTo(index >= maxIndex ? 0 : index + 1), AUTOPLAY_MS);
    return () => clearTimeout(timer);
  }, [paused, maxIndex, index, goTo]);

  const pages = maxIndex + 1;

  return (
    <div
      role="region"
      aria-roledescription="carousel"
      aria-label="Customer reviews"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget)) setPaused(false);
      }}
      onTouchStart={() => setPaused(true)}
      onTouchEnd={() => setPaused(false)}
    >
      <div
        ref={trackRef}
        onScroll={handleScroll}
        className="no-scrollbar -mx-2 flex snap-x snap-mandatory items-stretch overflow-x-auto"
      >
        {reviews.map((review) => (
          <div key={review.id} className="shrink-0 basis-full snap-start px-2 py-2 sm:basis-1/2 lg:basis-1/3">
            <ReviewCard review={review} href={review.url || fallbackUrl} />
          </div>
        ))}
      </div>

      {maxIndex > 0 && (
        <div className="mt-6 flex items-center justify-center gap-4">
          <button type="button" className="review-arrow" aria-label="Previous review" onClick={() => goTo(index <= 0 ? maxIndex : index - 1)}>
            <ChevronLeft className="w-5 h-5" />
          </button>

          {pages <= 10 ? (
            <div className="flex items-center gap-2">
              {Array.from({ length: pages }, (_, i) => (
                <button
                  key={i}
                  type="button"
                  aria-label={`Go to review ${i + 1}`}
                  aria-current={i === index ? 'true' : undefined}
                  onClick={() => goTo(i)}
                  className={`h-2 rounded-full transition-all duration-300 ${i === index ? 'w-8 bg-brand' : 'w-2 bg-brand/30 hover:bg-brand/60'}`}
                />
              ))}
            </div>
          ) : (
            <span className="min-w-[3.5rem] text-center text-sm font-medium text-slate-500">
              {index + 1} / {pages}
            </span>
          )}

          <button type="button" className="review-arrow" aria-label="Next review" onClick={() => goTo(index >= maxIndex ? 0 : index + 1)}>
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  );
}
