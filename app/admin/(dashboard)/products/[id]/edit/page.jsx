import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import ProductForm from '@/components/admin/ProductForm';

export const metadata = { title: 'Edit Product' };
export const dynamic = 'force-dynamic';

export default async function EditProductPage({ params }) {
  const { id } = await params;
  const product = await prisma.product.findUnique({
    where: { id: Number(id) },
    include: { brand: true, category: true, images: { orderBy: { order: 'asc' } } }
  });

  if (!product) notFound();

  return (
    <div>
      <h2 className="text-lg font-bold text-brand-navy mb-6">Edit Product</h2>
      <ProductForm initialProduct={product} />
    </div>
  );
}
