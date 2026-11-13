import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

function text(value, max) {
  return typeof value === 'string' && value.trim() ? value.trim().slice(0, max) : null;
}

// Accepts either the pasted <iframe ...> code from Google Maps or just its src link.
// Only Google Maps embed links are kept.
function mapEmbed(value) {
  if (typeof value !== 'string' || !value.trim()) return null;
  const match = value.match(/src\s*=\s*["']([^"']+)["']/i);
  const url = (match ? match[1] : value).trim();
  return /^https:\/\/www\.google\.com\/maps\/embed\?/i.test(url) ? url : null;
}

export async function PUT(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }

  const email = text(body.email, 120);
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: 'Enter a valid email address' }, { status: 400 });
  }

  const whatsappDigits = typeof body.whatsappNumber === 'string' ? body.whatsappNumber.replace(/\D/g, '') : '';
  if (whatsappDigits && (whatsappDigits.length < 8 || whatsappDigits.length > 15)) {
    return NextResponse.json({ error: 'WhatsApp number must be 8 to 15 digits including the country code' }, { status: 400 });
  }

  if (typeof body.mapEmbedUrl === 'string' && body.mapEmbedUrl.trim() && !mapEmbed(body.mapEmbedUrl)) {
    return NextResponse.json(
      { error: 'Map link must be the embed code from Google Maps (Share > Embed a map)' },
      { status: 400 }
    );
  }

  const data = {
    phone: text(body.phone, 40),
    whatsappNumber: whatsappDigits || null,
    email,
    address: text(body.address, 300),
    workingHours: text(body.workingHours, 200),
    mapEmbedUrl: mapEmbed(body.mapEmbedUrl)
  };

  const settings = await prisma.siteSetting.upsert({
    where: { id: 1 },
    update: data,
    create: { id: 1, ...data }
  });

  return NextResponse.json({ settings });
}
