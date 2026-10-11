import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import HomepageItemForm from '@/components/admin/HomepageItemForm';

export const metadata = { title: 'Edit Homepage Item' };
export const dynamic = 'force-dynamic';

export default async function EditHomepageItemPage({ params, searchParams }) {
  const { id } = await params;
  const sp = await searchParams;
  const item = await prisma.homepageItem.findUnique({ where: { id: Number(id) } });
  if (!item) notFound();

  return (
    <div>
      <h2 className="text-lg font-bold text-brand-navy mb-6">Edit Item</h2>
      <HomepageItemForm section={sp?.section || item.section} initialItem={item} />
    </div>
  );
}