import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request, { params }) {
  const { id } = await params;
  const category = await prisma.category.findUnique({ where: { id: Number(id) } });
  if (!category) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json({ category });
}

export async function PUT(request, { params }) {
  const { id } = await params;
  const categoryId = Number(id);

  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }

  if (!body.name || !body.name.trim()) {
    return NextResponse.json({ error: 'Name is required' }, { status: 400 });
  }

  const existing = await prisma.category.findUnique({ where: { id: categoryId } });
  if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  const category = await prisma.category.update({
    where: { id: categoryId },
    data: {
      name: body.name.trim(),
      description: body.description || null,
      image: body.image || null
    }
  });

  return NextResponse.json({ category });
}

export async function DELETE(request, { params }) {
  const { id } = await params;
  const categoryId = Number(id);

  const existing = await prisma.category.findUnique({ where: { id: categoryId } });
  if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  await prisma.category.delete({ where: { id: categoryId } });
  return NextResponse.json({ ok: true });
}
