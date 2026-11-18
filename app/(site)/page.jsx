import Hero from "@/components/site/Hero";
import BrandsStrip from "@/components/site/BrandsStrip";
import Banners from "@/components/site/Banners";
import About from "@/components/site/About";
import Categories from "@/components/site/Categories";
import FeaturedProducts from "@/components/site/FeaturedProducts";
import BrandShowcase from "@/components/site/BrandShowcase";
import OilBattery from "@/components/site/OilBattery";
import Industries from "@/components/site/Industries";
import WhyChoose from "@/components/site/WhyChoose";
import Reviews from "@/components/site/Reviews";
import ProductFinder from "@/components/site/ProductFinder";
import CTA from "@/components/site/CTA";
import OfferPopup from "@/components/site/OfferPopup";
import { prisma } from "@/lib/prisma";
import { getSettings } from "@/lib/settings";
import { toSlide } from "@/lib/brandShowcase";
import { SITE_CONTENT_DEFAULTS } from "@/lib/siteContentDefaults";

export const dynamic = "force-dynamic";

export async function generateMetadata() {
  const hero = await prisma.siteContent.findUnique({
    where: { section: "hero" },
  });
  return {
    title: hero?.seoTitle || "Zeemac Filters | Complete Filtration Solutions",
    description:
      hero?.metaDescription ||
      "Zeemac Filters supplies a comprehensive range of filtration products for marine engines, industrial machinery, hydraulic systems, compressors and power plants.",
    keywords: hero?.focusKeyword ? [hero.focusKeyword] : undefined,
  };
}

async function loadShowcase() {
  try {
    const [rows, content] = await Promise.all([
      prisma.showcaseBrand.findMany({
        where: { isActive: true },
        orderBy: [{ order: "asc" }, { id: "asc" }],
      }),
      prisma.siteContent.findUnique({ where: { section: "brandshowcase" } }),
    ]);
    const defaults = SITE_CONTENT_DEFAULTS.brandshowcase;
    return {
      brands: rows.map(toSlide),
      header: {
        eyebrow: content?.eyebrow || defaults.eyebrow,
        heading: content?.heading || defaults.heading,
        subtext: content?.body1 || defaults.body1,
      },
    };
  } catch {
    return { brands: [], header: {} };
  }
}

export default async function HomePage() {
  const settings = await getSettings();
  const showcase = await loadShowcase();
  const [slides, stripBrands, productFinderContent, popupRow] = await Promise.all([
    prisma.heroSlide.findMany({
      where: { isActive: true },
      orderBy: { order: "asc" },
    }),
    prisma.brand.findMany({
      where: { logo: { not: null } },
      orderBy: [{ order: "asc" }, { id: "asc" }],
      take: 20,
      select: { id: true, name: true, slug: true, logo: true },
    }),
    prisma.siteContent.findUnique({ where: { section: "productfinder" } }),
    prisma.siteContent.findUnique({ where: { section: "popup" } }),
  ]);

  const popup =
    popupRow && popupRow.isActive && popupRow.heading
      ? {
          eyebrow: popupRow.eyebrow || "",
          heading: popupRow.heading,
          body: popupRow.body1 || "",
          terms: popupRow.body2 || "",
          image: popupRow.image || "",
          imageAlt: popupRow.imageAlt || "",
          primaryText: popupRow.tagline || "Claim Your Discount",
          primaryLink: popupRow.body3 || "#contact",
          secondaryText: popupRow.headingLine2 || "",
        }
      : null;

  return (
    <>
      <Hero slides={slides} />
      <Banners />
      <BrandsStrip brands={stripBrands} />
      <About />
      <Categories />
      <FeaturedProducts />
      {showcase.brands.length > 0 && (
        <BrandShowcase brands={showcase.brands} header={showcase.header} />
      )}
      <OilBattery />
      <Industries />
      <WhyChoose />
      <Reviews />
      <ProductFinder data={productFinderContent} whatsappNumber={settings.whatsappNumber} />
      <CTA data={slides} />
      {popup && (
        <OfferPopup
          data={popup}
          version={String(popupRow.updatedAt.getTime())}
          intervalMinutes={popupRow.intervalMinutes ?? 15}
        />
      )}
    </>
  );
}
