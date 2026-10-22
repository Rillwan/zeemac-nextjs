import Link from 'next/link';
import { Plus } from 'lucide-react';
import { prisma } from '@/lib/prisma';
import HeroSlideTable from '@/components/admin/HeroSlideTable';

export const metadata = { title: 'Hero Slides' };
export const dynamic = 'force-dynamic';

export default async function AdminHeroSlidesPage() {
  const slides = await prisma.heroSlide.findMany({ orderBy: { order: 'asc' } });

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-lg font-bold text-brand-navy">Hero Slides</h2>
        <Link href="/admin/hero-slides/new" className="btn-primary">
          <Plus className="w-4 h-4" /> Add Slide
        </Link>
      </div>
      <p className="text-sm text-slate-500 mb-6">
        Slides play in order, lowest Order number first. Hidden slides are not shown on the website.
        With only one slide, the slider arrows and dots do not appear.
      </p>
      <HeroSlideTable initialSlides={slides} />
    </div>
  );
}
