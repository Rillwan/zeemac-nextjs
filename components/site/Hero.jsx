"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { SITE_CONTENT_DEFAULTS } from "@/lib/siteContentDefaults";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const AUTOPLAY_MS = 6500;
const DEFAULTS = SITE_CONTENT_DEFAULTS.hero;
const ANIMATED =
  ".eyebrow, .hero-title .char, [data-hero-text], [data-hero-actions], [data-hero-tagline], .hero-image-wrap";

const FALLBACK_SLIDE = {
  id: "default",
  eyebrow: DEFAULTS.eyebrow,
  heading: DEFAULTS.heading,
  headingLine2: DEFAULTS.headingLine2,
  description: DEFAULTS.body1,
  tagline: DEFAULTS.tagline,
  image: DEFAULTS.image,
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
function introTimeline(slide, direction) {
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

  add(".eyebrow", { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6 });
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
  add(
    "[data-hero-tagline]",
    { y: 20, opacity: 0 },
    { y: 0, opacity: 1, duration: 0.5 },
    "-=0.4",
  );
  add(
    ".hero-image-wrap",
    { scale: 0.92, opacity: 0, x: 50 * direction, y: 0 },
    { scale: 1, opacity: 1, x: 0, y: 0, duration: 0.9 },
    "-=0.6",
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

export default function Hero({ slides, brands = [] }) {
  const items = slides && slides.length > 0 ? slides : [FALLBACK_SLIDE];
  const count = items.length;

  const heroRef = useRef(null);
  const slideRefs = useRef([]);
  const currentRef = useRef(0);
  const busyRef = useRef(false);
  const touchStartX = useRef(null);

  const [current, setCurrent] = useState(0);
  const [ready, setReady] = useState(false);
  const [paused, setPaused] = useState(false);

  const goTo = useCallback(
    (target, direction = 1) => {
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

      gsap
        .timeline({
          onComplete: () => {
            busyRef.current = false;
          },
        })
        .add(outroTimeline(outSlide))
        .set(outSlide, { autoAlpha: 0 })
        .set(inSlide, { autoAlpha: 1 })
        .add(introTimeline(inSlide, direction));
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
      tl = introTimeline(first, 1);
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

    const timer = setTimeout(
      () => goTo(currentRef.current + 1, 1),
      AUTOPLAY_MS,
    );
    return () => clearTimeout(timer);
  }, [ready, paused, count, current, goTo]);

  // Parallax on the picture while scrolling
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.to(".hero-image-wrap", {
        yPercent: 8,
        ease: "none",
        scrollTrigger: {
          trigger: heroRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });
    }, heroRef);
    return () => ctx.revert();
  }, []);

  function handleTouchStart(e) {
    touchStartX.current = e.touches[0].clientX;
  }

  function handleTouchEnd(e) {
    if (touchStartX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    touchStartX.current = null;
    if (Math.abs(dx) < 50) return;
    if (dx < 0) {
      goTo(currentRef.current + 1, 1);
    } else {
      goTo(currentRef.current - 1, -1);
    }
  }

  return (
    <section
      className="hero relative pt-24 pb-8 sm:pt-28 sm:pb-20 lg:pt-40 lg:pb-12 overflow-hidden"
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
      <div className="max-w-7xl mx-auto px-6 lg:px-10 relative z-10">
        <div className="grid" aria-live={paused ? "polite" : "off"}>
          {items.map((slide, i) => {
            const Heading = i === 0 ? "h1" : "h2";
            const taglinePoints = (slide.tagline || "")
              .split(",")
              .map((t) => t.trim())
              .filter(Boolean);

            return (
              <div
                key={slide.id}
                ref={(el) => {
                  slideRefs.current[i] = el;
                }}
                className="col-start-1 row-start-1 grid lg:grid-cols-2 gap-6 md:gap-14 items-center"
                style={{ visibility: i === 0 ? "visible" : "hidden" }}
                role="group"
                aria-roledescription="slide"
                aria-label={`${i + 1} of ${count}`}
                aria-hidden={i === current ? undefined : true}
              >
                <div>
                  {/* {slide.eyebrow && <p className="eyebrow">{slide.eyebrow}</p>} */}
                  <Heading className="hero-title mt-4 text-4xl text-center md:text-start lg:text-6xl xl:text-7xl font-medium md:text-nowrap ">
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
                      className="mt-6 mx-auto md:ml-0 text-slate-600 text-center md:text-start text-[15px] md:text-lg max-w-md"
                      data-hero-text
                    >
                      {slide.description}
                    </p>
                  )}
                  {(slide.primaryButtonText || slide.secondaryButtonText) && (
                    <div
                      className="mt-8 flex items-center justify-center md:justify-start flex-wrap gap-4"
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
                          {slide.secondaryButtonText}
                        </a>
                      )}
                    </div>
                  )}
                  {taglinePoints.length > 0 && (
                    <div
                      className="hero-tagline mt-4 md:mt-8 justify-center md:justify-start"
                      data-hero-tagline
                    >
                      {taglinePoints.map((point) => (
                        <span key={point}>{point}</span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="relative">
                  <div className="hero-image-wrap relative aspect-[4/3.1]">
                    <Image
                      src={slide.image || DEFAULTS.image}
                      alt={slide.imageAlt || slide.heading}
                      fill
                      sizes="(min-width: 1024px) 50vw, 100vw"
                      priority={i === 0}
                      className="object-cover"
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {count > 1 && (
          <div className="relative z-10 mt-10 flex items-center gap-5">
            <button
              type="button"
              aria-label="Previous slide"
              onClick={() => goTo(currentRef.current - 1, -1)}
              className="w-11 h-11 rounded-full border border-slate-200 bg-white/70 flex items-center justify-center text-brand-navy hover:bg-brand hover:text-white hover:border-brand transition-colors"
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
                  onClick={() => goTo(i, i > currentRef.current ? 1 : -1)}
                  className={`h-2 rounded-full transition-all duration-300 ${i === current ? "w-8 bg-brand" : "w-2 bg-brand/30 hover:bg-brand/60"}`}
                />
              ))}
            </div>

            <button
              type="button"
              aria-label="Next slide"
              onClick={() => goTo(currentRef.current + 1, 1)}
              className="w-11 h-11 rounded-full border border-slate-200 bg-white/70 flex items-center justify-center text-brand-navy hover:bg-brand hover:text-white hover:border-brand transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}
        {brands.length > 0 && (
          <div className="relative z-10 mt-12 flex items-center justify-center md:justify-start flex-col md:flex-row gap-x-8 gap-y-4 border-t border-slate-200/70 pt-6">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-800">
              Brands we supply :
            </span>
            {brands.map((brand) => (
              <a
                key={brand.id}
                href={`/brands/${brand.slug}`}
                aria-label={brand.name}
                className="relative h-[50px] w-[150px]"
              >
                <Image
                  src={brand.logo}
                  alt={`${brand.name} logo`}
                  fill
                  sizes="96px"
                  className="object-contain"
                />
              </a>
            ))}
          </div>
        )}
      </div>
      <div className="hero-blob" aria-hidden="true"></div>
    </section>
  );
}
