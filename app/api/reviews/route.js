import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { buildReviewData } from '@/lib/review';
import { parseOrder } from '@/lib/heroSlide';

export async function GET() {
  const reviews = await prisma.review.findMany({
    where: { isActive: true },
    orderBy: [{ order: 'asc' }, { id: 'asc' }]
  });
  return NextResponse.json({ reviews });
}

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }

  const data = buildReviewData(body);
  if (!data.authorName) {
    return NextResponse.json({ error: 'Reviewer name is required' }, { status: 400 });
  }

  const requestedOrder = parseOrder(body.order);
  if (requestedOrder !== null) {
    data.order = requestedOrder;
  } else {
    const last = await prisma.review.findFirst({ orderBy: { order: 'desc' } });
    data.order = (last?.order ?? -1) + 1;
  }

  const review = await prisma.review.create({ data });
  return NextResponse.json({ review }, { status: 201 });
}
