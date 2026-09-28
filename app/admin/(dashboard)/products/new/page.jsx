import ProductForm from '@/components/admin/ProductForm';

export const metadata = { title: 'Add Product' };

export default function NewProductPage() {
  return (
    <div>
      <h2 className="text-lg font-bold text-brand-navy mb-6">Add Product</h2>
      <ProductForm />
    </div>
  );
}
