import Image from "next/image";
import Reveal from "@/components/site/Reveal";
import { ArrowRight } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { SITE_CONTENT_DEFAULTS } from "@/lib/siteContentDefaults";

export default async function CTA() {
  const content = await prisma.siteContent.findUnique({
    where: { section: "cta" },
  });

  return (
    <section id="contact" className="section-pad pt-0">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <Reveal as="div" className="cta-banner">
          <Image
            src={content?.image || "/images/about.jpeg"}
            alt={content?.imageAlt || "Zeemac filtration solutions"}
            fill
            sizes="(max-width: 1280px) 100vw, 1280px"
            className="cta-bg-img"
          />
          <div className="cta-content">
            <h2 className="cta-title">
              {content?.heading || SITE_CONTENT_DEFAULTS.cta.heading}
            </h2>
            <p className="cta-text">
              {content?.body1 || SITE_CONTENT_DEFAULTS.cta.body1}
            </p>
            <div className="cta-actions">
              <a href="#contact" className="btn-primary">
                Request a Quote <ArrowRight className="w-4 h-4" />
              </a>
              <a href="#contact" className="btn-outline-light">
                Contact Us
              </a>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
