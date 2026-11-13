import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PATCH(request, { params }) {
  const { id } = await params;
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }

  if (body.status !== 'new' && body.status !== 'handled') {
    return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
  }

  const existing = await prisma.enquiry.findUnique({ where: { id: Number(id) } });
  if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  const enquiry = await prisma.enquiry.update({ where: { id: Number(id) }, data: { status: body.status } });
  return NextResponse.json({ enquiry });
}

export async function DELETE(request, { params }) {
  const { id } = await params;
  const existing = await prisma.enquiry.findUnique({ where: { id: Number(id) } });
  if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  await prisma.enquiry.delete({ where: { id: Number(id) } });
  return NextResponse.json({ ok: true });
}
