import Image from 'next/image';
import Reveal from '@/components/site/Reveal';
import { ArrowRight } from 'lucide-react';
import { prisma } from '@/lib/prisma';

export default async function About() {
  const content = await prisma.siteContent.findUnique({ where: { section: 'about' } });

  return (
    <section id="about" className="section-pad">
      <div className="max-w-7xl mx-auto px-6 lg:px-10 grid lg:grid-cols-2 gap-14 items-center">
        <Reveal as="div" className="about-image-wrap ">
          <Image
            src={content?.image || '/images/about.jpeg'}
            alt={content?.imageAlt || 'Zeemac Filters filtration products and marine equipment'}
            width={640}
            height={480}
            className="w-full h-auto"
          />
          <div className="absolute bg-white z-[2] -bottom-6 -left-6 p-6 rounded-xl shadow-xl border border-slate-100 hidden sm:block max-w-xs">
              <p className="text-sm font-semibold text-slate-800">ISO Certified Filtration Standards</p>
              <p className="text-xs text-slate-500 mt-1">Trusted by engineers and industrial clients worldwide.</p>
            </div>
        </Reveal>

        <div>
          <Reveal as="p" className="eyebrow">About Us</Reveal>
          <Reveal as="h2" className="section-title mt-3" delay={0.05}> {content?.heading || 'Your Trusted Partner for Filtration &amp; Marine Solutions'} </Reveal>
          <Reveal as="p" className="mt-4 text-slate-500 max-w-md" delay={0.1}>
            {content?.body1 || 'At Zeemac Filters, we provide reliable filtration and marine industrial products designed to support the performance, efficiency and longevity of critical equipment.'}
          </Reveal>
          <Reveal as="p" className="mt-4 text-slate-500 max-w-md" delay={0.15}>
            {content?.body1 || 'From engine filters and hydraulic filtration to industrial and process filtration solutions, our product range serves a wide variety of applications across marine, industrial, construction, power and other sectors.'}
          </Reveal>
          <Reveal as="p" className="mt-4 text-slate-500 max-w-md" delay={0.2}>
            {content?.body1 || 'With a strong focus on product quality, availability and customer support, we help businesses find the right filtration solution for their specific requirements.'}
          </Reveal>
          <Reveal as="a" href="/about" className="btn-primary mt-8" delay={0.25}>
            About Zeemac Filters <ArrowRight className="w-4 h-4" />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
