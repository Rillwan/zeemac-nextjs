'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import gsap from 'gsap';

const SEEN_KEY = 'zeemac-preloader-seen';

export default function Preloader() {
  const preloaderRef = useRef(null);
  const logoRef = useRef(null);
  const nameRef = useRef(null);
  const subRef = useRef(null);
  const barRef = useRef(null);
  const routeBarRef = useRef(null);
  const pathname = usePathname();
  const isFirstRun = useRef(true);

  // First visit of the session: the logo reveals, the waves drift, the name opens up, a line fills, then the screen lifts away.
  // Later visits in the same session (and visitors who prefer reduced motion) skip it.
  useEffect(() => {
    const el = preloaderRef.current;
    if (!el) return undefined;

    let seen = false;
    try {
      seen = window.sessionStorage.getItem(SEEN_KEY) === '1';
    } catch {
      seen = false;
    }
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const finish = () => {
      el.style.display = 'none';
      document.body.classList.add('loaded');
      window.dispatchEvent(new CustomEvent('zeemac:loaded'));
      try {
        window.sessionStorage.setItem(SEEN_KEY, '1');
      } catch {
        // storage blocked: the animation simply plays again next time
      }
    };

    if (seen || reduceMotion) {
      finish();
      return undefined;
    }

    let bob;
    const tl = gsap.timeline();

    tl.fromTo(
      logoRef.current,
      { clipPath: 'inset(0 100% 0 0)', scale: 0.9, opacity: 1 },
      { clipPath: 'inset(0 0% 0 0)', scale: 1, duration: 0.95, ease: 'power2.inOut' }
    )
      .add(() => {
        bob = gsap.to(logoRef.current, { y: -5, duration: 0.7, yoyo: true, repeat: -1, ease: 'sine.inOut' });
      })
      .fromTo(
        nameRef.current,
        { opacity: 0, y: 10, letterSpacing: '0.5em' },
        { opacity: 1, y: 0, letterSpacing: '0.14em', duration: 0.65, ease: 'power3.out' },
        '-=0.35'
      )
      .fromTo(subRef.current, { opacity: 0 }, { opacity: 1, duration: 0.5, ease: 'power2.out' }, '-=0.35')
      .to(barRef.current, { width: '100%', duration: 0.9, ease: 'power1.inOut' }, '-=0.6')
      .to(
        el,
        {
          yPercent: -100,
          duration: 0.8,
          ease: 'power3.inOut',
          onStart: () => {
            if (bob) bob.kill();
          },
          onComplete: finish
        },
        '+=0.2'
      );

    return () => {
      if (bob) bob.kill();
      tl.revert();
    };
  }, []);

  // Moving between pages: a thin progress line across the top instead of a full screen
  useEffect(() => {
    if (isFirstRun.current) {
      isFirstRun.current = false;
      return;
    }
    const bar = routeBarRef.current;
    if (!bar) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    gsap.killTweensOf(bar);
    gsap
      .timeline()
      .fromTo(bar, { width: '0%', opacity: 1 }, { width: '100%', duration: 0.5, ease: 'power2.out' })
      .to(bar, { opacity: 0, duration: 0.3 });
  }, [pathname]);

  return (
    <>
      <div id="preloader" ref={preloaderRef} aria-hidden="true" suppressHydrationWarning>
        <div className="preloader-inner">
          <div className="preloader-logo" ref={logoRef}>
            <Image src="/images/logo.png" alt="" width={132} height={106} priority />
          </div>
          <p className="preloader-name" ref={nameRef}>ZEEMAC</p>
          <p className="preloader-sub" ref={subRef}>FILTERS</p>
          <div className="preloader-bar">
            <span ref={barRef}></span>
          </div>
        </div>
      </div>
      {/* Hides the loader before the first paint when it has already played in this browser session */}
      <script
        dangerouslySetInnerHTML={{
          __html:
            "try{if(sessionStorage.getItem('" +
            SEEN_KEY +
            "')==='1'){var p=document.getElementById('preloader');if(p)p.style.display='none';}}catch(e){}"
        }}
      />
      <noscript>
        <style>{'#preloader{display:none!important}'}</style>
      </noscript>
      <div className="route-progress" ref={routeBarRef} aria-hidden="true" />
    </>
  );
}