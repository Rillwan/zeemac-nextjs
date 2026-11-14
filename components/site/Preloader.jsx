'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import gsap from 'gsap';

function SplitLine({ text, className }) {
  return (
    <p className={`pl-line ${className}`} aria-hidden="true">
      {text.split('').map((char, i) => (
        <span key={i} className="pl-char">
          {char}
        </span>
      ))}
    </p>
  );
}

export default function Preloader() {
  const rootRef = useRef(null);
  const logoRef = useRef(null);
  const busyRef = useRef(false);
  const timerRef = useRef(null);
  const pathname = usePathname();
  const prevPathRef = useRef(pathname);
  const router = useRouter();

  const getChars = () =>
    rootRef.current ? Array.from(rootRef.current.querySelectorAll('.pl-char')) : [];
  const reduceMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Hides the screen and tells Hero / OfferPopup that the page may start its own animation
  const finish = () => {
    window.clearTimeout(timerRef.current);
    if (rootRef.current) gsap.set(rootRef.current, { visibility: 'hidden' });
    busyRef.current = false;
    document.body.classList.add('loaded');
    window.dispatchEvent(new CustomEvent('zeemac:loaded'));
  };

  // Screen slides up from the bottom, then the letters rise one by one
  const coverIn = () =>
    new Promise((resolve) => {
      const el = rootRef.current;
      if (!el) {
        resolve();
        return;
      }
      gsap.killTweensOf([el, logoRef.current, ...getChars()]);
      gsap.set(el, { visibility: 'visible', yPercent: 100 });
      gsap.set(getChars(), { yPercent: 110, opacity: 1 });
      gsap.set(logoRef.current, { opacity: 0, y: 12 });
      gsap
        .timeline({ onComplete: resolve })
        .to(el, { yPercent: 0, duration: 0.55, ease: 'power3.inOut' })
        .to(logoRef.current, { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' }, '-=0.15')
        .to(getChars(), { yPercent: 0, duration: 0.6, ease: 'power4.out', stagger: 0.04 }, '-=0.3');
    });

  // Letters leave upward, then the whole screen lifts away
  const revealOut = (hold = 0.15) => {
    const el = rootRef.current;
    if (!el) {
      finish();
      return;
    }
    gsap
      .timeline({ onComplete: finish })
      .to(getChars(), { yPercent: -110, duration: 0.45, ease: 'power3.in', stagger: 0.025 }, hold)
      .to(logoRef.current, { opacity: 0, duration: 0.25, ease: 'power1.in' }, hold)
      .to(el, { yPercent: -100, duration: 0.7, ease: 'power3.inOut' }, '-=0.1');
  };

  // A) Full page load / refresh
  useEffect(() => {
    const el = rootRef.current;
    if (!el) return undefined;
    if (reduceMotion()) {
      finish();
      return undefined;
    }
    busyRef.current = true;
    gsap.set(el, { yPercent: 0, visibility: 'visible' });
    gsap.set(getChars(), { yPercent: 110, opacity: 1 });
    gsap.set(logoRef.current, { opacity: 0, y: 12 });

    const tl = gsap.timeline({ onComplete: () => revealOut(0.45) });
    tl.to(logoRef.current, { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }).to(
      getChars(),
      { yPercent: 0, duration: 0.7, ease: 'power4.out', stagger: 0.05 },
      '-=0.2'
    );

    return () => {
      tl.kill();
    };
  }, []);

  // B) Clicking an internal link to another page: cover first, then navigate
  useEffect(() => {
    const onClick = (e) => {
      if (e.defaultPrevented || e.button !== 0) return;
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = e.target instanceof Element ? e.target.closest('a[href]') : null;
      if (!a || a.target === '_blank' || a.hasAttribute('download')) return;

      let url;
      try {
        url = new URL(a.href, window.location.href);
      } catch {
        return;
      }
      if (url.origin !== window.location.origin) return;
      if (/^\/(admin|api|uploads)(\/|$)/.test(url.pathname)) return;
      if (url.pathname === window.location.pathname) return;
      if (reduceMotion()) return;

      e.preventDefault();
      e.stopPropagation();
      if (busyRef.current) return;

      busyRef.current = true;
      document.body.classList.remove('loaded');
      window.clearTimeout(timerRef.current);
      // Safety: never leave the visitor stuck behind the screen
      timerRef.current = window.setTimeout(() => revealOut(0.1), 8000);
      coverIn().then(() => router.push(url.pathname + url.search + url.hash));
    };

    document.addEventListener('click', onClick, true);
    return () => document.removeEventListener('click', onClick, true);
  }, [router]);

  // C) The new page is ready: reveal it (also covers browser back / forward)
  useEffect(() => {
    if (prevPathRef.current === pathname) return;
    prevPathRef.current = pathname;

    if (reduceMotion()) {
      finish();
      return;
    }
    const el = rootRef.current;
    if (!el) return;

    if (!busyRef.current) {
      busyRef.current = true;
      document.body.classList.remove('loaded');
      gsap.killTweensOf([el, logoRef.current, ...getChars()]);
      gsap.set(el, { visibility: 'visible', yPercent: 0 });
      gsap.set(getChars(), { yPercent: 0, opacity: 1 });
      gsap.set(logoRef.current, { opacity: 1, y: 0 });
    }
    revealOut(0.15);
  }, [pathname]);

  return (
    <>
      <div id="preloader" ref={rootRef} aria-hidden="true" suppressHydrationWarning>
        <div className="preloader-inner">
          <div className="preloader-logo" ref={logoRef}>
            <Image src="/images/logo.png" alt="" width={132} height={106} priority />
          </div>
          <SplitLine text="ZEEMAC" className="pl-name" />
          <SplitLine text="FILTERS" className="pl-sub" />
        </div>
      </div>
      <noscript>
        <style>{'#preloader{display:none!important}'}</style>
      </noscript>
    </>
  );
}
