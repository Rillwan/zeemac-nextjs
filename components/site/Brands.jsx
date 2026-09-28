import Reveal from '@/components/site/Reveal';
import { slugify } from '@/lib/validators';
import { ArrowRight } from 'lucide-react';

const BRANDS = [
  'Volvo Penta', 'Framo', 'UFI/Sofima', 'Sullair', 'Fildac', 'Fleetguard',
  'Caterpillar', 'Donaldson', 'Mann', 'Parker', 'HYDAC', 'Racor',
  'Atlas Copco', 'Baldwin', 'Pall', 'Wartsila', 'Perkins', 'MP Filtri', 'STAUFF'
];

export default function Brands() {
  return (
    <section id="brands" className="section-pad">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="flex flex-wrap items-end justify-between gap-6 mb-12">
          <div className="max-w-xl">
            <Reveal as="p" className="eyebrow">Trusted Brands. Reliable Filtration.</Reveal>
            <Reveal as="h2" className="section-title mt-3" delay={0.05}>Products From Established Manufacturers</Reveal>
            <Reveal as="p" className="mt-4 text-slate-500" delay={0.1}>
              We offer filtration products from established manufacturers and brands serving marine, industrial, hydraulic, engine and process applications.
            </Reveal>
          </div>
          <Reveal as="a" href="/brands" className="btn-outline shrink-0" delay={0.1}>
            View All Brands <ArrowRight className="w-4 h-4" />
          </Reveal>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {BRANDS.map((brand, i) => (
            <Reveal as="a" href={`/brands/${slugify(brand)}`} className="brand-badge" key={brand} delay={(i % 10) * 0.03}>
              {brand}
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
