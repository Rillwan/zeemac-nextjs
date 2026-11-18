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

  const all = await prisma.showcaseBrand.findMany({ orderBy: [{ order: 'asc' }, { id: 'asc' }] });
  const index = all.findIndex((brand) => brand.id === id);
  if (index === -1) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  const neighbourIndex = direction === 'up' ? index - 1 : index + 1;
  if (neighbourIndex < 0 || neighbourIndex >= all.length) {
    return NextResponse.json({ ok: true });
  }

  [all[index], all[neighbourIndex]] = [all[neighbourIndex], all[index]];

  // Rewrite clean 0..n-1 positions so duplicate or gapped order numbers heal themselves
  await prisma.$transaction(
    all.map((brand, position) =>
      prisma.showcaseBrand.update({ where: { id: brand.id }, data: { order: position } })
    )
  );

  return NextResponse.json({ ok: true });
}
