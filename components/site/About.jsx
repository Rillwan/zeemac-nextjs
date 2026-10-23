import Image from "next/image";
import Reveal from "@/components/site/Reveal";
import { ArrowRight } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { SITE_CONTENT_DEFAULTS } from "@/lib/siteContentDefaults";

export default async function About() {
  const content = await prisma.siteContent.findUnique({
    where: { section: "about" },
  });

  return (
    <section id="about" className="pt-12 pb-20">
      <div className="max-w-7xl mx-auto px-6 lg:px-10 grid lg:grid-cols-2 gap-14 items-center">
        <Reveal as="div" className="about-image-wrap ">
          <Image
            src={content?.image || SITE_CONTENT_DEFAULTS.about.image}
            alt={content?.imageAlt || SITE_CONTENT_DEFAULTS.about.imageAlt}
            width={640}
            height={480}
            className="w-full h-auto"
          />
          <div className="absolute bg-white z-[2] -bottom-6 -left-6 p-6 rounded-xl shadow-xl border border-slate-100 hidden sm:block max-w-xs">
            <p className="text-sm font-semibold text-slate-800">
              ISO Certified Filtration Standards
            </p>
            <p className="text-xs text-slate-500 mt-1">
              Trusted by engineers and industrial clients worldwide.
            </p>
          </div>
        </Reveal>

        <div>
          <Reveal as="p" className="eyebrow">
            About Us
          </Reveal>
          <Reveal as="h2" className="section-title mt-3" delay={0.05}>
            {" "}
            {content?.heading || SITE_CONTENT_DEFAULTS.about.heading}{" "}
          </Reveal>
          <Reveal as="p" className="mt-4 text-slate-500 max-w-md" delay={0.1}>
            {content?.body1 || SITE_CONTENT_DEFAULTS.about.body1}
          </Reveal>
          <Reveal as="p" className="mt-4 text-slate-500 max-w-md" delay={0.15}>
            {content?.body2 || SITE_CONTENT_DEFAULTS.about.body2}
          </Reveal>
          <Reveal as="p" className="mt-4 text-slate-500 max-w-md" delay={0.2}>
            {content?.body3 || SITE_CONTENT_DEFAULTS.about.body3}
          </Reveal>
          <Reveal
            as="a"
            href="/about"
            className="btn-primary mt-8"
            delay={0.25}
          >
            About Zeemac Filters <ArrowRight className="w-4 h-4" />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
