import { prisma } from '@/lib/prisma';

const SITE_URL = 'https://www.zeemacgroup.com';

export default async function sitemap() {
  const [products, categories, brands] = await Promise.all([
    prisma.product.findMany({ where: { status: 'active' }, select: { slug: true, updatedAt: true } }),
    prisma.category.findMany({ select: { slug: true, updatedAt: true } }),
    prisma.brand.findMany({ select: { slug: true, updatedAt: true } })
  ]);

  const staticRoutes = [
    { url: `${SITE_URL}/`, changeFrequency: 'weekly', priority: 1.0 },
    { url: `${SITE_URL}/products`, changeFrequency: 'daily', priority: 0.9 },
    { url: `${SITE_URL}/categories`, changeFrequency: 'weekly', priority: 0.7 },
    { url: `${SITE_URL}/brands`, changeFrequency: 'weekly', priority: 0.7 }
  ].map((r) => ({ ...r, lastModified: new Date() }));

  const productRoutes = products.map((p) => ({
    url: `${SITE_URL}/products/${p.slug}`,
    lastModified: p.updatedAt,
    changeFrequency: 'weekly',
    priority: 0.8
  }));

  const categoryRoutes = categories.map((c) => ({
    url: `${SITE_URL}/categories/${c.slug}`,
    lastModified: c.updatedAt,
    changeFrequency: 'weekly',
    priority: 0.6
  }));

  const brandRoutes = brands.map((b) => ({
    url: `${SITE_URL}/brands/${b.slug}`,
    lastModified: b.updatedAt,
    changeFrequency: 'weekly',
    priority: 0.6
  }));

  return [...staticRoutes, ...productRoutes, ...categoryRoutes, ...brandRoutes];
}
