import { prisma } from '@/lib/prisma';
import EnquiryTable from '@/components/admin/EnquiryTable';

export const metadata = { title: 'Enquiries' };
export const dynamic = 'force-dynamic';

export default async function AdminEnquiriesPage() {
  const enquiries = await prisma.enquiry.findMany({
    orderBy: { createdAt: 'desc' },
    take: 500,
    select: {
      id: true,
      name: true,
      company: true,
      phone: true,
      email: true,
      topic: true,
      message: true,
      status: true,
      createdAt: true
    }
  });

  const serialised = enquiries.map((e) => ({ ...e, createdAt: e.createdAt.toISOString() }));

  return (
    <div className="w-full">
      <h2 className="text-lg font-bold text-brand-navy mb-2">Enquiries</h2>
      <p className="text-sm text-slate-500 mb-6">
        Messages sent through the Contact page, newest first. Mark an enquiry as handled once you have replied.
      </p>
      <EnquiryTable initialEnquiries={serialised} />
    </div>
  );
}
