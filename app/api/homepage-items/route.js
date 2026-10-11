import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const section = searchParams.get('section');

    const items = await prisma.homepageItem.findMany({
        where: section ? { section } : undefined,
        orderBy: { order: 'asc' }
    });
    return NextResponse.json({ items });
}

export async function POST(request) {
    let body;
    try {
        body = await request.json();
    } catch {
        return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
    }

    if (!body.section || !body.title?.trim() || !body.icon) {
        return NextResponse.json({ error: 'Section, title and icon are required' }, { status: 400 });
    }

    const last = await prisma.homepageItem.findFirst({
        where: { section: body.section },
        orderBy: { order: 'desc' }
    });

    const item = await prisma.homepageItem.create({
        data: {
            section: body.section,
            icon: body.icon,
            title: body.title.trim(),
            description: body.description || '',
            order: (last?.order ?? -1) + 1
        }
    });

    return NextResponse.json({ item }, { status: 201 });
}