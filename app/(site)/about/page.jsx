import Image from "next/image";
import Reveal from "@/components/site/Reveal";
import AccentText from "@/components/site/AccentText";
import Breadcrumbs from "@/components/site/Breadcrumbs";
import {
  ArrowRight,
  Eye,
  Target,
  ShieldCheck,
  Users,
  Award,
  Globe,
} from "lucide-react";
import { prisma } from "@/lib/prisma";

export const metadata = {
  title: "About Us",
  description:
    "Learn about Zeemac Filters — our story, vision, mission and values as a supplier of marine and industrial filtration solutions.",
};

const VALUES = [
  {
    icon: ShieldCheck,
    title: "Quality First",
    text: "We supply products that meet strict quality and reliability standards.",
  },
  {
    icon: Users,
    title: "Customer Focus",
    text: "We take time to understand each customer\u2019s equipment and requirements.",
  },
  {
    icon: Award,
    title: "Trusted Brands",
    text: "We work with established manufacturers across the filtration industry.",
  },
  {
    icon: Globe,
    title: "Regional Reach",
    text: "Based in the UAE, supporting marine and industrial customers across the region.",
  },
];

export default async function AboutPage() {
  const content = await prisma.siteContent.findUnique({
    where: { section: "about" },
  });

  return (
    <div>
      {/* Intro */}
      <section className="page-hero pt-28 pb-14 lg:pt-36 lg:pb-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <Breadcrumbs
            items={[{ label: "Home", href: "/" }, { label: "About Us" }]}
          />
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div>
              <Reveal as="p" className="section-eyebrow">
                About Zeemac Filters
              </Reveal>
              <Reveal as="h1" className="section-title mt-3 max-w-xl" delay={0.05}>
                <AccentText text="Your Trusted Partner for **Filtration & Marine Solutions**" />
              </Reveal>
              <Reveal as="p" className="mt-5 text-slate-600 max-w-xl leading-relaxed" delay={0.1}>
                At Zeemac Filters, we provide reliable filtration and marine
                industrial products designed to support the performance,
                efficiency and longevity of critical equipment.
              </Reveal>
              <Reveal as="p" className="mt-4 text-slate-600 max-w-xl leading-relaxed" delay={0.15}>
                From engine filters and hydraulic filtration to industrial and
                process filtration solutions, our product range serves a wide
                variety of applications across marine, industrial,
                construction, power and other sectors.
              </Reveal>
              <Reveal as="p" className="mt-4 text-slate-600 max-w-xl leading-relaxed" delay={0.2}>
                With a strong focus on product quality, availability and
                customer support, we help businesses find the right filtration
                solution for their specific requirements.
              </Reveal>
              <Reveal as="div" className="mt-8 flex flex-wrap gap-3" delay={0.25}>
                <a href="/products" className="btn-primary">
                  Explore Products <ArrowRight className="w-4 h-4" />
                </a>
                <a href="/#contact" className="btn-outline">
                  Request a Quote
                </a>
              </Reveal>
            </div>

            <Reveal as="div" delay={0.1}>
              <div className="relative aspect-[4/3.2] overflow-hidden rounded-2xl shadow-xl">
                <Image
                  src={content?.image || "/images/about.jpeg"}
                  alt={
                    content?.imageAlt ||
                    "Zeemac Filters filtration products and marine equipment"
                  }
                  fill
                  sizes="(min-width: 1024px) 600px, 100vw"
                  priority
                  className="object-cover"
                />
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="section-pad bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 grid sm:grid-cols-2 gap-6">
          <Reveal as="div" className="detail-card !p-8">
            <span className="about-icon mb-5">
              <Eye className="w-6 h-6" />
            </span>
            <h2 className="text-xl font-bold text-brand-navy mb-2">Our Vision</h2>
            <p className="text-slate-600 text-sm leading-relaxed">
              To be a leading and trusted supplier of filtration and marine
              industrial products across the region, recognized for
              reliability, product range and customer support.
            </p>
          </Reveal>
          <Reveal as="div" className="detail-card !p-8" delay={0.05}>
            <span className="about-icon mb-5">
              <Target className="w-6 h-6" />
            </span>
            <h2 className="text-xl font-bold text-brand-navy mb-2">Our Mission</h2>
            <p className="text-slate-600 text-sm leading-relaxed">
              To supply high-quality filtration products from established
              brands, help customers identify the right solution for their
              equipment, and deliver dependable service at every step.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Values */}
      <section className="why-band section-pad">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="max-w-2xl mx-auto text-center mb-12">
            <Reveal as="p" className="section-eyebrow">
              Our Values
            </Reveal>
            <Reveal as="h2" className="section-title mt-3" delay={0.05}>
              <AccentText text="What Drives **Zeemac Filters**" />
            </Reveal>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {VALUES.map(({ icon: Icon, title, text }, i) => (
              <Reveal as="div" className="why-card" key={title} delay={(i % 4) * 0.05}>
                <span className="why-card-icon">
                  <Icon className="w-7 h-7" />
                </span>
                <h4>{title}</h4>
                <p>{text}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-pad bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <Reveal
            as="div"
            className="cta-banner"
            style={{ background: "linear-gradient(135deg, #0E2A52 0%, #1E63D6 100%)" }}
          >
            <div className="cta-content">
              <h2 className="cta-title">Need the Right Filtration Solution?</h2>
              <p className="cta-text">
                Tell us about your equipment or requirement, and our team will
                help you find the right product.
              </p>
              <div className="cta-actions">
                <a href="/products" className="btn-primary">
                  Explore Products <ArrowRight className="w-4 h-4" />
                </a>
                <a href="/#contact" className="btn-outline-light">
                  Contact Us
                </a>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
