"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import gsap from "gsap";
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Globe,
  Headset,
  ShieldCheck,
  Truck,
} from "lucide-react";
import { SITE_CONTENT_DEFAULTS } from "@/lib/siteContentDefaults";

const AUTOPLAY_MS = 6500;
const DEFAULTS = SITE_CONTENT_DEFAULTS.hero;
const ANIMATED =
  ".hero-eyebrow, .hero-title .char, [data-hero-text], [data-hero-actions]";

const TRUST_ITEMS = [
  { icon: ShieldCheck, label: ["Genuine", "Manufacturers"] },
  { icon: Truck, label: ["Wide Product", "Range"] },
  { icon: Headset, label: ["Technical", "Support"] },
  { icon: Globe, label: ["Global Supply", "Network"] },
];

const FALLBACK_SLIDE = {
  id: "default",
  eyebrow: DEFAULTS.eyebrow,
  heading: DEFAULTS.heading,
  headingLine2: DEFAULTS.headingLine2,
  description: DEFAULTS.body1,
  image: DEFAULTS.image,
  mobileImage: null,
  imageAlt: DEFAULTS.imageAlt,
  primaryButtonText: "Explore Products",
  primaryButtonLink: "/products",
  secondaryButtonText: "Request a Quote",
  secondaryButtonLink: "#contact",
};

function SplitHeadline({ text, className = "" }) {
  if (!text) return null;
  const words = text.split(" ");
  return (
    <span className={`split-text block ${className}`}>
      {words.map((word, wi) => (
        <span
          key={wi}
          className="word"
          style={{ display: "inline-block", whiteSpace: "nowrap" }}
        >
          {word.split("").map((char, ci) => (
            <span key={ci} className="char">
              {char}
            </span>
          ))}
          {wi < words.length - 1 ? "\u00A0" : ""}
        </span>
      ))}
    </span>
  );
}

// Plays a slide's entrance. fromTo with explicit values means it always starts
// from the same state, whatever a previous outro left behind.
function introTimeline(slide) {
  const q = gsap.utils.selector(slide);
  const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

  const add = (selector, from, to, position) => {
    const targets = q(selector);
    if (!targets.length) return;
    tl.fromTo(
      targets,
      from,
      to,
      position && tl.duration() > 0 ? position : undefined,
    );
  };

  add(
    ".hero-eyebrow",
    { y: 20, opacity: 0 },
    { y: 0, opacity: 1, duration: 0.6 },
  );
  add(
    ".hero-title .char",
    { y: 46, opacity: 0, rotateX: 40 },
    { y: 0, opacity: 1, rotateX: 0, duration: 0.7, stagger: 0.02 },
    "-=0.3",
  );
  add(
    "[data-hero-text]",
    { y: 20, opacity: 0 },
    { y: 0, opacity: 1, duration: 0.6 },
    "-=0.35",
  );
  add(
    "[data-hero-actions]",
    { y: 20, opacity: 0 },
    { y: 0, opacity: 1, duration: 0.6 },
    "-=0.4",
  );

  return tl;
}

function outroTimeline(slide) {
  return gsap.to(slide.querySelectorAll(ANIMATED), {
    opacity: 0,
    y: -16,
    duration: 0.3,
    ease: "power2.in",
  });
}

