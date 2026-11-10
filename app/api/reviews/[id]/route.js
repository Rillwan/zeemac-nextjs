import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { buildReviewData } from '@/lib/review';
import { parseOrder } from '@/lib/heroSlide';

export async function GET(request, { params }) {
  const { id } = await params;
  const review = await prisma.review.findUnique({ where: { id: Number(id) } });
  if (!review) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json({ review });
}

export async function PUT(request, { params }) {
  const { id } = await params;
  const reviewId = Number(id);

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

  const existing = await prisma.review.findUnique({ where: { id: reviewId } });
  if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  const requestedOrder = parseOrder(body.order);
  if (requestedOrder !== null) data.order = requestedOrder;

  const review = await prisma.review.update({ where: { id: reviewId }, data });
  return NextResponse.json({ review });
}

export async function DELETE(request, { params }) {
  const { id } = await params;
  const reviewId = Number(id);

  const existing = await prisma.review.findUnique({ where: { id: reviewId } });
  if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  await prisma.review.delete({ where: { id: reviewId } });
  return NextResponse.json({ ok: true });
}
