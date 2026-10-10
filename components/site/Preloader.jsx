'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import gsap from 'gsap';

export default function Preloader() {
  const preloaderRef = useRef(null);
  const markRef = useRef(null);
  const textRef = useRef(null);
  const progressRef = useRef(null);
  const pathname = usePathname();
  const isFirstRun = useRef(true);

  // ആദ്യത്തെ page load — പൂർണ്ണമായ draw animation
  useEffect(() => {
    const preloader = preloaderRef.current;
    const mark = markRef.current;
    const text = textRef.current;
    const progress = progressRef.current;

    const tl = gsap.timeline();

    tl.to(mark, { strokeDashoffset: 0, duration: 1.1, ease: 'power2.inOut' })
      .to(text, { opacity: 1, y: -4, duration: 0.4, ease: 'power2.out' }, '-=0.4')
      .to(progress, { width: '100%', duration: 0.9, ease: 'power1.inOut' }, '-=0.5')
      .to(preloader, {
        yPercent: -100,
        duration: 0.8,
        ease: 'power3.inOut',
        onComplete: () => {
          preloader.style.display = 'none';
          document.body.classList.add('loaded');
          window.dispatchEvent(new CustomEvent('zeemac:loaded'));
        }
      }, '+=0.15');

    return () => tl.revert();
  }, []);

  // ഇനി മുതൽ ഉള്ള navigations (pathname മാറുമ്പോൾ) — ചെറിയ transition flash
  useEffect(() => {
    if (isFirstRun.current) {
      isFirstRun.current = false; // ആദ്യത്തെ load-ൽ ഇത് skip ചെയ്യുക, മുകളിലെ effect മതി
      return;
    }

    const preloader = preloaderRef.current;
    if (!preloader) return;

    preloader.style.display = 'flex';
    gsap.set(preloader, { yPercent: 0 });
    gsap.to(preloader, {
      yPercent: -100,
      duration: 0.6,
      ease: 'power3.inOut',
      delay: 0.35,
      onComplete: () => { preloader.style.display = 'none'; }
    });
  }, [pathname]);

  return (
    <div id="preloader" ref={preloaderRef} aria-hidden="true">
      <div className="preloader-inner">
        <svg width="72" height="72" viewBox="0 0 72 72" fill="none" xmlns="http://www.w3.org/2000/svg">
          <g ref={markRef} id="preloader-mark" strokeWidth="3">
            <circle cx="36" cy="36" r="26" />
            <circle cx="36" cy="36" r="6" />
            <path d="M36 10V22M36 50V62M10 36H22M50 36H62M17.5 17.5L25.8 25.8M46.2 46.2L54.5 54.5M54.5 17.5L46.2 25.8M25.8 46.2L17.5 54.5" />
          </g>
        </svg>
        <p className="preloader-text" ref={textRef}>Zeemac Filters</p>
        <div className="preloader-bar"><span id="preloader-progress" ref={progressRef}></span></div>
      </div>
    </div>
  );
}