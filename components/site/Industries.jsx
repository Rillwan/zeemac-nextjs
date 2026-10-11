import Reveal from '@/components/site/Reveal';
import { prisma } from '@/lib/prisma';
import { SITE_CONTENT_DEFAULTS } from '@/lib/siteContentDefaults';
import { ICON_MAP } from '@/lib/icons';
import { PackageSearch } from 'lucide-react';

export default async function Industries() {
  const [content, items] = await Promise.all([
    prisma.siteContent.findUnique({ where: { section: 'industries' } }),
    prisma.homepageItem.findMany({ where: { section: 'industries' }, orderBy: { order: 'asc' } })
  ]);

  return (
    <section className="section-pad bg-slate-50">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="max-w-xl mb-12">
          <Reveal as="p" className="eyebrow">{content?.eyebrow || SITE_CONTENT_DEFAULTS.industries.eyebrow}</Reveal>
          <Reveal as="h2" className="section-title mt-3" delay={0.05}>{content?.heading || SITE_CONTENT_DEFAULTS.industries.heading}</Reveal>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item, i) => {
            const Icon = ICON_MAP[item.icon] || PackageSearch;
            return (
              <Reveal as="div" className="industry-card" key={item.id} delay={(i % 3) * 0.06}>
                <Icon className="w-6 h-6 text-brand mb-3" />
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