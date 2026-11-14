import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowRight,
  BatteryCharging,
  Check,
  Droplets,
  Factory,
  HardHat,
  Headset,
  Ship,
  ShieldCheck,
  Truck,
  UtensilsCrossed,
  Wrench,
  Zap
} from 'lucide-react';
import { prisma } from '@/lib/prisma';
import Reveal from '@/components/site/Reveal';
import Parallax from '@/components/site/Parallax';
import OilBatteryGallery from '@/components/site/OilBatteryGallery';
import AccentText from '@/components/site/AccentText';
import Breadcrumbs from '@/components/site/Breadcrumbs';
import { SITE_CONTENT_DEFAULTS } from '@/lib/siteContentDefaults';
import {
  OB_BATTERIES,
  OB_CTA,
  OB_ENQUIRY_HREF,
  OB_INDUSTRIES,
  OB_INTRO,
  OB_OILS,
  OB_SOLUTIONS,
  OB_TAGLINE,
  OB_WHY
} from '@/lib/oilBatteryContent';

export const metadata = {
  title: 'Oil & Battery Solutions',
  description:
    'Engine oils, industrial lubricants, automotive and industrial batteries for vehicles, generators, marine and industrial equipment. Talk to Zeemac Filters about your requirements.'
};
export const dynamic = 'force-dynamic';

// Only accept real picture paths from the admin form
const asImage = (value) => (typeof value === 'string' && /^(\/|https?:\/\/)/.test(value) ? value : null);

const ICONS = { Ship, Zap, Truck, Factory, UtensilsCrossed, HardHat, ShieldCheck, Wrench, Headset };

