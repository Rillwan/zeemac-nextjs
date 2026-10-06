import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { FileText, ArrowRight, PackageSearch } from 'lucide-react';
import { prisma } from '@/lib/prisma';
import ProductCard from '@/components/site/ProductCard';

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
    <div className="border-t border-slate-100 py-4">
      <h3 className="text-sm font-bold text-brand-navy mb-1">{label}</h3>
      <p className="text-sm text-slate-500 whitespace-pre-line">{value}</p>
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

  return (
    <div className="section-pad pt-32 lg:pt-40">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <div className="max-w-6xl mx-auto px-6 lg:px-10">
        <div className="grid lg:grid-cols-2 gap-12">
          <div>
            <div className="product-card-img mb-4" style={{ aspectRatio: '4 / 3' }}>
              {product.images[0] ? (
                <Image src={product.images[0].url} alt={product.name} fill className="object-cover" priority />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-slate-300">
                  <PackageSearch className="w-10 h-10" />
                </div>
              )}
            </div>
            {product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-3">
                {product.images.slice(1).map((img) => (
                  <div key={img.id} className="product-card-img" style={{ aspectRatio: '1 / 1', marginBottom: 0 }}>
                    <Image src={img.url} alt={product.name} fill className="object-cover" />
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            <p className="eyebrow">{product.category?.name || 'Product'}</p>
            <h1 className="section-title mt-3">{product.name}</h1>
            <p className="text-sm text-slate-400 mt-2">
              {[product.brand?.name, product.partNumber && `Part No: ${product.partNumber}`].filter(Boolean).join(' • ')}
            </p>
            {product.shortDescription && <p className="mt-4 text-slate-500">{product.shortDescription}</p>}

            <div className="mt-6 flex flex-wrap gap-3">
              <a
                href={`https://wa.me/971045913307?text=${encodeURIComponent(enquiryText)}`}
                target="_blank"
                rel="noopener"
                className="btn-primary"
              >
                Request a Quote <ArrowRight className="w-4 h-4" />
              </a>
              {product.datasheetUrl && (
                <a href={product.datasheetUrl} target="_blank" rel="noopener" className="btn-outline">
                  <FileText className="w-4 h-4" /> Datasheet
                </a>
              )}
              {product.catalogueUrl && (
                <a href={product.catalogueUrl} target="_blank" rel="noopener" className="btn-outline">
                  <FileText className="w-4 h-4" /> Catalogue
                </a>
              )}
            </div>

            <div className="mt-4">
              <DetailBlock label="Full Description" value={product.fullDescription} />
              <DetailBlock label="Specifications" value={product.specifications} />
              <DetailBlock label="Applications" value={product.applications} />
              <DetailBlock label="Compatible Models" value={product.compatibleModels} />
              <DetailBlock label="Cross Reference" value={product.crossReference} />
            </div>
          </div>
        </div>

        {related.length > 0 && (
          <div className="mt-20">
            <h2 className="section-title mb-8">Related Products</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {related.map((p) => <ProductCard product={p} key={p.id} />)}
            </div>
          </div>
        )}

        <div className="mt-10">
          <Link href="/products" className="btn-outline">← Back to All Products</Link>
        </div>
      </div>
    </div>
  );
}
