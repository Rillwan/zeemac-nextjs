import Link from 'next/link';
import { Plus } from 'lucide-react';
import { prisma } from '@/lib/prisma';
import BrandTable from '@/components/admin/BrandTable';

export const metadata = { title: 'Brands' };
export const dynamic = 'force-dynamic';

export default async function AdminBrandsPage() {
  const brands = await prisma.brand.findMany({ orderBy: { order: 'asc' } });

  return (
    <div className="max-w-3xl">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-bold text-brand-navy">Brands</h2>
        <Link href="/admin/brands/new" className="btn-primary">
          <Plus className="w-4 h-4" /> Add Brand
        </Link>
      </div>
      <BrandTable initialBrands={brands} />
    </div>
  );
}
