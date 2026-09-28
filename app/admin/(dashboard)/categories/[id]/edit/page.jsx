import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import CategoryForm from '@/components/admin/CategoryForm';

export const metadata = { title: 'Edit Category' };
export const dynamic = 'force-dynamic';

export default async function EditCategoryPage({ params }) {
  const { id } = await params;
  const category = await prisma.category.findUnique({ where: { id: Number(id) } });
  if (!category) notFound();

  return (
    <div>
      <h2 className="text-lg font-bold text-brand-navy mb-6">Edit Category</h2>
      <CategoryForm initialCategory={category} />
    </div>
  );
}
