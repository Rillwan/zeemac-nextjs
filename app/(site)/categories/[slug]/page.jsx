import { notFound } from 'next/navigation';
import { PackageSearch } from 'lucide-react';
import { prisma } from '@/lib/prisma';
import PageHero from '@/components/site/PageHero';
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
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <PageHero
        eyebrow="Category"
        title={category.name}
        description={category.description}
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Categories', href: '/categories' },
          { label: category.name }
        ]}
      />

      <section className="py-10 lg:py-14 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          {products.length === 0 ? (
            <div className="flex flex-col items-center text-center py-20 text-slate-400">
              <PackageSearch className="w-10 h-10 mb-3" />
              <p>No products in this category yet.</p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {products.map((p) => <ProductCard product={p} key={p.id} />)}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
