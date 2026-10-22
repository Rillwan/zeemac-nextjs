import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { buildSlideData, parseOrder } from '@/lib/heroSlide';

export async function GET() {
  const slides = await prisma.heroSlide.findMany({ orderBy: { order: 'asc' } });
  return NextResponse.json({ slides });
}

export async function POST(request) {
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

  const requestedOrder = parseOrder(body.order);
  if (requestedOrder !== null) {
    data.order = requestedOrder;
  } else {
    const last = await prisma.heroSlide.findFirst({ orderBy: { order: 'desc' } });
    data.order = (last?.order ?? -1) + 1;
  }

  const slide = await prisma.heroSlide.create({ data });
  return NextResponse.json({ slide }, { status: 201 });
}
