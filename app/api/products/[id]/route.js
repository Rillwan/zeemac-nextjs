import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { validateProductInput } from '@/lib/validators';

export async function GET(request, { params }) {
  const { id } = await params;
  const product = await prisma.product.findUnique({
    where: { id: Number(id) },
    include: { brand: true, category: true, images: { orderBy: { order: 'asc' } } }
  });
  if (!product) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json({ product });
}

export async function PUT(request, { params }) {
  const { id } = await params;
  const productId = Number(id);

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

  const existing = await prisma.product.findUnique({ where: { id: productId } });
  if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  const images = Array.isArray(body.images) ? body.images.filter(Boolean) : [];

  // Simplest correct approach: replace the image set on every save.
  await prisma.productImage.deleteMany({ where: { productId } });

  const product = await prisma.product.update({
    where: { id: productId },
    data: {
      name: body.name.trim(),
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
      images: { create: images.map((url, i) => ({ url, order: i })) }
    },
    include: { brand: true, category: true, images: true }
  });

  return NextResponse.json({ product });
}

export async function DELETE(request, { params }) {
  const { id } = await params;
  const productId = Number(id);

  const existing = await prisma.product.findUnique({ where: { id: productId } });
  if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  await prisma.product.delete({ where: { id: productId } });
  return NextResponse.json({ ok: true });
}
