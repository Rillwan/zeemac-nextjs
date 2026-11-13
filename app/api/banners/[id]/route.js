import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { buildBannerData, validateBanner } from '@/lib/banner';
import { parseOrder } from '@/lib/heroSlide';

export async function GET(request, { params }) {
  const { id } = await params;
  const banner = await prisma.banner.findUnique({ where: { id: Number(id) } });
  if (!banner) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json({ banner });
}

export async function PUT(request, { params }) {
  const { id } = await params;
  const bannerId = Number(id);

  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }

  const data = buildBannerData(body);
  const problem = validateBanner(data);
  if (problem) return NextResponse.json({ error: problem }, { status: 400 });

  const existing = await prisma.banner.findUnique({ where: { id: bannerId } });
  if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  const requestedOrder = parseOrder(body.order);
  if (requestedOrder !== null) data.order = requestedOrder;

  const banner = await prisma.banner.update({ where: { id: bannerId }, data });
  return NextResponse.json({ banner });
}

export async function DELETE(request, { params }) {
  const { id } = await params;
  const bannerId = Number(id);

  const existing = await prisma.banner.findUnique({ where: { id: bannerId } });
  if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  await prisma.banner.delete({ where: { id: bannerId } });
  return NextResponse.json({ ok: true });
}
