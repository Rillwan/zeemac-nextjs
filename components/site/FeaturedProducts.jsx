import { ArrowRight } from 'lucide-react';
import { prisma } from '@/lib/prisma';
import Reveal from '@/components/site/Reveal';
import ProductCard from '@/components/site/ProductCard';

export default async function FeaturedProducts() {
  const products = await prisma.product.findMany({
    where: { featured: true, status: 'active' },
    orderBy: { order: 'asc' },
    take: 8,
    include: { brand: true, category: true, images: { orderBy: { order: 'asc' }, take: 1 } }
  });

  if (products.length === 0) return null;

  return (
    <section className="section-pad">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="flex flex-wrap items-end justify-between gap-6 mb-12">
          <div className="max-w-xl">
            <Reveal as="p" className="eyebrow">Featured Products</Reveal>
            <Reveal as="h2" className="section-title mt-3" delay={0.05}>Popular Filtration Products</Reveal>
          </div>
          <Reveal as="a" href="/products" className="btn-outline shrink-0" delay={0.1}>
            View All Products <ArrowRight className="w-4 h-4" />
          </Reveal>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((p, i) => (
            <Reveal as="div" key={p.id} delay={(i % 4) * 0.05}>
              <ProductCard product={p} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
