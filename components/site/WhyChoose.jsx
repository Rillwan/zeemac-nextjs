import Reveal from "@/components/site/Reveal";
import Parallax from "@/components/site/Parallax";
import AccentText from "@/components/site/AccentText";
import { prisma } from "@/lib/prisma";
import { SITE_CONTENT_DEFAULTS } from "@/lib/siteContentDefaults";
import { ICON_MAP } from "@/lib/icons";
import { PackageSearch } from "lucide-react";

// Each column drifts at its own speed while scrolling
const COLUMN_SPEEDS = [6, 14, 22];

export default async function WhyChoose() {
  const defaults = SITE_CONTENT_DEFAULTS.whychoose;
  const [content, items] = await Promise.all([
    prisma.siteContent.findUnique({ where: { section: "whychoose" } }),
    prisma.homepageItem.findMany({
      where: { section: "whychoose" },
      orderBy: { order: "asc" },
    }),
  ]);

  return (
    <section className="why-band section-pad">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="max-w-2xl mx-auto text-center mb-12">
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

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item, i) => {
            const Icon = ICON_MAP[item.icon] || PackageSearch;
            return (
              <Parallax key={item.id} className="h-full" speed={COLUMN_SPEEDS[i % 3]}>
                <Reveal
                  as="div"
                  className="why-card h-full"
                  delay={(i % 3) * 0.06}
                >
                  <span className="why-card-icon">
                    <Icon className="w-7 h-7" />
                  </span>
                  <h4>{item.title}</h4>
                  <p>{item.description}</p>
                </Reveal>
              </Parallax>
            );
          })}
        </div>
      </div>
    </section>
  );
}
