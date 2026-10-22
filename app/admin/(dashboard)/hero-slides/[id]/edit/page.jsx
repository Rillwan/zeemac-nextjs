import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import HeroSlideForm from '@/components/admin/HeroSlideForm';

export const metadata = { title: 'Edit Hero Slide' };
export const dynamic = 'force-dynamic';

export default async function EditHeroSlidePage({ params }) {
  const { id } = await params;
  const slide = await prisma.heroSlide.findUnique({ where: { id: Number(id) } });
  if (!slide) notFound();

  return (
    <div>
      <h2 className="text-lg font-bold text-brand-navy mb-6">Edit Hero Slide</h2>
      <HeroSlideForm initialSlide={slide} />
    </div>
  );
}
