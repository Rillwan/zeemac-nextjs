import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { slugify } from '@/lib/validators';

export async function GET() {
  const brands = await prisma.brand.findMany({ orderBy: { order: 'asc' } });
  return NextResponse.json({ brands });
}

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }

  if (!body.name || !body.name.trim()) {
    return NextResponse.json({ error: 'Name is required' }, { status: 400 });
  }

  const baseSlug = slugify(body.name);
  let slug = baseSlug;
  let suffix = 1;
  while (await prisma.brand.findUnique({ where: { slug } })) {
    suffix += 1;
    slug = `${baseSlug}-${suffix}`;
  }

  const last = await prisma.brand.findFirst({ orderBy: { order: 'desc' } });

  const brand = await prisma.brand.create({
    data: {
      name: body.name.trim(),
      slug,
      logo: body.logo || null,
      order: (last?.order ?? -1) + 1
    }
  });

  return NextResponse.json({ brand }, { status: 201 });
}
