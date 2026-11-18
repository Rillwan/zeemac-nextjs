import { prisma } from '@/lib/prisma';
import ShowcaseBrandForm from '@/components/admin/ShowcaseBrandForm';

export const metadata = { title: 'Add Brand Slide' };
export const dynamic = 'force-dynamic';

export default async function NewShowcaseBrandPage() {
  const brands = await prisma.brand.findMany({
    orderBy: [{ order: 'asc' }, { id: 'asc' }],
    select: { id: true, name: true, slug: true }
  });

  return (
    <div>
      <h2 className="text-lg font-bold text-brand-navy mb-6">Add Brand Slide</h2>
      <ShowcaseBrandForm brands={brands} />
    </div>
  );
}
