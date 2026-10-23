import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }

  const id = Number(body?.id);
  const direction = body?.direction;
  if (!Number.isInteger(id) || !['up', 'down'].includes(direction)) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }

  const all = await prisma.brand.findMany({ orderBy: [{ order: 'asc' }, { id: 'asc' }] });
  const current = all.find((brand) => brand.id === id);
  if (!current) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  // Move only within the same group (highlighted brands or other brands)
  const group = all.filter((brand) => brand.featured === current.featured);
  const groupIndex = group.findIndex((brand) => brand.id === id);
  const neighbour = group[direction === 'up' ? groupIndex - 1 : groupIndex + 1];
  if (!neighbour) {
    return NextResponse.json({ ok: true });
  }

  const currentIndex = all.findIndex((brand) => brand.id === current.id);
  const neighbourIndex = all.findIndex((brand) => brand.id === neighbour.id);
  [all[currentIndex], all[neighbourIndex]] = [all[neighbourIndex], all[currentIndex]];

  // Rewrite clean 0..n-1 positions so duplicate or gapped order numbers heal themselves
  await prisma.$transaction(
    all.map((brand, index) =>
      prisma.brand.update({ where: { id: brand.id }, data: { order: index } })
    )
  );

  return NextResponse.json({ ok: true });
}
