import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import SiteContentForm from '@/components/admin/SiteContentForm';

const VALID_SECTIONS = { hero: 'Homepage Hero', about: 'About Section', cta: 'Quote CTA Banner' };

export const dynamic = 'force-dynamic';

export default async function EditContentPage({ params }) {
  const { section } = await params;
  if (!VALID_SECTIONS[section]) notFound();

  const content = await prisma.siteContent.findUnique({ where: { section } });

  return (
    <div>
      <h2 className="text-lg font-bold text-brand-navy mb-6">Edit: {VALID_SECTIONS[section]}</h2>
      <SiteContentForm section={section} initialContent={content} />
    </div>
  );
}