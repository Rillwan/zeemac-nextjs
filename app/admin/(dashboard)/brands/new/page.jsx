import BrandForm from '@/components/admin/BrandForm';

export const metadata = { title: 'Add Brand' };

export default function NewBrandPage() {
  return (
    <div>
      <h2 className="text-lg font-bold text-brand-navy mb-6">Add Brand</h2>
      <BrandForm />
    </div>
  );
}
