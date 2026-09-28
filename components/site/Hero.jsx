'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight } from 'lucide-react';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

function SplitHeadline({ text, className = '' }) {
  const words = text.split(' ');
  return (
    <span className={`split-text block ${className}`}>
      {words.map((word, wi) => (
        <span key={wi} className="word" style={{ display: 'inline-block', whiteSpace: 'nowrap' }}>
          {word.split('').map((char, ci) => <span key={ci} className="char">{char}</span>)}
          {wi < words.length - 1 ? '\u00A0' : ''}
        </span>
      ))}
    </span>
  );
}

export default function Hero() {
  const heroRef = useRef(null);
  const imageWrapRef = useRef(null);

  useEffect(() => {
    let tl;

    const playIntro = () => {
      const hero = heroRef.current;
      if (!hero) return;
      tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      tl.from(hero.querySelector('.eyebrow'), { y: 20, opacity: 0, duration: 0.6 })
        .from(hero.querySelectorAll('.hero-title .char'), { y: 46, opacity: 0, rotateX: 40, duration: 0.7, stagger: 0.02 }, '-=0.3')
        .from(hero.querySelector('[data-hero-text]'), { y: 20, opacity: 0, duration: 0.6 }, '-=0.35')
        .from(hero.querySelector('[data-hero-actions]'), { y: 20, opacity: 0, duration: 0.6 }, '-=0.4')
        .from(hero.querySelector('[data-hero-tagline]'), { y: 20, opacity: 0, duration: 0.5 }, '-=0.4')
        .from(hero.querySelector('.hero-image-wrap'), { scale: 0.92, opacity: 0, duration: 0.9, ease: 'power3.out' }, '-=0.6');
    };

    if (document.body.classList.contains('loaded')) {
      playIntro();
    } else {
      window.addEventListener('zeemac:loaded', playIntro, { once: true });
    }
    return () => {
      window.removeEventListener('zeemac:loaded', playIntro);
      tl?.revert();
    }
  }, []);

  useEffect(() => {
    const trigger = gsap.to(imageWrapRef.current, {
      yPercent: 8,
      ease: 'none',
      scrollTrigger: { trigger: heroRef.current, start: 'top top', end: 'bottom top', scrub: true }
    });
    return () => trigger.scrollTrigger?.kill();
  }, []);

  return (
    <section className="hero relative pt-16 pb-16 sm:pt-28 sm:pb-20 lg:pt-20 lg:pb-24 overflow-hidden bg-cover" id="home" ref={heroRef}
      style={{
        backgroundImage: `url('/images/bg-hero.jpg')`, // Place image in /public folder
      }}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-10 grid md:grid-cols-2 gap-2 md:gap-8 items-center relative z-10">
        <div className="realative z-1">
          {/* <p className="eyebrow">Reliable Filters for Marine, Industrial &amp; Heavy-Duty Applications</p> */}
          <h1 className="hero-title mt-4 text-4xl text-center md:text-start lg:text-6xl xl:text-7xl font-medium md:text-nowrap ">
            <SplitHeadline text="Marine & Industrial" className="text-brand-navy" />
            <SplitHeadline text="Filtration Solutions" className="text-brand" />
          </h1>
          <p className="mt-6 mx-auto md:ml-0 text-slate-600 text-center md:text-start text-[14px] max-w-md" data-hero-text>
            Zeemac Group supplies a comprehensive range of filtration products for marine engines, industrial machinery, hydraulic systems, compressors, power plants and other demanding applications.
          </p>
          <div className="mt-8 flex items-center justify-center md:justify-start flex-wrap gap-4" data-hero-actions>
            <a href="/products" className="btn-primary w-fit md:w-auto text-nowrap">Explore Products <ArrowRight className="w-4 h-4" /></a>
            <a href="#contact" className="btn-outline w-fit md:w-auto text-nowrap">Request a Quote <ArrowRight className="w-4 h-4" /></a>
          </div>
          <div className="hero-tagline mt-4 md:mt-8 justify-center md:justify-start" data-hero-tagline>
            <span>Quality Products</span>
            <span>Trusted Brands</span>
            <span>Industrial Expertise</span>
            <span>UAE</span>
          </div>
        </div>

        <div className="relative">
          <div className="hero-image-wrap" ref={imageWrapRef}>
            <Image
              src="/images/hero.png"
              alt="Marine and industrial filtration products"
              width={720}
              height={560}
              priority
              className="w-full h-auto"
            />
          </div>
        </div>
      </div>
      <div className="hero-blob" aria-hidden="true"></div>
    </section>
  );
}
