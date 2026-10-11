import Reveal from "@/components/site/Reveal";
import { prisma } from "@/lib/prisma";
import { SITE_CONTENT_DEFAULTS } from "@/lib/siteContentDefaults";
import { ICON_MAP } from "@/lib/icons";
import { ArrowRight, PackageSearch } from "lucide-react";

export default async function Categories() {
  const [content, items] = await Promise.all([
    prisma.siteContent.findUnique({ where: { section: "categories" } }),
    prisma.homepageItem.findMany({
      where: { section: "categories" },
      orderBy: { order: "asc" },
    }),
  ]);

  return (
    <section id="categories" className="section-pad bg-slate-50">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="flex flex-wrap items-end justify-between gap-6 mb-12">
          <div className="max-w-xl">
            <Reveal as="p" className="eyebrow">
              {content?.eyebrow || SITE_CONTENT_DEFAULTS.categories.eyebrow}
            </Reveal>
            <Reveal as="h2" className="section-title mt-3" delay={0.05}>
              {content?.heading || SITE_CONTENT_DEFAULTS.categories.heading}
            </Reveal>
            <Reveal as="p" className="mt-4 text-slate-500" delay={0.1}>
              {content?.body1 || SITE_CONTENT_DEFAULTS.categories.body1}
            </Reveal>
          </div>
          <Reveal
            as="a"
            href="/products"
            className="btn-outline shrink-0"
            delay={0.1}
          >
            View All Products <ArrowRight className="w-4 h-4" />
          </Reveal>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {items.map((item, i) => {
            const Icon = ICON_MAP[item.icon] || PackageSearch;
            return (
              <Reveal
                as="div"
                className="category-card"
                key={item.id}
                delay={(i % 4) * 0.05}
              >
                <div className="category-icon">
                  <Icon className="w-5 h-5" />
                </div>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
