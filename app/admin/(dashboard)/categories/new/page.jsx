import CategoryForm from '@/components/admin/CategoryForm';

export const metadata = { title: 'Add Category' };

export default function NewCategoryPage() {
  return (
    <div>
      <h2 className="text-lg font-bold text-brand-navy mb-6">Add Category</h2>
      <CategoryForm />
    </div>
  );
}
