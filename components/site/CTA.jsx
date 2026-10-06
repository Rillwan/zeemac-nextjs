import Image from 'next/image';
import Reveal from '@/components/site/Reveal';
import { ArrowRight } from 'lucide-react';

export default function CTA() {
  return (
    <section id="contact" className="section-pad pt-0">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <Reveal as="div" className="cta-banner">
          <Image
            src="https://placehold.co/900x420/123d8a/ffffff?text=Zeemac+Group"
            alt="Zeemac Filters filtration solutions"
            fill
            sizes="(max-width: 1280px) 100vw, 1280px"
            className="cta-bg-img"
          />
          <div className="cta-content">
            <h2 className="cta-title">Need the Right Filtration Solution?</h2>
            <p className="cta-text">
              Whether you need a single replacement filter or filtration products for ongoing industrial requirements, our team is ready to assist. Tell us what you need — we&apos;ll help you find the right solution.
            </p>
            <div className="cta-actions">
              <a href="#contact" className="btn-primary">Request a Quote <ArrowRight className="w-4 h-4" /></a>
              <a href="#contact" className="btn-outline-light">Contact Us</a>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
