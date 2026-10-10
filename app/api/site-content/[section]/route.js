import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

const ALLOWED_FIELDS = [
  'eyebrow', 'heading', 'headingLine2', 'body1', 'body2', 'body3',
  'image', 'imageAlt', 'tagline', 'seoTitle', 'metaDescription', 'focusKeyword'
];

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

  // Only touch fields that were actually sent in this request — so the
  // SEO form (which only sends seoTitle/metaDescription/focusKeyword)
  // never wipes out the Content form's fields, and vice versa.
  const data = {};
  for (const field of ALLOWED_FIELDS) {
    if (Object.prototype.hasOwnProperty.call(body, field)) {
      data[field] = body[field] || null;
    }
  }

  const content = await prisma.siteContent.upsert({
    where: { section },
    update: data,
    create: { section, ...data }
  });

  return NextResponse.json({ content });
}