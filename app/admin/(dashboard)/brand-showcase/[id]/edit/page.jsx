import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import ShowcaseBrandForm from '@/components/admin/ShowcaseBrandForm';

export const metadata = { title: 'Edit Brand Slide' };
export const dynamic = 'force-dynamic';

export default async function EditShowcaseBrandPage({ params }) {
  const { id } = await params;
  const [brand, brands] = await Promise.all([
    prisma.showcaseBrand.findUnique({ where: { id: Number(id) } }),
    prisma.brand.findMany({
      orderBy: [{ order: 'asc' }, { id: 'asc' }],
      select: { id: true, name: true, slug: true }
    })
  ]);
  if (!brand) notFound();

  return (
    <div>
      <h2 className="text-lg font-bold text-brand-navy mb-6">Edit Brand Slide</h2>
      <ShowcaseBrandForm initialBrand={brand} brands={brands} />
    </div>
  );
}
