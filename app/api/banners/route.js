import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { buildBannerData, validateBanner } from '@/lib/banner';
import { parseOrder } from '@/lib/heroSlide';

export async function GET() {
  const banners = await prisma.banner.findMany({
    where: { isActive: true },
    orderBy: [{ order: 'asc' }, { id: 'asc' }]
  });
  return NextResponse.json({ banners });
}

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }

  const data = buildBannerData(body);
  const problem = validateBanner(data);
  if (problem) return NextResponse.json({ error: problem }, { status: 400 });

  const requestedOrder = parseOrder(body.order);
  if (requestedOrder !== null) {
    data.order = requestedOrder;
  } else {
    const last = await prisma.banner.findFirst({ orderBy: { order: 'desc' } });
    data.order = (last?.order ?? -1) + 1;
  }

  const banner = await prisma.banner.create({ data });
  return NextResponse.json({ banner }, { status: 201 });
}
