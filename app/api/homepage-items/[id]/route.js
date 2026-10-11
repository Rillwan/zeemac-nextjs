import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request, { params }) {
    const { id } = await params;
    const item = await prisma.homepageItem.findUnique({ where: { id: Number(id) } });
    if (!item) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json({ item });
}

export async function PUT(request, { params }) {
    const { id } = await params;

    let body;
    try {
        body = await request.json();
    } catch {
        return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
    }

    if (!body.title?.trim() || !body.icon) {
        return NextResponse.json({ error: 'Title and icon are required' }, { status: 400 });
    }

    const existing = await prisma.homepageItem.findUnique({ where: { id: Number(id) } });
    if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    const item = await prisma.homepageItem.update({
        where: { id: Number(id) },
        data: {
            icon: body.icon,
            title: body.title.trim(),
            description: body.description || ''
        }
    });

    return NextResponse.json({ item });
}

export async function DELETE(request, { params }) {
    const { id } = await params;
    const existing = await prisma.homepageItem.findUnique({ where: { id: Number(id) } });
    if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    await prisma.homepageItem.delete({ where: { id: Number(id) } });
    return NextResponse.json({ ok: true });
}