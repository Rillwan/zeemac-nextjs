import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import BrandForm from '@/components/admin/BrandForm';

export const metadata = { title: 'Edit Brand' };
export const dynamic = 'force-dynamic';

export default async function EditBrandPage({ params }) {
  const { id } = await params;
  const brand = await prisma.brand.findUnique({ where: { id: Number(id) } });
  if (!brand) notFound();

  return (
    <div>
      <h2 className="text-lg font-bold text-brand-navy mb-6">Edit Brand</h2>
      <BrandForm initialBrand={brand} />
    </div>
  );
}
