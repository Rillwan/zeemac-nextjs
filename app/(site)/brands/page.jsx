import Image from 'next/image';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import PageHero from '@/components/site/PageHero';

export const metadata = {
  title: 'Brands',
  description: 'Filtration products from established brands, supplied by Zeemac Filters.'
};
export const dynamic = 'force-dynamic';

export default async function BrandsPage() {
  const brands = await prisma.brand.findMany({
    orderBy: { order: 'asc' },
    include: { _count: { select: { products: { where: { status: 'active' } } } } }
  });

  return (
    <>
      <PageHero
        eyebrow="Trusted Brands We Supply"
        title="Genuine Filters from **Trusted Manufacturers**"
        description="We work with globally recognized manufacturers to deliver genuine products and reliable supply."
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Brands' }]}
        showTrust
      />

      <section className="py-10 lg:py-14 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
            {brands.map((b) => (
              <Link key={b.id} href={`/brands/${b.slug}`} className="brand-tile">
                <div className="relative h-16 w-full">
                  {b.logo ? (
                    <Image
                      src={b.logo}
                      alt={`${b.name} logo`}
                      fill
                      sizes="(min-width: 1024px) 220px, 45vw"
                      className="object-contain"
                    />
                  ) : (
                    <span className="flex h-full items-center justify-center font-bold text-brand-navy">{b.name}</span>
                  )}
                </div>
                <span className="mt-4 text-sm font-semibold text-brand-navy">{b.name}</span>
                <span className="text-xs text-slate-500">
                  {b._count.products} product{b._count.products === 1 ? '' : 's'}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
