import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import ReviewForm from '@/components/admin/ReviewForm';

export const metadata = { title: 'Edit Review' };
export const dynamic = 'force-dynamic';

export default async function EditReviewPage({ params }) {
  const { id } = await params;
  const review = await prisma.review.findUnique({ where: { id: Number(id) } });
  if (!review) notFound();

  return (
    <div>
      <h2 className="text-lg font-bold text-brand-navy mb-6">Edit Review</h2>
      <ReviewForm initialReview={review} />
    </div>
  );
}
