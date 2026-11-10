import Link from 'next/link';
import { Plus } from 'lucide-react';
import { prisma } from '@/lib/prisma';
import ReviewTable from '@/components/admin/ReviewTable';

export const metadata = { title: 'Reviews' };
export const dynamic = 'force-dynamic';

export default async function AdminReviewsPage() {
  const reviews = await prisma.review.findMany({ orderBy: [{ order: 'asc' }, { id: 'asc' }] });

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-lg font-bold text-brand-navy">Google Reviews</h2>
        <Link href="/admin/reviews/new" className="btn-primary">
          <Plus className="w-4 h-4" /> Add Review
        </Link>
      </div>
      <p className="text-sm text-slate-500 mb-6">
        Reviews slide in order, lowest Order number first. Hidden reviews are not shown on the website.
        Add only genuine reviews from your Google Business profile and keep the wording as the customer wrote it.
        The rating summary and the Google buttons are set in Page content → Reviews Section.
      </p>
      <ReviewTable initialReviews={reviews} />
    </div>
  );
}
