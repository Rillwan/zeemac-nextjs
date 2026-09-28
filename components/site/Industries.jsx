import Reveal from '@/components/site/Reveal';
import { Anchor, HardHat, Factory, Zap, Cog, Truck } from 'lucide-react';

const INDUSTRIES = [
  { icon: Anchor, name: 'Marine & Offshore', desc: 'Filtration solutions for marine engines, vessels and offshore equipment.' },
  { icon: HardHat, name: 'Construction & Heavy Equipment', desc: 'Filters for construction machinery and heavy-duty equipment.' },
  { icon: Factory, name: 'Industrial Plants', desc: 'Filtration solutions for industrial machinery and process systems.' },
  { icon: Zap, name: 'Power Generation', desc: 'Products for power plants and power-generation equipment.' },
  { icon: Cog, name: 'Manufacturing', desc: 'Filtration solutions supporting manufacturing and production equipment.' },
  { icon: Truck, name: 'Rental Equipment', desc: 'Reliable replacement filters for rental and heavy equipment fleets.' }
];

export default function Industries() {
  return (
    <section id="industries" className="section-pad bg-slate-50">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="max-w-xl mb-12">
          <Reveal as="p" className="eyebrow">Industries We Serve</Reveal>
          <Reveal as="h2" className="section-title mt-3" delay={0.05}>Filtration Solutions Across Multiple Industries</Reveal>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {INDUSTRIES.map(({ icon: Icon, name, desc }, i) => (
            <Reveal as="div" className="industry-card" key={name} delay={(i % 3) * 0.06}>
              <Icon className="w-6 h-6 text-brand mb-3" />
              <h3>{name}</h3>
              <p>{desc}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
