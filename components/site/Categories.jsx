import Reveal from '@/components/site/Reveal';
import { slugify } from '@/lib/validators';
import { ArrowRight, Ship, Droplet, Fuel, Wind, Gauge, Waves, Fan, Factory } from 'lucide-react';

const CATEGORIES = [
  { icon: Ship, name: 'Marine Engine Filters', desc: 'Filters designed to support the reliable operation of marine engines and equipment.' },
  { icon: Droplet, name: 'Oil Filters', desc: 'Efficient filtration solutions for maintaining clean oil circulation and protecting engine components.' },
  { icon: Fuel, name: 'Fuel Filters', desc: 'Solutions designed to remove contaminants and help maintain clean fuel delivery.' },
  { icon: Wind, name: 'Air Filters', desc: 'High-quality filtration for engines, machinery and air intake systems.' },
  { icon: Gauge, name: 'Hydraulic Filters', desc: 'Filtration solutions for hydraulic systems and fluid-powered equipment.' },
  { icon: Waves, name: 'Water & RO Filters', desc: 'Filtration and membrane solutions for water treatment and reverse osmosis applications.' },
  { icon: Fan, name: 'Compressor Filters', desc: 'Filtration solutions for compressed-air systems and industrial compressors.' },
  { icon: Factory, name: 'Industrial Filters', desc: 'A broad range of filtration products for industrial and process applications.' }
];

export default function Categories() {
  return (
    <section id="categories" className="section-pad bg-slate-50">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="flex flex-wrap items-end justify-between gap-6 mb-12">
          <div className="max-w-xl">
            <Reveal as="p" className="eyebrow">Explore Our Products</Reveal>
            <Reveal as="h2" className="section-title mt-3" delay={0.05}>Find the Right Filtration Solution</Reveal>
            <Reveal as="p" className="mt-4 text-slate-500" delay={0.1}>
              Find the right filtration solution for your equipment and application.
            </Reveal>
          </div>
          <Reveal as="a" href="/products" className="btn-outline shrink-0" delay={0.1}>
            View All Products <ArrowRight className="w-4 h-4" />
          </Reveal>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {CATEGORIES.map(({ icon: Icon, name, desc }, i) => (
            <Reveal as="a" href={`/categories/${slugify(name)}`} className="category-card block" key={name} delay={(i % 4) * 0.05}>
              <div className="category-icon"><Icon className="w-5 h-5" /></div>
              <h3>{name}</h3>
              <p>{desc}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
