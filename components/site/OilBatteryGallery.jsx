'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { BatteryCharging, Droplets, Wrench } from 'lucide-react';
import Reveal from '@/components/site/Reveal';
import Parallax from '@/components/site/Parallax';
import AccentText from '@/components/site/AccentText';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

// Captions and the scroll speed of each picture. The middle picture sits lower and drifts faster.
const SLOTS = [
  { icon: Droplets, caption: 'Engine Oils & Lubricants', note: 'Protection for every engine', speed: 8 },
  { icon: BatteryCharging, caption: 'Automotive & Industrial Batteries', note: 'Dependable power storage', speed: 18, lower: true },
  { icon: Wrench, caption: 'Expert Product Support', note: 'The right product for your equipment', speed: 8 }
];

export default function OilBatteryGallery({ images = [] }) {
  const gridRef = useRef(null);

  useEffect(() => {
    const grid = gridRef.current;
    if (!grid) return undefined;

    const mm = gsap.matchMedia();
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      const figures = grid.querySelectorAll('.ob-gal-fig');
      const media = grid.querySelectorAll('.ob-gal-media');

      gsap.set(figures, { opacity: 0, y: 70, clipPath: 'inset(14% 14% 14% 14% round 36px)' });
      gsap.set(media, { scale: 1.35 });

      gsap
        .timeline({
          scrollTrigger: { trigger: grid, start: 'top 80%', once: true },
          onComplete: () => gsap.set(figures, { clearProps: 'clipPath' })
        })
        .to(figures, {
          opacity: 1,
          y: 0,
          clipPath: 'inset(0% 0% 0% 0% round 24px)',
          duration: 1.1,
          ease: 'power4.out',
          stagger: 0.18
        })
        .to(media, { scale: 1, duration: 1.5, ease: 'power3.out', stagger: 0.18 }, 0);
    });

    return () => mm.revert();
  }, []);

  return (
    <section className="why-band py-14 lg:py-20">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="max-w-2xl mx-auto text-center mb-12">
          <Reveal as="p" className="section-eyebrow">Our Range</Reveal>
          <Reveal as="h2" className="section-title mt-3" delay={0.05}>
            <AccentText text="Powering Engines, **Machines** & Businesses" />
          </Reveal>
          <Reveal as="p" className="mt-4 text-slate-500" delay={0.1}>
            A closer look at the oil and battery solutions we supply for vehicles, generators and industrial equipment.
          </Reveal>
        </div>

        <div ref={gridRef} className="grid gap-6 sm:grid-cols-3">
          {SLOTS.map((slot, i) => {
            const Icon = slot.icon;
            const src = images[i];
            return (
              <Parallax key={slot.caption} className={slot.lower ? 'sm:mt-12' : ''} speed={slot.speed}>
                <figure className="ob-gal-fig">
                  <span className="ob-gal-index">0{i + 1}</span>
                  <div className="ob-gal-media">
                    {src ? (
                      <Image
                        src={src}
                        alt={slot.caption}
                        fill
                        sizes="(min-width: 1024px) 400px, (min-width: 640px) 33vw, 100vw"
                        className="object-cover"
                      />
                    ) : (
                      <Icon className="ob-gal-icon" strokeWidth={1.2} aria-hidden="true" />
                    )}
                  </div>
                  <figcaption className="ob-gal-cap">
                    <h3>{slot.caption}</h3>
                    <p className="ob-gal-note">{slot.note}</p>
                  </figcaption>
                </figure>
              </Parallax>
            );
          })}
        </div>
      </div>
    </section>
  );
}
