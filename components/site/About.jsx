import Image from "next/image";
import Reveal from "@/components/site/Reveal";
import Parallax from "@/components/site/Parallax";
import { ArrowRight, Box } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { SITE_CONTENT_DEFAULTS } from "@/lib/siteContentDefaults";
import { ICON_MAP } from "@/lib/icons";

// Shown until points are added in Admin > Homepage Items > About Points
const FALLBACK_POINTS = [
  { id: "f1", icon: "Award", title: "10+ Years", description: "Industry Experience" },
  { id: "f2", icon: "Box", title: "Wide Product Range", description: "Oil, Fuel, Air, Hydraulic, Water & More" },
  { id: "f3", icon: "ShieldCheck", title: "Genuine Products", description: "From Trusted Manufacturers" },
  { id: "f4", icon: "Headset", title: "Technical Support", description: "Before & After Sales" },
];

export default async function About() {
  const defaults = SITE_CONTENT_DEFAULTS.about;
  const [content, dbPoints] = await Promise.all([
    prisma.siteContent.findUnique({ where: { section: "about" } }),
    prisma.homepageItem.findMany({
      where: { section: "aboutpoints" },
      orderBy: { order: "asc" },
    }),
  ]);

  const points = dbPoints.length > 0 ? dbPoints : FALLBACK_POINTS;
  const paragraphs = [
    content?.body1 || defaults.body1,
    content?.body2 || defaults.body2,
    content?.body3 || defaults.body3,
  ].filter(Boolean);

  return (
    <section id="about" className="bg-white py-16 lg:py-24">
      <div className="max-w-7xl mx-auto px-6 lg:px-10 grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
        <Reveal as="div" className="relative mb-6 lg:mb-0">
          <div className="relative aspect-[4/3.2] overflow-hidden rounded-2xl shadow-xl">
            <Parallax className="absolute inset-0" speed={10} scale={1.25}>
              <Image
                src={content?.image || defaults.image}
                alt={content?.imageAlt || defaults.imageAlt}
                fill
                sizes="(min-width: 1024px) 600px, 100vw"
                className="object-cover"
              />
            </Parallax>
          </div>
          <Parallax
            className="absolute z-[2] -bottom-6 left-4 lg:-left-6 hidden sm:block max-w-xs"
            speed={-40}
          >
            <div className="rounded-xl border border-slate-100 bg-white p-5 shadow-xl">
              <p className="text-sm font-semibold text-slate-800">
                {content?.tagline || defaults.tagline}
              </p>
              <p className="mt-1 text-xs text-slate-500">
                {content?.headingLine2 || defaults.headingLine2}
              </p>
            </div>
          </Parallax>
        </Reveal>

        <div>
          <Reveal as="p" className="section-eyebrow">
            {content?.eyebrow || defaults.eyebrow}
          </Reveal>
          <Reveal as="h2" className="section-title mt-3 max-w-xl" delay={0.05}>
            {content?.heading || defaults.heading}
          </Reveal>
          {paragraphs.map((text, i) => (
            <Reveal
              as="p"
              key={i}
              className="mt-4 text-black max-w-xl leading-relaxed"
              delay={0.1 + i * 0.05}
            >
              {text}
            </Reveal>
          ))}

          <div className="mt-8 grid sm:grid-cols-2 gap-x-8 gap-y-6 max-w-xl">
            {points.map((point, i) => {
              const Icon = ICON_MAP[point.icon] || Box;
              return (
                <Reveal
                  as="div"
                  key={point.id}
                  className="flex items-center gap-4"
                  delay={0.15 + (i % 2) * 0.05}
                >
                  <span className="about-icon">
                    <Icon className="w-6 h-6" />
                  </span>
                  <div>
                    <p className="font-semibold text-brand-navy">{point.title}</p>
                    <p className="text-sm text-slate-500">{point.description}</p>
                  </div>
                </Reveal>
              );
            })}
          </div>

          <Reveal as="a" href="/about" className="btn-primary mt-9" delay={0.3}>
            Learn More <ArrowRight className="w-4 h-4" />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
