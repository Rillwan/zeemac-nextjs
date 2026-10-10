import Hero from '@/components/site/Hero';
import About from '@/components/site/About';
import Categories from '@/components/site/Categories';
import FeaturedProducts from '@/components/site/FeaturedProducts';
import Brands from '@/components/site/Brands';
import Industries from '@/components/site/Industries';
import WhyChoose from '@/components/site/WhyChoose';
import ProductFinder from '@/components/site/ProductFinder';
import CTA from '@/components/site/CTA';
import { prisma } from '@/lib/prisma';

export async function generateMetadata() {
  const hero = await prisma.siteContent.findUnique({ where: { section: 'hero' } });
  return {
    title: hero?.seoTitle || 'Zeemac Filters | Complete Filtration Solutions',
    description: hero?.metaDescription || 'Zeemac Filters supplies a comprehensive range of filtration products for marine engines, industrial machinery, hydraulic systems, compressors and power plants.',
    keywords: hero?.focusKeyword ? [hero.focusKeyword] : undefined
  };
}

export default async function HomePage() {
  const [heroContent, ctaContent] = await Promise.all([
    prisma.siteContent.findUnique({ where: { section: 'hero' } }),
    prisma.siteContent.findUnique({ where: { section: 'cta' } })
  ]);

  return (
    <>
      <Hero data={heroContent} />
      <About />
      <Categories />
      <FeaturedProducts />
      <Brands />
      <Industries />
      <WhyChoose />
      <ProductFinder />
      <CTA data={heroContent} />
    </>
  );
}
