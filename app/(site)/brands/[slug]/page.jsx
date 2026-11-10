import Image from 'next/image';
import { notFound } from 'next/navigation';
import { PackageSearch } from 'lucide-react';
import { prisma } from '@/lib/prisma';
import PageHero from '@/components/site/PageHero';
import ProductCard from '@/components/site/ProductCard';

export const dynamic = 'force-dynamic';

async function getBrand(slug) {
  return prisma.brand.findUnique({ where: { slug } });
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const brand = await getBrand(slug);
  if (!brand) return {};
  return {
    title: brand.name,
    description: brand.description || `Browse ${brand.name} filtration products from Zeemac Filters.`
  };
}

export default async function BrandDetailPage({ params }) {
  const { slug } = await params;
  const brand = await getBrand(slug);
  if (!brand) notFound();

  const products = await prisma.product.findMany({
    where: { brandId: brand.id, status: 'active' },
    orderBy: { order: 'asc' },
    include: { brand: true, category: true, images: { orderBy: { order: 'asc' }, take: 1 } }
  });

  const SITE_URL = 'https://www.zeemacfilters.com';
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE_URL}/` },
      { '@type': 'ListItem', position: 2, name: 'Brands', item: `${SITE_URL}/brands` },
      { '@type': 'ListItem', position: 3, name: brand.name, item: `${SITE_URL}/brands/${brand.slug}` }
    ]
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <PageHero
        eyebrow="Brand"
        title={brand.name}
        description={brand.description}
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Brands', href: '/brands' },
          { label: brand.name }
        ]}
      >
        {brand.logo && (
          <div className="hidden sm:flex w-32 h-32 shrink-0 items-center justify-center rounded-2xl border border-slate-200 bg-white p-4">
            <Image
              src={brand.logo}
              alt={`${brand.name} logo`}
              width={128}
              height={128}
              className="object-contain w-full h-full"
            />
          </div>
        )}
      </PageHero>

      <section className="py-10 lg:py-14 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-brand-navy">Products from {brand.name}</h2>
            <span className="text-sm text-slate-400">
              {products.length} product{products.length === 1 ? '' : 's'}
            </span>
          </div>

          {products.length === 0 ? (
            <div className="flex flex-col items-center text-center py-20 text-slate-400">
              <PackageSearch className="w-10 h-10 mb-3" />
              <p>No products from this brand yet.</p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {products.map((p) => <ProductCard product={p} key={p.id} />)}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
