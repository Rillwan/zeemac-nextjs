import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request, { params }) {
  const { section } = await params;
  const content = await prisma.siteContent.findUnique({ where: { section } });
  return NextResponse.json({ content });
}

export async function PUT(request, { params }) {
  const { section } = await params;

  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }

  const content = await prisma.siteContent.upsert({
    where: { section },
    update: {
      eyebrow: body.eyebrow || null,
      heading: body.heading || null,
      headingLine2: body.headingLine2 || null,
      body1: body.body1 || null,
      body2: body.body2 || null,
      body3: body.body3 || null,
      image: body.image || null,
      imageAlt: body.imageAlt || null,
      tagline: body.tagline || null
    },
    create: {
      section,
      eyebrow: body.eyebrow || null,
      heading: body.heading || null,
      headingLine2: body.headingLine2 || null,
      body1: body.body1 || null,
      body2: body.body2 || null,
      body3: body.body3 || null,
      image: body.image || null,
      imageAlt: body.imageAlt || null,
      tagline: body.tagline || null
    }
  });

  return NextResponse.json({ content });
}