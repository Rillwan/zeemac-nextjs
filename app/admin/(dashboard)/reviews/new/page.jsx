import ReviewForm from '@/components/admin/ReviewForm';

export const metadata = { title: 'Add Review' };

export default function NewReviewPage() {
  return (
    <div>
      <h2 className="text-lg font-bold text-brand-navy mb-6">Add Review</h2>
      <ReviewForm />
    </div>
  );
}
