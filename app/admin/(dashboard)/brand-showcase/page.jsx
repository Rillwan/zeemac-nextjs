import Link from 'next/link';
import { Plus, Pencil } from 'lucide-react';
import { prisma } from '@/lib/prisma';
import ShowcaseBrandTable from '@/components/admin/ShowcaseBrandTable';

export const metadata = { title: 'Brand Showcase' };
export const dynamic = 'force-dynamic';

export default async function AdminBrandShowcasePage() {
  const brands = await prisma.showcaseBrand.findMany({ orderBy: [{ order: 'asc' }, { id: 'asc' }] });

  return (
    <div className="w-full">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
        <h2 className="text-lg font-bold text-brand-navy">Brand Showcase (Brands We Distribute)</h2>
        <Link href="/admin/brand-showcase/new" className="btn-primary">
          <Plus className="w-4 h-4" /> Add Brand Slide
        </Link>
      </div>
      <p className="text-sm text-slate-500 mb-4">
        The tabbed section on the homepage, just after Featured Products. Each brand slide becomes one tab, and the
        slides play in this order, top first.
      </p>
      <Link
        href="/admin/content/brandshowcase/edit"
        className="inline-flex items-center gap-2 text-sm font-semibold text-brand mb-6"
      >
        <Pencil className="w-4 h-4" /> Edit the section heading
      </Link>
      <ShowcaseBrandTable initialBrands={brands} />
    </div>
  );
}
