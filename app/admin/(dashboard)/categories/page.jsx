import Link from 'next/link';
import { Plus } from 'lucide-react';
import { prisma } from '@/lib/prisma';
import CategoryTable from '@/components/admin/CategoryTable';

export const metadata = { title: 'Categories' };
export const dynamic = 'force-dynamic';

export default async function AdminCategoriesPage() {
  const categories = await prisma.category.findMany({ orderBy: { order: 'asc' } });

  return (
    <div className="max-w-3xl">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-bold text-brand-navy">Categories</h2>
        <Link href="/admin/categories/new" className="btn-primary">
          <Plus className="w-4 h-4" /> Add Category
        </Link>
      </div>
      <CategoryTable initialCategories={categories} />
    </div>
  );
}
