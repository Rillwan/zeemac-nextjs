'use client';

import { useEffect } from 'react';
import gsap from 'gsap';

const SELECTOR = '.product-card, .category-tile, .why-card, .industry-card';

// One listener for every card on the site: lift, 3D tilt that follows the cursor, and a glow (styled in globals.css).
export default function CardEffects() {
  useEffect(() => {
    const canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!canHover || reduceMotion) return undefined;

    let active = null;
    const setters = new WeakMap();

    const getSetters = (card) => {
      let s = setters.get(card);
      if (!s) {
        s = {
          rx: gsap.quickTo(card, 'rotationX', { duration: 0.5, ease: 'power3.out' }),
          ry: gsap.quickTo(card, 'rotationY', { duration: 0.5, ease: 'power3.out' })
        };
        setters.set(card, s);
      }
      return s;
    };

    const enter = (card) => {
      card.classList.add('is-hovered');
      gsap.set(card, { transformPerspective: 900 });
      gsap.to(card, { y: -8, duration: 0.4, ease: 'power3.out', overwrite: 'auto' });
    };

    const leave = (card) => {
      card.classList.remove('is-hovered');
      const s = getSetters(card);
      s.rx(0);
      s.ry(0);
      gsap.to(card, { y: 0, duration: 0.5, ease: 'power3.out', overwrite: 'auto' });
    };

    const onMove = (e) => {
      const card = e.target instanceof Element ? e.target.closest(SELECTOR) : null;
      if (card !== active) {
        if (active) leave(active);
        active = card;
        if (card) enter(card);
      }
      if (!card) return;

      const rect = card.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width;
      const py = (e.clientY - rect.top) / rect.height;
      card.style.setProperty('--mx', `${px * 100}%`);
      card.style.setProperty('--my', `${py * 100}%`);

      const s = getSetters(card);
      s.ry((px - 0.5) * 10);
      s.rx((0.5 - py) * 10);
    };

    const reset = () => {
      if (active) leave(active);
      active = null;
    };

    document.addEventListener('pointermove', onMove, { passive: true });
    document.documentElement.addEventListener('pointerleave', reset);
    window.addEventListener('blur', reset);

    return () => {
      document.removeEventListener('pointermove', onMove);
      document.documentElement.removeEventListener('pointerleave', reset);
      window.removeEventListener('blur', reset);
      reset();
    };
  }, []);

  return null;
}
