import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { buildShowcaseData, validateShowcase } from '@/lib/brandShowcase';

export async function GET(request, { params }) {
  const { id } = await params;
  const brand = await prisma.showcaseBrand.findUnique({ where: { id: Number(id) } });
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

  const data = buildShowcaseData(body);
  const problem = validateShowcase(data);
  if (problem) return NextResponse.json({ error: problem }, { status: 400 });

  const existing = await prisma.showcaseBrand.findUnique({ where: { id: brandId } });
  if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  const brand = await prisma.showcaseBrand.update({ where: { id: brandId }, data });
  return NextResponse.json({ brand });
}

export async function DELETE(request, { params }) {
  const { id } = await params;
  const brandId = Number(id);

  const existing = await prisma.showcaseBrand.findUnique({ where: { id: brandId } });
  if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  await prisma.showcaseBrand.delete({ where: { id: brandId } });
  return NextResponse.json({ ok: true });
}
