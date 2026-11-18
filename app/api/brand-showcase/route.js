import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { buildShowcaseData, validateShowcase } from '@/lib/brandShowcase';

export async function GET() {
  const brands = await prisma.showcaseBrand.findMany({
    where: { isActive: true },
    orderBy: [{ order: 'asc' }, { id: 'asc' }]
  });
  return NextResponse.json({ brands });
}

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }

  const data = buildShowcaseData(body);
  const problem = validateShowcase(data);
  if (problem) return NextResponse.json({ error: problem }, { status: 400 });

  const last = await prisma.showcaseBrand.findFirst({ orderBy: { order: 'desc' } });
  data.order = (last?.order ?? -1) + 1;

  const brand = await prisma.showcaseBrand.create({ data });
  return NextResponse.json({ brand }, { status: 201 });
}
