import { notFound } from 'next/navigation';
import { PackageSearch } from 'lucide-react';
import { prisma } from '@/lib/prisma';
import ProductCard from '@/components/site/ProductCard';

export const dynamic = 'force-dynamic';

async function getCategory(slug) {
  return prisma.category.findUnique({ where: { slug } });
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const category = await getCategory(slug);
  if (!category) return {};
  return {
    title: category.name,
    description: category.description || `Browse ${category.name} from Zeemac Filters.`
  };
}

export default async function CategoryDetailPage({ params }) {
  const { slug } = await params;
  const category = await getCategory(slug);
  if (!category) notFound();

  const products = await prisma.product.findMany({
    where: { categoryId: category.id, status: 'active' },
    orderBy: { order: 'asc' },
    include: { brand: true, category: true, images: { orderBy: { order: 'asc' }, take: 1 } }
  });

  const SITE_URL = 'https://www.zeemacfilters.com';
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE_URL}/` },
      { '@type': 'ListItem', position: 2, name: 'Categories', item: `${SITE_URL}/categories` },
      { '@type': 'ListItem', position: 3, name: category.name, item: `${SITE_URL}/categories/${category.slug}` }
    ]
  };

  return (
    <div className="section-pad pt-32 lg:pt-40">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <p className="eyebrow">Category</p>
        <h1 className="section-title mt-3">{category.name}</h1>
        {category.description && <p className="mt-4 text-slate-500 max-w-xl">{category.description}</p>}

        {products.length === 0 ? (
          <div className="flex flex-col items-center text-center py-20 text-slate-400">
            <PackageSearch className="w-10 h-10 mb-3" />
            <p>No products in this category yet.</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-10">
            {products.map((p) => <ProductCard product={p} key={p.id} />)}
          </div>
        )}
      </div>
    </div>
  );
}
