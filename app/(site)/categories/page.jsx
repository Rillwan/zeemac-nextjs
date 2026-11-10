import { prisma } from '@/lib/prisma';
import PageHero from '@/components/site/PageHero';
import CategoryTile from '@/components/site/CategoryTile';

export const metadata = {
  title: 'Categories',
  description: 'Browse Zeemac Filters filtration products by category — marine engine, oil, fuel, air, hydraulic, water, compressor and industrial filters.'
};
export const dynamic = 'force-dynamic';

export default async function CategoriesPage() {
  const categories = await prisma.category.findMany({
    orderBy: [{ order: 'asc' }, { id: 'asc' }],
    include: { _count: { select: { products: { where: { status: 'active' } } } } }
  });

  return (
    <>
      <PageHero
        eyebrow="Shop by Filter Category"
        title="Find the Right Filtration Solution for **Your Industry**"
        description="We offer a complete range of high-quality filtration products for marine, industrial and automotive applications."
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Categories' }]}
        showTrust
      />

      <section className="py-10 lg:py-14 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {categories.map((c) => (
              <CategoryTile key={c.id} category={c} count={c._count.products} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
