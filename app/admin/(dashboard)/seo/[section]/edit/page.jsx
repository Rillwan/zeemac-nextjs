import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import SeoForm from '@/components/admin/SeoForm';

const VALID_SECTIONS = { hero: 'Homepage', about: 'About Page' };

export const dynamic = 'force-dynamic';

export default async function EditSeoPage({ params }) {
  const { section } = await params;
  if (!VALID_SECTIONS[section]) notFound();

  const content = await prisma.siteContent.findUnique({ where: { section } });

  return (
    <div>
      <h2 className="text-lg font-bold text-brand-navy mb-6">SEO: {VALID_SECTIONS[section]}</h2>
      <SeoForm section={section} initialContent={content} />
    </div>
  );
}