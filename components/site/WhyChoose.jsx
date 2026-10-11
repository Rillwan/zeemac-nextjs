import Reveal from "@/components/site/Reveal";
import { prisma } from "@/lib/prisma";
import { SITE_CONTENT_DEFAULTS } from "@/lib/siteContentDefaults";
import { ICON_MAP } from "@/lib/icons";
import { PackageSearch } from "lucide-react";

export default async function WhyChoose() {
  const [content, items] = await Promise.all([
    prisma.siteContent.findUnique({ where: { section: "whychoose" } }),
    prisma.homepageItem.findMany({
      where: { section: "whychoose" },
      orderBy: { order: "asc" },
    }),
  ]);

  return (
    <section className="section-pad">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="max-w-xl mb-12">
          <Reveal as="p" className="eyebrow">
            {content?.eyebrow || SITE_CONTENT_DEFAULTS.whychoose.eyebrow}
          </Reveal>
          <Reveal as="h2" className="section-title mt-3" delay={0.05}>
            {content?.heading || SITE_CONTENT_DEFAULTS.whychoose.heading}
          </Reveal>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-8">
          {items.map((item, i) => {
            const Icon = ICON_MAP[item.icon] || PackageSearch;
            return (
              <Reveal
                as="div"
                className="why-point"
                key={item.id}
                delay={(i % 3) * 0.06}
              >
                <span className="why-icon">
                  <Icon className="w-5 h-5" />
                </span>
                <div>
                  <h4>{item.title}</h4>
                  <p>{item.description}</p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
