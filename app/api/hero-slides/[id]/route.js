import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { buildSlideData, parseOrder } from '@/lib/heroSlide';

export async function GET(request, { params }) {
  const { id } = await params;
  const slide = await prisma.heroSlide.findUnique({ where: { id: Number(id) } });
  if (!slide) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json({ slide });
}

export async function PUT(request, { params }) {
  const { id } = await params;
  const slideId = Number(id);

  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }

  const data = buildSlideData(body);
  if (!data.heading) {
    return NextResponse.json({ error: 'Heading is required' }, { status: 400 });
  }

  const existing = await prisma.heroSlide.findUnique({ where: { id: slideId } });
  if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  const requestedOrder = parseOrder(body.order);
  if (requestedOrder !== null) data.order = requestedOrder;

  const slide = await prisma.heroSlide.update({ where: { id: slideId }, data });
  return NextResponse.json({ slide });
}

export async function DELETE(request, { params }) {
  const { id } = await params;
  const slideId = Number(id);

  const existing = await prisma.heroSlide.findUnique({ where: { id: slideId } });
  if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  await prisma.heroSlide.delete({ where: { id: slideId } });
  return NextResponse.json({ ok: true });
}