function ProductBlock({ block, icon: Icon, tone }) {
  return (
    <section id={block.id} className={`py-14 lg:py-20 ${tone === 'tint' ? 'why-band' : 'bg-white'}`}>
      <div className="max-w-7xl mx-auto px-6 lg:px-10 grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:gap-14 items-start">
        <div>
          <Reveal as="span" className="about-icon">
            <Icon className="w-6 h-6" />
          </Reveal>
          <Reveal as="h2" className="section-title mt-5" delay={0.05}>{block.title}</Reveal>
          <Reveal as="p" className="mt-3 text-lg font-semibold text-brand" delay={0.08}>{block.subtitle}</Reveal>
          <Reveal as="p" className="mt-4 text-slate-500 leading-relaxed" delay={0.1}>{block.text}</Reveal>

          <Reveal as="div" className="detail-card mt-7" delay={0.12}>
            <h3>Key Benefits</h3>
            <ul className="mt-4 space-y-3">
              {block.benefits.map((benefit) => (
                <li key={benefit} className="ob-benefit">
                  <Check className="w-5 h-5" />
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>

        <div>
          <Reveal as="p" className="section-eyebrow mb-4">Product Categories</Reveal>
          <div className="grid gap-3 sm:grid-cols-2">
            {block.categories.map((category, i) => (
              <Reveal as="div" key={category} className="ob-item" delay={(i % 2) * 0.04}>
                <Check className="w-4 h-4" />
                {category}
              </Reveal>
            ))}
          </div>
          <Reveal as="div" className="mt-6" delay={0.1}>
            <Link href={OB_ENQUIRY_HREF} className="btn-primary">
              Enquire About {block.id === 'oils' ? 'Oils' : 'Batteries'} <ArrowRight className="w-4 h-4" />
            </Link>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

export default async function OilBatteryPage() {
  const defaults = SITE_CONTENT_DEFAULTS.oilbattery;
  const content = await prisma.siteContent.findUnique({ where: { section: 'oilbattery' } });

  const galleryImages = [asImage(content?.body2), asImage(content?.body3), asImage(content?.headingLine2)];

  const SITE_URL = 'https://www.zeemacfilters.com';
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE_URL}/` },
      { '@type': 'ListItem', position: 2, name: 'Oil & Battery Solutions', item: `${SITE_URL}/oil-battery` }
    ]
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      {/* Top of the page */}
      <section className="page-hero pt-28 pb-12 lg:pt-36 lg:pb-16">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Oil & Battery Solutions' }]} />

          <div className="grid gap-10 lg:grid-cols-2 lg:gap-14 items-center">
            <div>
              <p className="section-eyebrow">{content?.eyebrow || defaults.eyebrow}</p>
              <h1 className="section-title mt-3">
                <AccentText text="Oil & **Battery** Solutions" />
              </h1>
              <p className="mt-4 text-lg font-semibold text-brand-navy">{OB_TAGLINE}</p>
              <p className="mt-4 text-slate-600 leading-relaxed">{content?.body1 || defaults.body1}</p>

              <p className="mt-6 text-xs font-bold uppercase tracking-[0.16em] text-slate-400">Our Solutions</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {OB_SOLUTIONS.map((item) => (
                  <span key={item} className="ob-chip">{item}</span>
                ))}
              </div>

              <div className="mt-8 flex flex-wrap gap-3">
                <Link href={OB_ENQUIRY_HREF} className="btn-primary">
                  Enquire Now <ArrowRight className="w-4 h-4" />
                </Link>
                <Link href="/contact" className="btn-outline">Contact Our Team</Link>
              </div>
            </div>

            <div className="ob-visual !rounded-3xl shadow-xl">
              {content?.image ? (
                <Image
                  src={content.image}
                  alt={content.imageAlt || defaults.imageAlt}
                  fill
                  sizes="(min-width: 1024px) 600px, 100vw"
                  priority
                />
              ) : (
                <div className="flex items-center gap-8" aria-hidden="true">
                  <Droplets className="w-24 h-24 opacity-80" strokeWidth={1.3} />
                  <BatteryCharging className="w-24 h-24 opacity-80" strokeWidth={1.3} />
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Introduction */}
      <section className="py-14 lg:py-20 bg-white">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <Reveal as="h2" className="section-title">{OB_INTRO.heading}</Reveal>
          {OB_INTRO.paragraphs.map((text, i) => (
            <Reveal as="p" key={i} className="mt-5 text-slate-500 leading-relaxed" delay={0.05 + i * 0.05}>{text}</Reveal>
          ))}
        </div>
      </section>

      <ProductBlock block={OB_OILS} icon={Droplets} tone="tint" />
      <ProductBlock block={OB_BATTERIES} icon={BatteryCharging} tone="white" />

      {/* Industries */}
      <section className="why-band py-14 lg:py-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="max-w-2xl mx-auto text-center mb-12">
            <Reveal as="h2" className="section-title">{OB_INDUSTRIES.heading}</Reveal>
            <Reveal as="p" className="mt-4 text-slate-500" delay={0.05}>{OB_INDUSTRIES.text}</Reveal>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {OB_INDUSTRIES.items.map((item, i) => {
              const Icon = ICONS[item.icon];
              return (
                <Reveal as="div" key={item.title} className="why-card" delay={(i % 3) * 0.05}>
                  <span className="why-card-icon">
                    <Icon className="w-7 h-7" />
                  </span>
                  <h4>{item.title}</h4>
                  <p>{item.text}</p>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* Why choose us */}
      <section className="py-14 lg:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <Reveal as="h2" className="section-title text-center mb-10">{OB_WHY.heading}</Reveal>
          <div className="grid gap-5 sm:grid-cols-2">
            {OB_WHY.items.map((item, i) => {
              const Icon = ICONS[item.icon];
              return (
                <Reveal as="div" key={item.title} className="detail-card flex items-start gap-4" delay={(i % 2) * 0.05}>
                  <span className="about-icon">
                    <Icon className="w-6 h-6" />
                  </span>
                  <div>
                    <h3 className="!mb-1">{item.title}</h3>
                    <p className="text-sm text-slate-500">{item.text}</p>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      <OilBatteryGallery images={galleryImages} />

      {/* Call to action */}
      <section className="pb-14 lg:pb-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <Reveal
            as="div"
            className="cta-banner"
            style={{ background: 'linear-gradient(135deg, #0E2A52 0%, #1E63D6 100%)' }}
          >
            <Parallax className="absolute inset-0" speed={14} scale={1.35}>
              <Image
                src="/images/about.jpeg"
                alt=""
                fill
                sizes="(max-width: 1280px) 100vw, 1280px"
                className="cta-bg-img"
              />
            </Parallax>
            <div className="cta-content">
              <h2 className="cta-title">{OB_CTA.heading}</h2>
              <p className="cta-text">{OB_CTA.text}</p>
              <p className="cta-text !mt-3 font-semibold !text-white">{OB_CTA.strong}</p>
              <div className="cta-actions">
                <Link href={OB_ENQUIRY_HREF} className="btn-primary">
                  Enquire Now <ArrowRight className="w-4 h-4" />
                </Link>
                <Link href="/contact" className="btn-outline-light">Contact Our Team</Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
