import { prisma } from '@/lib/prisma';
import ProductFilters from '@/components/site/ProductFilters';
import ProductCard from '@/components/site/ProductCard';
import { PackageSearch } from 'lucide-react';

export const metadata = {
  title: 'Products',
  description: 'Browse marine and industrial filtration products from Zeemac Filters — engine, oil, fuel, air, hydraulic, water and compressor filters.'
};
export const dynamic = 'force-dynamic';

export default async function ProductsPage({ searchParams }) {
  const params = await searchParams;
  const q = params?.q?.trim() || '';
  const categorySlug = params?.category || '';
  const brandSlug = params?.brand || '';

  const where = {
    status: 'active',
    ...(q ? {
      OR: [
        { name: { contains: q } },
        { partNumber: { contains: q } },
        { shortDescription: { contains: q } }
      ]
    } : {}),
    ...(categorySlug ? { category: { slug: categorySlug } } : {}),
    ...(brandSlug ? { brand: { slug: brandSlug } } : {})
  };

  const [products, categories, brands] = await Promise.all([
    prisma.product.findMany({
      where,
      orderBy: { order: 'asc' },
      include: { brand: true, category: true, images: { orderBy: { order: 'asc' }, take: 1 } }
    }),
    prisma.category.findMany({ orderBy: { order: 'asc' } }),
    prisma.brand.findMany({ orderBy: { order: 'asc' } })
  ]);

  return (
    <div className="section-pad pt-32 lg:pt-40">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <p className="eyebrow">Our Products</p>
        <h1 className="section-title mt-3 mb-8">Filtration Products</h1>

        <ProductFilters categories={categories} brands={brands} />

        {products.length === 0 ? (
          <div className="flex flex-col items-center text-center py-20 text-slate-400">
            <PackageSearch className="w-10 h-10 mb-3" />
            <p>No products match your search.</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((p) => <ProductCard product={p} key={p.id} />)}
          </div>
        )}
      </div>
    </div>
  );
}
