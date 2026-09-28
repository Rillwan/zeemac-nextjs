'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export default function Counter({ value, suffix = '' }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const obj = { val: 0 };
    const trigger = ScrollTrigger.create({
      trigger: el,
      start: 'top 90%',
      once: true,
      onEnter: () => {
        gsap.to(obj, {
          val: value,
          duration: 1.6,
          ease: 'power2.out',
          onUpdate: () => {
            if (el) el.textContent = Math.floor(obj.val) + suffix;
          }
        });
      }
    });

    return () => trigger.kill();
  }, [value, suffix]);

  return <span className="stat-number" ref={ref}>0</span>;
}
