import Reveal from '@/components/site/Reveal';
import { Layers, Award, Target, ShieldCheck, MapPin, MessageSquare } from 'lucide-react';

const POINTS = [
  { icon: Layers, title: 'Wide Product Range', text: 'Access a comprehensive range of marine and industrial filtration products.' },
  { icon: Award, title: 'Multiple Brands', text: 'Products available from a broad selection of established filtration brands.' },
  { icon: Target, title: 'Application-Focused Solutions', text: 'We help customers identify products suited to their equipment and application.' },
  { icon: ShieldCheck, title: 'Quality & Reliability', text: 'Products selected to support demanding marine and industrial environments.' },
  { icon: MapPin, title: 'UAE-Based Support', text: 'Convenient access to filtration and marine industrial products in the UAE.' },
  { icon: MessageSquare, title: 'Request-Based Supply', text: 'Tell us your equipment, brand or filter requirement and our team can assist you in finding the appropriate product.' }
];

export default function WhyChoose() {
  return (
    <section className="section-pad">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="max-w-xl mb-12">
          <Reveal as="p" className="eyebrow">Why Choose Us</Reveal>
          <Reveal as="h2" className="section-title mt-3" delay={0.05}>Why Businesses Choose Zeemac Filters</Reveal>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-8">
          {POINTS.map(({ icon: Icon, title, text }, i) => (
            <Reveal as="div" className="why-point" key={title} delay={(i % 3) * 0.06}>
              <span className="why-icon"><Icon className="w-5 h-5" /></span>
              <div>
                <h4>{title}</h4>
                <p>{text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
