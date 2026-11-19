'use client';

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import gsap from 'gsap';
import { ArrowRight, ChevronLeft, ChevronRight, Maximize2, X } from 'lucide-react';
import { SHOWCASE_AUTOPLAY_MS } from '@/lib/brandShowcase';

const useIsoLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

function formatNumber(value) {
  return Number(value).toLocaleString('en-US');
}

function BrandLogo({ brand }) {
  if (!brand.logo) {
    return <span className="text-2xl font-extrabold text-brand-navy">{brand.name}</span>;
  }
  return (
    <div className="relative h-[60px] w-48 sm:h-[75px]">
      <Image
        src={brand.logo}
        alt={`${brand.name} logo`}
        fill
        sizes="300"
        className="object-contain object-left "
      />
    </div>
  );
}

export default function BrandShowcase({ brands = [], header = {}, autoplayMs = SHOWCASE_AUTOPLAY_MS }) {
  const total = brands.length;
  const rootRef = useRef(null);
  const railRef = useRef(null);
  const railInnerRef = useRef(null);
  const tabRefs = useRef([]);
  const dirRef = useRef(1);
  const touchRef = useRef(null);
  const zoomTriggerRef = useRef(null);
  const closeRef = useRef(null);

  const [index, setIndex] = useState(0);
  const [indicator, setIndicator] = useState({ x: 0, w: 0, ready: false });
  const [revealed, setRevealed] = useState(false);
  const [inView, setInView] = useState(false);
  const [mouseOver, setMouseOver] = useState(false);
  const [keyboardFocus, setKeyboardFocus] = useState(false);
  const [reduced, setReduced] = useState(false);
  const [zoomIndex, setZoomIndex] = useState(null);

  const goTo = useCallback(
    (target, dir) => {
      if (total === 0) return;
      const next = ((target % total) + total) % total;
      if (next === index) return;
      dirRef.current = dir ?? (next > index ? 1 : -1);
      setIndex(next);
    },
    [index, total]
  );

  const goNext = useCallback(() => goTo(index + 1, 1), [goTo, index]);
  const goPrev = useCallback(() => goTo(index - 1, -1), [goTo, index]);

  const paused = mouseOver || keyboardFocus || !inView || zoomIndex !== null;
  const autoplayOn = total > 1 && !reduced;

  useEffect(() => {
    setReduced(window.matchMedia('(prefers-reduced-motion: reduce)').matches);
    rootRef.current?.classList.add('bs-js');
  }, []);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return undefined;
    const observer = new IntersectionObserver(
      ([entry]) => {
        setInView(entry.isIntersecting);
        if (entry.isIntersecting) setRevealed(true);
      },
      { threshold: 0.2 }
    );
    observer.observe(root);
    return () => observer.disconnect();
  }, []);

  const measure = useCallback(() => {
    const tab = tabRefs.current[index];
    if (!tab) return;
    setIndicator({ x: tab.offsetLeft, w: tab.offsetWidth, ready: true });
  }, [index]);

  useIsoLayoutEffect(() => {
    measure();
  }, [measure]);

  useEffect(() => {
    const inner = railInnerRef.current;
    if (!inner) return undefined;
    const observer = new ResizeObserver(measure);
    observer.observe(inner);
    window.addEventListener('resize', measure);
    if (document.fonts?.ready) document.fonts.ready.then(measure);
    return () => {
      observer.disconnect();
      window.removeEventListener('resize', measure);
    };
  }, [measure]);

  useEffect(() => {
    const rail = railRef.current;
    const tab = tabRefs.current[index];
    if (!rail || !tab || rail.scrollWidth <= rail.clientWidth) return;
    rail.scrollTo({
      left: tab.offsetLeft - (rail.clientWidth - tab.offsetWidth) / 2,
      behavior: reduced ? 'auto' : 'smooth'
    });
  }, [index, reduced]);

  useEffect(() => {
    if (!revealed) return undefined;
    const root = rootRef.current;
    if (!root) return undefined;
    const items = root.querySelectorAll('[data-head] [data-anim]');
    if (reduced) {
      gsap.set(items, { opacity: 1, y: 0 });
      return undefined;
    }
    const tween = gsap.fromTo(
      items,
      { y: 28, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, stagger: 0.1, ease: 'power3.out' }
    );
    return () => {
      tween.kill();
    };
  }, [revealed, reduced]);

  useIsoLayoutEffect(() => {
    if (!revealed) return undefined;
    const root = rootRef.current;
    const slide = root?.querySelector(`[data-slide="${index}"]`);
    if (!slide) return undefined;

    const items = slide.querySelectorAll('[data-anim]');
    const image = slide.querySelector('[data-img]');
    const counters = slide.querySelectorAll('[data-count]');

    const finalCounters = () => {
      counters.forEach((el) => {
        el.textContent = `${el.dataset.prefix || ''}${formatNumber(el.dataset.count)}${el.dataset.suffix || ''}`;
      });
    };

    if (reduced) {
      gsap.set(items, { opacity: 1, y: 0 });
      if (image) gsap.set(image, { opacity: 1, x: 0, scale: 1 });
      finalCounters();
      return undefined;
    }

    const dir = dirRef.current;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        items,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.7, stagger: 0.08, delay: 0.15, ease: 'power3.out' }
      );
      if (image) {
        gsap.fromTo(
          image,
          { x: dir * 70, scale: 0.94, opacity: 0 },
          { x: 0, scale: 1, opacity: 1, duration: 0.95, delay: 0.1, ease: 'power3.out' }
        );
      }
      counters.forEach((el) => {
        const state = { value: 0 };
        const target = Number(el.dataset.count);
        gsap.to(state, {
          value: target,
          duration: 1.4,
          delay: 0.45,
          ease: 'power2.out',
          onUpdate: () => {
            el.textContent = `${el.dataset.prefix || ''}${formatNumber(Math.round(state.value))}${el.dataset.suffix || ''}`;
          },
          onComplete: finalCounters
        });
      });
    }, slide);

    return () => {
      ctx.kill();
    };
  }, [index, revealed, reduced]);

  useEffect(() => {
    if (zoomIndex === null) return undefined;
    closeRef.current?.focus();
    const onKey = (event) => {
      if (event.key === 'Escape') setZoomIndex(null);
    };
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('keydown', onKey);
      zoomTriggerRef.current?.focus();
    };
  }, [zoomIndex]);

  const onTabKeyDown = (event) => {
    let target = null;
    if (event.key === 'ArrowRight') target = index + 1;
    else if (event.key === 'ArrowLeft') target = index - 1;
    else if (event.key === 'Home') target = 0;
    else if (event.key === 'End') target = total - 1;
    if (target === null) return;
    event.preventDefault();
    const next = ((target % total) + total) % total;
    goTo(next, event.key === 'ArrowLeft' ? -1 : 1);
    tabRefs.current[next]?.focus();
  };

  const onTouchStart = (event) => {
    const touch = event.touches[0];
    touchRef.current = { x: touch.clientX, y: touch.clientY };
  };

  const onTouchEnd = (event) => {
    const start = touchRef.current;
    touchRef.current = null;
    if (!start) return;
    const touch = event.changedTouches[0];
    const dx = touch.clientX - start.x;
    const dy = touch.clientY - start.y;
    if (Math.abs(dx) < 50 || Math.abs(dx) < Math.abs(dy)) return;
    if (dx < 0) goNext();
    else goPrev();
  };

  if (total === 0) return null;

  const zoomBrand = zoomIndex !== null ? brands[zoomIndex] : null;

  return (
    <section
      id="brand-showcase"
      ref={rootRef}
      className="bs-root relative isolate overflow-hidden section-pad"
      aria-labelledby="bs-heading"
      onPointerEnter={(event) => {
        if (event.pointerType === 'mouse') setMouseOver(true);
      }}
      onPointerLeave={(event) => {
        if (event.pointerType === 'mouse') setMouseOver(false);
      }}
      onFocus={(event) => {
        if (event.target.matches(':focus-visible')) setKeyboardFocus(true);
      }}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setKeyboardFocus(false);
      }}
    >
      {brands.map((brand, i) => (
        <div
          key={`tint-${brand.id}`}
          className={`bs-tint ${i === index ? 'is-active' : ''}`}
          style={{
            background: `radial-gradient(60% 70% at 88% 45%, ${brand.tint} 0%, transparent 72%), radial-gradient(40% 50% at 0% 100%, ${brand.tint} 0%, transparent 70%)`
          }}
          aria-hidden="true"
        />
      ))}

      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div data-head className="mx-auto max-w-2xl text-center">
          <p data-anim className="section-eyebrow">
            {header.eyebrow}
          </p>
          <h2 data-anim id="bs-heading" className="section-title mt-3">
            {header.heading}
          </h2>
          {header.subtext && (
            <p data-anim className="mt-4 text-slate-500">
              {header.subtext}
            </p>
          )}
        </div>

        <div data-head className="mt-10 sm:mt-12">
          <div data-anim ref={railRef} className="bs-rail no-scrollbar">
            <div ref={railInnerRef} className="relative flex" role="tablist" aria-label="Brands we distribute" onKeyDown={onTabKeyDown}>
              <span
                className="bs-indicator"
                aria-hidden="true"
                style={{
                  width: indicator.w,
                  transform: `translateX(${indicator.x}px)`,
                  opacity: indicator.ready ? 1 : 0
                }}
              >
                {autoplayOn && (
                  <span className="bs-progress">
                    <span
                      key={`progress-${index}`}
                      className="bs-progress-fill"
                      style={{
                        animationDuration: `${autoplayMs}ms`,
                        animationPlayState: paused ? 'paused' : 'running'
                      }}
                      onAnimationEnd={goNext}
                    />
                  </span>
                )}
              </span>
              {brands.map((brand, i) => (
                <button
                  key={brand.id}
                  ref={(el) => {
                    tabRefs.current[i] = el;
                  }}
                  type="button"
                  role="tab"
                  id={`bs-tab-${brand.id}`}
                  aria-selected={i === index}
                  aria-controls={`bs-panel-${brand.id}`}
                  tabIndex={i === index ? 0 : -1}
                  className={`bs-tab ${!indicator.ready && i === index ? 'bs-tab-fallback' : ''}`}
                  onClick={() => goTo(i)}
                >
                  {brand.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-10 sm:mt-14" onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
          <div className="grid">
            {brands.map((brand, i) => {
              const active = i === index;
              return (
                <div
                  key={brand.id}
                  id={`bs-panel-${brand.id}`}
                  role="tabpanel"
                  aria-labelledby={`bs-tab-${brand.id}`}
                  data-slide={i}
                  aria-hidden={!active}
                  inert={!active}
                  className={`bs-slide ${active ? 'is-active' : ''}`}
                >
                  <div className="grid items-center gap-8 lg:grid-cols-[3fr_2fr] lg:gap-16">
                    <div className="order-2 lg:order-1">
                      <div data-anim>
                        <BrandLogo brand={brand} />
                      </div>
                      {brand.tagline && (
                        <p
                          data-anim
                          className="mt-6 text-base font-bold sm:text-lg"
                          style={{ color: brand.accent }}
                        >
                          {brand.tagline}
                        </p>
                      )}
                      <h3
                        data-anim
                        className="mt-3 text-3xl font-semibold leading-tight tracking-tight text-brand-navy sm:text-4xl lg:text-[2.6rem]"
                      >
                        {brand.title}
                      </h3>
                      <div className="mt-5 space-y-4 text-[0.95rem] leading-relaxed text-slate-600">
                        {brand.paragraphs.map((text, p) => (
                          <p data-anim key={p}>
                            {text}
                          </p>
                        ))}
                      </div>

                      {brand.highlights?.length > 0 && (
                        <dl data-anim className="mt-7 grid grid-cols-3 gap-3 sm:gap-5">
                          {brand.highlights.map((item, h) => (
                            <div
                              key={`${item.label}-${h}`}
                              className="border-l-2 pl-3 sm:pl-4"
                              style={{ borderColor: brand.accent }}
                            >
                              <dt
                                className="text-xl font-extrabold leading-tight sm:text-2xl"
                                style={{ color: brand.accent }}
                              >
                                {typeof item.value === 'number' ? (
                                  <span
                                    data-count={item.value}
                                    data-prefix={item.prefix || ''}
                                    data-suffix={item.suffix || ''}
                                  >
                                    {`${item.prefix || ''}${formatNumber(item.value)}${item.suffix || ''}`}
                                  </span>
                                ) : (
                                  item.text
                                )}
                              </dt>
                              <dd className="mt-1 text-xs font-medium text-slate-500 sm:text-sm">
                                {item.label}
                              </dd>
                            </div>
                          ))}
                        </dl>
                      )}

                      <div data-anim className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                        <Link
                          href={brand.productsLink || '/products'}
                          className="btn-primary w-full justify-center sm:w-auto"
                        >
                          Explore Products <ArrowRight className="h-4 w-4" />
                        </Link>
                        <Link
                          href={brand.quoteLink || '/contact'}
                          className="btn-outline w-full justify-center sm:w-auto"
                        >
                          Request a Quote
                        </Link>
                      </div>
                    </div>

                    <div className="order-1 lg:order-2">
                      <div data-img className="bs-image-card" style={{ '--bs-tint': brand.tint }}>
                        {brand.badge && (
                          <span className="bs-badge" style={{ '--bs-accent': brand.accent }}>
                            {brand.badge}
                          </span>
                        )}
                        <Image
                          src={brand.image}
                          alt={brand.imageAlt || `${brand.name} products`}
                          fill
                          sizes="(min-width: 1024px) 40vw, 100vw"
                          className="object-cover"
                          priority={i === 0}
                        />
                        <button
                          type="button"
                          className="bs-zoom"
                          onClick={(event) => {
                            zoomTriggerRef.current = event.currentTarget;
                            setZoomIndex(i);
                          }}
                        >
                          Closer Look <Maximize2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {total > 1 && (
          <div className="mt-10 flex items-center justify-center gap-4">
            <button
              type="button"
              aria-label="Previous brand"
              onClick={goPrev}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-brand-navy shadow-sm transition-colors hover:border-brand hover:bg-brand hover:text-white"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <div className="flex items-center gap-2">
              {brands.map((brand, i) => (
                <button
                  key={brand.id}
                  type="button"
                  aria-label={`Show ${brand.name}`}
                  aria-current={i === index}
                  onClick={() => goTo(i)}
                  className={`bs-dot ${i === index ? 'is-active' : ''}`}
                />
              ))}
            </div>
            <button
              type="button"
              aria-label="Next brand"
              onClick={goNext}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-brand-navy shadow-sm transition-colors hover:border-brand hover:bg-brand hover:text-white"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        )}
      </div>

      {zoomBrand && (
        <div
          className="bs-lightbox"
          role="dialog"
          aria-modal="true"
          aria-label={`${zoomBrand.name} image`}
          onClick={() => setZoomIndex(null)}
        >
          <button
            ref={closeRef}
            type="button"
            aria-label="Close image"
            className="bs-lightbox-close"
            onClick={() => setZoomIndex(null)}
          >
            <X className="h-5 w-5" />
          </button>
          <div className="bs-lightbox-frame" onClick={(event) => event.stopPropagation()}>
            <Image
              src={zoomBrand.image}
              alt={zoomBrand.imageAlt || `${zoomBrand.name} products`}
              width={1400}
              height={1100}
              sizes="90vw"
              className="h-auto max-h-[80vh] w-full object-contain"
            />
          </div>
        </div>
      )}
    </section>
  );
}
