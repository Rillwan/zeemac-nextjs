import Link from 'next/link';
import { notFound } from 'next/navigation';
import { FileText, ArrowRight } from 'lucide-react';
import { prisma } from '@/lib/prisma';
import ProductCard from '@/components/site/ProductCard';
import ProductGallery from '@/components/site/ProductGallery';
import Breadcrumbs from '@/components/site/Breadcrumbs';
import { getAllSpecs } from '@/lib/specs';
import { getSettings } from '@/lib/settings';
import { whatsappUrl } from '@/lib/contact';

export const dynamic = 'force-dynamic';

async function getProduct(slug) {
  return prisma.product.findUnique({
    where: { slug },
    include: { brand: true, category: true, images: { orderBy: { order: 'asc' } } }
  });
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) return {};

  return {
    title: product.seoTitle || product.name,
    description: product.metaDescription || product.shortDescription || undefined,
    keywords: product.focusKeyword ? [product.focusKeyword] : undefined,
    openGraph: product.images[0] ? { images: [{ url: product.images[0].url }] } : undefined
  };
}

function DetailBlock({ label, value }) {
  if (!value) return null;
  return (
    <div className="detail-card">
      <h3>{label}</h3>
      <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">{value}</p>
    </div>
  );
}

export default async function ProductDetailPage({ params }) {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product || product.status !== 'active') notFound();

  const related = await prisma.product.findMany({
    where: {
      status: 'active',
      id: { not: product.id },
      OR: [
        product.categoryId ? { categoryId: product.categoryId } : undefined,
        product.brandId ? { brandId: product.brandId } : undefined
      ].filter(Boolean)
    },
    take: 4,
    include: { brand: true, category: true, images: { orderBy: { order: 'asc' }, take: 1 } }
  });

  const settings = await getSettings();
  const { rows: specRows, notes: specNotes } = getAllSpecs(product.specifications);
  const hasSpecs = specRows.length > 0 || specNotes.length > 0;
  const hasDetails = Boolean(
    product.fullDescription || product.applications || product.compatibleModels || product.crossReference
  );

  const enquiryText = `Hi Zeemac Filters, I'd like to enquire about: ${product.name}${product.partNumber ? ` (Part No: ${product.partNumber})` : ''}`;

  const SITE_URL = 'https://www.zeemacfilters.com';
  const productSchema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.metaDescription || product.shortDescription || product.fullDescription || undefined,
    sku: product.partNumber || undefined,
    image: product.images.map((img) => `${SITE_URL}${img.url}`),
    brand: product.brand ? { '@type': 'Brand', name: product.brand.name } : undefined,
    category: product.category?.name
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE_URL}/` },
      { '@type': 'ListItem', position: 2, name: 'Products', item: `${SITE_URL}/products` },
      { '@type': 'ListItem', position: 3, name: product.name, item: `${SITE_URL}/products/${product.slug}` }
    ]
  };

  const crumbs = [
    { label: 'Home', href: '/' },
    { label: 'Products', href: '/products' },
    ...(product.category ? [{ label: product.category.name, href: `/categories/${product.category.slug}` }] : []),
    { label: product.name }
  ];

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      <section className="page-hero pt-28 pb-12 lg:pt-36 lg:pb-16">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <Breadcrumbs items={crumbs} />

          <div className="grid lg:grid-cols-2 gap-10 lg:gap-14 items-start">
            <ProductGallery images={product.images} name={product.name} badge={product.badge} />

            <div>
              <p className="section-eyebrow">{product.category?.name || 'Product'}</p>
              <h1 className="section-title mt-3">{product.name}</h1>
              <p className="text-sm text-slate-500 mt-3">
                {[product.brand?.name, product.partNumber && `Part No: ${product.partNumber}`].filter(Boolean).join(' • ')}
              </p>
              {product.shortDescription && (
                <p className="mt-5 text-slate-600 leading-relaxed">{product.shortDescription}</p>
              )}

              <div className="mt-7 flex flex-wrap gap-3">
                <a
                  href={whatsappUrl(settings.whatsappNumber, enquiryText)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary"
                >
                  Request a Quote <ArrowRight className="w-4 h-4" />
                </a>
                {product.datasheetUrl && (
                  <a href={product.datasheetUrl} target="_blank" rel="noopener noreferrer" className="btn-outline">
                    <FileText className="w-4 h-4" /> Datasheet
                  </a>
                )}
                {product.catalogueUrl && (
                  <a href={product.catalogueUrl} target="_blank" rel="noopener noreferrer" className="btn-outline">
                    <FileText className="w-4 h-4" /> Catalogue
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {(hasSpecs || hasDetails) && (
        <section className="py-12 lg:py-16 bg-white">
          <div className={`max-w-7xl mx-auto px-6 lg:px-10 grid gap-8 items-start ${hasSpecs && hasDetails ? 'lg:grid-cols-[1.3fr_1fr]' : ''}`}>
            {hasDetails && (
              <div className="grid gap-5">
                <DetailBlock label="Full Description" value={product.fullDescription} />
                <DetailBlock label="Applications" value={product.applications} />
                <DetailBlock label="Compatible Models" value={product.compatibleModels} />
                <DetailBlock label="Cross Reference" value={product.crossReference} />
              </div>
            )}

            {hasSpecs && (
              <div className="detail-card !p-0 overflow-hidden">
                <h3 className="px-6 pt-6">Specifications</h3>
                {specRows.length > 0 && (
                  <div className="overflow-x-auto">
                    <table className="spec-table">
                      <tbody>
                        {specRows.map((row, i) => (
                          <tr key={`${row.label}-${i}`}>
                            <th scope="row">{row.label}</th>
                            <td>{row.value}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
                {specNotes.length > 0 && (
                  <ul className="px-6 py-4 text-sm text-slate-600 list-disc list-inside space-y-1">
                    {specNotes.map((line, i) => <li key={i}>{line}</li>)}
                  </ul>
                )}
              </div>
            )}
          </div>
        </section>
      )}

      {related.length > 0 && (
        <section className="py-12 lg:py-16" style={{ background: 'linear-gradient(180deg, #F3F8FF 0%, #FFFFFF 100%)' }}>
          <div className="max-w-7xl mx-auto px-6 lg:px-10">
            <p className="section-eyebrow">You May Also Like</p>
            <h2 className="section-title mt-3 mb-8">Related Products</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {related.map((p) => <ProductCard product={p} key={p.id} />)}
            </div>
          </div>
        </section>
      )}

      <section className="pb-14 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <Link href="/products" className="btn-outline">← Back to All Products</Link>
        </div>
      </section>
    </>
  );
}