export default function Hero({ slides }) {
  const items = slides && slides.length > 0 ? slides : [FALLBACK_SLIDE];
  const count = items.length;

  const heroRef = useRef(null);
  const slideRefs = useRef([]);
  const bgRefs = useRef([]);
  const currentRef = useRef(0);
  const busyRef = useRef(false);
  const touchStartX = useRef(null);

  const [current, setCurrent] = useState(0);
  const [ready, setReady] = useState(false);
  const [paused, setPaused] = useState(false);

  const goTo = useCallback(
    (target) => {
      if (busyRef.current) return;
      const from = currentRef.current;
      const to = ((target % count) + count) % count;
      if (to === from) return;

      const outSlide = slideRefs.current[from];
      const inSlide = slideRefs.current[to];
      if (!outSlide || !inSlide) return;

      busyRef.current = true;
      currentRef.current = to;
      setCurrent(to);

      // Background picture: old one fades out while the new one fades in and settles
      const outBg = bgRefs.current[from];
      const inBg = bgRefs.current[to];
      if (outBg) {
        gsap.to(outBg, {
          autoAlpha: 0,
          duration: 1.1,
          ease: "power1.inOut",
        });
      }
      if (inBg) {
        gsap.fromTo(
          inBg,
          { autoAlpha: 0, scale: 1.06 },
          { autoAlpha: 1, scale: 1, duration: 1.4, ease: "power2.out" },
        );
      }

      gsap
        .timeline({
          onComplete: () => {
            busyRef.current = false;
          },
        })
        .add(outroTimeline(outSlide))
        .set(outSlide, { autoAlpha: 0 })
        .set(inSlide, { autoAlpha: 1 })
        .add(introTimeline(inSlide));
    },
    [count],
  );

  // First slide: hidden until the preloader finishes, then plays its entrance
  useEffect(() => {
    const first = slideRefs.current[0];
    if (!first) return undefined;

    const targets = first.querySelectorAll(ANIMATED);
    gsap.set(targets, { opacity: 0 });

    let tl;
    const start = () => {
      tl = introTimeline(first);
      setReady(true);
    };

    if (document.body.classList.contains("loaded")) {
      start();
    } else {
      window.addEventListener("zeemac:loaded", start, { once: true });
    }

    return () => {
      window.removeEventListener("zeemac:loaded", start);
      if (tl) tl.kill();
      gsap.set(targets, { clearProps: "all" });
    };
  }, []);

  // Autoplay: restarts after every change, stops while hovered/focused or when the visitor prefers reduced motion
  useEffect(() => {
    if (!ready || paused || count < 2) return undefined;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches)
      return undefined;

    const timer = setTimeout(() => goTo(currentRef.current + 1), AUTOPLAY_MS);
    return () => clearTimeout(timer);
  }, [ready, paused, count, current, goTo]);

  function handleTouchStart(e) {
    touchStartX.current = e.touches[0].clientX;
  }

  function handleTouchEnd(e) {
    if (touchStartX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    touchStartX.current = null;
    if (Math.abs(dx) < 50) return;
    if (dx < 0) {
      goTo(currentRef.current + 1);
    } else {
      goTo(currentRef.current - 1);
    }
  }

  return (
    <section
      className="hero relative overflow-hidden flex flex-col min-h-[100svh] lg:h-[100svh] lg:min-h-[640px] lg:max-h-[1000px]"
      id="home"
      ref={heroRef}
      aria-roledescription="carousel"
      aria-label="Featured highlights"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget)) setPaused(false);
      }}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Background pictures: one per slide, cross-fading.
          Phones use the mobile picture (or the desktop one if none was uploaded), desktop uses the wide picture. */}
      <div className="absolute inset-0 z-0" aria-hidden="true">
        {items.map((slide, i) => {
          const desktopSrc = slide.image || DEFAULTS.image;
          const mobileSrc = slide.mobileImage || desktopSrc;
          return (
            <div
              key={slide.id}
              ref={(el) => {
                bgRefs.current[i] = el;
              }}
              className="absolute inset-0"
              style={{
                visibility: i === 0 ? "visible" : "hidden",
                opacity: i === 0 ? 1 : 0,
              }}
            >
              <picture>
                <source media="(min-width: 1024px)" srcSet={desktopSrc} />
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={mobileSrc}
                  alt=""
                  loading={i === 0 ? "eager" : "lazy"}
                  fetchPriority={i === 0 ? "high" : "auto"}
                  decoding="async"
                  className="absolute inset-0 h-full w-full object-cover object-[78%_bottom] lg:object-[75%_center]"
                />
              </picture>
            </div>
          );
        })}
        {/* Readability gradients: top on phones, left on desktop */}
        <div className="absolute inset-x-0 top-0 h-[58%] bg-gradient-to-b from-white/90 via-white/55 to-transparent lg:hidden" />
        <div className="absolute inset-y-0 left-0 w-[64%] bg-gradient-to-r from-white via-white/75 to-transparent hidden lg:block" />
      </div>

      {/* White Gradient Overlay */}
      <div className="absolute lg:hidden inset-0 z-[1] bg-gradient-to-b from-white via-white/60 via-10% to-transparent" />

      <div className="relative z-10 flex flex-1 flex-col w-full max-w-7xl mx-auto px-6 lg:px-10 pt-[88px] sm:pt-24 xl:pt-[104px] pb-6 lg:pb-7">
        <div
          className="grid flex-1 content-start lg:content-center"
          aria-live={paused ? "polite" : "off"}
        >
          {items.map((slide, i) => {
            const Heading = i === 0 ? "h1" : "h2";

            return (
              <div
                key={slide.id}
                ref={(el) => {
                  slideRefs.current[i] = el;
                }}
                className="col-start-1 row-start-1 self-start lg:self-center"
                style={{ visibility: i === 0 ? "visible" : "hidden" }}
                role="group"
                aria-roledescription="slide"
                aria-label={`${i + 1} of ${count}`}
                aria-hidden={i === current ? undefined : true}
              >
                <div className="lg:max-w-2xl">
                  {slide.eyebrow && (
                    <p className="hero-eyebrow max-w-[16rem] sm:max-w-none leading-relaxed">
                      {slide.eyebrow}
                    </p>
                  )}
                  <Heading className="hero-title mt-3 lg:mt-4 text-[2.2rem] leading-[1.12] sm:text-5xl lg:text-[clamp(2.4rem,7vh,3.6rem)] font-semibold text-start">
                    <SplitHeadline
                      text={slide.heading}
                      className="text-brand-navy"
                    />
                    <SplitHeadline
                      text={slide.headingLine2}
                      className="text-brand"
                    />
                  </Heading>
                  {slide.description && (
                    <p
                      className="mt-4 lg:mt-5 text-black text-start text-[15px] lg:text-base xl:text-lg max-w-sm sm:max-w-md"
                      data-hero-text
                    >
                      {slide.description}
                    </p>
                  )}
                  {(slide.primaryButtonText || slide.secondaryButtonText) && (
                    <div
                      className="mt-6 lg:mt-7 flex flex-col items-start sm:flex-row sm:items-center gap-3 sm:gap-4"
                      data-hero-actions
                    >
                      {slide.primaryButtonText && (
                        <a
                          href={slide.primaryButtonLink || "#"}
                          className="btn-primary"
                        >
                          {slide.primaryButtonText}{" "}
                          <ArrowRight className="w-4 h-4" />
                        </a>
                      )}
                      {slide.secondaryButtonText && (
                        <a
                          href={slide.secondaryButtonLink || "#"}
                          className="btn-outline"
                        >
                          {slide.secondaryButtonText}{" "}
                          <ArrowRight className="w-4 h-4" />
                        </a>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom row: trust strip (left, tablet/desktop) and slider controls */}
        <div className="mt-auto pt-6 flex items-end justify-center lg:justify-between gap-6">
          <div className="hidden md:flex items-center w-fit rounded-2xl bg-white/80 backdrop-blur px-6 py-3">
            {TRUST_ITEMS.map(({ icon: Icon, label }) => (
              <div key={label[0]} className="trust-item">
                <Icon className="w-6 h-6 text-brand shrink-0" />
                <span>
                  {label[0]}
                  <br />
                  {label[1]}
                </span>
              </div>
            ))}
          </div>

          {count > 1 && (
            <div className="flex items-center gap-4 md:ml-auto lg:ml-0">
              <button
                type="button"
                aria-label="Previous slide"
                onClick={() => goTo(currentRef.current - 1)}
                className="hidden lg:flex w-10 h-10 rounded-full border border-slate-200 bg-white/80 items-center justify-center text-brand-navy hover:bg-brand hover:text-white hover:border-brand transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-2">
                {items.map((slide, i) => (
                  <button
                    key={slide.id}
                    type="button"
                    aria-label={`Go to slide ${i + 1}`}
                    aria-current={i === current ? "true" : undefined}
                    onClick={() => goTo(i)}
                    className={`h-2 rounded-full transition-all duration-300 ${i === current ? "w-8 bg-brand" : "w-2 bg-brand/40 hover:bg-brand/60"}`}
                  />
                ))}
              </div>

              <button
                type="button"
                aria-label="Next slide"
                onClick={() => goTo(currentRef.current + 1)}
                className="hidden lg:flex w-10 h-10 rounded-full border border-slate-200 bg-white/80 items-center justify-center text-brand-navy hover:bg-brand hover:text-white hover:border-brand transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
