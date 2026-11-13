import Link from 'next/link';
import { Plus } from 'lucide-react';
import { prisma } from '@/lib/prisma';
import BannerTable from '@/components/admin/BannerTable';

export const metadata = { title: 'Banners' };
export const dynamic = 'force-dynamic';

export default async function AdminBannersPage() {
  const banners = await prisma.banner.findMany({ orderBy: [{ order: 'asc' }, { id: 'asc' }] });

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-lg font-bold text-brand-navy">Banners</h2>
        <Link href="/admin/banners/new" className="btn-primary">
          <Plus className="w-4 h-4" /> Add Banner
        </Link>
      </div>
      <p className="text-sm text-slate-500 mb-6">
        Full-width banners that slide on the homepage, just below the brands strip. They slide in order, lowest Order number first.
        Desktop picture: 1920 x 640 px (3:1), under 300 KB. Optional phone picture: 1200 x 900 px (4:3).
        Upload a phone picture for every banner, or for none, so the slider keeps one height.
      </p>
      <BannerTable initialBanners={banners} />
    </div>
  );
}
