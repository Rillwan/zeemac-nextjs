import Image from "next/image";
import Reveal from "@/components/site/Reveal";
import { prisma } from "@/lib/prisma";
import { SITE_CONTENT_DEFAULTS } from "@/lib/siteContentDefaults";
import { ArrowRight } from "lucide-react";

function BrandLogo({ brand, className = "" }) {
  if (brand.logo) {
    return (
      <div className={`relative ${className}`}>
        <Image
          src={brand.logo}
          alt={`${brand.name} logo`}
          fill
          sizes="(min-width: 1024px) 240px, 50vw"
          className="object-contain"
        />
      </div>
    );
  }
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <span className="text-3xl font-extrabold text-brand/40">
        {brand.name.charAt(0)}
      </span>
    </div>
  );
}

export default async function Brands() {
  const [content, brands] = await Promise.all([
    prisma.siteContent.findUnique({ where: { section: "brands" } }),
    prisma.brand.findMany({ orderBy: [{ order: "asc" }, { id: "asc" }] }),
  ]);

  if (brands.length === 0) return null;

  const featured = brands.filter((brand) => brand.featured);
  const others = brands.filter((brand) => !brand.featured);
  const defaults = SITE_CONTENT_DEFAULTS.brands;

  return (
    <section id="brands" className="section-pad">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="flex flex-wrap items-end justify-between gap-6 mb-12">
          <div className="max-w-xl">
            <Reveal as="p" className="eyebrow">
              {content?.eyebrow || defaults.eyebrow}
            </Reveal>
            <Reveal as="h2" className="section-title mt-3" delay={0.05}>
              {content?.heading || defaults.heading}
            </Reveal>
            <Reveal as="p" className="mt-4 text-slate-500" delay={0.1}>
              {content?.body1 || defaults.body1}
            </Reveal>
          </div>
          <Reveal
            as="a"
            href="/brands"
            className="btn-outline shrink-0"
            delay={0.1}
          >
            View All Brands <ArrowRight className="w-4 h-4" />
          </Reveal>
        </div>

        {featured.length > 0 && (
          <div className="flex flex-wrap justify-center gap-6">
            {featured.map((brand, i) => (
              <Reveal
                as="div"
                key={brand.id}
                className="w-full sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)]"
                delay={(i % 3) * 0.08}
              >
                <a
                  href={`/brands/${brand.slug}`}
                  className="group flex h-full flex-col rounded-3xl border border-slate-100 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"
                >
                  <div className="flex h-32 items-center justify-center rounded-2xl bg-brand-light/60 p-5">
                    <BrandLogo brand={brand} className="h-full w-full" />
                  </div>
                  <h3 className="mt-5 text-lg font-extrabold text-brand-navy">
                    {brand.name}
                  </h3>
                  {brand.description && (
                    <p className="mt-2 text-sm leading-relaxed text-slate-500 line-clamp-4">
                      {brand.description}
                    </p>
                  )}
                  <span className="mt-auto inline-flex items-center gap-2 pt-5 text-sm font-bold text-brand">
                    View products
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </span>
                </a>
              </Reveal>
            ))}
          </div>
        )}

        {others.length > 0 && (
          <>
            {featured.length > 0 && (
              <h3 className="mt-16 mb-6 text-sm font-bold uppercase tracking-wider text-slate-400">
                Other brands we supply
              </h3>
            )}
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
              {others.map((brand, i) => (
                <Reveal as="div" key={brand.id} delay={(i % 6) * 0.04}>
                  <a
                    href={`/brands/${brand.slug}`}
                    className="flex h-full flex-col items-center gap-3 rounded-2xl border border-slate-100 bg-white p-4 text-center transition duration-300 hover:-translate-y-1 hover:border-brand/30 hover:shadow-lg"
                  >
                    <BrandLogo brand={brand} className="h-14 w-full" />
                    <span className="text-xs font-bold text-brand-navy">
                      {brand.name}
                    </span>
                  </a>
                </Reveal>
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
