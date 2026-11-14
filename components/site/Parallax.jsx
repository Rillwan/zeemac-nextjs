'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

// Moves its children vertically while the section scrolls through the screen.
// speed: how far (in % of its own height) it travels each way. Negative = opposite direction.
// scale: use above 1 for pictures that sit inside an overflow-hidden frame, so no gap shows.
// Do not put this on the same element as <Reveal>: wrap one inside the other.
export default function Parallax({ children, as: Tag = 'div', speed = 12, scale = 1, className = '', ...rest }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;

    const mm = gsap.matchMedia();
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      const amount = window.innerWidth < 768 ? speed * 0.5 : speed;
      gsap.fromTo(
        el,
        { yPercent: -amount, scale },
        {
          yPercent: amount,
          scale,
          ease: 'none',
          scrollTrigger: {
            trigger: el.parentElement || el,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 0.6
          }
        }
      );
    });

    return () => mm.revert();
  }, [speed, scale]);

  return (
    <Tag ref={ref} className={className} {...rest}>
      {children}
    </Tag>
  );
}
