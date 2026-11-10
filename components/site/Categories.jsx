import Reveal from "@/components/site/Reveal";
import AccentText from "@/components/site/AccentText";
import CategoryTile from "@/components/site/CategoryTile";
import { prisma } from "@/lib/prisma";
import { SITE_CONTENT_DEFAULTS } from "@/lib/siteContentDefaults";
import { Headset, ShieldCheck, Truck } from "lucide-react";

const TRUST_ITEMS = [
  { icon: ShieldCheck, label: ["Genuine", "Manufacturers"] },
  { icon: Truck, label: ["Wide Product", "Range"] },
  { icon: Headset, label: ["Technical", "Support"] },
];

export default async function Categories() {
  const defaults = SITE_CONTENT_DEFAULTS.categories;
  const [content, categories] = await Promise.all([
    prisma.siteContent.findUnique({ where: { section: "categories" } }),
    prisma.category.findMany({
      orderBy: [{ order: "asc" }, { id: "asc" }],
      take: 6,
    }),
  ]);

  if (categories.length === 0) return null;

  return (
    <section
      id="categories"
      className="section-pad"
      style={{
        background: "linear-gradient(180deg, #F3F8FF 0%, #FFFFFF 100%)",
      }}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="flex flex-wrap items-end justify-between gap-6 mb-10">
          <div className="max-w-xl">
            <Reveal as="p" className="section-eyebrow">
              {content?.eyebrow || defaults.eyebrow}
            </Reveal>
            <Reveal as="h2" className="section-title mt-3" delay={0.05}>
              <AccentText text={content?.heading || defaults.heading} />
            </Reveal>
            <Reveal as="p" className="mt-4 text-black" delay={0.1}>
              {content?.body1 || defaults.body1}
            </Reveal>
          </div>

          <Reveal as="div" className="hidden lg:flex items-center" delay={0.1}>
            {TRUST_ITEMS.map(({ icon: Icon, label }) => (
              <div key={label[0]} className="trust-item">
                <Icon className="w-6 h-6 text-brand shrink-0" />
                <span>
                  {label[0]}
                  <br />
                  {label[1]}
                </span>
              </div>
            ))}
          </Reveal>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {categories.map((cat, i) => (
            <Reveal as="div" key={cat.id} delay={(i % 3) * 0.05}>
              <CategoryTile category={cat} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
