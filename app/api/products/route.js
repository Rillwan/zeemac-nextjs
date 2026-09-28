import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { slugify, validateProductInput } from '@/lib/validators';

export async function GET() {
  const products = await prisma.product.findMany({
    orderBy: { order: 'asc' },
    include: { brand: true, category: true, images: { orderBy: { order: 'asc' } } }
  });
  return NextResponse.json({ products });
}

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }

  const { valid, errors } = validateProductInput(body);
  if (!valid) {
    return NextResponse.json({ error: 'Validation failed', fields: errors }, { status: 400 });
  }

  const baseSlug = slugify(body.name);
  let slug = baseSlug;
  let suffix = 1;
  while (await prisma.product.findUnique({ where: { slug } })) {
    suffix += 1;
    slug = `${baseSlug}-${suffix}`;
  }

  const last = await prisma.product.findFirst({ orderBy: { order: 'desc' } });
  const images = Array.isArray(body.images) ? body.images.filter(Boolean) : [];

  const product = await prisma.product.create({
    data: {
      name: body.name.trim(),
      slug,
      partNumber: body.partNumber || null,
      brandId: body.brandId ? Number(body.brandId) : null,
      categoryId: body.categoryId ? Number(body.categoryId) : null,
      subcategory: body.subcategory || null,
      shortDescription: body.shortDescription || null,
      fullDescription: body.fullDescription || null,
      specifications: body.specifications || null,
      applications: body.applications || null,
      compatibleModels: body.compatibleModels || null,
      crossReference: body.crossReference || null,
      datasheetUrl: body.datasheetUrl || null,
      catalogueUrl: body.catalogueUrl || null,
      featured: Boolean(body.featured),
      status: body.status === 'draft' ? 'draft' : 'active',
      seoTitle: body.seoTitle || null,
      metaDescription: body.metaDescription || null,
      focusKeyword: body.focusKeyword || null,
      order: (last?.order ?? -1) + 1,
      images: { create: images.map((url, i) => ({ url, order: i })) }
    },
    include: { brand: true, category: true, images: true }
  });

  return NextResponse.json({ product }, { status: 201 });
}
