import Image from 'next/image';
import Link from 'next/link';
import { PackageSearch } from 'lucide-react';
import { prisma } from '@/lib/prisma';

export const metadata = {
  title: 'Categories',
  description: 'Browse Zeemac Filters filtration products by category — marine engine, oil, fuel, air, hydraulic, water, compressor and industrial filters.'
};
export const dynamic = 'force-dynamic';

export default async function CategoriesPage() {
  const categories = await prisma.category.findMany({
    orderBy: { order: 'asc' },
    include: { _count: { select: { products: { where: { status: 'active' } } } } }
  });

  return (
    <div className="section-pad pt-32 lg:pt-40">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <p className="eyebrow">Explore Our Products</p>
        <h1 className="section-title mt-3 mb-10">Product Categories</h1>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((c) => (
            <Link key={c.id} href={`/categories/${c.slug}`} className="category-card block">
              <div className="category-icon">
                {c.image ? <Image src={c.image} alt={c.name} width={24} height={24} className="object-contain" /> : <PackageSearch className="w-5 h-5" />}
              </div>
              <h3>{c.name}</h3>
              {c.description && <p>{c.description}</p>}
              <p className="product-meta mt-2">{c._count.products} product{c._count.products === 1 ? '' : 's'}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
