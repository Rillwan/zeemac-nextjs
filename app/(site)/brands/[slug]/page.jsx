import Image from 'next/image';
import { notFound } from 'next/navigation';
import { PackageSearch } from 'lucide-react';
import { prisma } from '@/lib/prisma';
import ProductCard from '@/components/site/ProductCard';

export const dynamic = 'force-dynamic';

async function getBrand(slug) {
  return prisma.brand.findUnique({ where: { slug } });
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const brand = await getBrand(slug);
  if (!brand) return {};
  return { title: brand.name, description: `Browse ${brand.name} filtration products from Zeemac Group.` };
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

  const SITE_URL = 'https://www.zeemacgroup.com';
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
    <div className="section-pad pt-32 lg:pt-40">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="flex items-center gap-4 mb-2">
          {brand.logo && (
            <div className="w-16 h-16 rounded-xl border border-slate-200 flex items-center justify-center p-2">
              <Image src={brand.logo} alt={brand.name} width={48} height={48} className="object-contain" />
            </div>
          )}
          <div>
            <p className="eyebrow">Brand</p>
            <h1 className="section-title mt-1">{brand.name}</h1>
          </div>
        </div>

        {products.length === 0 ? (
          <div className="flex flex-col items-center text-center py-20 text-slate-400">
            <PackageSearch className="w-10 h-10 mb-3" />
            <p>No products from this brand yet.</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-10">
            {products.map((p) => <ProductCard product={p} key={p.id} />)}
          </div>
        )}
      </div>
    </div>
  );
}
