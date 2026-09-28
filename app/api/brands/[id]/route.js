import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request, { params }) {
  const { id } = await params;
  const brand = await prisma.brand.findUnique({ where: { id: Number(id) } });
  if (!brand) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json({ brand });
}

export async function PUT(request, { params }) {
  const { id } = await params;
  const brandId = Number(id);

  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }

  if (!body.name || !body.name.trim()) {
    return NextResponse.json({ error: 'Name is required' }, { status: 400 });
  }

  const existing = await prisma.brand.findUnique({ where: { id: brandId } });
  if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  const brand = await prisma.brand.update({
    where: { id: brandId },
    data: {
      name: body.name.trim(),
      logo: body.logo || null
    }
  });

  return NextResponse.json({ brand });
}

export async function DELETE(request, { params }) {
  const { id } = await params;
  const brandId = Number(id);

  const existing = await prisma.brand.findUnique({ where: { id: brandId } });
  if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  await prisma.brand.delete({ where: { id: brandId } });
  return NextResponse.json({ ok: true });
}
