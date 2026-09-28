import Image from 'next/image';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';

export const metadata = {
  title: 'Brands',
  description: 'Filtration products from established brands, supplied by Zeemac Group.'
};
export const dynamic = 'force-dynamic';

export default async function BrandsPage() {
  const brands = await prisma.brand.findMany({
    orderBy: { order: 'asc' },
    include: { _count: { select: { products: { where: { status: 'active' } } } } }
  });

  return (
    <div className="section-pad pt-32 lg:pt-40">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <p className="eyebrow">Trusted Brands</p>
        <h1 className="section-title mt-3 mb-10">Our Brands</h1>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {brands.map((b) => (
            <Link key={b.id} href={`/brands/${b.slug}`} className="brand-badge flex-col gap-1">
              {b.logo ? (
                <Image src={b.logo} alt={b.name} width={64} height={32} className="object-contain" />
              ) : (
                <span>{b.name}</span>
              )}
              <span className="text-[10px] font-semibold text-slate-400">{b._count.products} product{b._count.products === 1 ? '' : 's'}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
