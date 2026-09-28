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
