import Link from 'next/link';
import { Plus } from 'lucide-react';
import { prisma } from '@/lib/prisma';
import ProductTable from '@/components/admin/ProductTable';

export const metadata = { title: 'Dashboard' };
export const dynamic = 'force-dynamic';

export default async function AdminDashboardPage() {
  const products = await prisma.product.findMany({
    orderBy: { order: 'asc' },
    include: { brand: true, category: true }
  });

  return (
    <div className="">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-bold text-brand-navy">Products</h2>
        <Link href="/admin/products/new" className="btn-primary">
          <Plus className="w-4 h-4" /> Add Product
        </Link>
      </div>
      <ProductTable initialProducts={products} />
    </div>
  );
}
