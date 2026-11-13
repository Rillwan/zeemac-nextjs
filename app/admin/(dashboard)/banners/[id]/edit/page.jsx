import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import BannerForm from '@/components/admin/BannerForm';

export const metadata = { title: 'Edit Banner' };
export const dynamic = 'force-dynamic';

export default async function EditBannerPage({ params }) {
  const { id } = await params;
  const banner = await prisma.banner.findUnique({ where: { id: Number(id) } });
  if (!banner) notFound();

  return (
    <div>
      <h2 className="text-lg font-bold text-brand-navy mb-6">Edit Banner</h2>
      <BannerForm initialBanner={banner} />
    </div>
  );
}
