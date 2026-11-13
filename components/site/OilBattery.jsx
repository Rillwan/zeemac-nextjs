import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, BatteryCharging, Droplets } from 'lucide-react';
import { prisma } from '@/lib/prisma';
import Reveal from '@/components/site/Reveal';
import AccentText from '@/components/site/AccentText';
import { SITE_CONTENT_DEFAULTS } from '@/lib/siteContentDefaults';
import { OB_BATTERIES, OB_ENQUIRY_HREF, OB_HOME_INTRO, OB_OILS } from '@/lib/oilBatteryContent';

function Card({ icon: Icon, title, text, chips, image, imageAlt, href }) {
  return (
    <div className="ob-card">
      <div className="ob-visual">
        {image ? (
          <Image src={image} alt={imageAlt} fill sizes="(min-width: 768px) 560px, 100vw" />
        ) : (
          <Icon className="w-20 h-20 opacity-80" strokeWidth={1.4} aria-hidden="true" />
        )}
      </div>

      <div className="flex flex-1 flex-col pt-5 px-1">
        <div className="flex items-center gap-3">
          <span className="about-icon !w-11 !h-11">
            <Icon className="w-5 h-5" />
          </span>
          <h3 className="text-lg font-bold text-brand-navy leading-snug">{title}</h3>
        </div>
        <p className="mt-3 text-sm leading-relaxed text-slate-500">{text}</p>

        <div className="mt-4 flex flex-wrap gap-2">
          {chips.map((chip) => (
            <span key={chip} className="ob-chip">{chip}</span>
          ))}
        </div>

        <Link href={href} className="category-tile-link mt-auto !pt-5">
          Learn more <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}

export default async function OilBattery() {
  const defaults = SITE_CONTENT_DEFAULTS.oilbattery;
  const content = await prisma.siteContent.findUnique({ where: { section: 'oilbattery' } });

  return (
    <section id="oil-battery" className="py-14 lg:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="max-w-3xl mx-auto text-center mb-10 lg:mb-12">
          <Reveal as="p" className="section-eyebrow">{content?.eyebrow || defaults.eyebrow}</Reveal>
          <Reveal as="h2" className="section-title mt-3" delay={0.05}>
            <AccentText text={content?.heading || defaults.heading} />
          </Reveal>
          <Reveal as="p" className="mt-4 text-slate-500" delay={0.1}>{OB_HOME_INTRO}</Reveal>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Reveal as="div">
            <Card
              icon={Droplets}
              title={OB_OILS.title}
              text={OB_OILS.subtitle}
              chips={OB_OILS.categories.slice(0, 6)}
              image={content?.image2}
              imageAlt={content?.imageAlt || 'Engine oils and lubricants'}
              href="/oil-battery#oils"
            />
          </Reveal>
          <Reveal as="div" delay={0.06}>
            <Card
              icon={BatteryCharging}
              title={OB_BATTERIES.title}
              text={OB_BATTERIES.subtitle}
              chips={OB_BATTERIES.categories.slice(0, 6)}
              image={content?.image3}
              imageAlt="Automotive and industrial batteries"
              href="/oil-battery#batteries"
            />
          </Reveal>
        </div>

        <Reveal as="div" className="mt-10 flex flex-wrap items-center justify-center gap-3 sm:gap-4" delay={0.1}>
          <Link href="/oil-battery" className="btn-primary">
            Explore Oil &amp; Battery Solutions <ArrowRight className="w-4 h-4" />
          </Link>
          <Link href={OB_ENQUIRY_HREF} className="btn-outline">Enquire Now</Link>
        </Reveal>
      </div>
    </section>
  );
}
